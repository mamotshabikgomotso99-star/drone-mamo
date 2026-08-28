import { Hero } from "@/components/marketing/Hero";
import { ServicesGrid } from "@/components/marketing/ServicesGrid";
import { WhySection } from "@/components/marketing/WhySection";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { TechnologySection } from "@/components/marketing/TechnologySection";
import { ImpactStats } from "@/components/marketing/ImpactStats";
import { CaseStudies } from "@/components/marketing/CaseStudies";
import { PricingPreview } from "@/components/marketing/PricingPreview";
import { BookingCTA } from "@/components/marketing/BookingCTA";
import { FAQ } from "@/components/marketing/FAQ";
import { db } from "@/lib/db";
import { services } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export const revalidate = 600;

export default async function HomePage() {
  const services = await fetchServices();
  return (
    <>
      <Hero />
      <ServicesGrid services={services} />
      <WhySection />
      <TechnologySection />
      <HowItWorks />
      <ImpactStats />
      <CaseStudies />
      <PricingPreview />
      <FAQ />
      <BookingCTA />
    </>
  );
}

async function fetchServices() {
  try {
    const rows = await db
      .select()
      .from(services)
      .where(eq(services.active, true))
      .orderBy(desc(services.featured));
    return rows.map((s) => ({
      id: s.id,
      slug: s.slug,
      name: s.name,
      shortDescription: s.shortDescription,
      benefits: (s.benefits ?? []) as string[],
      iconKey: s.iconKey,
      featured: s.featured,
    }));
  } catch {
    return [];
  }
}
