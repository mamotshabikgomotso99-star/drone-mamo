import { db } from "@/lib/db";
import { bookings, services, users } from "@/lib/db/schema";
import { eq, desc, and, like, or, type SQL } from "drizzle-orm";
import { Badge } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatZAR, formatDate } from "@/lib/utils";
import { ArrowRight, Search } from "lucide-react";
import { Input } from "@/components/ui/form";

const STATUSES = ["all", "pending", "confirmed", "scheduled", "in_progress", "completed", "cancelled", "rejected"] as const;

const STATUS_TONE: Record<string, "amber" | "blue" | "indigo" | "violet" | "emerald" | "zinc" | "red"> = {
  pending: "amber",
  confirmed: "blue",
  scheduled: "indigo",
  in_progress: "violet",
  completed: "emerald",
  cancelled: "zinc",
  rejected: "red",
};

export const metadata = { title: "Bookings · Admin" };

interface PageProps {
  searchParams: Promise<{ status?: string; q?: string }>;
}

export default async function AdminBookingsPage({ searchParams }: PageProps) {
  const { status, q } = await searchParams;
  const activeStatus = status ?? "all";

  let rows: any[] = [];
  try {
    const whereParts: SQL[] = [];
    if (activeStatus !== "all") {
      whereParts.push(eq(bookings.status, activeStatus as any));
    }
    if (q && q.trim()) {
      whereParts.push(or(
        like(bookings.reference, `%${q}%`),
        like(bookings.contactName, `%${q}%`),
        like(bookings.cropType, `%${q}%`),
      )!);
    }
    const whereClause = whereParts.length ? and(...whereParts) : undefined;
    rows = await db
      .select({
        id: bookings.id,
        reference: bookings.reference,
        contactName: bookings.contactName,
        contactPhone: bookings.contactPhone,
        cropType: bookings.cropType,
        farmSizeHectares: bookings.farmSizeHectares,
        scheduledDate: bookings.scheduledDate,
        status: bookings.status,
        estimatedPriceZar: bookings.estimatedPriceZar,
        finalPriceZar: bookings.finalPriceZar,
        userName: users.name,
        userEmail: users.email,
        serviceName: services.name,
      })
      .from(bookings)
      .leftJoin(users, eq(users.id, bookings.userId))
      .leftJoin(services, eq(services.id, bookings.serviceId))
      .where(whereClause)
      .orderBy(desc(bookings.createdAt))
      .limit(200);
  } catch {
    rows = [];
  }

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-8 sm:py-12">
      <header className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-fg">
            Bookings
          </h1>
          <p className="mt-1 text-fg-muted">
            Manage, approve, and assign incoming drone service requests.
          </p>
        </div>
        <div className="text-sm text-fg-muted">
          {rows.length} booking{rows.length === 1 ? "" : "s"}
        </div>
      </header>

      {/* Filters */}
      <form className="mb-6 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted pointer-events-none" />
          <Input name="q" defaultValue={q ?? ""} placeholder="Search by reference, name, crop…" className="pl-9" />
        </div>
        <select
          name="status"
          defaultValue={activeStatus}
          className="rounded-xl border border-leaf-700/15 bg-white px-4 py-3 text-sm text-fg focus:outline-none focus:border-leaf-400/60 focus:bg-ash-50 transition-colors cursor-pointer appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%231f8050%22 stroke-width=%222%22><polyline points=%226 9 12 15 18 9%22/></svg>')] bg-no-repeat bg-right pr-10 [background-position:right_0.75rem_center] [background-size:18px_18px]"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s === "all" ? "All statuses" : s.replace("_", " ")}</option>
          ))}
        </select>
        <Button type="submit" variant="secondary">Filter</Button>
      </form>

      {rows.length === 0 ? (
        <div className="rounded-2xl glass p-12 text-center">
          <div className="text-fg font-medium">No bookings match the current filter.</div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl glass">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-leaf-700/15 text-xs uppercase tracking-wider text-fg-muted">
                <th className="px-5 py-4">Reference</th>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Service</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Est.</th>
                <th className="px-5 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((b) => (
                <tr key={b.id} className="border-b border-leaf-700/10 hover:bg-ash-50">
                  <td className="px-5 py-4 font-mono text-xs text-fg">{b.reference}</td>
                  <td className="px-5 py-4">
                    <div className="text-fg">{b.contactName}</div>
                    <div className="text-xs text-fg-muted">{b.userEmail}</div>
                  </td>
                  <td className="px-5 py-4 text-fg-dim">{b.serviceName ?? "—"}</td>
                  <td className="px-5 py-4 text-fg-dim">{formatDate(b.scheduledDate)}</td>
                  <td className="px-5 py-4">
                    <Badge tone={STATUS_TONE[b.status]}>{b.status.replace("_", " ")}</Badge>
                  </td>
                  <td className="px-5 py-4 text-right text-fg font-medium">
                    {formatZAR(b.finalPriceZar ?? b.estimatedPriceZar)}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/admin/bookings/${b.id}`}
                      className="inline-flex items-center gap-1 text-leaf-700 hover:text-leaf-800 text-xs font-medium"
                    >
                      Open <ArrowRight className="h-3 w-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}