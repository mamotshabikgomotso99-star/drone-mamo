import { db } from "@/lib/db";
import { services } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import { Badge, Card, CardTitle, CardDescription } from "@/components/ui/card";
import { formatZAR } from "@/lib/utils";
import { ServiceForm } from "./ServiceForm";

export const metadata = { title: "Services · Admin" };

export default async function AdminServicesPage() {
  let rows: any[] = [];
  try {
    rows = await db
      .select()
      .from(services)
      .orderBy(asc(services.name));
  } catch {
    rows = [];
  }

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-8 sm:py-12">
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-fg">
          Services
        </h1>
        <p className="mt-1 text-fg-muted">
          Manage the service catalogue and pricing.
        </p>
      </header>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {rows.length === 0 ? (
            <div className="rounded-2xl glass p-12 text-center">
              <div className="text-fg font-medium">No services yet.</div>
              <div className="text-fg-muted text-sm mt-1">
                Create one using the form on the right.
              </div>
            </div>
          ) : (
            rows.map((s) => (
              <Card key={s.id}>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge tone={s.active ? "emerald" : "zinc"}>
                        {s.active ? "active" : "draft"}
                      </Badge>
                      <span className="text-xs uppercase tracking-wider text-fg-muted">
                        {s.category}
                      </span>
                      {s.featured ? (
                        <Badge tone="amber">featured</Badge>
                      ) : null}
                    </div>
                    <CardTitle className="text-base">{s.name}</CardTitle>
                    <CardDescription>{s.shortDescription}</CardDescription>
                    <div className="mt-2 text-sm text-fg-dim">
                      {s.pricingModel === "fixed"
                        ? <>{formatZAR(s.basePriceZar)} fixed</>
                        : s.pricingModel === "per_hectare"
                          ? <>{formatZAR(s.perHectarePriceZar)} per hectare</>
                          : s.pricingModel === "hybrid"
                            ? <>{formatZAR(s.basePriceZar)} + {formatZAR(s.perHectarePriceZar)} per ha</>
                            : <>Custom quote</>}
                    </div>
                  </div>
                </div>
                <details className="mt-2 border-t border-leaf-700/10 pt-3">
                  <summary className="cursor-pointer text-xs text-leaf-700 hover:underline">
                    Edit details
                  </summary>
                  <div className="mt-3">
                    <ServiceForm initial={s} />
                  </div>
                </details>
              </Card>
            ))
          )}
        </div>

        <aside>
          <Card>
            <CardTitle className="text-base">New service</CardTitle>
            <ServiceForm />
          </Card>
        </aside>
      </div>
    </div>
  );
}