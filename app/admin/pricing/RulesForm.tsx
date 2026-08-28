"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Input, Label, Select } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { adminUpsertPricingRuleAction } from "@/actions/pricing-rules";
import { useToast } from "@/components/ui/toast";

const KINDS = [
  { value: "urgency_fee", label: "Urgency fee" },
  { value: "location_fee", label: "Distance surcharge" },
  { value: "addon", label: "Add-on" },
] as const;

export function RulesForm({ services }: { services: Array<{ id: string; name: string }> }) {
  const router = useRouter();
  const t = useToast();
  const [pending, setPending] = React.useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    form.set("active", "true");
    setPending(true);
    const res = await adminUpsertPricingRuleAction(form);
    setPending(false);
    if (!res.ok) {
      t.toast({ title: "Could not save rule", description: res.error, tone: "error" });
    } else {
      t.toast({ title: "Pricing rule saved", tone: "success" });
      router.refresh();
      (e.currentTarget as HTMLFormElement).reset();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3">
      <div>
        <Label htmlFor="serviceId">Service</Label>
        <Select id="serviceId" name="serviceId" required>
          <option value="">— choose —</option>
          {services.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </Select>
      </div>
      <div>
        <Label htmlFor="name">Rule name</Label>
        <Input id="name" name="name" required placeholder="e.g. Distance surcharge >100km" />
      </div>
      <div>
        <Label htmlFor="kind">Rule type</Label>
        <Select id="kind" name="kind" required defaultValue="urgency_fee">
          {KINDS.map((k) => <option key={k.value} value={k.value}>{k.label}</option>)}
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="amountZar">Amount (ZAR)</Label>
          <Input id="amountZar" name="amountZar" type="number" min="0" step="0.01" defaultValue="0" />
        </div>
        <div>
          <Label htmlFor="percent">Percent (%)</Label>
          <Input id="percent" name="percent" type="number" min="0" max="200" step="0.1" defaultValue="0" />
        </div>
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Input id="description" name="description" placeholder="Optional context" />
      </div>
      <Button type="submit" loading={pending} className="w-full">
        Save rule
      </Button>
    </form>
  );
}