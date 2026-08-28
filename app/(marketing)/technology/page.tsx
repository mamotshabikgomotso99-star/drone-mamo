import { TechnologySection } from "@/components/marketing/TechnologySection";
import { Cpu, Layers, Wifi, Radio, Camera, BarChart3 } from "lucide-react";
import { BookingCTA } from "@/components/marketing/BookingCTA";

export const metadata = {
  title: "Technology",
  description:
    "Inside the KM Drone Services technology stack — flight hardware, sensors, software, and data workflows.",
};

export default function TechnologyPage() {
  return (
    <>
      <section className="pt-24 pb-12 sm:pt-32 sm:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-leaf-700 font-medium">
            <span className="h-px w-8 bg-leaf-400/60" />
            Technology
          </span>
          <h1 className="mt-4 text-5xl sm:text-6xl font-semibold tracking-tight text-fg max-w-3xl text-balance">
            Built on real, modern drone tech.
          </h1>
          <p className="mt-5 text-lg text-fg-dim max-w-2xl">
            We use professional-grade agricultural drones, RTK positioning,
            and proven imagery processing pipelines — and we&apos;re careful to
            not over-claim what the data tells us.
          </p>
        </div>
      </section>

      <TechnologySection />

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-3 gap-5">
          {[
            {
              icon: Radio,
              title: "RTK positioning",
              body: "Real-time kinematic corrections bring positioning accuracy down to a few centimetres.",
            },
            {
              icon: Camera,
              title: "Multispectral + RGB",
              body: "Visible, near-infrared and red-edge sensors capture vegetation-health signals invisible to the eye.",
            },
            {
              icon: Layers,
              title: "Orthomosaic processing",
              body: "Hundreds of overlapping images are stitched into a single, geo-referenced mosaic suitable for analysis.",
            },
            {
              icon: BarChart3,
              title: "Vegetation indices",
              body: "NDVI, NDRE and similar indices surface plant-health variation across fields.",
            },
            {
              icon: Wifi,
              title: "Live mission telemetry",
              body: "Pilots monitor battery, altitude, wind and payload in real time.",
            },
            {
              icon: Cpu,
              title: "On-board & cloud processing",
              body: "Edge compute for fast in-field checks, plus cloud pipelines for full deliverables.",
            },
          ].map((t) => {
            const Icon = t.icon;
            return (
              <div key={t.title} className="rounded-2xl glass p-6">
                <Icon className="h-6 w-6 text-leaf-700 mb-3" />
                <h3 className="text-base font-semibold text-fg">{t.title}</h3>
                <p className="mt-2 text-sm text-fg-dim leading-relaxed">{t.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      <BookingCTA />
    </>
  );
}