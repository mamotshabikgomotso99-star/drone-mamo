"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function BookingCTA() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-leaf-500/40 bg-gradient-to-br from-ink-3 via-ink-2 to-ink p-10 sm:p-16">
          {/* Decorative glow */}
          <div
            className="absolute -top-32 -right-32 h-96 w-96 rounded-full opacity-40 blur-3xl"
            style={{ background: "radial-gradient(circle, #34d273 0%, transparent 70%)" }}
          />
          <div
            className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full opacity-20 blur-3xl"
            style={{ background: "radial-gradient(circle, #1ba35a 0%, transparent 70%)" }}
          />

          <div className="relative grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-fg text-balance">
                Ready to fly your first mission?
              </h2>
              <p className="mt-5 text-lg text-fg-dim max-w-xl">
                Tell us about your farm in a few clicks and we&apos;ll come back
                with a tailored estimate within 1 business day.
              </p>
            </div>
            <div className="lg:justify-self-end flex flex-col sm:flex-row gap-3">
              <Button href="/book" size="xl">
                Book a service <ArrowRight className="h-5 w-5" />
              </Button>
              <Button href="/contact" size="xl" variant="secondary">
                Talk to us first
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}