import { Button } from "@/components/ui/button";
import { Sprout, Target, Eye, Sparkles } from "lucide-react";

export default function AboutPage() {
  return (
    <>
      <section className="pt-24 pb-16 sm:pt-32 sm:pb-24 relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 70% 30%, rgba(52, 210, 115, 0.25), transparent 50%)",
          }}
        />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-leaf-700 font-medium">
            <span className="h-px w-8 bg-leaf-400/60" />
            About KM Drone Services
          </span>
          <h1 className="mt-4 text-5xl sm:text-6xl font-semibold tracking-tight text-fg max-w-3xl text-balance">
            Built by pilots. <br />
            Backed by data. <br />
            Built for South African farms.
          </h1>
          <p className="mt-6 text-lg text-fg-dim max-w-2xl">
            We started KM Drone Services because we saw South African farmers
            losing too much to inefficiency: wasted chemicals, missed problem
            zones, late interventions. Today we operate a focused fleet across
            the country, helping farmers spray smarter, monitor faster, and
            protect yield.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-3 gap-6">
          {[
            {
              icon: Sprout,
              title: "Mission",
              body: "To give every South African farmer access to precision aerial work that reduces inputs, lifts yields, and protects the land.",
            },
            {
              icon: Target,
              title: "Vision",
              body: "A future where every farm — no matter its size — can call on aerial intelligence and precision application as easily as they call on a tractor.",
            },
            {
              icon: Sparkles,
              title: "Values",
              body: "Operator-led. Data-backed. Farmer-first. We tell you what we know, what we don't, and exactly what we'll do on your farm.",
            },
          ].map((b) => {
            const Icon = b.icon;
            return (
              <div key={b.title} className="rounded-2xl glass p-7">
                <div className="h-11 w-11 rounded-xl bg-leaf-50 border border-leaf-500/40 flex items-center justify-center mb-5">
                  <Icon className="h-5 w-5 text-leaf-700" />
                </div>
                <h3 className="text-xl font-semibold text-fg">{b.title}</h3>
                <p className="mt-3 text-sm text-fg-dim leading-relaxed">{b.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="py-20 bg-ash-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-semibold tracking-tight text-fg text-balance">
            Why drone technology for agriculture?
          </h2>
          <div className="mt-6 space-y-5 text-fg-dim leading-relaxed">
            <p>
              Agriculture is one of the most physically demanding jobs on the
              planet, and one of the most exposed to weather, pests, and
              market volatility. Drones put a high-precision aerial platform
              into the hands of farmers — without the cost of owning one, the
              training to fly one, or the regulatory burden of operating one.
            </p>
            <p>
              For spraying, drones apply product with droplet precision,
              following the terrain and avoiding soil compaction. For
              monitoring, they capture hundreds of hectares of imagery in a
              single flight. For mapping, they produce geo-rectified
              orthomosaics ready for farm-management platforms.
            </p>
            <p>
              Our role is to be the operator, the analyst, and the partner —
              translating aerial data into action on your farm.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-semibold tracking-tight text-fg">
            Our team
          </h2>
          <p className="mt-3 text-fg-dim">
            Pilots, agronomists, and operations specialists. We&apos;re a small,
            focused team — and we work with a vetted network of freelance
            pilots across South Africa.
          </p>
          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            {[
              { name: "Karabo M.", role: "Founder & Chief Pilot" },
              { name: "Lerato N.", role: "Operations Manager" },
              { name: "Sipho D.", role: "Senior Drone Pilot" },
              { name: "Naledi v.W.", role: "Agriscience Analyst" },
            ].map((m) => (
              <div key={m.name} className="rounded-2xl glass p-5 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-leaf-400 to-leaf-600 flex items-center justify-center text-ink font-semibold">
                  {m.name[0]}
                </div>
                <div>
                  <div className="text-fg font-medium">{m.name}</div>
                  <div className="text-xs text-fg-muted">{m.role}</div>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-fg-muted">
            Placeholder team information. Replace with verified staff details
            when available.
          </p>
        </div>
      </section>
    </>
  );
}