"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Input, Label, Select, Textarea } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { adminUpsertTeamAction } from "@/actions/admin";
import { useToast } from "@/components/ui/toast";

const ROLES = ["pilot", "agronomist", "technician", "coordinator"] as const;

export function TeamForm() {
  const router = useRouter();
  const t = useToast();
  const [pending, setPending] = React.useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setPending(true);
    const res = await adminUpsertTeamAction({
      name: fd.get("name"),
      role: fd.get("role"),
      email: fd.get("email") || "",
      phone: fd.get("phone") || "",
      available: fd.get("available") === "true",
      bio: fd.get("bio") || "",
    });
    setPending(false);
    if (!res.ok) {
      t.toast({ title: "Could not save", description: res.error, tone: "error" });
    } else {
      t.toast({ title: "Team member saved", tone: "success" });
      router.refresh();
      (e.currentTarget as HTMLFormElement).reset();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required minLength={2} />
      </div>
      <div>
        <Label htmlFor="role">Role</Label>
        <Select id="role" name="role" defaultValue="pilot">
          {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
        </Select>
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" />
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" name="phone" placeholder="+27 ..." />
      </div>
      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea id="bio" name="bio" rows={3} placeholder="Background, certifications, region coverage…" />
      </div>
      <div>
        <label className="flex items-center gap-2 text-sm text-fg-dim">
          <input type="checkbox" name="available" value="true" defaultChecked className="rounded border-leaf-700/15 bg-white" />
          Available for assignment
        </label>
      </div>
      <Button type="submit" loading={pending} className="w-full">
        Save
      </Button>
    </form>
  );
}