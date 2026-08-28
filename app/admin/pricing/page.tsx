import { db } from "@/lib/db";
import { servicePricingRules, services } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { formatZAR } from "@/lib/utils";
import { RulesForm } from "./RulesForm";

export const metadata = { title: "Pricing rules · Admin" };

export default async function AdminPricingPage() {
  let rules: any[] = [];
  let allServices: any[] = [];
  try {
    [rules, allServices] = await Promise.all([
      db.select().from(servicePricingRules).orderBy(desc(servicePricingRules.createdAt)),
      db.select({ id: services.id, name: services.name }).from(services),
    ]);
  } catch {}

  const activeRules = rules.filter((r) => r.active);

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-8 sm:py-12">
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-fg">
          Pricing rules
        </h1>
        <p className="mt-1 text-fg-muted">
          Adjust urgency surcharges, distance fees, and add-ons.
        </p>
      </header>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {activeRules.length === 0 ? (
            <div className="rounded-2xl glass p-12 text-center">
              <div className="text-fg font-medium">No active pricing rules yet.</div>
              <div className="text-fg-muted text-sm mt-1">
                Add a rule on the right to apply surcharges to specific services.
              </div>
            </div>
          ) : (
            activeRules.map((r) => {
              const svc = allServices.find((s) => s.id === r.serviceId);
              return (
                <Card key={r.id}>
                  <CardTitle className="text-base">{r.name}</CardTitle>
                  <CardDescription>
                    {svc?.name ?? "—"} · {r.kind.replace("_", " ")}
                  </CardDescription>
                  <div className="mt-2 text-sm text-fg-dim flex gap-4">
                    {Number(r.amountZar) > 0 ? <span>Amount: {formatZAR(r.amountZar)}</span> : null}
                    {Number(r.percent) > 0 ? <span>Percent: {r.percent}%</span> : null}
                  </div>
                  {r.description ? (
                    <div className="text-sm text-fg-muted mt-2">{r.description}</div>
                  ) : null}
                </Card>
              );
            })
          )}
        </div>

        <aside>
          <Card>
            <CardTitle className="text-base">New rule</CardTitle>
            <RulesForm services={allServices} />
          </Card>

          <Card className="mt-4">
            <CardTitle className="text-base">Pricing engine</CardTitle>
            <CardDescription className="mt-2">
              The booking flow combines the service&apos;s base price with configured multipliers, urgency uplift and
              distance surcharge.
            </CardDescription>
            <div className="mt-3 text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-fg-muted">Distance threshold</span>
                <span className="text-fg">100 km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-fg-muted">Urgency window</span>
                <span className="text-fg">≤ 24 h</span>
              </div>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}