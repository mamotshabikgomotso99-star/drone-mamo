import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { notifications } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { Card } from "@/components/ui/card";
import { Bell, Check } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import { MarkAllReadButton } from "./MarkAllReadButton";

export const metadata = { title: "Notifications" };

export default async function NotificationsPage() {
  const session = await auth();
  if (!session) return null;

  let rows: any[] = [];
  try {
    rows = await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, session.user.id))
      .orderBy(desc(notifications.createdAt))
      .limit(50);
  } catch {
    rows = [];
  }
  const unread = rows.filter((r) => !r.read).length;

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-8 sm:py-12 max-w-3xl">
      <header className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-fg">
            Notifications
          </h1>
          <p className="mt-1 text-fg-muted">
            {unread > 0 ? `${unread} unread` : "All caught up"}
          </p>
        </div>
        {unread > 0 ? <MarkAllReadButton /> : null}
      </header>

      {rows.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Bell className="h-10 w-10 text-fg-muted mx-auto mb-3" />
            <div className="text-fg font-medium">No notifications yet</div>
            <p className="text-sm text-fg-muted mt-1">
              We&apos;ll let you know when something happens with your bookings.
            </p>
          </div>
        </Card>
      ) : (
        <ul className="space-y-3">
          {rows.map((n) => (
            <li
              key={n.id}
              className={`rounded-2xl glass p-5 ${n.read ? "opacity-70" : ""}`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
                    n.read
                      ? "bg-ash-100 text-fg-muted border border-leaf-700/15"
                      : "bg-leaf-50 text-leaf-700 border border-leaf-500/30"
                  }`}
                >
                  {n.read ? <Check className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-fg">{n.title}</div>
                  <div className="text-sm text-fg-dim mt-1">{n.message}</div>
                  <div className="text-xs text-fg-muted mt-2">
                    {formatDateTime(n.createdAt)}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}