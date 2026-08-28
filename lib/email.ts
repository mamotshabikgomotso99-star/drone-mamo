/**
 * Email sender: uses Resend if RESEND_API_KEY is set, otherwise logs to console.
 * All transactional emails for KM Drone Services go through here.
 */

import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const fromAddress = process.env.EMAIL_FROM ?? "KM Drone Services <bookings@kmdrones.co.za>";
const replyTo = process.env.EMAIL_REPLY_TO ?? "hello@kmdrones.co.za";

const resend = apiKey ? new Resend(apiKey) : null;

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  tags?: { name: string; value: string }[];
}

export async function sendEmail(opts: SendEmailOptions) {
  const { to, subject, html, text, replyTo: rt, tags } = opts;
  const finalReplyTo = rt ?? replyTo;

  if (!resend) {
    // Console fallback for local dev / no key configured
    console.log("\n────── [DEV EMAIL FALLBACK] ──────");
    console.log("To:      ", to);
    console.log("From:    ", fromAddress);
    console.log("Reply-To:", finalReplyTo);
    console.log("Subject: ", subject);
    console.log("HTML (truncated):", html.replace(/\s+/g, " ").slice(0, 200) + "…");
    console.log("──────────────────────────────────\n");
    return { id: `dev-${Date.now()}`, simulated: true };
  }

  try {
    const result = await resend.emails.send({
      from: fromAddress,
      to,
      subject,
      html,
      text,
      replyTo: finalReplyTo,
      tags,
    });
    return { id: result.data?.id, simulated: false };
  } catch (err) {
    console.error("[email] Resend send failed:", err);
    throw err;
  }
}

/* -------------------- Branded HTML layouts -------------------- */
const shell = (inner: string) => `
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width" />
<title>KM Drone Services</title>
</head>
<body style="margin:0;background:#05080a;color:#f4f4f5;font-family:-apple-system,Segoe UI,Roboto,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#05080a;padding:32px 16px;">
  <tr><td align="center">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#0a0f12;border:1px solid rgba(255,255,255,0.08);border-radius:18px;overflow:hidden;">
      <tr><td style="background:linear-gradient(135deg,#0e1518,#0a0f12);padding:24px 32px;border-bottom:1px solid rgba(255,255,255,0.06);">
        <table role="presentation" width="100%"><tr>
          <td style="font-weight:700;color:#f4f4f5;font-size:18px;letter-spacing:-0.01em;">KM Drone Services</td>
          <td align="right" style="color:#34d273;font-size:12px;">Precision Agriculture</td>
        </tr></table>
      </td></tr>
      <tr><td style="padding:32px;">${inner}</td></tr>
      <tr><td style="padding:24px 32px;border-top:1px solid rgba(255,255,255,0.06);color:#71717a;font-size:12px;">
        © ${new Date().getFullYear()} KM Drone Services · South Africa<br />
        You're receiving this email because you have an account or booking with us.
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;

const button = (href: string, label: string) =>
  `<a href="${href}" style="display:inline-block;background:#34d273;color:#05080a;text-decoration:none;font-weight:600;padding:12px 22px;border-radius:12px;margin-top:16px;">${label}</a>`;

const h1 = (text: string) =>
  `<h1 style="margin:0 0 12px 0;font-size:24px;letter-spacing:-0.02em;color:#f4f4f5;">${text}</h1>`;
const p = (text: string) =>
  `<p style="margin:0 0 14px 0;color:#a1a1aa;line-height:1.55;font-size:14px;">${text}</p>`;
const divider = () =>
  `<hr style="border:none;border-top:1px solid rgba(255,255,255,0.06);margin:24px 0;" />`;

const siteUrl = () => process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/* -------------------- Templates -------------------- */
export const emailTemplates = {
  welcome(name: string) {
    const subject = "Welcome to KM Drone Services";
    const html = shell(`
      ${h1(`Welcome aboard, ${name}`)}
      ${p("Thanks for creating an account with KM Drone Services. You're one step closer to running precision drone operations on your farm.")}
      ${p("From your dashboard you can book a drone service, manage your farms, and track every step of the job in real time.")}
      ${button(`${siteUrl()}/dashboard`, "Open dashboard")}
      ${divider()}
      ${p("If you have any questions, simply reply to this email — we read every message.")}
    `);
    return { subject, html };
  },

  bookingSubmitted(args: { name: string; reference: string; service: string; date: string }) {
    const subject = `Booking received · ${args.reference}`;
    const html = shell(`
      ${h1(`We've got your booking, ${args.name}`)}
      ${p(`Your request for <strong style="color:#f4f4f5;">${args.service}</strong> on <strong style="color:#f4f4f5;">${args.date}</strong> has been received.`)}
      ${p(`Your reference is <strong style="color:#34d273;">${args.reference}</strong>. Our operations team will review and confirm shortly — usually within 1 business day.`)}
      ${button(`${siteUrl()}/dashboard/bookings`, "View my bookings")}
      ${divider()}
      ${p("Need to add anything? Reply to this email and we'll update your booking.")}
    `);
    return { subject, html };
  },

  bookingConfirmed(args: { name: string; reference: string; date: string }) {
    const subject = `Booking confirmed · ${args.reference}`;
    const html = shell(`
      ${h1(`Confirmed, ${args.name}`)}
      ${p(`Your booking <strong style="color:#34d273;">${args.reference}</strong> is confirmed for <strong style="color:#f4f4f5;">${args.date}</strong>.`)}
      ${p("We'll send a final reminder the day before and our pilot will check in with you on-site.")}
      ${button(`${siteUrl()}/dashboard/bookings`, "View details")}
    `);
    return { subject, html };
  },

  bookingRescheduled(args: { name: string; reference: string; newDate: string }) {
    const subject = `Booking rescheduled · ${args.reference}`;
    const html = shell(`
      ${h1(`New date for your booking`)}
      ${p(`Hi ${args.name}, your booking <strong style="color:#34d273;">${args.reference}</strong> has been moved to <strong style="color:#f4f4f5;">${args.newDate}</strong>.`)}
      ${p("If this doesn't suit, please reply and we'll find a better time.")}
      ${button(`${siteUrl()}/dashboard/bookings`, "View booking")}
    `);
    return { subject, html };
  },

  bookingCancelled(args: { name: string; reference: string }) {
    const subject = `Booking cancelled · ${args.reference}`;
    const html = shell(`
      ${h1(`Booking cancelled`)}
      ${p(`Hi ${args.name}, your booking <strong style="color:#34d273;">${args.reference}</strong> has been cancelled as requested.`)}
      ${button(`${siteUrl()}/dashboard/bookings`, "View my bookings")}
    `);
    return { subject, html };
  },

  bookingCompleted(args: { name: string; reference: string }) {
    const subject = `Job complete · ${args.reference}`;
    const html = shell(`
      ${h1(`Job complete`)}
      ${p(`Thanks ${args.name} — your drone service <strong style="color:#34d273;">${args.reference}</strong> has been marked complete.`)}
      ${p("We'd love your feedback. If you have a minute, reply with any thoughts on the job.")}
      ${button(`${siteUrl()}/dashboard/bookings`, "View booking")}
    `);
    return { subject, html };
  },

  passwordReset(args: { resetUrl: string }) {
    const subject = "Reset your KM Drone Services password";
    const html = shell(`
      ${h1("Reset your password")}
      ${p("We received a request to reset the password on your KM Drone Services account.")}
      ${p("Click the button below within the next hour to set a new password.")}
      ${button(args.resetUrl, "Reset password")}
      ${divider()}
      ${p("If you didn't request this, you can safely ignore this email.")}
    `);
    return { subject, html };
  },
};