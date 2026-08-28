import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { bookings, bookingHistory, services, drones, teamMembers, users } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { Badge, Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Calendar, Clock, Hash, User, Phone } from "lucide-react";
import { formatZAR, formatDateTime, formatDate } from "@/lib/utils";
import { AdminBookingControls } from "./AdminBookingControls";

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

export default async function AdminBookingDetail({ params }: PageProps) {
  const { id } = await params;

  let booking: any;
  try {
    booking = await db.query.bookings.findFirst({ where: eq(bookings.id, id) });
  } catch {}
  if (!booking) notFound();

  const [service, history, owner, drone, team, allDrones, allTeam] = await Promise.all([
    db.query.services.findFirst({ where: eq(services.id, booking.serviceId) }),
    db.select().from(bookingHistory).where(eq(bookingHistory.bookingId, booking.id)).orderBy(desc(bookingHistory.createdAt)),
    db.query.users.findFirst({ where: eq(users.id, booking.userId) }),
    booking.droneId ? db.query.drones.findFirst({ where: eq(drones.id, booking.droneId) }) : Promise.resolve(null),
    booking.assignedTeamId ? db.query.teamMembers.findFirst({ where: eq(teamMembers.id, booking.assignedTeamId) }) : Promise.resolve(null),
    db.select().from(drones),
    db.select().from(teamMembers),
  ]);

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-8 sm:py-12 max-w-6xl mx-auto">
      <Link href="/admin/bookings" className="text-sm text-fg-muted hover:text-fg inline-flex items-center gap-2 mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to bookings
      </Link>

      <header className="mb-8 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Badge tone={STATUS_TONE[booking.status]}>{booking.status.replace("_", " ")}</Badge>
            <span className="font-mono text-sm text-fg">{booking.reference}</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-fg">
            {service?.name ?? "Booking"}
          </h1>
          <p className="text-fg-muted mt-1">
            {owner?.name} · {owner?.email}
          </p>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h2 className="text-lg font-semibold text-fg mb-4">Booking details</h2>
            <div className="grid sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
              <Item icon={<Calendar />} label="Date" value={formatDate(booking.scheduledDate)} />
              <Item icon={<Clock />} label="Time" value={booking.timeSlot} />
              <Item icon={<MapPin />} label="Crop" value={booking.cropType} />
              <Item icon={<Hash />} label="Size" value={`${booking.farmSizeHectares} ha`} />
              <Item icon={<User />} label="Contact" value={booking.contactName} />
              <Item icon={<Phone />} label="Phone" value={booking.contactPhone || "—"} />
              {booking.province ? <Item icon={<MapPin />} label="Province" value={booking.province} /> : null}
            </div>
            {booking.notes ? (
              <div className="mt-5 pt-5 border-t border-leaf-700/10">
                <div className="text-xs uppercase tracking-wider text-fg-muted mb-2">Customer notes</div>
                <div className="text-sm text-fg-dim whitespace-pre-line">{booking.notes}</div>
              </div>
            ) : null}
          </Card>

          <Card>
            <h2 className="text-lg font-semibold text-fg mb-4">Activity</h2>
            {history.length === 0 ? (
              <div className="text-sm text-fg-muted">No activity yet.</div>
            ) : (
              <ol className="space-y-3">
                {history.map((h) => (
                  <li key={h.id} className="flex gap-3 text-sm">
                    <div className="h-2 w-2 rounded-full bg-leaf-400 mt-2 shrink-0" />
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
          </Card>
        </div>

        <aside className="space-y-6">
          <Card>
            <h3 className="text-sm uppercase tracking-wider text-fg-muted mb-2">Pricing</h3>
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
          </Card>

          <AdminBookingControls
            booking={{
              id: booking.id,
              status: booking.status,
              scheduledDate: booking.scheduledDate.toISOString().slice(0, 16),
              timeSlot: booking.timeSlot,
              droneId: booking.droneId,
              assignedTeamId: booking.assignedTeamId,
              finalPriceZar: booking.finalPriceZar ?? "",
              internalNotes: booking.internalNotes ?? "",
            }}
            drones={allDrones.map((d) => ({ id: d.id, name: d.name, status: d.status }))}
            team={allTeam.map((m) => ({ id: m.id, name: m.name, role: m.role }))}
          />
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