"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { markAllNotificationsReadAction } from "@/actions/notifications";
import { useToast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";

export function MarkAllReadButton() {
  const t = useToast();
  const router = useRouter();
  const [pending, setPending] = React.useState(false);

  async function handleClick() {
    setPending(true);
    const res = await markAllNotificationsReadAction();
    setPending(false);
    if (!res.ok) {
      t.toast({ title: "Could not update", description: res.error, tone: "error" });
    } else {
      router.refresh();
    }
  }

  return (
    <Button type="button" variant="secondary" size="sm" onClick={handleClick} loading={pending}>
      Mark all as read
    </Button>
  );
}