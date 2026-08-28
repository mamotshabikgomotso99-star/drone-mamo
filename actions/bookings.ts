"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  bookings,
  services,
  farms,
  bookingHistory,
  notifications,
  servicePricingRules,
  users,
  type Booking,
} from "@/lib/db/schema";
import { bookingSchema, calculatePricing, type BookingInput } from "@/lib/validators";
import { fail, flattenZod, ok, type ActionResult } from "@/lib/action-result";
import { requireUser } from "@/lib/auth";
import { generateBookingReference } from "@/lib/utils";
import { sendEmail, emailTemplates } from "@/lib/email";

export async function createBookingAction(input: BookingInput): Promise<ActionResult<{ reference: string }>> {
  const user = await requireUser().catch(() => null);
  if (!user) return fail("You must be signed in to book a service");

  const parsed = bookingSchema.safeParse(input);
  if (!parsed.success) return fail("Please check the booking details", flattenZod(parsed.error));
  const data = parsed.data;

  const service = await db.query.services.findFirst({
    where: eq(services.id, data.serviceId),
    with: { pricingRules: true },
  });
  if (!service || !service.active) return fail("Selected service is not available");

  // Upsert farm
  let farmId: string;
  const existingFarm = await db.query.farms.findFirst({
    where: (f, { and, eq: _eq }) => and(_eq(f.userId, user.id), _eq(f.address, data.farm.address)),
  });
  if (existingFarm) {
    farmId = existingFarm.id;
    await db
      .update(farms)
      .set({
        name: data.farm.name,
        province: data.farm.province ?? null,
        city: data.farm.city ?? null,
        lat: String(data.farm.lat),
        lng: String(data.farm.lng),
        sizeHectares: String(data.farm.sizeHectares),
        cropType: data.farm.cropType || null,
        boundary: data.farm.boundary ?? null,
        updatedAt: new Date(),
      })
      .where(eq(farms.id, farmId));
  } else {
    const [f] = await db
      .insert(farms)
      .values({
        userId: user.id,
        name: data.farm.name,
        address: data.farm.address,
        province: data.farm.province ?? null,
        city: data.farm.city ?? null,
        lat: String(data.farm.lat),
        lng: String(data.farm.lng),
        sizeHectares: String(data.farm.sizeHectares),
        cropType: data.farm.cropType || null,
        boundary: data.farm.boundary ?? null,
        isPrimary: false,
      })
      .returning();
    farmId = f.id;
  }

  // Pricing
  const pricing = calculatePricing({
    service,
    hectares: data.farm.sizeHectares,
    urgency: data.urgency,
    distanceKm: data.distanceKm,
    pricingRules: service.pricingRules,
  });

  const reference = generateBookingReference();

  // Insert booking
  const [booking] = await db
    .insert(bookings)
    .values({
      reference,
      userId: user.id,
      serviceId: service.id,
      farmId,
      cropType: data.cropType,
      farmSizeHectares: String(data.farm.sizeHectares),
      province: data.farm.province ?? null,
      scheduledDate: data.scheduledDate,
      timeSlot: data.timeSlot,
      urgency: data.urgency,
      estimatedPriceZar: String(pricing.total),
      status: "pending",
      notes: data.notes ?? null,
      contactName: data.contactName,
      contactPhone: data.contactPhone,
    })
    .returning();

  await db.insert(bookingHistory).values({
    bookingId: booking.id,
    actorId: user.id,
    actorLabel: user.name,
    action: "Booking submitted",
    toStatus: "pending",
    details: { pricing },
  });

  await db.insert(notifications).values({
    userId: user.id,
    type: "booking_submitted",
    title: "Booking received",
    message: `Your ${service.name} booking (${reference}) is in the queue for review.`,
    bookingId: booking.id,
  });

  // Email
  const tpl = emailTemplates.bookingSubmitted({
    name: data.contactName,
    reference,
    service: service.name,
    date: new Date(data.scheduledDate).toLocaleDateString("en-ZA", { dateStyle: "long" }),
  });
  await sendEmail({
    to: user.email,
    subject: tpl.subject,
    html: tpl.html,
    tags: [
      { name: "kind", value: "booking-submitted" },
      { name: "ref", value: reference },
    ],
  }).catch((e) => console.error("[email] submitted failed:", e));

  revalidatePath("/dashboard/bookings");
  revalidatePath("/admin/bookings");

  return ok({ reference }, "Booking submitted");
}

export async function cancelBookingAction(bookingId: string): Promise<ActionResult<undefined>> {
  const user = await requireUser().catch(() => null);
  if (!user) return fail("Unauthorized");
  const booking = await db.query.bookings.findFirst({ where: eq(bookings.id, bookingId) });
  if (!booking) return fail("Booking not found");
  if (booking.userId !== user.id && user.role !== "admin") return fail("Forbidden");
  if (["completed", "cancelled", "rejected"].includes(booking.status))
    return fail("This booking can no longer be cancelled");

  await db
    .update(bookings)
    .set({ status: "cancelled", updatedAt: new Date() })
    .where(eq(bookings.id, bookingId));
  await db.insert(bookingHistory).values({
    bookingId,
    actorId: user.id,
    actorLabel: user.name,
    action: "Cancelled by " + (user.role === "admin" ? "admin" : "customer"),
    fromStatus: booking.status,
    toStatus: "cancelled",
  });
  await db.insert(notifications).values({
    userId: booking.userId,
    type: "booking_cancelled",
    title: "Booking cancelled",
    message: `Booking ${booking.reference} was cancelled.`,
    bookingId,
  });
  const owner = await db.query.users.findFirst({ where: eq(users.id, booking.userId) });
  if (owner) {
    const tpl = emailTemplates.bookingCancelled({ name: owner.name, reference: booking.reference });
    await sendEmail({
      to: owner.email,
      subject: tpl.subject,
      html: tpl.html,
    }).catch(() => null);
  }
  revalidatePath("/dashboard/bookings");
  revalidatePath(`/dashboard/bookings/${bookingId}`);
  revalidatePath("/admin/bookings");
  return ok(undefined, "Booking cancelled");
}