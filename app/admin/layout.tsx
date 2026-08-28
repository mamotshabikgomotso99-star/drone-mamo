import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Plane,
  Sprout,
  Wrench,
  TrendingUp,
  Settings,
  LogOut,
  DollarSign,
} from "lucide-react";
import { logoutAction } from "@/actions/auth";
import { db } from "@/lib/db";
import { bookings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Bookings", icon: Calendar },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/services", label: "Services", icon: Sprout },
  { href: "/admin/pricing", label: "Pricing rules", icon: DollarSign },
  { href: "/admin/drones", label: "Drone fleet", icon: Plane },
  { href: "/admin/team", label: "Team", icon: Wrench },
  { href: "/admin/analytics", label: "Analytics", icon: TrendingUp },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login?from=/admin");
  if (session.user.role !== "admin") redirect("/dashboard");

  let pendingCount = 0;
  try {
    const r = await db.query.bookings.findMany({ where: (b, { eq: _eq }) => _eq(b.status, "pending") });
    pendingCount = r.length;
  } catch {}

  return (
    <div className="min-h-screen flex bg-ash-50">
      <aside className="hidden lg:flex flex-col w-72 border-r border-leaf-700/10 bg-white sticky top-0 h-screen">
        <div className="p-6 border-b border-leaf-700/10">
          <Link href="/">
            <Logo variant="compact" />
          </Link>
          <div className="mt-3 text-[10px] uppercase tracking-widest text-leaf-700 font-medium">
            Admin
          </div>
        </div>

        <nav className="px-3 flex-1 overflow-y-auto py-4">
          <ul className="space-y-1">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg text-fg-dim hover:text-fg hover:bg-ash-100 transition-colors"
                >
                  <n.icon className="h-4 w-4" />
                  <span className="flex-1">{n.label}</span>
                  {n.href === "/admin/bookings" && pendingCount > 0 ? (
                    <span className="text-[10px] font-medium rounded-full bg-amber-100 text-amber-700 px-2 py-0.5">
                      {pendingCount}
                    </span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-leaf-700/10">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-leaf-500 to-leaf-700 flex items-center justify-center text-white font-semibold text-sm">
              {session.user.name?.[0]?.toUpperCase() ?? "A"}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-fg truncate">
                {session.user.name}
              </div>
              <div className="text-xs text-fg-muted truncate">{session.user.email}</div>
            </div>
            <form action={logoutAction}>
              <Button type="submit" size="icon" variant="ghost" aria-label="Log out">
                <LogOut className="h-4 w-4" />
              </Button>
            </form>
          </div>
          <div className="mt-2 flex items-center gap-1 px-2">
            <Link href="/dashboard" className="text-xs text-fg-muted hover:text-fg">
              ← Customer view
            </Link>
          </div>
        </div>
      </aside>

      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}