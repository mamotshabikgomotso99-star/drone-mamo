import { db } from "@/lib/db";
import { services } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { ServicesGrid } from "@/components/marketing/ServicesGrid";
import { BookingCTA } from "@/components/marketing/BookingCTA";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agricultural drone services",
  description:
    "Browse the full range of KM Drone Services — crop spraying, fertilizer application, mapping, crop monitoring, livestock monitoring, and agricultural media.",
};

export const revalidate = 600;

export default async function ServicesPage() {
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
  const items = rows.map((s) => ({
    id: s.id,
    slug: s.slug,
    name: s.name,
    shortDescription: s.shortDescription,
    benefits: (s.benefits ?? []) as string[],
    iconKey: s.iconKey,
    featured: s.featured,
  }));

  return (
    <>
      <section className="pt-24 pb-12 sm:pt-32 sm:pb-16 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-leaf-700 font-medium">
            <span className="h-px w-8 bg-leaf-400/60" />
            Services
          </span>
          <h1 className="mt-4 text-5xl sm:text-6xl font-semibold tracking-tight text-fg max-w-3xl text-balance">
            The full KM Drone Services menu.
          </h1>
          <p className="mt-5 text-lg text-fg-dim max-w-2xl">
            Whether you need a single spray run or a season-long monitoring
            programme, we have a service to match. Pick the right one and we&apos;ll
            guide you through booking.
          </p>
        </div>
      </section>
      <ServicesGrid services={items} heading="All services" subheading="" />
      <BookingCTA />
    </>
  );
}