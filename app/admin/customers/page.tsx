import { db } from "@/lib/db";
import { users, bookings, customerProfiles } from "@/lib/db/schema";
import { eq, desc, sql, like, or, and, type SQL } from "drizzle-orm";
import { Badge } from "@/components/ui/card";
import { Input } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { formatZAR, formatDate } from "@/lib/utils";
import Link from "next/link";

export const metadata = { title: "Customers · Admin" };

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function AdminCustomersPage({ searchParams }: PageProps) {
  const { q } = await searchParams;

  let rows: any[] = [];
  try {
    const whereParts: SQL[] = [];
    if (q && q.trim()) {
      whereParts.push(or(
        like(users.name, `%${q}%`),
        like(users.email, `%${q}%`),
        like(users.phone, `%${q}%`),
      )!);
    }
    whereParts.push(eq(users.role, "customer"));
    const whereClause = and(...whereParts);

    rows = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        phone: users.phone,
        province: customerProfiles.province,
        status: users.status,
        createdAt: users.createdAt,
        bookingCount: sql<number>`(SELECT COUNT(*) FROM ${bookings} WHERE ${bookings.userId} = ${users.id})`,
        lifetimeValue: sql<string>`COALESCE((SELECT SUM(${bookings.finalPriceZar})::text FROM ${bookings} WHERE ${bookings.userId} = ${users.id} AND ${bookings.status} IN ('completed','confirmed','scheduled','in_progress')), '0')`,
      })
      .from(users)
      .leftJoin(customerProfiles, eq(customerProfiles.userId, users.id))
      .where(whereClause)
      .orderBy(desc(users.createdAt))
      .limit(200);
  } catch {
    rows = [];
  }

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-8 sm:py-12">
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-fg">
          Customers
        </h1>
        <p className="mt-1 text-fg-muted">
          Registered farmers, growers and agronomy clients.
        </p>
      </header>

      <form className="mb-6 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted pointer-events-none" />
          <Input name="q" defaultValue={q ?? ""} placeholder="Search name, email, phone…" className="pl-9" />
        </div>
        <Button type="submit" variant="secondary">Search</Button>
      </form>

      {rows.length === 0 ? (
        <div className="rounded-2xl glass p-12 text-center">
          <div className="text-fg font-medium">No customers yet.</div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl glass">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-leaf-700/15 text-xs uppercase tracking-wider text-fg-muted">
                <th className="px-5 py-4">Name</th>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">Phone</th>
                <th className="px-5 py-4">Province</th>
                <th className="px-5 py-4 text-right">Bookings</th>
                <th className="px-5 py-4 text-right">LTV</th>
                <th className="px-5 py-4">Joined</th>
                <th className="px-5 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id} className="border-b border-leaf-700/10 hover:bg-ash-50">
                  <td className="px-5 py-4 text-fg">{c.name}</td>
                  <td className="px-5 py-4 text-fg-dim">{c.email}</td>
                  <td className="px-5 py-4 text-fg-dim">{c.phone ?? "—"}</td>
                  <td className="px-5 py-4 text-fg-dim">{c.province ?? "—"}</td>
                  <td className="px-5 py-4 text-right text-fg">{Number(c.bookingCount)}</td>
                  <td className="px-5 py-4 text-right text-fg">{formatZAR(c.lifetimeValue)}</td>
                  <td className="px-5 py-4 text-fg-muted">{formatDate(c.createdAt)}</td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/admin/bookings?q=${encodeURIComponent(c.email)}`}
                      className="text-xs text-leaf-700 hover:underline"
                    >
                      View bookings
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