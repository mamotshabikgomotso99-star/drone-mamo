import { FAQ } from "@/components/marketing/FAQ";
import { BookingCTA } from "@/components/marketing/BookingCTA";

export const metadata = {
  title: "Frequently asked questions",
  description:
    "Common questions about KM Drone Services — drone spraying, pricing, booking, weather, service areas, and more.",
};

export default function FaqPage() {
  return (
    <>
      <section className="pt-24 pb-12 sm:pt-32 sm:pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-leaf-700 font-medium">
            <span className="h-px w-8 bg-leaf-400/60" />
            FAQ
          </span>
          <h1 className="mt-4 text-5xl sm:text-6xl font-semibold tracking-tight text-fg max-w-3xl text-balance">
            Questions we hear most often.
          </h1>
          <p className="mt-5 text-lg text-fg-dim max-w-2xl">
            If you don&apos;t see your question here, just reach out — we read
            every message.
          </p>
        </div>
      </section>
      <FAQ />
      <BookingCTA />
    </>
  );
}