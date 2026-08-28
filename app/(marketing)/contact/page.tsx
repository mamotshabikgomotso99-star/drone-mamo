import { ContactForm } from "@/components/ContactForm";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export const metadata = {
  title: "Contact",
  description: "Get in touch with KM Drone Services — call, email, or send us a message.",
};

export default function ContactPage() {
  return (
    <section className="pt-24 pb-24 sm:pt-32 sm:pb-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-leaf-700 font-medium">
              <span className="h-px w-8 bg-leaf-400/60" />
              Contact
            </span>
            <h1 className="mt-4 text-5xl sm:text-6xl font-semibold tracking-tight text-fg max-w-md text-balance">
              Let&apos;s talk about your farm.
            </h1>
            <p className="mt-5 text-lg text-fg-dim max-w-md">
              Drop us a line and we&apos;ll come back within 1 business day. For
              urgent jobs, call us directly.
            </p>

            <div className="mt-10 space-y-5">
              <Item icon={<Mail />} title="Email" body="hello@kmdrones.co.za" link="mailto:hello@kmdrones.co.za" />
              <Item icon={<Phone />} title="Phone" body="+27 11 555 0100" link="tel:+27115550100" />
              <Item icon={<MapPin />} title="Service area" body="Nationwide · South Africa" />
              <Item
                icon={<Clock />}
                title="Business hours"
                body="Mon–Fri 07:00–17:00 · Sat 08:00–13:00"
              />
            </div>
          </div>

          <div className="rounded-2xl glass p-7 sm:p-9">
            <h2 className="text-2xl font-semibold tracking-tight text-fg mb-1">
              Send a message
            </h2>
            <p className="text-sm text-fg-muted mb-6">
              We read every message and respond within 1 business day.
            </p>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}

function Item({
  icon,
  title,
  body,
  link,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  link?: string;
}) {
  const content = (
    <div className="flex items-start gap-4">
      <div className="h-10 w-10 rounded-xl bg-leaf-50 border border-leaf-500/40 flex items-center justify-center text-leaf-700 shrink-0">
        {icon}
      </div>
      <div>
        <div className="text-xs uppercase tracking-wider text-fg-muted">{title}</div>
        <div className="text-fg font-medium">{body}</div>
      </div>
    </div>
  );
  return link ? (
    <a href={link} className="block hover:text-fg text-fg-dim transition-colors">
      {content}
    </a>
  ) : (
    content
  );
}