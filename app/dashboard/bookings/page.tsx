import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { bookings } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { Badge } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight } from "lucide-react";
import { formatZAR, formatDate } from "@/lib/utils";

export const metadata = { title: "My bookings" };

const STATUS_TONE: Record<string, "amber" | "blue" | "indigo" | "violet" | "emerald" | "zinc" | "red"> = {
  pending: "amber",
  confirmed: "blue",
  scheduled: "indigo",
  in_progress: "violet",
  completed: "emerald",
  cancelled: "zinc",
  rejected: "red",
};

export default async function BookingsPage() {
  const session = await auth();
  if (!session) return null;

  let rows: any[] = [];
  try {
    rows = await db
      .select()
      .from(bookings)
      .where(eq(bookings.userId, session.user.id))
      .orderBy(desc(bookings.createdAt));
  } catch {
    rows = [];
  }

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-8 sm:py-12">
      <header className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-fg">
            My bookings
          </h1>
          <p className="mt-1 text-fg-muted">
            All your drone service bookings in one place.
          </p>
        </div>
        <Button href="/book">
          <Calendar className="h-4 w-4" /> New booking
        </Button>
      </header>

      {rows.length === 0 ? (
        <div className="rounded-2xl glass p-12 text-center">
          <Calendar className="h-10 w-10 text-fg-muted mx-auto mb-3" />
          <h3 className="text-fg font-medium">No bookings yet</h3>
          <p className="text-sm text-fg-muted mt-1">
            Book your first drone service in just a few clicks.
          </p>
          <Button href="/book" className="mt-5">
            Book a service
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl glass">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-leaf-700/10 text-xs uppercase tracking-wider text-fg-muted">
                <th className="px-5 py-4">Reference</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4">Crop</th>
                <th className="px-5 py-4">Size</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Estimated</th>
                <th className="px-5 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((b) => (
                <tr
                  key={b.id}
                  className="border-b border-leaf-700/10 hover:bg-ash-50 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="font-medium text-fg">{b.reference}</div>
                    <div className="text-xs text-fg-muted">{b.timeSlot}</div>
                  </td>
                  <td className="px-5 py-4 text-fg-dim">{formatDate(b.scheduledDate)}</td>
                  <td className="px-5 py-4 text-fg-dim">{b.cropType}</td>
                  <td className="px-5 py-4 text-fg-dim">{b.farmSizeHectares} ha</td>
                  <td className="px-5 py-4">
                    <Badge tone={STATUS_TONE[b.status]}>{b.status.replace("_", " ")}</Badge>
                  </td>
                  <td className="px-5 py-4 text-right text-fg font-medium">
                    {formatZAR(b.estimatedPriceZar)}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/dashboard/bookings/${b.id}`}
                      className="inline-flex items-center gap-1 text-leaf-700 hover:text-leaf-800 text-xs font-medium"
                    >
                      View <ArrowRight className="h-3 w-3" />
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