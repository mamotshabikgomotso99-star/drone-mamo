"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users, passwordResetTokens } from "@/lib/db/schema";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/lib/validators";
import { fail, flattenZod, ok, type ActionResult } from "@/lib/action-result";
import { signIn } from "@/lib/auth";
import { generateSecureToken } from "@/lib/auth";
import { sendEmail, emailTemplates } from "@/lib/email";
import { headers } from "next/headers";
import { nanoid } from "@/lib/utils";

export async function registerAction(formData: FormData): Promise<ActionResult<undefined>> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) return fail("Validation failed", flattenZod(parsed.error));

  const { name, email, phone, password } = parsed.data;

  const existing = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  if (existing) return fail("An account with this email already exists");

  const hash = await bcrypt.hash(password, 12);
  const [user] = await db
    .insert(users)
    .values({
      email,
      name,
      phone: phone || null,
      passwordHash: hash,
      role: "customer",
      status: "active",
    })
    .returning();

  // Welcome email
  const tpl = emailTemplates.welcome(name);
  await sendEmail({ to: email, subject: tpl.subject, html: tpl.html, tags: [{ name: "kind", value: "welcome" }] }).catch(
    (e) => console.error("[email] welcome failed:", e),
  );

  // Sign the user in immediately
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (err) {
    // NextAuth throws a redirect — that's "success" for actions
    if (err instanceof Error && err.message.includes("NEXT_REDIRECT")) throw err;
    console.error("[register] auto-login failed:", err);
  }

  return ok(undefined, "Account created");
}

export async function loginAction(formData: FormData): Promise<ActionResult<undefined>> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return fail("Validation failed", flattenZod(parsed.error));

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/dashboard",
    });
  } catch (err) {
    if (err instanceof Error && err.message.includes("NEXT_REDIRECT")) throw err;
    return fail("Invalid email or password");
  }
  return ok();
}

export async function logoutAction() {
  const { signOut } = await import("@/lib/auth");
  await signOut({ redirectTo: "/" });
}

export async function forgotPasswordAction(formData: FormData): Promise<ActionResult<undefined>> {
  const parsed = forgotPasswordSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) return fail("Validation failed", flattenZod(parsed.error));

  const { email } = parsed.data;
  const user = await db.query.users.findFirst({ where: eq(users.email, email) });

  // Always respond with success — do not leak which emails exist
  if (user) {
    const token = generateSecureToken(48);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    await db.insert(passwordResetTokens).values({
      userId: user.id,
      token,
      expiresAt,
    });
    const h = await headers();
    const host = h.get("host");
    const proto = h.get("x-forwarded-proto") ?? "http";
    const base = process.env.AUTH_URL ?? (host ? `${proto}://${host}` : "http://localhost:3000");
    const resetUrl = `${base}/reset-password?token=${token}`;
    const tpl = emailTemplates.passwordReset({ resetUrl });
    await sendEmail({
      to: email,
      subject: tpl.subject,
      html: tpl.html,
      tags: [{ name: "kind", value: "password-reset" }],
    }).catch((e) => console.error("[email] reset failed:", e));
  }
  return ok(undefined, "If that email exists, a reset link has been sent.");
}

export async function resetPasswordAction(formData: FormData): Promise<ActionResult<undefined>> {
  const parsed = resetPasswordSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) return fail("Validation failed", flattenZod(parsed.error));

  const { token, password } = parsed.data;

  const record = await db.query.passwordResetTokens.findFirst({ where: eq(passwordResetTokens.token, token) });
  if (!record || record.used || record.expiresAt < new Date()) {
    return fail("This reset link is invalid or has expired");
  }

  const hash = await bcrypt.hash(password, 12);
  await db
    .update(users)
    .set({ passwordHash: hash, updatedAt: new Date() })
    .where(eq(users.id, record.userId));
  await db
    .update(passwordResetTokens)
    .set({ used: true })
    .where(eq(passwordResetTokens.id, record.id));

  return ok(undefined, "Password updated. You can now sign in.");
}

// Simple per-IP rate limiting via in-memory map (sufficient for low-volume traffic)
const RATE = new Map<string, { count: number; resetAt: number }>();
export async function rateLimit(key: string, max = 5, windowMs = 60_000) {
  const now = Date.now();
  const entry = RATE.get(key);
  if (!entry || entry.resetAt < now) {
    RATE.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: max - 1 };
  }
  if (entry.count >= max) return { ok: false, remaining: 0 };
  entry.count++;
  return { ok: true, remaining: max - entry.count };
}