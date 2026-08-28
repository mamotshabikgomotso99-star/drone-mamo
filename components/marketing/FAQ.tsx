"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "Is drone spraying legal in South Africa?",
    a: "Aerial application of agricultural chemicals is regulated in South Africa. KM Drone Services operates in compliance with applicable South African Civil Aviation Authority (SACAA) rules and the Department of Agriculture's requirements for aerial agricultural operations. Operators hold the relevant remote pilot licences, and we work within the framework set out for commercial agricultural drone operations.",
  },
  {
    q: "What is the minimum farm size you work with?",
    a: "There is no strict minimum. For spraying and fertilizer application we typically recommend at least 1 hectare due to setup overhead, but we have completed smaller jobs for specific use-cases like vineyard blocks or trial plots. For mapping and analysis we happily work on plots as small as a few hectares.",
  },
  {
    q: "How is pricing calculated?",
    a: "Pricing depends on the service. Spray-related services are priced per hectare with a small base fee. Mapping and analysis are priced per hectare with a minimum booking fee. Media and surveying work is usually a fixed fee per project. You can use the booking page for an estimate, and we will confirm the final quote after reviewing the brief.",
  },
  {
    q: "How quickly can you deploy?",
    a: "Standard bookings are typically scheduled within 3-7 working days. Urgent requests can usually be accommodated within 48 hours subject to weather, pilot and equipment availability. A small urgency surcharge applies for 48-hour turnaround.",
  },
  {
    q: "What happens if the weather is bad on the day?",
    a: "Drone operations are weather-sensitive. We monitor conditions closely and reschedule at no extra cost if conditions are unsuitable — high winds, rain, or extreme heat. Safety always comes first.",
  },
  {
    q: "Do I need to prepare anything on the day?",
    a: "We&apos;ll brief you before the job. Typically you need to ensure clear access to the field and inform any workers or livestock in the operating area. For spraying, you&apos;ll need to confirm re-entry intervals in line with the product label.",
  },
  {
    q: "What crops do you work with?",
    a: "We work across a wide range of crops including maize, soya, wheat, sugarcane, citrus, grapes, deciduous fruit, vegetables, macadamias, and more. For crops we haven&apos;t encountered, we&apos;ll gladly review the use-case with you before booking.",
  },
  {
    q: "Are the chemicals used approved?",
    a: "We only work with products approved for aerial application under South African regulations. We don&apos;t provide agronomy advice on chemical selection — that should come from your agronomist or crop advisor.",
  },
  {
    q: "Can I cancel or reschedule a booking?",
    a: "Yes. You can cancel or reschedule a booking from your customer dashboard up until it is confirmed. Once confirmed, please contact us directly and we&apos;ll do our best to accommodate.",
  },
  {
    q: "How do I pay?",
    a: "Payment is arranged directly with our team. We&apos;ll issue an invoice with bank details after a booking is completed. Online card payments will be available in a future release.",
  },
];

export function FAQ() {
  const [open, setOpen] = React.useState<number | null>(0);

  return (
    <section className="relative py-24 sm:py-32 bg-ash-50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-leaf-700 font-medium">
            <span className="h-px w-8 bg-leaf-400/60" />
            FAQ
          </span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-semibold tracking-tight text-fg text-balance">
            Common questions, real answers.
          </h2>
          <p className="mt-4 text-fg-dim">
            Can&apos;t find what you&apos;re looking for?{" "}
            <Link href="/contact" className="text-leaf-700 hover:underline">
              Get in touch
            </Link>
            .
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={f.q}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="rounded-2xl glass overflow-hidden"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-medium text-fg">{f.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-fg-muted transition-transform ${isOpen ? "rotate-180 text-leaf-700" : ""}`}
                  />
                </button>
                {isOpen ? (
                  <div className="px-6 pb-6 text-sm text-fg-dim leading-relaxed">
                    <div dangerouslySetInnerHTML={{ __html: f.a }} />
                  </div>
                ) : null}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}