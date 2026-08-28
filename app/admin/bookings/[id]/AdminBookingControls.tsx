"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/form";
import { adminUpdateBookingAction } from "@/actions/admin";
import { useToast } from "@/components/ui/toast";

const STATUS_OPTIONS = [
  "pending",
  "confirmed",
  "scheduled",
  "in_progress",
  "completed",
  "cancelled",
  "rejected",
] as const;

interface Props {
  booking: {
    id: string;
    status: string;
    scheduledDate: string;
    timeSlot: string;
    droneId: string | null;
    assignedTeamId: string | null;
    finalPriceZar: string;
    internalNotes: string;
  };
  drones: Array<{ id: string; name: string; status: string }>;
  team: Array<{ id: string; name: string; role: string }>;
}

export function AdminBookingControls({ booking, drones, team }: Props) {
  const router = useRouter();
  const t = useToast();
  const [pending, setPending] = React.useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setPending(true);
    const res = await adminUpdateBookingAction(form);
    setPending(false);
    if (!res.ok) {
      t.toast({ title: "Could not update booking", description: res.error, tone: "error" });
    } else {
      t.toast({ title: "Booking updated", description: res.message, tone: "success" });
      router.refresh();
    }
  }

  return (
    <Card>
      <CardTitle className="text-base">Manage booking</CardTitle>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <input type="hidden" name="bookingId" value={booking.id} />

        <div>
          <Label htmlFor="status">Status</Label>
          <Select id="status" name="status" defaultValue={booking.status}>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s.replace("_", " ")}</option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="scheduledDate">Scheduled date &amp; time</Label>
          <Input
            id="scheduledDate"
            name="scheduledDate"
            type="datetime-local"
            defaultValue={booking.scheduledDate}
          />
        </div>

        <div>
          <Label htmlFor="timeSlot">Time slot</Label>
          <Select id="timeSlot" name="timeSlot" defaultValue={booking.timeSlot}>
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
          </Select>
        </div>

        <div>
          <Label htmlFor="droneId">Assigned drone</Label>
          <Select id="droneId" name="droneId" defaultValue={booking.droneId ?? ""}>
            <option value="">— Unassigned —</option>
            {drones.map((d) => (
              <option key={d.id} value={d.id}>{d.name} ({d.status})</option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="assignedTeamId">Assigned operator</Label>
          <Select id="assignedTeamId" name="assignedTeamId" defaultValue={booking.assignedTeamId ?? ""}>
            <option value="">— Unassigned —</option>
            {team.map((m) => (
              <option key={m.id} value={m.id}>{m.name} ({m.role})</option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="finalPriceZar">Final price (ZAR)</Label>
          <Input
            id="finalPriceZar"
            name="finalPriceZar"
            type="number"
            min="0"
            step="0.01"
            defaultValue={booking.finalPriceZar}
          />
        </div>

        <div>
          <Label htmlFor="internalNotes">Internal notes</Label>
          <Textarea id="internalNotes" name="internalNotes" rows={4} defaultValue={booking.internalNotes} />
        </div>

        <Button type="submit" loading={pending} className="w-full">
          Save changes
        </Button>
      </form>
    </Card>
  );
}