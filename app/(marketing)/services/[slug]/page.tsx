import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { services } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Map as MapIcon, Leaf, Briefcase } from "lucide-react";
import { formatZAR } from "@/lib/utils";
import type { Metadata } from "next";

export const revalidate = 600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const row = await db.query.services.findFirst({ where: eq(services.slug, slug) });
  if (!row) return { title: "Service" };
  return {
    title: row.name,
    description: row.shortDescription,
    openGraph: { title: row.name, description: row.shortDescription, images: row.imageUrl ? [row.imageUrl] : [] },
  };
}

export async function generateStaticParams() {
  try {
    const rows = await db.query.services.findMany({ where: (s, { eq: _eq }) => _eq(s.active, true) });
    return rows.map((r) => ({ slug: r.slug }));
  } catch {
    return [];
  }
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const service = await db.query.services.findFirst({
    where: and(eq(services.slug, slug), eq(services.active, true)),
    with: { pricingRules: true },
  });

  if (!service) notFound();

  const benefits = (service.benefits ?? []) as string[];
  const useCases = (service.useCases ?? []) as string[];
  const suitableCustomers = (service.suitableCustomers ?? []) as string[];

  return (
    <>
      <section className="pt-24 pb-12 sm:pt-32 sm:pb-20 relative">
        <div
          className="absolute inset-0 -z-10 opacity-25"
          style={{
            backgroundImage:
              "radial-gradient(circle at 80% 0%, rgba(52, 210, 115, 0.25), transparent 50%)",
          }}
        />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/services"
            className="text-xs text-fg-muted hover:text-fg inline-flex items-center gap-2 mb-8"
          >
            ← All services
          </Link>
          <div className="grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-leaf-700 font-medium">
                <Leaf className="h-3.5 w-3.5" />
                {service.category.replace("_", " ")}
              </span>
              <h1 className="mt-4 text-4xl sm:text-6xl font-semibold tracking-tight text-fg text-balance">
                {service.name}
              </h1>
              <p className="mt-5 text-lg text-fg-dim max-w-2xl leading-relaxed">
                {service.shortDescription}
              </p>
              <div className="mt-7 prose prose-invert max-w-2xl text-fg-dim leading-relaxed">
                <p>{service.description}</p>
              </div>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button href={`/book?service=${service.slug}`} size="lg">
                  Book this service <ArrowRight className="h-4 w-4" />
                </Button>
                <Button href="/contact" size="lg" variant="secondary">
                  Talk to an advisor
                </Button>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-2xl glass p-6">
                <div className="text-xs text-leaf-700 font-medium mb-2 uppercase tracking-wider">
                  Pricing model
                </div>
                <div className="text-lg font-semibold text-fg">
                  {service.pricingModel === "fixed"
                    ? "Fixed per booking"
                    : service.pricingModel === "per_hectare"
                      ? "Per hectare + base"
                      : service.pricingModel === "hybrid"
                        ? "Base + per-hectare"
                        : "Custom quote"}
                </div>
                <div className="mt-4 space-y-2 text-sm">
                  <Row label="Base fee" value={formatZAR(service.basePriceZar)} />
                  <Row label="Per hectare" value={formatZAR(service.perHectarePriceZar)} />
                  <Row label="Min. hectares" value={`${service.minimumHectares} ha`} />
                  <Row label="Max per day" value={`${service.maxHectaresPerDay} ha`} />
                </div>
                <div className="mt-5 text-xs text-fg-muted">
                  Final pricing confirmed after we review your farm.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {benefits.length ? (
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-semibold tracking-tight text-fg">
              What you get
            </h2>
            <ul className="mt-6 grid sm:grid-cols-2 gap-3">
              {benefits.map((b) => (
                <li key={b} className="flex gap-3 rounded-2xl glass p-5">
                  <Check className="h-5 w-5 text-leaf-700 shrink-0 mt-0.5" />
                  <span className="text-sm text-fg-dim">{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {useCases.length ? (
        <section className="py-16 bg-ash-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-leaf-700 font-medium">
                <MapIcon className="h-3.5 w-3.5" /> Typical use cases
              </div>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-fg">
                Where this service shines
              </h2>
              <ul className="mt-6 space-y-3">
                {useCases.map((u) => (
                  <li key={u} className="flex gap-3 text-fg-dim">
                    <span className="text-leaf-700 mt-1">▸</span>
                    <span>{u}</span>
                  </li>
                ))}
              </ul>
            </div>
            {suitableCustomers.length ? (
              <div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-leaf-700 font-medium">
                  <Briefcase className="h-3.5 w-3.5" /> Who it&apos;s for
                </div>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-fg">
                  Ideal for
                </h2>
                <ul className="mt-6 space-y-3">
                  {suitableCustomers.map((c) => (
                    <li key={c} className="flex gap-3 text-fg-dim">
                      <span className="text-leaf-700 mt-1">▸</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      <HowItWorks />
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-fg-muted">{label}</span>
      <span className="text-fg font-medium">{value}</span>
    </div>
  );
}