import { db } from "@/lib/db";
import { bookings, services } from "@/lib/db/schema";
import { eq, sql, desc } from "drizzle-orm";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingUp, DollarSign, Users, Calendar } from "lucide-react";
import { formatZAR } from "@/lib/utils";

export const metadata = { title: "Analytics · Admin" };

export default async function AdminAnalyticsPage() {
  let total = 0;
  let pending = 0;
  let completed = 0;
  let cancelled = 0;
  let revenue = 0;
  let uniqueCustomers = 0;
  let byService: any[] = [];
  let recent: any[] = [];

  try {
    const [counts] = await db
      .select({
        total: sql<number>`COUNT(*)::int`,
        pending: sql<number>`SUM(CASE WHEN ${bookings.status} = 'pending' THEN 1 ELSE 0 END)::int`,
        completed: sql<number>`SUM(CASE WHEN ${bookings.status} = 'completed' THEN 1 ELSE 0 END)::int`,
        cancelled: sql<number>`SUM(CASE WHEN ${bookings.status} IN ('cancelled','rejected') THEN 1 ELSE 0 END)::int`,
        revenue: sql<string>`COALESCE(SUM(${bookings.finalPriceZar}::numeric), 0)::text`,
        uniqueCustomers: sql<number>`COUNT(DISTINCT ${bookings.userId})::int`,
      })
      .from(bookings);

    total = Number(counts.total ?? 0);
    pending = Number(counts.pending ?? 0);
    completed = Number(counts.completed ?? 0);
    cancelled = Number(counts.cancelled ?? 0);
    revenue = parseFloat(counts.revenue ?? "0");
    uniqueCustomers = Number(counts.uniqueCustomers ?? 0);

    byService = await db
      .select({
        id: services.id,
        name: services.name,
        count: sql<number>`COUNT(${bookings.id})::int`,
        revenue: sql<string>`COALESCE(SUM(${bookings.finalPriceZar}::numeric), 0)::text`,
      })
      .from(bookings)
      .leftJoin(services, eq(services.id, bookings.serviceId))
      .groupBy(services.id, services.name)
      .orderBy(desc(sql`COUNT(${bookings.id})`))
      .limit(10);

    recent = await db
      .select({
        id: bookings.id,
        scheduledDate: bookings.scheduledDate,
        status: bookings.status,
        finalPriceZar: bookings.finalPriceZar,
        estimatedPriceZar: bookings.estimatedPriceZar,
        cropType: bookings.cropType,
        farmSizeHectares: bookings.farmSizeHectares,
      })
      .from(bookings)
      .orderBy(desc(bookings.createdAt))
      .limit(30);
  } catch {}

  // Build simple monthly buckets (last 12 weeks by week-of-year, using recent)
  const buckets = new Map<string, { count: number; revenue: number }>();
  const now = Date.now();
  for (let i = 11; i >= 0; i--) {
    const t = now - i * 7 * 86400_000;
    const k = new Date(t).toISOString().slice(0, 10);
    buckets.set(k, { count: 0, revenue: 0 });
  }
  for (const r of recent) {
    const d = r.scheduledDate ? new Date(r.scheduledDate).getTime() : 0;
    if (!d) continue;
    const k = new Date(d).toISOString().slice(0, 10);
    const bucket = buckets.get(k);
    if (bucket) {
      bucket.count += 1;
      bucket.revenue += parseFloat(r.finalPriceZar ?? r.estimatedPriceZar ?? "0") || 0;
    }
  }
  const series = Array.from(buckets.entries()).map(([date, b]) => ({ date, ...b }));

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-8 sm:py-12">
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-fg">
          Analytics
        </h1>
        <p className="mt-1 text-fg-muted">
          Platform performance and operational health.
        </p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Stat icon={<Calendar />} label="Total bookings" value={total} />
        <Stat icon={<TrendingUp />} label="Pending" value={pending} tone="amber" />
        <Stat icon={<Calendar />} label="Completed" value={completed} tone="emerald" />
        <Stat icon={<Users />} label="Unique customers" value={uniqueCustomers} />
        <Stat icon={<DollarSign />} label="Revenue" value={formatZAR(revenue)} tone="gold" />
        <Stat icon={<TrendingUp />} label="Cancelled / rejected" value={cancelled} tone="red" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardTitle>Recent activity</CardTitle>
          <CardDescription>Last {recent.length} bookings (subset of platform total).</CardDescription>
          <div className="mt-4 h-48 flex items-end gap-1">
            {series.map((s) => {
              const maxCount = Math.max(1, ...series.map((x) => x.count));
              const h = (s.count / maxCount) * 100;
              return (
                <div key={s.date} className="flex-1 flex flex-col items-center gap-1 group">
                  <div
                    className="w-full bg-gradient-to-t from-leaf-600 to-leaf-300 rounded-t-md group-hover:from-leaf-500 group-hover:to-leaf-200 transition-colors"
                    style={{ height: `${Math.max(h, 2)}%` }}
                    title={`${s.date}: ${s.count} booking(s)`}
                  />
                </div>
              );
            })}
          </div>
          <div className="mt-2 text-[10px] uppercase tracking-wider text-fg-muted flex justify-between">
            <span>12 weeks ago</span>
            <span>Today</span>
          </div>
        </Card>

        <Card>
          <CardTitle>Top services</CardTitle>
          <ul className="mt-4 space-y-3">
            {byService.length === 0 ? (
              <li className="text-sm text-fg-muted">No data yet.</li>
            ) : null}
            {byService.map((s, i) => (
              <li key={s.id ?? i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="h-6 w-6 rounded-full bg-leaf-50 border border-leaf-500/40 text-leaf-700 text-xs flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-fg truncate">{s.name ?? "—"}</span>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-fg">{Number(s.count)}</div>
                  <div className="text-[10px] text-fg-muted">{formatZAR(s.revenue)}</div>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

function Stat({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: React.ReactNode; tone?: "amber" | "emerald" | "gold" | "red" }) {
  const styles: Record<string, string> = {
    amber: "bg-amber-500/10 text-amber-300 border border-amber-500/20",
    emerald: "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20",
    gold: "bg-gold-500/10 text-gold-300 border border-gold-500/20",
    red: "bg-red-500/10 text-red-300 border border-red-500/20",
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