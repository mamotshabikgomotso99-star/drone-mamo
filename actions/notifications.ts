"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { notifications } from "@/lib/db/schema";
import { requireUser } from "@/lib/auth";
import { fail, ok, type ActionResult } from "@/lib/action-result";

export async function markNotificationReadAction(id: string): Promise<ActionResult<undefined>> {
  const user = await requireUser().catch(() => null);
  if (!user) return fail("Unauthorized");
  await db
    .update(notifications)
    .set({ read: true })
    .where(eq(notifications.id, id));
  revalidatePath("/dashboard/notifications");
  return ok();
}

export async function markAllNotificationsReadAction(): Promise<ActionResult<undefined>> {
  const user = await requireUser().catch(() => null);
  if (!user) return fail("Unauthorized");
  await db
    .update(notifications)
    .set({ read: true })
    .where(eq(notifications.userId, user.id));
  revalidatePath("/dashboard/notifications");
  return ok();
}