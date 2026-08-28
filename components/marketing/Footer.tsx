import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative border-t border-leaf-700/10 bg-ash-50 mt-32">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-leaf-500/50 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo variant="compact" />
            <p className="mt-5 text-sm text-fg-dim max-w-sm leading-relaxed">
              Precision agricultural drone services for South African farmers.
              Smarter spraying, mapping, and crop intelligence — backed by data,
              delivered from the air.
            </p>
            <div className="mt-6 space-y-3 text-sm text-fg-dim">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-leaf-600" />
                <a href="mailto:hello@kmdrones.co.za" className="hover:text-fg">hello@kmdrones.co.za</a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-leaf-600" />
                <a href="tel:+27115550100" className="hover:text-fg">+27 11 555 0100</a>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-leaf-600" />
                <span>Operating nationwide · South Africa</span>
              </div>
            </div>
          </div>

          <FooterCol
            title="Services"
            items={[
              { href: "/services/crop-spraying", label: "Crop spraying" },
              { href: "/services/fertilizer-application", label: "Fertilizer application" },
              { href: "/services/crop-monitoring", label: "Crop monitoring" },
              { href: "/services/agricultural-mapping", label: "Agricultural mapping" },
              { href: "/services", label: "All services →" },
            ]}
          />
          <FooterCol
            title="Company"
            items={[
              { href: "/about", label: "About" },
              { href: "/technology", label: "Technology" },
              { href: "/case-studies", label: "Case studies" },
              { href: "/pricing", label: "Pricing" },
              { href: "/contact", label: "Contact" },
            ]}
          />
          <FooterCol
            title="Account"
            items={[
              { href: "/book", label: "Book a service" },
              { href: "/login", label: "Sign in" },
              { href: "/register", label: "Create account" },
              { href: "/faq", label: "FAQ" },
            ]}
          />
        </div>

        <div className="mt-14 pt-8 border-t border-leaf-700/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs text-fg-muted">
          <div>
            © {new Date().getFullYear()} KM Drone Services. Operating in
            South Africa in compliance with applicable aviation and
            agricultural regulations.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-fg">Privacy</Link>
            <Link href="/terms" className="hover:text-fg">Terms</Link>
            <Link href="/cookies" className="hover:text-fg">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  items,
}: {
  title: string;
  items: { href: string; label: string }[];
}) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-fg mb-4">{title}</h4>
      <ul className="space-y-2.5">
        {items.map((i) => (
          <li key={i.href}>
            <Link
              href={i.href}
              className="text-sm text-fg-dim hover:text-fg transition-colors"
            >
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}