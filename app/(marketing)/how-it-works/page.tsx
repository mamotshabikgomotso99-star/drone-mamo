import { HowItWorks } from "@/components/marketing/HowItWorks";
import { BookingCTA } from "@/components/marketing/BookingCTA";
import { Plane, Map, FileCheck, Sparkles } from "lucide-react";

export const metadata = {
  title: "How it works",
  description:
    "From first enquiry to final deliverables — here's how a typical KM Drone Services job is planned, flown, and reported.",
};

export default function HowItWorksPage() {
  return (
    <>
      <section className="pt-24 pb-12 sm:pt-32 sm:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-leaf-700 font-medium">
            <span className="h-px w-8 bg-leaf-400/60" />
            How it works
          </span>
          <h1 className="mt-4 text-5xl sm:text-6xl font-semibold tracking-tight text-fg max-w-3xl text-balance">
            A simple, transparent process.
          </h1>
          <p className="mt-5 text-lg text-fg-dim max-w-2xl">
            We designed our booking flow to remove friction and ambiguity. You
            always know what&apos;s happening, when, and what it costs.
          </p>
        </div>
      </section>

      <HowItWorks />

      <section className="py-20 bg-ash-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: Plane,
                title: "Pre-flight checks",
                body: "Every mission starts with weather, NOTAM and terrain checks. Safety is non-negotiable.",
              },
              {
                icon: Map,
                title: "Mission planning",
                body: "We define waypoints, overlap, altitude, and sensor payload to suit your crop and brief.",
              },
              {
                icon: FileCheck,
                title: "Post-flight QA",
                body: "Imagery is reviewed, processed, and checked before any deliverable is sent to you.",
              },
              {
                icon: Sparkles,
                title: "Insights you can act on",
                body: "You receive annotated outputs and clear next-step recommendations — not just data dumps.",
              },
            ].map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.title} className="rounded-2xl glass p-7">
                  <Icon className="h-6 w-6 text-leaf-700 mb-4" />
                  <h3 className="text-lg font-semibold text-fg">{b.title}</h3>
                  <p className="mt-2 text-sm text-fg-dim leading-relaxed">{b.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <BookingCTA />
    </>
  );
}