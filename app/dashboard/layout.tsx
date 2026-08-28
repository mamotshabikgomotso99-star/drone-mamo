import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Calendar,
  Plus,
  User,
  Bell,
  LogOut,
  Plane,
} from "lucide-react";
import { logoutAction } from "@/actions/auth";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/bookings", label: "My bookings", icon: Calendar },
  { href: "/book", label: "Book a service", icon: Plus },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login?from=/dashboard");

  const isAdmin = session.user.role === "admin";

  return (
    <div className="min-h-screen flex bg-ash-50">
      <aside className="hidden lg:flex flex-col w-72 border-r border-leaf-700/10 bg-white sticky top-0 h-screen">
        <div className="p-6 border-b border-leaf-700/10">
          <Link href="/">
            <Logo variant="compact" />
          </Link>
        </div>

        <nav className="px-3 flex-1 py-4">
          <div className="text-[10px] uppercase tracking-widest text-fg-muted px-3 py-2">
            Customer
          </div>
          <ul className="space-y-1">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg text-fg-dim hover:text-fg hover:bg-ash-100 transition-colors"
                >
                  <n.icon className="h-4 w-4" />
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>

          {isAdmin ? (
            <>
              <div className="text-[10px] uppercase tracking-widest text-fg-muted px-3 py-2 mt-6">
                Admin
              </div>
              <ul className="space-y-1">
                <li>
                  <Link
                    href="/admin"
                    className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg text-leaf-700 hover:text-fg hover:bg-leaf-50 transition-colors font-medium"
                  >
                    <Plane className="h-4 w-4" />
                    Admin dashboard
                  </Link>
                </li>
              </ul>
            </>
          ) : null}
        </nav>

        <div className="p-4 border-t border-leaf-700/10">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-leaf-500 to-leaf-700 flex items-center justify-center text-white font-semibold text-sm">
              {session.user.name?.[0]?.toUpperCase() ?? "U"}
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
        </div>
      </aside>

      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}