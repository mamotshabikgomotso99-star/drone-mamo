import { db } from "@/lib/db";
import { teamMembers } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Wrench, Plus } from "lucide-react";
import { TeamForm } from "./TeamForm";

export const metadata = { title: "Team · Admin" };

export default async function AdminTeamPage() {
  let rows: any[] = [];
  try {
    rows = await db.select().from(teamMembers).orderBy(asc(teamMembers.name));
  } catch {
    rows = [];
  }

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-8 sm:py-12">
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-fg">
          Operations team
        </h1>
        <p className="mt-1 text-fg-muted">
          Pilots, agronomists, and field technicians.
        </p>
      </header>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {rows.length === 0 ? (
            <div className="rounded-2xl glass p-12 text-center">
              <div className="text-fg font-medium">No team members registered.</div>
            </div>
          ) : (
            rows.map((m) => (
              <Card key={m.id}>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-leaf-400 to-leaf-600 flex items-center justify-center text-ink font-semibold shrink-0">
                    {m.name?.[0]?.toUpperCase() ?? "?"}
                  </div>
                  <div className="min-w-0">
                    <CardTitle className="text-base">{m.name}</CardTitle>
                    <CardDescription>{m.role}</CardDescription>
                    {m.bio ? (
                      <div className="text-sm text-fg-dim mt-2">{m.bio}</div>
                    ) : null}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        <aside>
          <Card>
            <CardTitle className="text-base flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add team member
            </CardTitle>
            <TeamForm />
          </Card>
        </aside>
      </div>
    </div>
  );
}