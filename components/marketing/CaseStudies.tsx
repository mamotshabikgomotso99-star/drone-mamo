"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp } from "lucide-react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const CASES = [
  {
    title: "Vineyard disease pressure — Western Cape",
    service: "Crop Health Analysis + Crop Monitoring",
    challenge:
      "Powdery mildew pressure rising across 14 blocks; scouting every row impossible.",
    solution:
      "Weekly flyovers + multispectral analysis. Identified 3 problem blocks within 48 hours.",
    outcome:
      "Targeted spray saved an estimated 38% of fungicide volume and kept the harvest on plan.",
    tag: "Disease management",
  },
  {
    title: "Sugarcane fertilizer lift-off — KZN",
    service: "Fertilizer Application",
    challenge:
      "Mid-season foliar feed required across 320 ha; tractor access limited by recent rain.",
    solution:
      "Variable-rate drone application based on prescription map from prior imagery.",
    outcome:
      "Job completed in 2 flying days — no soil compaction; uniform coverage verified.",
    tag: "Yield intervention",
  },
  {
    title: "Estate media kit — Limpopo",
    service: "Agricultural Photography & Video",
    challenge:
      "Marketing team needed a premium aerial library for a 2,400 ha citrus estate.",
    solution:
      "Two-day shoot at golden hour; licensed 4K footage and edited stills.",
    outcome:
      "Deliverables used in three campaigns and the annual report.",
    tag: "Brand & marketing",
  },
];

export function CaseStudies({ items = CASES }: { items?: typeof CASES }) {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-leaf-700 font-medium">
              <span className="h-px w-8 bg-leaf-400/60" />
              Case studies
            </span>
            <h2 className="mt-4 text-4xl sm:text-5xl font-semibold tracking-tight text-fg text-balance">
              Real farms. Real outcomes.
            </h2>
            <p className="mt-4 text-fg-dim max-w-xl">
              A snapshot of how our drone services are being used across South
              Africa. (Sample case studies — replace with confirmed data when
              available.)
            </p>
          </div>
          <Button href="/case-studies" variant="secondary">
            All case studies <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <Card className="h-full flex flex-col">
                <div className="mb-4 inline-flex">
                  <span className="text-[10px] uppercase tracking-widest text-leaf-700 bg-leaf-50 border border-leaf-500/40 rounded-full px-2 py-0.5">
                    {c.tag}
                  </span>
                </div>
                <CardTitle className="text-xl mb-2">{c.title}</CardTitle>
                <CardDescription className="mb-5">{c.service}</CardDescription>

                <dl className="space-y-3 text-sm flex-1">
                  <Item label="Challenge" body={c.challenge} />
                  <Item label="Solution" body={c.solution} />
                  <Item label="Outcome" body={c.outcome} highlight />
                </dl>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Item({
  label,
  body,
  highlight,
}: {
  label: string;
  body: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-fg-muted mb-1">
        {label}
      </dt>
      <dd
        className={
          highlight
            ? "text-fg font-medium flex items-start gap-2"
            : "text-fg-dim"
        }
      >
        {highlight ? <TrendingUp className="h-4 w-4 text-leaf-700 mt-0.5 shrink-0" /> : null}
        <span>{body}</span>
      </dd>
    </div>
  );
}