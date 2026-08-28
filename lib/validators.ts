import { z } from "zod";
import { haversineKm, approximatePolygonHectares, parseNumber } from "@/lib/utils";

// =============================================================
// Shared field schemas
// =============================================================
export const emailSchema = z.string().email("Invalid email").toLowerCase().trim();
export const phoneSchema = z
  .string()
  .trim()
  .regex(/^(\+?27|0)\d{9}$/u, "Phone must be a valid South African number (e.g. +27 82 555 0199)")
  .optional()
  .or(z.literal(""));
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/u, "Password must contain an uppercase letter")
  .regex(/[a-z]/u, "Password must contain a lowercase letter")
  .regex(/[0-9]/u, "Password must contain a number");

export const southAfricanProvinces = [
  "Western Cape",
  "Eastern Cape",
  "Northern Cape",
  "Free State",
  "KwaZulu-Natal",
  "North West",
  "Gauteng",
  "Mpumalanga",
  "Limpopo",
] as const;

// =============================================================
// Auth
// =============================================================
export const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Name is too short").max(120),
    email: emailSchema,
    phone: phoneSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({ email: emailSchema });

export const resetPasswordSchema = z
  .object({
    token: z.string().min(10),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// =============================================================
// Farm + booking
// =============================================================
export const farmSchema = z.object({
  name: z.string().trim().min(2, "Farm name is required").max(120),
  address: z.string().trim().min(3, "Address is required").max(255),
  province: z.enum(southAfricanProvinces).or(z.string()).optional(),
  city: z.string().trim().max(120).optional().or(z.literal("")),
  lat: z.coerce.number().min(-34).max(-22, "Latitudes must be in South Africa"),
  lng: z.coerce.number().min(16).max(33, "Longitudes must be in South Africa"),
  sizeHectares: z.coerce.number().positive("Farm size must be > 0").max(100_000),
  cropType: z.string().trim().max(64).optional().or(z.literal("")),
  boundary: z
    .array(z.tuple([z.number(), z.number()]))
    .optional()
    .nullable(),
});

export const bookingSchema = z
  .object({
    serviceId: z.string().uuid("Choose a service"),
    farm: farmSchema,
    cropType: z.string().trim().min(2, "Crop type is required").max(64),
    scheduledDate: z.coerce.date().refine(
      (d) => d.getTime() > Date.now() - 60 * 60 * 1000,
      "Date must be in the future",
    ),
    timeSlot: z.enum(["morning", "afternoon"]),
    urgency: z.enum(["standard", "urgent"]).default("standard"),
    contactName: z.string().trim().min(2, "Contact name is required").max(120),
    contactPhone: z
      .string()
      .trim()
      .regex(/^(\+?27|0)\d{9}$/u, "Phone must be a valid South African number"),
    notes: z.string().trim().max(2000).optional().or(z.literal("")),
    distanceKm: z.coerce.number().nonnegative().default(0),
  })
  .superRefine((data, ctx) => {
    // For services that have size minima
    if (data.farm.sizeHectares <= 0) {
      ctx.addIssue({
        code: "custom",
        path: ["farm", "sizeHectares"],
        message: "Farm size must be greater than 0",
      });
    }
  });

// =============================================================
// Contact + admin forms
// =============================================================
export const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: emailSchema,
  phone: phoneSchema.optional(),
  subject: z.string().trim().min(3).max(160),
  message: z.string().trim().min(10).max(4000),
});

export const profileUpdateSchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: phoneSchema,
  companyName: z.string().trim().max(255).optional().or(z.literal("")),
  province: z
    .enum(southAfricanProvinces)
    .or(z.literal(""))
    .optional(),
  preferredCrop: z.string().trim().max(64).optional().or(z.literal("")),
});

export const serviceUpsertSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(96)
    .regex(/^[a-z0-9-]+$/u, "Slug must be lowercase letters, numbers, or hyphens"),
  name: z.string().trim().min(2).max(160),
  shortDescription: z.string().trim().min(10).max(300),
  description: z.string().trim().min(20).max(8000),
  category: z.enum([
    "spraying",
    "fertilization",
    "monitoring",
    "mapping",
    "analysis",
    "livestock",
    "media",
  ]),
  pricingModel: z.enum(["fixed", "per_hectare", "hybrid", "custom"]),
  basePriceZar: z.coerce.number().nonnegative(),
  perHectarePriceZar: z.coerce.number().nonnegative(),
  minimumHectares: z.coerce.number().nonnegative(),
  maxHectaresPerDay: z.coerce.number().nonnegative(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  iconKey: z.string().trim().max(64).optional(),
  benefits: z.array(z.string()).default([]),
  useCases: z.array(z.string()).default([]),
  suitableCustomers: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
});

export const droneUpsertSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(2).max(120),
  model: z.string().trim().min(2).max(120),
  registration: z.string().trim().max(64).optional().or(z.literal("")),
  capacityKg: z.coerce.number().nonnegative().default(0),
  flightTimeMin: z.coerce.number().int().nonnegative().default(0),
  status: z.enum(["available", "assigned", "maintenance", "unavailable"]),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
});

export const teamUpsertSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(2).max(160),
  role: z.string().trim().min(2).max(120),
  email: emailSchema.optional().or(z.literal("")),
  phone: z
    .string()
    .trim()
    .max(32)
    .optional()
    .or(z.literal("")),
  available: z.boolean().default(true),
  bio: z.string().trim().max(2000).optional().or(z.literal("")),
});

export const bookingStatusUpdateSchema = z.object({
  bookingId: z.string().uuid(),
  status: z.enum([
    "pending",
    "confirmed",
    "scheduled",
    "in_progress",
    "completed",
    "cancelled",
    "rejected",
  ]),
  scheduledDate: z.coerce.date().optional(),
  timeSlot: z.enum(["morning", "afternoon"]).optional(),
  droneId: z.string().uuid().optional().nullable(),
  assignedTeamId: z.string().uuid().optional().nullable(),
  internalNotes: z.string().max(5000).optional().or(z.literal("")),
  finalPriceZar: z.coerce.number().nonnegative().optional(),
});

export type BookingInput = z.infer<typeof bookingSchema>;
export type FarmInput = z.infer<typeof farmSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type ServiceUpsertInput = z.infer<typeof serviceUpsertSchema>;
export type DroneUpsertInput = z.infer<typeof droneUpsertSchema>;
export type TeamUpsertInput = z.infer<typeof teamUpsertSchema>;

// =============================================================
// Pricing engine
// =============================================================
export interface PricingInput {
  service: {
    pricingModel: "fixed" | "per_hectare" | "hybrid" | "custom";
    basePriceZar: string;
    perHectarePriceZar: string;
    minimumHectares: string;
    maxHectaresPerDay: string;
  };
  hectares: number;
  urgency: "standard" | "urgent";
  distanceKm: number;
  pricingRules?: Array<{
    kind: string;
    amountZar: string | null;
    percent: string | null;
    active: boolean;
  }>;
}

export interface PricingResult {
  base: number;
  perHectare: number;
  subtotal: number;
  urgencyFee: number;
  locationFee: number;
  total: number;
  currency: "ZAR";
  notes: string[];
}

export function calculatePricing(input: PricingInput): PricingResult {
  const notes: string[] = [];
  const base = parseNumber(input.service.basePriceZar);
  const perHa = parseNumber(input.service.perHectarePriceZar);
  const minHa = parseNumber(input.service.minimumHectares, 1);
  const ha = Math.max(input.hectares, minHa);

  let subtotal = 0;
  switch (input.service.pricingModel) {
    case "fixed":
      subtotal = base;
      break;
    case "per_hectare":
      subtotal = perHa * ha;
      break;
    case "hybrid":
      subtotal = base + perHa * ha;
      break;
    case "custom":
      subtotal = base; // estimate only
      notes.push("Pricing is indicative — final quote requires admin confirmation.");
      break;
  }

  // Urgency fees
  let urgencyFee = 0;
  for (const r of input.pricingRules ?? []) {
    if (!r.active || r.kind !== "urgency_fee") continue;
    const amt = parseNumber(r.amountZar);
    if (input.urgency === "urgent") urgencyFee += amt;
  }

  // Location fees — per-km above threshold
  let locationFee = 0;
  for (const r of input.pricingRules ?? []) {
    if (!r.active || r.kind !== "location_fee") continue;
    const amt = parseNumber(r.amountZar);
    const over = Math.max(0, input.distanceKm - 100);
    locationFee += amt * over;
  }

  const total = Math.round(subtotal + urgencyFee + locationFee);

  return {
    base: Math.round(base),
    perHectare: Math.round(perHa * ha),
    subtotal: Math.round(subtotal),
    urgencyFee: Math.round(urgencyFee),
    locationFee: Math.round(locationFee),
    total,
    currency: "ZAR",
    notes,
  };
}

/** Distance helper used in pricing & booking pages */
export function distanceToBase(
  base: { lat: number; lng: number } | null | undefined,
  target: { lat: number; lng: number },
) {
  if (!base) return 0;
  return haversineKm(base, target);
}

/** Approx farm area from a polygon (Lng/Lat) */
export function areaFromPolygon(ring: Array<[number, number]>) {
  return approximatePolygonHectares(ring);
}
