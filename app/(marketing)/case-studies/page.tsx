import { CaseStudies } from "@/components/marketing/CaseStudies";
import { BookingCTA } from "@/components/marketing/BookingCTA";

export const metadata = {
  title: "Case studies",
  description:
    "Sample case studies showing how KM Drone Services has been used across South African farms.",
};

export default function CaseStudiesPage() {
  return (
    <>
      <section className="pt-24 pb-12 sm:pt-32 sm:pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-leaf-700 font-medium">
            <span className="h-px w-8 bg-leaf-400/60" />
            Case studies
          </span>
          <h1 className="mt-4 text-5xl sm:text-6xl font-semibold tracking-tight text-fg max-w-3xl text-balance">
            How farms have used KM Drone Services.
          </h1>
          <p className="mt-5 text-lg text-fg-dim max-w-2xl">
            The case studies below are illustrative samples. We&apos;ll replace
            them with verified data as real engagements complete.
          </p>
        </div>
      </section>

      <CaseStudies />
      <BookingCTA />
    </>
  );
}