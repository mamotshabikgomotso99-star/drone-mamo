import { db } from "@/lib/db";
import { drones } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import { Badge, Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Plane, Plus } from "lucide-react";
import { DroneForm } from "./DroneForm";

export const metadata = { title: "Drone fleet · Admin" };

export default async function AdminDronesPage() {
  let rows: any[] = [];
  try {
    rows = await db.select().from(drones).orderBy(asc(drones.name));
  } catch {
    rows = [];
  }

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-8 sm:py-12">
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-fg">
          Drone fleet
        </h1>
        <p className="mt-1 text-fg-muted">
          Aerial platforms available for assignment to bookings.
        </p>
      </header>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {rows.length === 0 ? (
            <div className="rounded-2xl glass p-12 text-center">
              <div className="text-fg font-medium">No drones registered.</div>
            </div>
          ) : (
            rows.map((d) => (
              <Card key={d.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="h-8 w-8 rounded-lg bg-ash-100 border border-leaf-700/15 flex items-center justify-center text-fg-dim">
                        <Plane className="h-4 w-4" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{d.name}</CardTitle>
                        <CardDescription>{d.model}</CardDescription>
                      </div>
                    </div>
                    <div className="text-sm text-fg-dim mt-2">
                      Reg: <span className="font-mono text-fg">{d.registration ?? "—"}</span>
                      {d.capacityKg ? (
                        <span className="ml-3">Capacity: {d.capacityKg} kg</span>
                      ) : null}
                      {d.flightTimeMin ? (
                        <span className="ml-3">Flight: {d.flightTimeMin} min</span>
                      ) : null}
                    </div>
                    {d.notes ? (
                      <div className="text-xs text-fg-muted mt-2">{d.notes}</div>
                    ) : null}
                  </div>
                  <Badge tone={d.status === "available" ? "emerald" : d.status === "maintenance" ? "amber" : "zinc"}>
                    {d.status}
                  </Badge>
                </div>
              </Card>
            ))
          )}
        </div>

        <aside>
          <Card>
            <CardTitle className="text-base flex items-center gap-2">
              <Plus className="h-4 w-4" /> New drone
            </CardTitle>
            <DroneForm />
          </Card>
        </aside>
      </div>
    </div>
  );
}