import { db } from "@/lib/db";
import { bookings, services, drones, teamMembers, users } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { Card, CardTitle, CardDescription, Badge } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Users,
  TrendingUp,
  DollarSign,
  Plane,
  Sprout,
} from "lucide-react";
import Link from "next/link";
import { formatZAR, formatDate } from "@/lib/utils";

export const metadata = { title: "Admin overview" };

const STATUS_TONE: Record<string, "amber" | "blue" | "indigo" | "violet" | "emerald" | "zinc" | "red"> = {
  pending: "amber",
  confirmed: "blue",
  scheduled: "indigo",
  in_progress: "violet",
  completed: "emerald",
  cancelled: "zinc",
  rejected: "red",
};

export default async function AdminOverview() {
  let allBookings: any[] = [];
  let allServices: any[] = [];
  let allDrones: any[] = [];
  let allTeam: any[] = [];
  let allUsers: any[] = [];
  try {
    [allBookings, allServices, allDrones, allTeam, allUsers] = await Promise.all([
      db.select().from(bookings).orderBy(desc(bookings.createdAt)).limit(200),
      db.select().from(services),
      db.select().from(drones),
      db.select().from(teamMembers),
      db.select().from(users),
    ]);
  } catch {}

  const stats = {
    total: allBookings.length,
    pending: allBookings.filter((b) => b.status === "pending").length,
    inProgress: allBookings.filter((b) => b.status === "in_progress" || b.status === "scheduled").length,
    completed: allBookings.filter((b) => b.status === "completed").length,
    revenue: allBookings.reduce(
      (s, b) => s + (parseFloat(b.finalPriceZar ?? b.estimatedPriceZar) || 0),
      0,
    ),
    activeDrones: allDrones.filter((d) => d.status === "available").length,
    customers: allUsers.filter((u) => u.role === "customer").length,
  };

  const recent = allBookings.slice(0, 8);
  const serviceCounts = allServices.map((s) => ({
    name: s.name,
    count: allBookings.filter((b) => b.serviceId === s.id).length,
  }));
  const topServices = serviceCounts.sort((a, b) => b.count - a.count).slice(0, 5);

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-8 sm:py-12">
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-fg">
          Operations overview
        </h1>
        <p className="mt-1 text-fg-muted">
          Today&apos;s snapshot of bookings, fleet, and revenue.
        </p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
        <Stat icon={<Calendar />} label="Total bookings" value={stats.total} />
        <Stat icon={<AlertCircle />} label="Pending review" value={stats.pending} tone="amber" />
        <Stat icon={<Clock />} label="Scheduled / in progress" value={stats.inProgress} tone="indigo" />
        <Stat icon={<CheckCircle2 />} label="Completed" value={stats.completed} tone="emerald" />
        <Stat icon={<DollarSign />} label="Revenue (est.)" value={formatZAR(stats.revenue)} tone="gold" />
        <Stat icon={<Plane />} label="Active drones" value={stats.activeDrones} />
        <Stat icon={<Users />} label="Customers" value={stats.customers} />
        <Stat icon={<Sprout />} label="Services" value={allServices.length} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="rounded-2xl glass p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <CardTitle>Recent bookings</CardTitle>
                <CardDescription>Latest activity across the platform</CardDescription>
              </div>
              <Link href="/admin/bookings" className="text-xs text-leaf-700 hover:underline font-medium">
                All bookings →
              </Link>
            </div>
            {recent.length === 0 ? (
              <div className="text-sm text-fg-muted py-6 text-center">
                No bookings yet.
              </div>
            ) : (
              <ul className="space-y-2">
                {recent.map((b) => (
                  <li key={b.id}>
                    <Link
                      href={`/admin/bookings/${b.id}`}
                      className="flex items-center justify-between gap-3 rounded-xl px-4 py-3 hover:bg-ash-50 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="font-mono text-xs text-fg-dim shrink-0">
                          {b.reference}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm text-fg truncate">{b.contactName}</div>
                          <div className="text-xs text-fg-muted truncate">
                            {b.cropType} · {b.farmSizeHectares} ha
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <Badge tone={STATUS_TONE[b.status]}>{b.status.replace("_", " ")}</Badge>
                        <span className="text-sm text-fg">
                          {formatZAR(b.finalPriceZar ?? b.estimatedPriceZar)}
                        </span>
                        <ArrowRight className="h-3 w-3 text-fg-muted" />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <aside className="space-y-4">
          <Card>
            <CardTitle className="text-base">Top services</CardTitle>
            <ul className="mt-4 space-y-3">
              {topServices.length === 0 ? (
                <li className="text-sm text-fg-muted">No data yet.</li>
              ) : null}
              {topServices.map((s, i) => (
                <li key={s.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <span className="h-6 w-6 rounded-full bg-leaf-50 border border-leaf-500/30 text-leaf-700 text-xs flex items-center justify-center font-medium">
                      {i + 1}
                    </span>
                    <span className="text-fg truncate">{s.name}</span>
                  </div>
                  <span className="text-fg-muted">{s.count}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <CardTitle className="text-base">Quick actions</CardTitle>
            <div className="mt-4 grid gap-2">
              <Button href="/admin/bookings?status=pending" variant="secondary">
                Review pending ({stats.pending})
              </Button>
              <Button href="/admin/services" variant="ghost">
                Manage services
              </Button>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function Stat({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: React.ReactNode; tone?: "amber" | "indigo" | "emerald" | "gold" }) {
  const styles: Record<string, string> = {
    amber: "bg-amber-50 text-amber-700 border border-amber-300",
    indigo: "bg-indigo-50 text-indigo-700 border border-indigo-300",
    emerald: "bg-emerald-50 text-emerald-700 border border-emerald-300",
    gold: "bg-amber-50 text-gold-500 border border-gold-500/40",
  };
  return (
    <div className="rounded-2xl glass p-5">
      <div className={`h-9 w-9 rounded-xl flex items-center justify-center mb-3 ${tone ? styles[tone] : "bg-ash-100 text-fg-dim border border-leaf-700/15"}`}>
        {icon}
      </div>
      <div className="text-2xl font-semibold text-fg truncate">{value}</div>
      <div className="text-xs text-fg-muted mt-1">{label}</div>
    </div>
  );
}