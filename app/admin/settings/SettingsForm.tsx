"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Input, Label } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { updateProfileAction } from "@/actions/admin";
import { useToast } from "@/components/ui/toast";

export function SettingsForm({ initial }: { initial: { name: string; email: string; phone: string } }) {
  const router = useRouter();
  const t = useToast();
  const [pending, setPending] = React.useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setPending(true);
    const res = await updateProfileAction(form);
    setPending(false);
    if (!res.ok) {
      t.toast({ title: "Could not save", description: res.error, tone: "error" });
    } else {
      t.toast({ title: "Profile updated", tone: "success" });
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required defaultValue={initial.name} />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required defaultValue={initial.email} />
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" name="phone" defaultValue={initial.phone} placeholder="+27 ..." />
      </div>
      <Button type="submit" loading={pending} className="w-full">Save</Button>
    </form>
  );
}