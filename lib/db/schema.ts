import {
  pgTable,
  text,
  timestamp,
  pgEnum,
  uuid,
  integer,
  numeric,
  boolean,
  jsonb,
  index,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

// =============================================================
// Enums
// =============================================================
export const userRoleEnum = pgEnum("user_role", ["customer", "admin", "team"]);
export const userStatusEnum = pgEnum("user_status", ["active", "suspended", "pending"]);

export const bookingStatusEnum = pgEnum("booking_status", [
  "pending",
  "confirmed",
  "scheduled",
  "in_progress",
  "completed",
  "cancelled",
  "rejected",
]);

export const serviceCategoryEnum = pgEnum("service_category", [
  "spraying",
  "fertilization",
  "monitoring",
  "mapping",
  "analysis",
  "livestock",
  "media",
]);

export const pricingModelEnum = pgEnum("pricing_model", [
  "fixed",
  "per_hectare",
  "hybrid",
  "custom",
]);

export const droneStatusEnum = pgEnum("drone_status", [
  "available",
  "assigned",
  "maintenance",
  "unavailable",
]);

export const notificationTypeEnum = pgEnum("notification_type", [
  "booking_submitted",
  "booking_confirmed",
  "booking_rescheduled",
  "booking_cancelled",
  "booking_completed",
  "system",
]);

// =============================================================
// Users & Auth
// =============================================================
export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 255 }).notNull(),
    passwordHash: text("password_hash"),
    name: varchar("name", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 32 }),
    role: userRoleEnum("role").notNull().default("customer"),
    status: userStatusEnum("status").notNull().default("active"),
    emailVerified: boolean("email_verified").notNull().default(false),
    image: text("image"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("users_email_idx").on(t.email)],
);

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  ipAddress: varchar("ip_address", { length: 64 }),
  userAgent: text("user_agent"),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  used: boolean("used").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// =============================================================
// Customer profile, farms, boundaries
// =============================================================
export const customerProfiles = pgTable("customer_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .unique(),
  companyName: varchar("company_name", { length: 255 }),
  province: varchar("province", { length: 64 }),
  preferredCrop: varchar("preferred_crop", { length: 64 }),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const farms = pgTable(
  "farms",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    address: text("address").notNull(),
    province: varchar("province", { length: 64 }),
    city: varchar("city", { length: 128 }),
    lat: numeric("lat", { precision: 10, scale: 7 }).notNull(),
    lng: numeric("lng", { precision: 10, scale: 7 }).notNull(),
    sizeHectares: numeric("size_hectares", { precision: 10, scale: 2 }).notNull(),
    cropType: varchar("crop_type", { length: 64 }),
    boundary: jsonb("boundary"), // GeoJSON Polygon coordinates
    isPrimary: boolean("is_primary").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("farms_user_idx").on(t.userId)],
);

// =============================================================
// Services & Pricing
// =============================================================
export const services = pgTable(
  "services",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: varchar("slug", { length: 96 }).notNull().unique(),
    name: varchar("name", { length: 255 }).notNull(),
    shortDescription: text("short_description").notNull(),
    description: text("description").notNull(),
    category: serviceCategoryEnum("category").notNull(),
    benefits: jsonb("benefits").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
    useCases: jsonb("use_cases").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
    suitableCustomers: jsonb("suitable_customers")
      .$type<string[]>()
      .notNull()
      .default(sql`'[]'::jsonb`),
    pricingModel: pricingModelEnum("pricing_model").notNull().default("per_hectare"),
    basePriceZar: numeric("base_price_zar", { precision: 12, scale: 2 }).notNull().default("0"),
    perHectarePriceZar: numeric("per_hectare_zar", { precision: 12, scale: 2 })
      .notNull()
      .default("0"),
    minimumHectares: numeric("min_hectares", { precision: 10, scale: 2 }).notNull().default("1"),
    maxHectaresPerDay: numeric("max_hectares_per_day", { precision: 10, scale: 2 })
      .notNull()
      .default("500"),
    imageUrl: text("image_url"),
    iconKey: varchar("icon_key", { length: 64 }),
    active: boolean("active").notNull().default(true),
    featured: boolean("featured").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("services_active_idx").on(t.active)],
);

export const servicePricingRules = pgTable("service_pricing_rules", {
  id: uuid("id").primaryKey().defaultRandom(),
  serviceId: uuid("service_id")
    .notNull()
    .references(() => services.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 128 }).notNull(), // e.g. "Distance surcharge >100km"
  kind: varchar("kind", { length: 32 }).notNull(), // "location_fee" | "urgency_fee" | "addon"
  amountZar: numeric("amount_zar", { precision: 12, scale: 2 }).notNull().default("0"),
  percent: numeric("percent", { precision: 5, scale: 2 }),
  description: text("description"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// =============================================================
// Drones & Team
// =============================================================
export const drones = pgTable("drones", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 128 }).notNull(),
  model: varchar("model", { length: 128 }).notNull(),
  registration: varchar("registration", { length: 64 }),
  capacityKg: numeric("capacity_kg", { precision: 8, scale: 2 }),
  flightTimeMin: integer("flight_time_min"),
  status: droneStatusEnum("status").notNull().default("available"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const teamMembers = pgTable("team_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 128 }).notNull(),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 32 }),
  available: boolean("available").notNull().default(true),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// =============================================================
// Bookings
// =============================================================
export const bookings = pgTable(
  "bookings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    reference: varchar("reference", { length: 24 }).notNull().unique(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    serviceId: uuid("service_id")
      .notNull()
      .references(() => services.id),
    farmId: uuid("farm_id").references(() => farms.id, { onDelete: "set null" }),
    droneId: uuid("drone_id").references(() => drones.id, { onDelete: "set null" }),
    assignedTeamId: uuid("assigned_team_id").references(() => teamMembers.id, {
      onDelete: "set null",
    }),
    cropType: varchar("crop_type", { length: 64 }).notNull(),
    farmSizeHectares: numeric("farm_size_hectares", { precision: 10, scale: 2 }).notNull(),
    province: varchar("province", { length: 64 }),
    scheduledDate: timestamp("scheduled_date", { withTimezone: true }).notNull(),
    scheduledEndDate: timestamp("scheduled_end_date", { withTimezone: true }),
    timeSlot: varchar("time_slot", { length: 32 }).notNull(), // "morning" | "afternoon"
    urgency: varchar("urgency", { length: 32 }).notNull().default("standard"),
    estimatedPriceZar: numeric("estimated_price_zar", { precision: 12, scale: 2 }).notNull(),
    finalPriceZar: numeric("final_price_zar", { precision: 12, scale: 2 }),
    status: bookingStatusEnum("status").notNull().default("pending"),
    notes: text("notes"),
    internalNotes: text("internal_notes"),
    contactPhone: varchar("contact_phone", { length: 32 }).notNull(),
    contactName: varchar("contact_name", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("bookings_user_idx").on(t.userId),
    index("bookings_status_idx").on(t.status),
    index("bookings_date_idx").on(t.scheduledDate),
  ],
);

export const bookingHistory = pgTable("booking_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  bookingId: uuid("booking_id")
    .notNull()
    .references(() => bookings.id, { onDelete: "cascade" }),
  actorId: uuid("actor_id").references(() => users.id, { onDelete: "set null" }),
  actorLabel: varchar("actor_label", { length: 128 }).notNull(),
  action: varchar("action", { length: 128 }).notNull(),
  fromStatus: bookingStatusEnum("from_status"),
  toStatus: bookingStatusEnum("to_status"),
  details: jsonb("details"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// =============================================================
// Notifications & messaging
// =============================================================
export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: notificationTypeEnum("type").notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    message: text("message").notNull(),
    bookingId: uuid("booking_id").references(() => bookings.id, { onDelete: "set null" }),
    read: boolean("read").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("notifications_user_idx").on(t.userId)],
);

export const contactMessages = pgTable("contact_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 32 }),
  subject: varchar("subject", { length: 255 }).notNull(),
  message: text("message").notNull(),
  handled: boolean("handled").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// =============================================================
// Reviews & audit log
// =============================================================
export const reviews = pgTable("reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  bookingId: uuid("booking_id")
    .notNull()
    .references(() => bookings.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  approved: boolean("approved").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const auditLog = pgTable("audit_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  actorId: uuid("actor_id").references(() => users.id, { onDelete: "set null" }),
  actorLabel: varchar("actor_label", { length: 128 }).notNull(),
  action: varchar("action", { length: 64 }).notNull(),
  entity: varchar("entity", { length: 64 }).notNull(),
  entityId: varchar("entity_id", { length: 64 }),
  details: jsonb("details"),
  ipAddress: varchar("ip_address", { length: 64 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// =============================================================
// Relations
// =============================================================
export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(customerProfiles, {
    fields: [users.id],
    references: [customerProfiles.userId],
  }),
  farms: many(farms),
  bookings: many(bookings),
  notifications: many(notifications),
}));

export const farmsRelations = relations(farms, ({ one, many }) => ({
  user: one(users, { fields: [farms.userId], references: [users.id] }),
  bookings: many(bookings),
}));

export const servicesRelations = relations(services, ({ many }) => ({
  pricingRules: many(servicePricingRules),
  bookings: many(bookings),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  user: one(users, { fields: [bookings.userId], references: [users.id] }),
  service: one(services, { fields: [bookings.serviceId], references: [services.id] }),
  farm: one(farms, { fields: [bookings.farmId], references: [farms.id] }),
  drone: one(drones, { fields: [bookings.droneId], references: [drones.id] }),
  team: one(teamMembers, { fields: [bookings.assignedTeamId], references: [teamMembers.id] }),
}));

export const dronesRelations = relations(drones, ({ many }) => ({
  bookings: many(bookings),
}));

export const teamMembersRelations = relations(teamMembers, ({ one, many }) => ({
  user: one(users, { fields: [teamMembers.userId], references: [users.id] }),
  bookings: many(bookings),
}));

// =============================================================
// Types
// =============================================================
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Farm = typeof farms.$inferSelect;
export type Service = typeof services.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type Drone = typeof drones.$inferSelect;
export type TeamMember = typeof teamMembers.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type AuditLog = typeof auditLog.$inferSelect;
export type CustomerProfile = typeof customerProfiles.$inferSelect;
export type BookingHistoryEntry = typeof bookingHistory.$inferSelect;
export type ContactMessage = typeof contactMessages.$inferSelect;
