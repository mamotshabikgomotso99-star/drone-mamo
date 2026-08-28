import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { requireAdmin } from "@/lib/auth";
import { SettingsForm } from "./SettingsForm";

export const metadata = { title: "Settings · Admin" };

export default async function AdminSettingsPage() {
  const admin = await requireAdmin();
  let me: any = null;
  try {
    me = await db.query.users.findFirst({ where: eq(users.id, admin.id) });
  } catch {}

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-8 sm:py-12">
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-fg">
          Settings
        </h1>
        <p className="mt-1 text-fg-muted">
          Update your administrator profile and platform preferences.
        </p>
      </header>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardTitle className="text-base">Profile</CardTitle>
            <CardDescription>How your name appears across the platform.</CardDescription>
            <SettingsForm
              initial={{
                name: me?.name ?? admin.name ?? "",
                email: me?.email ?? admin.email ?? "",
                phone: me?.phone ?? "",
              }}
            />
          </Card>
        </div>

        <aside>
          <Card>
            <CardTitle className="text-base">Compliance</CardTitle>
            <CardDescription className="mt-2">
              KM Drone Services operates within the South African Civil Aviation Authority (SACAA)
              regulatory framework. All commercial drone operations must comply with Part 101 of
              the Civil Aviation Regulations and any additional SACAA RPAS operator requirements.
            </CardDescription>
            <p className="text-xs text-fg-muted mt-4">
              Final operating certificates, pilot licences, and chemical applicator registrations
              must be held by the operating entity prior to revenue flights. Display this notice
              on customer-facing materials until then.
            </p>
          </Card>
        </aside>
      </div>
    </div>
  );
}