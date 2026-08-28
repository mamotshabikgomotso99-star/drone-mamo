import { PricingPreview } from "@/components/marketing/PricingPreview";
import { FAQ } from "@/components/marketing/FAQ";
import { BookingCTA } from "@/components/marketing/BookingCTA";
import { formatZAR } from "@/lib/utils";

export const metadata = {
  title: "Pricing",
  description:
    "Transparent pricing for KM Drone Services. Per-hectare, fixed and custom pricing models, all in ZAR.",
};

export default function PricingPage() {
  return (
    <>
      <section className="pt-24 pb-12 sm:pt-32 sm:pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-leaf-700 font-medium">
            <span className="h-px w-8 bg-leaf-400/60" />
            Pricing
          </span>
          <h1 className="mt-4 text-5xl sm:text-6xl font-semibold tracking-tight text-fg max-w-3xl text-balance">
            Honest, transparent pricing — in ZAR.
          </h1>
          <p className="mt-5 text-lg text-fg-dim max-w-2xl">
            Indicative pricing below; the booking page gives an instant
            estimate based on your farm size and service. Final pricing is
            confirmed after we review your brief.
          </p>
        </div>
      </section>

      <PricingPreview />

      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-semibold tracking-tight text-fg">
            Pricing notes
          </h2>
          <ul className="mt-6 space-y-3 text-fg-dim leading-relaxed">
            <li>
              <strong className="text-fg">Base fee.</strong> Covers setup,
              pilot travel up to 100 km from operations base, and standard
              safety equipment.
            </li>
            <li>
              <strong className="text-fg">Per-hectare fee.</strong>{" "}
              Applied to the net area flown.
            </li>
            <li>
              <strong className="text-fg">Distance surcharge.</strong>{" "}
              R8/km travelled beyond 100 km from our base.
            </li>
            <li>
              <strong className="text-fg">Urgent surcharge.</strong>{" "}
              Applies for 48-hour turnaround.
            </li>
            <li>
              <strong className="text-fg">Custom.</strong> For complex
              projects, we&apos;ll quote after scope.
            </li>
          </ul>
          <p className="mt-6 text-xs text-fg-muted">
            All pricing is in South African Rand (ZAR, R) and excludes VAT.
            Final invoices may vary based on actual area flown and conditions
            on the day.
          </p>
        </div>
      </section>

      <FAQ />
      <BookingCTA />
    </>
  );
}