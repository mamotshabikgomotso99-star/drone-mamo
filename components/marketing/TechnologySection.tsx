"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Wifi, Cpu, Camera, Radio, Layers, BarChart3 } from "lucide-react";

const TECH = [
  {
    title: "GPS-guided flight paths",
    description:
      "RTK-corrected waypoint navigation ensures every pass is flown precisely, with overlap tuned to your service.",
    icon: Radio,
  },
  {
    title: "Multispectral imaging",
    description:
      "Visible + NIR sensors surface vegetation-health patterns that aren&apos;t visible to the eye.",
    icon: Camera,
  },
  {
    title: "Onboard compute",
    description:
      "Edge processing means you get insights faster — sometimes in-flight.",
    icon: Cpu,
  },
  {
    title: "Live telemetry",
    description:
      "Pilots monitor battery, payload, and wind in real time for safer operations.",
    icon: Wifi,
  },
  {
    title: "Geo-rectified outputs",
    description:
      "Every deliverable is geo-referenced and ready for your farm-management platform.",
    icon: Layers,
  },
  {
    title: "Decision-ready reports",
    description:
      "Outputs include annotated reports — not just data dumps.",
    icon: BarChart3,
  },
];

export function TechnologySection() {
  return (
    <section className="relative py-24 sm:py-32 bg-ash-50">
      <div className="absolute inset-0 dot-bg opacity-20" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-leaf-700 font-medium">
              <span className="h-px w-8 bg-leaf-400/60" />
              Technology
            </span>
            <h2 className="mt-4 text-4xl sm:text-5xl font-semibold tracking-tight text-fg text-balance">
              The kit behind the work.
            </h2>
            <p className="mt-5 text-lg text-fg-dim max-w-md">
              Modern drones are the easy part. The hard part is the integration:
              sensors, software, pilots, and analysis — all working together
              for one outcome: a better farm.
            </p>
            <div className="mt-8 h-72 rounded-2xl glass overflow-hidden relative">
              <DroneTechDiagram />
            </div>
          </div>

          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
            {TECH.map((t, i) => {
              const Icon = t.icon;
              return (
                <motion.div
                  key={t.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="rounded-2xl glass p-6 hover:bg-ash-50 transition-colors"
                >
                  <div className="h-10 w-10 rounded-xl bg-leaf-50 border border-leaf-500/40 flex items-center justify-center mb-4">
                    <Icon className="h-5 w-5 text-leaf-700" />
                  </div>
                  <h3 className="text-base font-semibold text-fg">{t.title}</h3>
                  <p className="mt-2 text-sm text-fg-dim leading-relaxed">
                    {t.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function DroneTechDiagram() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <svg viewBox="0 0 400 280" className="w-full h-full">
        <defs>
          <radialGradient id="radar-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#34d273" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#34d273" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="200" cy="140" r="120" fill="url(#radar-grad)" />
        {[40, 80, 120].map((r) => (
          <circle
            key={r}
            cx="200"
            cy="140"
            r={r}
            fill="none"
            stroke="#34d273"
            strokeOpacity={0.15 + r / 400}
            strokeWidth="1"
          />
        ))}
        <line x1="0" y1="140" x2="400" y2="140" stroke="#34d273" strokeOpacity="0.2" />
        <line x1="200" y1="0" x2="200" y2="280" stroke="#34d273" strokeOpacity="0.2" />
        <g transform="translate(200,140)">
          <g stroke="#34d273" strokeWidth="1.5" strokeLinecap="round">
            <line x1="-40" y1="-40" x2="40" y2="40" />
            <line x1="40" y1="-40" x2="-40" y2="40" />
            <circle cx="-40" cy="-40" r="6" fill="#34d273" opacity="0.4" />
            <circle cx="40" cy="-40" r="6" fill="#34d273" opacity="0.4" />
            <circle cx="-40" cy="40" r="6" fill="#34d273" opacity="0.4" />
            <circle cx="40" cy="40" r="6" fill="#34d273" opacity="0.4" />
          </g>
          <rect x="-15" y="-15" width="30" height="30" rx="3" fill="#34d273" opacity="0.6" />
        </g>
      </svg>
    </div>
  );
}