import { db } from "@/lib/db";
import { services } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { BookingFlow } from "@/components/booking/BookingFlow";
import { requireUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Book a drone service",
  description: "Book a drone service in minutes — pick your service, draw your farm, and get an instant estimate.",
};

interface PageProps {
  searchParams: Promise<{ service?: string }>;
}

export default async function BookPage({ searchParams }: PageProps) {
  const user = await requireUser().catch(() => null);
  if (!user) redirect("/login?from=/book");

  const { service: serviceSlug } = await searchParams;

  let rows: any[] = [];
  try {
    rows = await db
      .select()
      .from(services)
      .where(eq(services.active, true))
      .orderBy(desc(services.featured));
  } catch {
    rows = [];
  }

  const servicesForForm = rows.map((s) => ({
    id: s.id,
    slug: s.slug,
    name: s.name,
    shortDescription: s.shortDescription,
    pricingModel: s.pricingModel,
    basePriceZar: s.basePriceZar,
    perHectarePriceZar: s.perHectarePriceZar,
    minimumHectares: s.minimumHectares,
    maxHectaresPerDay: s.maxHectaresPerDay,
    pricingRules: ((s as any).pricingRules ?? []) as Array<{
      kind: string;
      amountZar: string | null;
      percent: string | null;
      active: boolean;
    }>,
  }));

  return (
    <section className="pt-20 pb-24 sm:pt-28 sm:pb-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-leaf-400 font-medium">
            <span className="h-px w-8 bg-leaf-400/60" />
            Book a service
          </span>
          <h1 className="mt-4 text-4xl sm:text-6xl font-semibold tracking-tight text-white text-balance">
            Book a drone service in minutes.
          </h1>
          <p className="mt-5 text-lg text-fg-dim">
            Pick a service, share your farm details, and we&apos;ll send you
            back an instant estimate. We confirm the final price after a brief
            review.
          </p>
        </div>

        <BookingFlow services={servicesForForm} initialServiceSlug={serviceSlug} user={user} />
      </div>
    </section>
  );
}
