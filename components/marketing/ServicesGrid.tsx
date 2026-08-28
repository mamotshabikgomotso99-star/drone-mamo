"use client";

import * as React from "react";
import Link from "next/link";
import {
  SprayCan,
  FlaskConical,
  Shield,
  Leaf,
  Activity,
  Search,
  Map,
  Compass,
  Droplets,
  Beef,
  Camera,
  Plane,
} from "lucide-react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/ui/utils";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  spray: SprayCan,
  flask: FlaskConical,
  shield: Shield,
  leaf: Leaf,
  activity: Activity,
  search: Search,
  map: Map,
  compass: Compass,
  droplet: Droplets,
  cow: Beef,
  camera: Camera,
};

interface Service {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  benefits: string[];
  iconKey?: string | null;
  featured?: boolean | null;
}

export function ServicesGrid({
  services,
  heading = "What we do",
  subheading = "A complete suite of agricultural drone services, designed for the realities of South African farming.",
}: {
  services: Service[];
  heading?: string;
  subheading?: string;
}) {
  return (
    <section id="services" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-16">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-leaf-700 font-medium">
            <span className="h-px w-8 bg-leaf-400/60" />
            {heading}
          </span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-semibold tracking-tight text-fg text-balance">
            Agricultural drone services, built around your farm.
          </h2>
          <p className="mt-5 text-lg text-fg-dim max-w-2xl text-pretty">{subheading}</p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => {
            const Icon = ICONS[s.iconKey ?? "plane"] ?? Plane;
            return (
              <Link
                key={s.id}
                href={`/services/${s.slug}`}
                className={cn(
                  "group relative rounded-2xl glass p-6 sm:p-8 hover:bg-ash-50 transition-all duration-300 reveal",
                  s.featured && "ring-1 ring-leaf-500/20",
                )}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="h-12 w-12 rounded-xl bg-leaf-50 border border-leaf-500/40 flex items-center justify-center group-hover:bg-leaf-50 transition-colors">
                    <Icon className="h-6 w-6 text-leaf-700" />
                  </div>
                  {s.featured ? (
                    <span className="text-[10px] uppercase tracking-widest text-leaf-700 bg-leaf-50 border border-leaf-500/40 rounded-full px-2 py-0.5">
                      Featured
                    </span>
                  ) : null}
                </div>

                <h3 className="text-xl font-semibold text-fg mb-2 group-hover:text-leaf-700 transition-colors">
                  {s.name}
                </h3>
                <p className="text-sm text-fg-dim leading-relaxed mb-5">
                  {s.shortDescription}
                </p>

                {s.benefits?.length ? (
                  <ul className="space-y-1.5 text-xs text-fg-dim">
                    {s.benefits.slice(0, 3).map((b, j) => (
                      <li key={j} className="flex gap-2">
                        <span className="text-leaf-700 mt-1">▸</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}

                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-leaf-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            );
          })}
        </div>

        <div className="mt-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-leaf-700/10 pt-10">
          <p className="text-sm text-fg-muted max-w-lg">
            Not sure which service suits your farm? Our team can scope it with
            you in a 15-minute call.
          </p>
          <div className="flex gap-3">
            <Button href="/contact" variant="outline">Talk to an advisor</Button>
            <Button href="/services">All services →</Button>
          </div>
        </div>
      </div>
    </section>
  );
}