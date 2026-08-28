"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  bookings,
  bookingHistory,
  notifications,
  users,
  services,
  drones,
  teamMembers,
  servicePricingRules,
  customerProfiles,
} from "@/lib/db/schema";
import {
  bookingStatusUpdateSchema,
  serviceUpsertSchema,
  droneUpsertSchema,
  teamUpsertSchema,
  profileUpdateSchema,
} from "@/lib/validators";
import { fail, flattenZod, ok, type ActionResult } from "@/lib/action-result";
import { requireAdmin, requireUser } from "@/lib/auth";
import { sendEmail, emailTemplates } from "@/lib/email";
import { logAudit } from "@/lib/audit";

/* --------------- Booking admin actions --------------- */
export async function adminUpdateBookingAction(formData: FormData): Promise<ActionResult<undefined>> {
  let admin;
  try {
    admin = await requireAdmin();
  } catch {
    return fail("Forbidden");
  }

  const parsed = bookingStatusUpdateSchema.safeParse({
    bookingId: formData.get("bookingId"),
    status: formData.get("status"),
    scheduledDate: formData.get("scheduledDate") || undefined,
    timeSlot: formData.get("timeSlot") || undefined,
    droneId: formData.get("droneId") || null,
    assignedTeamId: formData.get("assignedTeamId") || null,
    internalNotes: formData.get("internalNotes") || undefined,
    finalPriceZar: formData.get("finalPriceZar") || undefined,
  });
  if (!parsed.success) return fail("Validation failed", flattenZod(parsed.error));
  const d = parsed.data;

  const booking = await db.query.bookings.findFirst({ where: eq(bookings.id, d.bookingId) });
  if (!booking) return fail("Booking not found");

  const fromStatus = booking.status;
  const updates: Partial<typeof bookings.$inferInsert> = {
    status: d.status,
    updatedAt: new Date(),
  };
  if (d.scheduledDate) updates.scheduledDate = d.scheduledDate;
  if (d.timeSlot) updates.timeSlot = d.timeSlot;
  if (d.droneId !== undefined) updates.droneId = d.droneId || null;
  if (d.assignedTeamId !== undefined) updates.assignedTeamId = d.assignedTeamId || null;
  if (d.internalNotes !== undefined) updates.internalNotes = d.internalNotes || null;
  if (d.finalPriceZar !== undefined) updates.finalPriceZar = String(d.finalPriceZar);

  await db.update(bookings).set(updates).where(eq(bookings.id, d.bookingId));

  await db.insert(bookingHistory).values({
    bookingId: d.bookingId,
    actorId: admin.id,
    actorLabel: admin.name,
    action: `Status updated → ${d.status}`,
    fromStatus,
    toStatus: d.status,
    details: updates,
  });

  // Notify customer
  const owner = await db.query.users.findFirst({ where: eq(users.id, booking.userId) });
  if (owner) {
    const map: Record<string, { type: string; tpl: (a: any) => { subject: string; html: string } }> = {
      confirmed: {
        type: "booking_confirmed",
        tpl: emailTemplates.bookingConfirmed,
      },
      scheduled: {
        type: "booking_confirmed",
        tpl: emailTemplates.bookingConfirmed,
      },
      completed: {
        type: "booking_completed",
        tpl: emailTemplates.bookingCompleted,
      },
      cancelled: {
        type: "booking_cancelled",
        tpl: emailTemplates.bookingCancelled,
      },
      rejected: {
        type: "booking_cancelled",
        tpl: emailTemplates.bookingCancelled,
      },
    };
    const cfg = map[d.status];
    if (cfg) {
      await db.insert(notifications).values({
        userId: owner.id,
        type: cfg.type as any,
        title: `Booking ${d.status}`,
        message: `Your booking ${booking.reference} has been marked ${d.status}.`,
        bookingId: booking.id,
      });
      const dateLabel = new Date(booking.scheduledDate).toLocaleDateString("en-ZA", {
        dateStyle: "long",
      });
      const tpl =
        d.status === "cancelled" || d.status === "rejected"
          ? cfg.tpl({ name: owner.name, reference: booking.reference })
          : d.status === "completed"
            ? cfg.tpl({ name: owner.name, reference: booking.reference })
            : cfg.tpl({ name: owner.name, reference: booking.reference, date: dateLabel });
      await sendEmail({
        to: owner.email,
        subject: tpl.subject,
        html: tpl.html,
        tags: [{ name: "kind", value: cfg.type }],
      }).catch((e) => console.error("[email] status failed:", e));
    }
  }

  await logAudit({
    actorId: admin.id,
    actorLabel: admin.name,
    action: "update_booking",
    entity: "booking",
    entityId: d.bookingId,
    details: { from: fromStatus, to: d.status, updates },
  });

  revalidatePath("/admin/bookings");
  revalidatePath(`/admin/bookings/${d.bookingId}`);
  revalidatePath("/dashboard/bookings");
  return ok(undefined, "Booking updated");
}

/* --------------- Service / pricing actions --------------- */
export async function adminUpsertServiceAction(input: unknown): Promise<ActionResult<{ id: string }>> {
  let admin;
  try {
    admin = await requireAdmin();
  } catch {
    return fail("Forbidden");
  }
  const parsed = serviceUpsertSchema.safeParse(input);
  if (!parsed.success) return fail("Validation failed", flattenZod(parsed.error));
  const d = parsed.data;

  if (d.id) {
    await db
      .update(services)
      .set({
        slug: d.slug,
        name: d.name,
        shortDescription: d.shortDescription,
        description: d.description,
        category: d.category,
        pricingModel: d.pricingModel,
        basePriceZar: String(d.basePriceZar),
        perHectarePriceZar: String(d.perHectarePriceZar),
        minimumHectares: String(d.minimumHectares),
        maxHectaresPerDay: String(d.maxHectaresPerDay),
        imageUrl: d.imageUrl || null,
        iconKey: d.iconKey || null,
        benefits: d.benefits,
        useCases: d.useCases,
        suitableCustomers: d.suitableCustomers,
        featured: d.featured,
        active: d.active,
        updatedAt: new Date(),
      })
      .where(eq(services.id, d.id));
    await logAudit({ actorId: admin.id, actorLabel: admin.name, action: "update_service", entity: "service", entityId: d.id });
    revalidatePath("/admin/services");
    revalidatePath("/services");
    return ok({ id: d.id }, "Service updated");
  }

  const [s] = await db
    .insert(services)
    .values({
      slug: d.slug,
      name: d.name,
      shortDescription: d.shortDescription,
      description: d.description,
      category: d.category,
      pricingModel: d.pricingModel,
      basePriceZar: String(d.basePriceZar),
      perHectarePriceZar: String(d.perHectarePriceZar),
      minimumHectares: String(d.minimumHectares),
      maxHectaresPerDay: String(d.maxHectaresPerDay),
      imageUrl: d.imageUrl || null,
      iconKey: d.iconKey || null,
      benefits: d.benefits,
      useCases: d.useCases,
      suitableCustomers: d.suitableCustomers,
      featured: d.featured,
      active: d.active,
    })
    .returning();
  await logAudit({ actorId: admin.id, actorLabel: admin.name, action: "create_service", entity: "service", entityId: s.id });
  revalidatePath("/admin/services");
  revalidatePath("/services");
  return ok({ id: s.id }, "Service created");
}

export async function adminDeleteServiceAction(id: string): Promise<ActionResult<undefined>> {
  let admin;
  try {
    admin = await requireAdmin();
  } catch {
    return fail("Forbidden");
  }
  await db.update(services).set({ active: false, updatedAt: new Date() }).where(eq(services.id, id));
  await logAudit({ actorId: admin.id, actorLabel: admin.name, action: "deactivate_service", entity: "service", entityId: id });
  revalidatePath("/admin/services");
  return ok(undefined, "Service deactivated");
}

/* --------------- Drone / team --------------- */
export async function adminUpsertDroneAction(input: unknown): Promise<ActionResult<{ id: string }>> {
  let admin;
  try {
    admin = await requireAdmin();
  } catch {
    return fail("Forbidden");
  }
  const parsed = droneUpsertSchema.safeParse(input);
  if (!parsed.success) return fail("Validation failed", flattenZod(parsed.error));
  const d = parsed.data;
  if (d.id) {
    await db
      .update(drones)
      .set({
        name: d.name,
        model: d.model,
        registration: d.registration || null,
        capacityKg: String(d.capacityKg),
        flightTimeMin: d.flightTimeMin,
        status: d.status,
        notes: d.notes || null,
        updatedAt: new Date(),
      })
      .where(eq(drones.id, d.id));
    revalidatePath("/admin/drones");
    return ok({ id: d.id }, "Drone updated");
  }
  const [r] = await db
    .insert(drones)
    .values({
      name: d.name,
      model: d.model,
      registration: d.registration || null,
      capacityKg: String(d.capacityKg),
      flightTimeMin: d.flightTimeMin,
      status: d.status,
      notes: d.notes || null,
    })
    .returning();
  revalidatePath("/admin/drones");
  return ok({ id: r.id }, "Drone added");
}

export async function adminUpsertTeamAction(input: unknown): Promise<ActionResult<{ id: string }>> {
  let admin;
  try {
    admin = await requireAdmin();
  } catch {
    return fail("Forbidden");
  }
  const parsed = teamUpsertSchema.safeParse(input);
  if (!parsed.success) return fail("Validation failed", flattenZod(parsed.error));
  const d = parsed.data;
  if (d.id) {
    await db
      .update(teamMembers)
      .set({
        name: d.name,
        role: d.role,
        email: d.email || null,
        phone: d.phone || null,
        available: d.available,
        bio: d.bio || null,
        updatedAt: new Date(),
      })
      .where(eq(teamMembers.id, d.id));
    revalidatePath("/admin/team");
    return ok({ id: d.id }, "Team member updated");
  }
  const [r] = await db
    .insert(teamMembers)
    .values({
      name: d.name,
      role: d.role,
      email: d.email || null,
      phone: d.phone || null,
      available: d.available,
      bio: d.bio || null,
    })
    .returning();
  revalidatePath("/admin/team");
  return ok({ id: r.id }, "Team member added");
}

/* --------------- Profile (customer) --------------- */
export async function updateProfileAction(formData: FormData): Promise<ActionResult<undefined>> {
  const user = await requireUser().catch(() => null);
  if (!user) return fail("Unauthorized");
  const parsed = profileUpdateSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    companyName: formData.get("companyName"),
    province: formData.get("province"),
    preferredCrop: formData.get("preferredCrop"),
  });
  if (!parsed.success) return fail("Validation failed", flattenZod(parsed.error));
  const d = parsed.data;
  await db.update(users).set({ name: d.name, phone: d.phone || null, updatedAt: new Date() }).where(eq(users.id, user.id));
  const profile = await db.query.customerProfiles.findFirst({
    where: eq(customerProfiles.userId, user.id),
  });
  if (profile) {
    await db
      .update(customerProfiles)
      .set({
        companyName: d.companyName || null,
        province: (d.province as string) || null,
        preferredCrop: d.preferredCrop || null,
        updatedAt: new Date(),
      })
      .where(eq(customerProfiles.userId, user.id));
  } else {
    await db.insert(customerProfiles).values({
      userId: user.id,
      companyName: d.companyName || null,
      province: (d.province as string) || null,
      preferredCrop: d.preferredCrop || null,
    });
  }
  revalidatePath("/dashboard/profile");
  return ok(undefined, "Profile updated");
}

/* --------------- Contact form --------------- */
export async function submitContactAction(formData: FormData): Promise<ActionResult<undefined>> {
  const { contactSchema } = await import("@/lib/validators");
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  });
  if (!parsed.success) return fail("Validation failed", flattenZod(parsed.error));
  const d = parsed.data;
  const { contactMessages } = await import("@/lib/db/schema");
  await db.insert(contactMessages).values(d);
  return ok(undefined, "Thanks — we'll be in touch within 1 business day.");
}