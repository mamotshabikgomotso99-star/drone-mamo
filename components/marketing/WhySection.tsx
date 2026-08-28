"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Award, Plane, Users, Sprout, MapPin, ShieldCheck } from "lucide-react";

const STATS = [
  { label: "Hectares covered", value: "12,400+", icon: Sprout },
  { label: "Active fleet", value: "4 drones", icon: Plane },
  { label: "Provinces served", value: "9", icon: MapPin },
  { label: "Mission-ready pilots", value: "8", icon: Users },
];

const PILLARS = [
  {
    title: "Built for South African farms",
    description:
      "From vineyards in the Cape to maize fields in the Free State — our drone operations are configured for the realities of local terrain, climate, and crops.",
    icon: MapPin,
  },
  {
    title: "Operator-led, data-backed",
    description:
      "Every flight is flown by a certified pilot. Every output is reviewed by an analyst. You get decision-ready insights — not just pretty pictures.",
    icon: ShieldCheck,
  },
  {
    title: "Designed for outcomes",
    description:
      "We measure success in fewer chemical litres, faster scouting, and measurable yield gains — not in the number of pretty maps we deliver.",
    icon: Award,
  },
];

export function WhySection() {
  return (
    <section className="relative py-24 sm:py-32 bg-ash-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-leaf-700 font-medium">
              <span className="h-px w-8 bg-leaf-400/60" />
              Why KM Drone Services
            </span>
            <h2 className="mt-4 text-4xl sm:text-5xl font-semibold tracking-tight text-fg text-balance">
              Smarter farming, <br />
              measured in hectares — not buzzwords.
            </h2>
            <p className="mt-5 text-lg text-fg-dim max-w-xl">
              We&apos;re not a fly-by-night operator. KM Drone Services was
              founded to give South African farmers a real alternative to
              manual, expensive, and inconsistent aerial work.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-4">
              {STATS.map((s) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.label}
                    className="rounded-2xl glass p-5 hover:bg-ash-50 transition-colors"
                  >
                    <Icon className="h-5 w-5 text-leaf-700 mb-3" />
                    <div className="text-2xl font-semibold text-fg">{s.value}</div>
                    <div className="text-xs text-fg-muted mt-1">{s.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-5">
            {PILLARS.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="rounded-2xl glass p-7 hover:bg-ash-50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-11 w-11 rounded-xl bg-leaf-50 border border-leaf-500/40 flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5 text-leaf-700" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-fg">
                        {p.title}
                      </h3>
                      <p className="mt-2 text-sm text-fg-dim leading-relaxed">
                        {p.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}