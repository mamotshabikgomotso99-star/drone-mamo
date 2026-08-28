"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const TIERS = [
  {
    name: "Spray & application",
    tagline: "Per-hectare pricing for crop spraying and fertilizer application.",
    model: "Per hectare + base fee",
    rows: [
      { label: "Base setup fee", value: "from R850" },
      { label: "Crop spraying", value: "from R320 / ha" },
      { label: "Fertilizer application", value: "from R280 / ha" },
      { label: "Pesticide application", value: "from R350 / ha" },
    ],
    cta: "Book a spraying job",
    href: "/book?service=crop-spraying",
    note: "Final pricing depends on crop, terrain, and product.",
  },
  {
    name: "Monitoring & mapping",
    tagline: "Imaging and mapping services for the full growing season.",
    model: "Per hectare or fixed",
    rows: [
      { label: "Crop monitoring (per visit)", value: "from R2 400 fixed" },
      { label: "Crop health analysis", value: "from R120 / ha" },
      { label: "Agricultural mapping", value: "from R85 / ha" },
      { label: "Irrigation monitoring", value: "from R110 / ha" },
    ],
    cta: "Book a mapping job",
    href: "/book?service=agricultural-mapping",
    note: "Best value when bundled into a season-long monitoring plan.",
    highlight: true,
  },
  {
    name: "Custom & media",
    tagline: "Surveying, media, and bespoke projects priced per brief.",
    model: "Project-based",
    rows: [
      { label: "Farm surveying", value: "from R3 500" },
      { label: "Agricultural photography & video", value: "from R4 500" },
      { label: "Livestock monitoring", value: "from R1 900 fixed" },
      { label: "Distance surcharge (>100km)", value: "R8 / km" },
    ],
    cta: "Request a custom quote",
    href: "/contact",
    note: "Tell us the brief — we&apos;ll come back with a tailored quote.",
  },
];

export function PricingPreview() {
  return (
    <section id="pricing-preview" className="relative py-24 sm:py-32 bg-ash-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-16">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-leaf-700 font-medium">
            <span className="h-px w-8 bg-leaf-400/60" />
            Pricing
          </span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-semibold tracking-tight text-fg text-balance">
            Transparent pricing. Honest estimates.
          </h2>
          <p className="mt-5 text-lg text-fg-dim max-w-2xl">
            Indicative pricing — final figures are confirmed after we review
            your farm. Use the booking page for an instant estimate.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {TIERS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={
                "relative rounded-2xl p-7 sm:p-8 transition-colors " +
                (t.highlight
                  ? "glass-strong ring-1 ring-leaf-500/30 glow-leaf"
                  : "glass hover:bg-ash-50")
              }
            >
              {t.highlight ? (
                <span className="absolute -top-3 left-7 text-[10px] uppercase tracking-widest text-ink bg-leaf-400 rounded-full px-2 py-0.5 font-semibold">
                  Most popular
                </span>
              ) : null}
              <div className="text-sm text-leaf-700 font-medium mb-2">{t.model}</div>
              <h3 className="text-2xl font-semibold text-fg">{t.name}</h3>
              <p className="mt-2 text-sm text-fg-dim">{t.tagline}</p>

              <ul className="mt-6 space-y-3">
                {t.rows.map((r) => (
                  <li key={r.label} className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-fg-dim">{r.label}</span>
                    <span className="text-fg font-medium">{r.value}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-7">
                <Button href={t.href} className="w-full" variant={t.highlight ? "primary" : "secondary"}>
                  {t.cta}
                </Button>
                <p
                  className="mt-3 text-xs text-fg-muted"
                  dangerouslySetInnerHTML={{ __html: t.note }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}