"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { servicePricingRules, services } from "@/lib/db/schema";
import { z } from "zod";
import { fail, flattenZod, ok, type ActionResult } from "@/lib/action-result";
import { requireAdmin } from "@/lib/auth";
import { logAudit } from "@/lib/audit";

const pricingRuleSchema = z.object({
  id: z.string().uuid().optional(),
  serviceId: z.string().uuid("Choose a service"),
  kind: z.enum(["urgency_fee", "location_fee", "addon"]),
  name: z.string().trim().min(2).max(128),
  amountZar: z.coerce.number().nonnegative().default(0),
  percent: z.coerce.number().min(0).max(200).default(0),
  description: z.string().trim().max(500).optional().or(z.literal("")),
  active: z.boolean().default(true),
});

export async function adminUpsertPricingRuleAction(formData: FormData): Promise<ActionResult<{ id: string }>> {
  let admin;
  try {
    admin = await requireAdmin();
  } catch {
    return fail("Forbidden");
  }
  const parsed = pricingRuleSchema.safeParse({
    id: (formData.get("id") as string) || undefined,
    serviceId: formData.get("serviceId"),
    kind: formData.get("kind"),
    name: formData.get("name"),
    amountZar: formData.get("amountZar") || 0,
    percent: formData.get("percent") || 0,
    description: formData.get("description") || undefined,
    active: formData.get("active") === "true",
  });
  if (!parsed.success) return fail("Validation failed", flattenZod(parsed.error));
  const d = parsed.data;

  const svc = await db.query.services.findFirst({ where: eq(services.id, d.serviceId) });
  if (!svc) return fail("Service not found");

  if (d.id) {
    await db
      .update(servicePricingRules)
      .set({
        serviceId: d.serviceId,
        kind: d.kind,
        name: d.name,
        amountZar: String(d.amountZar),
        percent: String(d.percent),
        description: d.description || null,
        active: d.active,
      })
      .where(eq(servicePricingRules.id, d.id));
    await logAudit({ actorId: admin.id, actorLabel: admin.name, action: "update_pricing_rule", entity: "pricing_rule", entityId: d.id });
    revalidatePath("/admin/pricing");
    revalidatePath("/admin/services");
    return ok({ id: d.id }, "Rule updated");
  }

  const [r] = await db
    .insert(servicePricingRules)
    .values({
      serviceId: d.serviceId,
      kind: d.kind,
      name: d.name,
      amountZar: String(d.amountZar),
      percent: String(d.percent),
      description: d.description || null,
      active: d.active,
    })
    .returning();
  await logAudit({ actorId: admin.id, actorLabel: admin.name, action: "create_pricing_rule", entity: "pricing_rule", entityId: r.id });
  revalidatePath("/admin/pricing");
  revalidatePath("/admin/services");
  return ok({ id: r.id }, "Rule created");
}

export async function adminDeletePricingRuleAction(id: string): Promise<ActionResult<undefined>> {
  let admin;
  try {
    admin = await requireAdmin();
  } catch {
    return fail("Forbidden");
  }
  await db.update(servicePricingRules).set({ active: false }).where(eq(servicePricingRules.id, id));
  await logAudit({ actorId: admin.id, actorLabel: admin.name, action: "deactivate_pricing_rule", entity: "pricing_rule", entityId: id });
  revalidatePath("/admin/pricing");
  return ok(undefined, "Rule deactivated");
}