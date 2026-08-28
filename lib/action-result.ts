/** Server actions return a consistent result shape */
export type ActionResult<T = undefined> =
  | { ok: true; data?: T; message?: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export function ok<T>(data?: T, message?: string): ActionResult<T> {
  return { ok: true, data, message };
}

export function fail(error: string, fieldErrors?: Record<string, string[]>): ActionResult {
  return { ok: false, error, fieldErrors };
}

/** Helper to flatten Zod errors into fieldErrors */
import type { ZodError } from "zod";

export function flattenZod(err: ZodError) {
  const out: Record<string, string[]> = {};
  for (const issue of err.issues) {
    const k = issue.path.join(".") || "_";
    (out[k] ??= []).push(issue.message);
  }
  return out;
}