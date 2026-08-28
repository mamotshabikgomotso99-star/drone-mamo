"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Sprout, Map, Plane, BarChart3 } from "lucide-react";

const STATS = [
  {
    label: "Average chemical reduction (spraying)",
    value: "60-90%",
    sub: "vs. traditional knapsack spraying",
    icon: Sprout,
  },
  {
    label: "Coverage per day per drone",
    value: "120 ha",
    sub: "depending on service & conditions",
    icon: Plane,
  },
  {
    label: "Mapping accuracy",
    value: "Sub-3 cm",
    sub: "RTK-corrected geo-referencing",
    icon: Map,
  },
  {
    label: "Time saved on scouting",
    value: "Up to 70%",
    sub: "vs. in-field ground scouting",
    icon: BarChart3,
  },
];

export function ImpactStats() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-16">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-leaf-700 font-medium">
            <span className="h-px w-8 bg-leaf-400/60" />
            Impact
          </span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-semibold tracking-tight text-fg text-balance">
            Numbers we&apos;d defend in front of any farmer.
          </h2>
          <p className="mt-5 text-lg text-fg-dim max-w-2xl">
            Indicative ranges from our operating experience and published
            agricultural-drone research — actual results vary with crop,
            conditions, and brief.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="rounded-2xl glass p-7 hover:bg-ash-50 transition-colors"
              >
                <Icon className="h-6 w-6 text-leaf-700 mb-4" />
                <div className="text-3xl sm:text-4xl font-semibold text-fg tracking-tight">
                  {s.value}
                </div>
                <div className="mt-2 text-sm font-medium text-fg/80">{s.label}</div>
                <div className="mt-1 text-xs text-fg-muted">{s.sub}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}