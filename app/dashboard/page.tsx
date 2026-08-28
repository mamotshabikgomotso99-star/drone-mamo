import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { bookings, notifications } from "@/lib/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { Badge } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Plane, Calendar, ArrowRight, CheckCircle2, AlertCircle, XCircle, Sparkles, Clock, User } from "lucide-react";
import { formatZAR, formatDate } from "@/lib/utils";

const STATUS_TONE: Record<string, "amber" | "blue" | "indigo" | "violet" | "emerald" | "zinc" | "red"> = {
  pending: "amber",
  confirmed: "blue",
  scheduled: "indigo",
  in_progress: "violet",
  completed: "emerald",
  cancelled: "zinc",
  rejected: "red",
};

const STATUS_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  pending: AlertCircle,
  confirmed: CheckCircle2,
  scheduled: Calendar,
  in_progress: Sparkles,
  completed: CheckCircle2,
  cancelled: XCircle,
  rejected: XCircle,
};

export const metadata = { title: "Dashboard" };

export default async function DashboardOverview({
  searchParams,
}: {
  searchParams: Promise<{ booking?: string }>;
}) {
  const session = await auth();
  if (!session) return null;
  const { booking: justBookedRef } = await searchParams;

  let userBookings: any[] = [];
  let unreadCount = 0;
  try {
    userBookings = await db
      .select()
      .from(bookings)
      .where(eq(bookings.userId, session.user.id))
      .orderBy(desc(bookings.createdAt))
      .limit(8);
    const n = await db.query.notifications.findMany({
      where: and(eq(notifications.userId, session.user.id), eq(notifications.read, false)),
    });
    unreadCount = n.length;
  } catch {
    userBookings = [];
  }

  const upcoming = userBookings.find(
    (b) => !["completed", "cancelled", "rejected"].includes(b.status) && new Date(b.scheduledDate) > new Date(),
  );
  const stats = {
    total: userBookings.length,
    upcoming: userBookings.filter((b) =>
      !["completed", "cancelled", "rejected"].includes(b.status) &&
      new Date(b.scheduledDate) > new Date(),
    ).length,
    completed: userBookings.filter((b) => b.status === "completed").length,
  };

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-8 sm:py-12">
      {justBookedRef ? (
        <div className="mb-6 rounded-2xl border border-leaf-500/40 bg-leaf-50 p-5 flex items-start gap-3 animate-fade-in-up">
          <CheckCircle2 className="h-5 w-5 text-leaf-700 mt-0.5" />
          <div>
            <div className="text-sm font-medium text-fg">Booking {justBookedRef} submitted</div>
            <div className="text-xs text-fg-dim mt-0.5">
              We&apos;ll review and confirm within 1 business day. Watch your email.
            </div>
          </div>
        </div>
      ) : null}

      <header className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-leaf-700 font-medium">
            Welcome back
          </div>
          <h1 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-fg">
            Hello, {session.user.name?.split(" ")[0]}
          </h1>
          <p className="mt-1 text-fg-muted">
            Manage your bookings, profile, and farm from here.
          </p>
        </div>
        <Button href="/book" size="lg">
          <Plane className="h-4 w-4" /> Book a drone service
        </Button>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        <Stat icon={<Calendar />} label="Total bookings" value={stats.total} />
        <Stat icon={<Clock />} label="Upcoming" value={stats.upcoming} tone="leaf" />
        <Stat icon={<CheckCircle2 />} label="Completed" value={stats.completed} tone="emerald" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {upcoming ? (
            <UpcomingCard b={upcoming} />
          ) : (
            <Card>
              <CardTitle>No upcoming missions</CardTitle>
              <CardDescription>Book your next drone service to get started.</CardDescription>
              <Button href="/book" className="mt-5">
                Book a service
              </Button>
            </Card>
          )}

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold tracking-tight text-fg">Recent bookings</h2>
              <Link href="/dashboard/bookings" className="text-xs text-leaf-700 hover:underline font-medium">
                View all →
              </Link>
            </div>
            {userBookings.length === 0 ? (
              <Card>
                <div className="text-center py-8">
                  <div className="text-fg-muted text-sm">No bookings yet.</div>
                  <Button href="/book" className="mt-4">
                    Book your first service
                  </Button>
                </div>
              </Card>
            ) : (
              <ul className="space-y-3">
                {userBookings.map((b) => {
                  const Icon = STATUS_ICON[b.status] ?? AlertCircle;
                  return (
                    <li key={b.id}>
                      <Link
                        href={`/dashboard/bookings/${b.id}`}
                        className="flex items-center justify-between gap-4 rounded-2xl glass p-4 hover:bg-ash-100 transition-colors"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="h-10 w-10 rounded-xl bg-leaf-50 border border-leaf-500/30 flex items-center justify-center text-leaf-700 shrink-0">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-fg truncate">
                              {b.reference}
                            </div>
                            <div className="text-xs text-fg-muted truncate">
                              {formatDate(b.scheduledDate)} · {b.timeSlot}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <Badge tone={STATUS_TONE[b.status]}>{b.status.replace("_", " ")}</Badge>
                          <span className="text-sm font-medium text-fg">
                            {formatZAR(b.estimatedPriceZar)}
                          </span>
                          <ArrowRight className="h-4 w-4 text-fg-muted" />
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-3">
              <CardTitle className="text-base">Notifications</CardTitle>
              <Link href="/dashboard/notifications" className="text-xs text-leaf-700 hover:underline font-medium">
                View all
              </Link>
            </div>
            <div className="text-sm text-fg-dim">
              {unreadCount > 0 ? (
                <>You have {unreadCount} unread notification{unreadCount === 1 ? "" : "s"}.</>
              ) : (
                <>You&apos;re all caught up.</>
              )}
            </div>
          </Card>

          <Card>
            <CardTitle className="text-base">Quick actions</CardTitle>
            <div className="mt-3 grid gap-2">
              <Button href="/book" variant="secondary" className="justify-start">
                <Plane className="h-4 w-4" /> Book a service
              </Button>
              <Button href="/dashboard/profile" variant="ghost" className="justify-start">
                <User className="h-4 w-4" /> Update profile
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: number; tone?: "leaf" | "emerald" }) {
  return (
    <div className="rounded-2xl glass p-5">
      <div className={`h-9 w-9 rounded-xl flex items-center justify-center mb-3 ${
        tone === "leaf" ? "bg-leaf-50 text-leaf-700 border border-leaf-500/30" :
        tone === "emerald" ? "bg-emerald-50 text-emerald-700 border border-emerald-300" :
        "bg-ash-100 text-fg-dim border border-leaf-700/15"
      }`}>
        {icon}
      </div>
      <div className="text-3xl font-semibold text-fg">{value}</div>
      <div className="text-xs text-fg-muted mt-1">{label}</div>
    </div>
  );
}

function UpcomingCard({ b }: { b: any }) {
  return (
    <Card className="glass-strong ring-1 ring-leaf-500/30">
      <div className="flex items-center justify-between mb-3">
        <Badge tone={STATUS_TONE[b.status]}>{b.status.replace("_", " ")}</Badge>
        <Link href={`/dashboard/bookings/${b.id}`} className="text-xs text-leaf-700 hover:underline font-medium">
          View details →
        </Link>
      </div>
      <CardTitle>Next mission</CardTitle>
      <CardDescription>{b.reference}</CardDescription>
      <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
        <Item label="Date" value={formatDate(b.scheduledDate)} />
        <Item label="Time" value={b.timeSlot} />
        <Item label="Estimated" value={formatZAR(b.estimatedPriceZar)} />
        <Item label="Crop" value={b.cropType ?? "—"} />
      </div>
    </Card>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-fg-muted">{label}</div>
      <div className="text-fg mt-1">{value}</div>
    </div>
  );
}