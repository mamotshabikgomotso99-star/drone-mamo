import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Combine class names with Tailwind-aware merging */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format ZAR currency */
export function formatZAR(amount: number | string | null | undefined) {
  const n = typeof amount === "string" ? parseFloat(amount) : amount ?? 0;
  if (!Number.isFinite(n)) return "R0";
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(n);
}

/** Generate a human-friendly booking reference: KMD-AB12CD */
export function generateBookingReference() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const random = (n: number) =>
    Array.from({ length: n }, () =>
      alphabet.charAt(Math.floor(Math.random() * alphabet.length)),
    ).join("");
  return `KMD-${random(2)}-${random(4)}`;
}

/** Format a date for SA locale */
export function formatDate(
  d: Date | string | number | null | undefined,
  opts: Intl.DateTimeFormatOptions = { dateStyle: "medium" },
) {
  if (!d) return "—";
  const date = typeof d === "string" || typeof d === "number" ? new Date(d) : d;
  return new Intl.DateTimeFormat("en-ZA", opts).format(date);
}

export function formatDateTime(d: Date | string | number | null | undefined) {
  return formatDate(d, { dateStyle: "medium", timeStyle: "short" });
}

/** Truncate text */
export function truncate(text: string | null | undefined, max = 100) {
  if (!text) return "";
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

/** Safe-parse a number */
export function parseNumber(v: unknown, fallback = 0) {
  if (v === null || v === undefined || v === "") return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

/** Compute great-circle distance (km) between two lat/lng pairs */
export function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
) {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(s));
}

/** Compute a rough polygon area in hectares using the spherical-excess approximation
 *  Good enough for an estimate prompt; the app makes no correctness claims about the value.
 */
export function approximatePolygonHectares(
  ring: Array<[number, number]>, // [lng, lat][]
) {
  if (ring.length < 3) return 0;
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  let total = 0;
  for (let i = 0; i < ring.length; i++) {
    const [lng1, lat1] = ring[i];
    const [lng2, lat2] = ring[(i + 1) % ring.length];
    total +=
      toRad(lng2 - lng1) *
      (2 + Math.sin(toRad(lat1)) + Math.sin(toRad(lat2)));
  }
  const areaM2 = Math.abs((total * R * R) / 2);
  return areaM2 / 10_000; // ha
}

/** Convenience id gen wrapper */
export { nanoid } from "nanoid";

/** Sleep */
export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Status colour helpers (used by badges) */
export const STATUS_TONE = {
  pending: "amber",
  confirmed: "blue",
  scheduled: "indigo",
  in_progress: "violet",
  completed: "emerald",
  cancelled: "zinc",
  rejected: "red",
} as const;
export type BookingStatus = keyof typeof STATUS_TONE;
