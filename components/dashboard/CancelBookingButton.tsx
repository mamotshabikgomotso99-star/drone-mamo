"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cancelBookingAction } from "@/actions/bookings";
import { useToast } from "@/components/ui/toast";

export function CancelBookingButton({ bookingId }: { bookingId: string }) {
  const t = useToast();
  const [loading, setLoading] = React.useState(false);
  return (
    <Button
      variant="danger"
      loading={loading}
      onClick={async () => {
        if (!confirm("Cancel this booking? This cannot be undone.")) return;
        setLoading(true);
        const res = await cancelBookingAction(bookingId);
        setLoading(false);
        if (!res.ok) {
          t.toast({ title: "Could not cancel", description: res.error, tone: "error" });
        } else {
          t.toast({ title: "Booking cancelled", tone: "success" });
        }
      }}
    >
      Cancel booking
    </Button>
  );
}