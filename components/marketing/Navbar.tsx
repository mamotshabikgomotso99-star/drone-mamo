"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/ui/utils";

const NAV: Array<{ label: string; href: string; children?: Array<{ label: string; href: string }> }> = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "How it works", href: "/how-it-works" },
  { label: "Technology", href: "/technology" },
  { label: "Case studies", href: "/case-studies" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

export function Navbar({ minimal = false }: { minimal?: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [user, setUser] = React.useState<{ id: string; role: string; name: string } | null>(null);

  React.useEffect(() => {
    fetch("/api/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => setUser(j?.user ?? null))
      .catch(() => null);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all",
        "border-b border-leaf-700/10 backdrop-blur-xl bg-white/85",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 group">
          <Logo variant="compact" />
        </Link>

        {!minimal ? (
          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((n) => {
              const active =
                n.href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(n.href);
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={cn(
                    "px-3 py-2 text-sm rounded-lg transition-colors",
                    active
                      ? "text-leaf-700 bg-leaf-50"
                      : "text-fg-dim hover:text-fg hover:bg-ash-100",
                  )}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>
        ) : null}

        <div className="flex items-center gap-2">
          {!minimal ? (
            <>
              {user ? (
                <Button href={user.role === "admin" ? "/admin" : "/dashboard"} variant="secondary" size="sm">
                  Dashboard
                </Button>
              ) : (
                <>
                  <Button href="/login" variant="ghost" size="sm" className="hidden sm:inline-flex">
                    Sign in
                  </Button>
                  <Button href="/book" size="sm">
                    Book a service
                  </Button>
                </>
              )}
              <button
                className="lg:hidden p-2 text-fg-dim hover:text-fg"
                aria-label="Open menu"
                onClick={() => setOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </button>
            </>
          ) : null}
        </div>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-[88%] max-w-sm bg-white border-l border-leaf-700/15 animate-fade-in-up p-6 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <Logo variant="compact" />
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="p-2 text-fg-dim hover:text-fg"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex flex-col gap-1">
              {NAV.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="px-3 py-3 text-base rounded-lg text-fg-dim hover:text-fg hover:bg-ash-100"
                >
                  {n.label}
                </Link>
              ))}
            </div>
            <div className="mt-auto pt-6 border-t border-leaf-700/10 flex flex-col gap-2">
              {user ? (
                <Button href={user.role === "admin" ? "/admin" : "/dashboard"} variant="secondary">
                  Open dashboard
                </Button>
              ) : (
                <>
                  <Button href="/login" variant="secondary">
                    Sign in
                  </Button>
                  <Button href="/book">Book a service</Button>
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}