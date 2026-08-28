"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Input, Label, Select } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { adminUpsertDroneAction } from "@/actions/admin";
import { useToast } from "@/components/ui/toast";

const STATUSES = ["available", "assigned", "maintenance", "unavailable"] as const;

export function DroneForm() {
  const router = useRouter();
  const t = useToast();
  const [pending, setPending] = React.useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setPending(true);
    const res = await adminUpsertDroneAction({
      name: fd.get("name"),
      model: fd.get("model"),
      registration: fd.get("registration") || "",
      capacityKg: Number(fd.get("capacityKg") || 0),
      flightTimeMin: Number(fd.get("flightTimeMin") || 0),
      status: fd.get("status"),
      notes: fd.get("notes") || "",
    });
    setPending(false);
    if (!res.ok) {
      t.toast({ title: "Could not save drone", description: res.error, tone: "error" });
    } else {
      t.toast({ title: "Drone saved", tone: "success" });
      router.refresh();
      (e.currentTarget as HTMLFormElement).reset();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required minLength={2} placeholder="e.g. XAG P100" />
      </div>
      <div>
        <Label htmlFor="model">Model</Label>
        <Input id="model" name="model" required minLength={2} placeholder="e.g. P100 Pro" />
      </div>
      <div>
        <Label htmlFor="registration">Registration</Label>
        <Input id="registration" name="registration" placeholder="ZS-DRN-01" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="capacityKg">Capacity (kg)</Label>
          <Input id="capacityKg" name="capacityKg" type="number" min="0" step="0.1" defaultValue="0" />
        </div>
        <div>
          <Label htmlFor="flightTimeMin">Flight time (min)</Label>
          <Input id="flightTimeMin" name="flightTimeMin" type="number" min="0" defaultValue="0" />
        </div>
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <Select id="status" name="status" defaultValue="available">
          {STATUSES.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
        </Select>
      </div>
      <Button type="submit" loading={pending} className="w-full">
        Save drone
      </Button>
    </form>
  );
}