"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  ClipboardList,
  Map as MapIcon,
  Plane,
  CheckCircle2,
} from "lucide-react";

const STEPS = [
  {
    n: "01",
    title: "Tell us about your farm",
    body: "Pick a service, share the basics of your farm and what you want to achieve.",
    icon: ClipboardList,
  },
  {
    n: "02",
    title: "Pin your location",
    body: "Drop a pin on the map or draw your farm boundary — we calculate the area automatically.",
    icon: MapIcon,
  },
  {
    n: "03",
    title: "We fly the mission",
    body: "Our pilots deploy the right drone, fly the planned pattern, and capture the data.",
    icon: Plane,
  },
  {
    n: "04",
    title: "Receive the deliverables",
    body: "High-res maps, vegetation-health layers, spray reports, or media — ready to use.",
    icon: CheckCircle2,
  },
];

export function HowItWorks() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-16">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-leaf-700 font-medium">
            <span className="h-px w-8 bg-leaf-400/60" />
            How it works
          </span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-semibold tracking-tight text-fg text-balance">
            From enquiry to deliverables in days, not weeks.
          </h2>
        </div>

        <div className="relative grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Connecting line on lg */}
          <div
            className="hidden lg:block absolute top-[60px] left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-leaf-500/30 to-transparent"
            aria-hidden
          />

          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                className="relative rounded-2xl glass p-7 group hover:bg-ash-50 transition-colors"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="text-xs font-mono text-leaf-700">{s.n}</div>
                  <div className="h-10 w-10 rounded-xl bg-leaf-50 border border-leaf-500/40 flex items-center justify-center group-hover:bg-leaf-50 transition-colors">
                    <Icon className="h-5 w-5 text-leaf-700" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-fg">{s.title}</h3>
                <p className="mt-2 text-sm text-fg-dim leading-relaxed">
                  {s.body}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}