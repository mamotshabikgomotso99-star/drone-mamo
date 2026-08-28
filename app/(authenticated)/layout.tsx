import { requireUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";

export default async function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  // Layout-level protection — pages can still opt in to stricter requirements
  const user = await requireUser().catch(() => null);
  if (!user) redirect("/login");
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
