import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, customerProfiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { ProfileForm } from "./ProfileForm";

export const metadata = { title: "Profile" };

export default async function ProfilePage() {
  const session = await auth();
  if (!session) return null;

  let user: any = null;
  let profile: any = null;
  try {
    [user, profile] = await Promise.all([
      db.query.users.findFirst({ where: eq(users.id, session.user.id) }),
      db.query.customerProfiles.findFirst({ where: eq(customerProfiles.userId, session.user.id) }),
    ]);
  } catch {}
  if (!user) return null;

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-8 sm:py-12 max-w-3xl">
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-fg">
          Profile
        </h1>
        <p className="mt-1 text-fg-muted">
          Update your details and farm information.
        </p>
      </header>
      <ProfileForm
        user={{
          name: user.name,
          email: user.email,
          phone: user.phone ?? "",
        }}
        profile={{
          companyName: profile?.companyName ?? "",
          province: profile?.province ?? "",
          preferredCrop: profile?.preferredCrop ?? "",
        }}
      />
    </div>
  );
}