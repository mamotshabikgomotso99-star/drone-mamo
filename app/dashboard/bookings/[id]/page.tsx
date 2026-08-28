import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { bookings, services, bookingHistory, drones, teamMembers } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { Badge } from "@/components/ui/card";
import { ArrowLeft, MapPin, Calendar, Clock, Hash, User, Phone } from "lucide-react";
import { formatZAR, formatDateTime, formatDate } from "@/lib/utils";
import { CancelBookingButton } from "@/components/dashboard/CancelBookingButton";

const STATUS_TONE: Record<string, "amber" | "blue" | "indigo" | "violet" | "emerald" | "zinc" | "red"> = {
  pending: "amber",
  confirmed: "blue",
  scheduled: "indigo",
  in_progress: "violet",
  completed: "emerald",
  cancelled: "zinc",
  rejected: "red",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BookingDetailPage({ params }: PageProps) {
  const session = await auth();
  if (!session) return null;
  const { id } = await params;

  let booking: any = null;
  try {
    booking = await db.query.bookings.findFirst({
      where: and(eq(bookings.id, id), eq(bookings.userId, session.user.id)),
    });
  } catch {}
  if (!booking) notFound();

  let service: any = null;
  let history: any[] = [];
  let drone: any = null;
  let team: any = null;
  try {
    [service, history, drone, team] = await Promise.all([
      db.query.services.findFirst({ where: eq(services.id, booking.serviceId) }),
      db.select().from(bookingHistory).where(eq(bookingHistory.bookingId, booking.id)).orderBy(desc(bookingHistory.createdAt)),
      booking.droneId
        ? db.query.drones.findFirst({ where: eq(drones.id, booking.droneId) })
        : Promise.resolve(null),
      booking.assignedTeamId
        ? db.query.teamMembers.findFirst({ where: eq(teamMembers.id, booking.assignedTeamId) })
        : Promise.resolve(null),
    ]);
  } catch {}

  const cancellable = !["completed", "cancelled", "rejected"].includes(booking.status);

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-8 sm:py-12 max-w-5xl mx-auto">
      <Link href="/dashboard/bookings" className="text-sm text-fg-muted hover:text-fg inline-flex items-center gap-2 mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to bookings
      </Link>

      <header className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Badge tone={STATUS_TONE[booking.status]}>{booking.status.replace("_", " ")}</Badge>
            <span className="text-xs text-fg-muted">Reference</span>
            <span className="text-sm font-mono text-fg">{booking.reference}</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-fg">
            {service?.name ?? "Booking"}
          </h1>
          <p className="text-fg-muted mt-1">
            Booked {formatDateTime(booking.createdAt)}
          </p>
        </div>
        <div className="flex gap-2">
          {cancellable ? <CancelBookingButton bookingId={booking.id} /> : null}
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="rounded-2xl glass p-6">
            <h2 className="text-lg font-semibold text-fg mb-4">Details</h2>
            <div className="grid sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
              <Item icon={<Calendar />} label="Date" value={formatDate(booking.scheduledDate)} />
              <Item icon={<Clock />} label="Time" value={booking.timeSlot} />
              <Item icon={<MapPin />} label="Crop" value={booking.cropType} />
              <Item icon={<Hash />} label="Farm size" value={`${booking.farmSizeHectares} ha`} />
              <Item icon={<User />} label="Contact" value={booking.contactName} />
              <Item icon={<Phone />} label="Phone" value={booking.contactPhone || "—"} />
              {booking.province ? (
                <Item icon={<MapPin />} label="Province" value={booking.province} />
              ) : null}
            </div>
            {booking.notes ? (
              <div className="mt-5 pt-5 border-t border-leaf-700/10">
                <div className="text-xs uppercase tracking-wider text-fg-muted mb-2">Notes</div>
                <div className="text-sm text-fg-dim leading-relaxed whitespace-pre-line">
                  {booking.notes}
                </div>
              </div>
            ) : null}
          </section>

          <section className="rounded-2xl glass p-6">
            <h2 className="text-lg font-semibold text-fg mb-4">Activity</h2>
            {history.length === 0 ? (
              <div className="text-sm text-fg-muted">No activity yet.</div>
            ) : (
              <ol className="space-y-3">
                {history.map((h) => (
                  <li key={h.id} className="flex gap-3 text-sm">
                    <div className="h-2 w-2 rounded-full bg-leaf-600 mt-2 shrink-0" />
                    <div>
                      <div className="text-fg">{h.action}</div>
                      <div className="text-xs text-fg-muted">
                        {h.actorLabel} · {formatDateTime(h.createdAt)}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl glass-strong p-6">
            <div className="text-xs uppercase tracking-wider text-fg-muted mb-2">
              Pricing
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-fg-muted text-sm">Estimated</span>
              <span className="text-xl font-semibold text-fg">
                {formatZAR(booking.estimatedPriceZar)}
              </span>
            </div>
            {booking.finalPriceZar ? (
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-fg-muted text-sm">Final</span>
                <span className="text-xl font-semibold text-leaf-700">
                  {formatZAR(booking.finalPriceZar)}
                </span>
              </div>
            ) : null}
            <p className="text-xs text-fg-muted mt-3">
              Final pricing confirmed by our team after reviewing your brief.
            </p>
          </div>

          {drone ? (
            <div className="rounded-2xl glass p-5">
              <div className="text-xs uppercase tracking-wider text-fg-muted mb-2">Assigned drone</div>
              <div className="text-fg font-medium">{drone.name}</div>
              <div className="text-xs text-fg-muted">{drone.model}</div>
            </div>
          ) : null}

          {team ? (
            <div className="rounded-2xl glass p-5">
              <div className="text-xs uppercase tracking-wider text-fg-muted mb-2">Operator</div>
              <div className="text-fg font-medium">{team.name}</div>
              <div className="text-xs text-fg-muted">{team.role}</div>
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
}

function Item({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="h-8 w-8 rounded-lg bg-ash-100 border border-leaf-700/15 flex items-center justify-center text-fg-dim shrink-0">
        {icon}
      </div>
      <div>
        <div className="text-xs uppercase tracking-wider text-fg-muted">{label}</div>
        <div className="text-fg mt-0.5">{value}</div>
      </div>
    </div>
  );
}