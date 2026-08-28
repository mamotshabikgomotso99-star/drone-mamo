"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input, Label, FieldError } from "@/components/ui/form";
import { Select } from "@/components/ui/form";
import { updateProfileAction } from "@/actions/admin";
import { useToast } from "@/components/ui/toast";

const PROVINCES = [
  "Western Cape",
  "Eastern Cape",
  "Northern Cape",
  "Free State",
  "KwaZulu-Natal",
  "North West",
  "Gauteng",
  "Mpumalanga",
  "Limpopo",
];

export function ProfileForm({
  user,
  profile,
}: {
  user: { name: string; email: string; phone: string };
  profile: { companyName: string; province: string; preferredCrop: string };
}) {
  const t = useToast();
  const [state, setState] = React.useState<{
    pending: boolean;
    error?: string;
    fieldErrors?: Record<string, string[]>;
  }>({ pending: false });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setState({ pending: true });
    const res = await updateProfileAction(form);
    if (!res.ok) {
      setState({ pending: false, error: res.error, fieldErrors: res.fieldErrors });
      t.toast({ title: "Update failed", description: res.error, tone: "error" });
    } else {
      setState({ pending: false });
      t.toast({ title: "Profile updated", tone: "success" });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="rounded-2xl glass p-6">
        <h2 className="text-lg font-semibold text-fg mb-4">Personal</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label required>Name</Label>
            <Input name="name" defaultValue={user.name} required />
            <FieldError message={state.fieldErrors?.name?.[0]} />
          </div>
          <div>
            <Label>Email</Label>
            <Input value={user.email} disabled />
          </div>
          <div>
            <Label>Phone</Label>
            <Input name="phone" defaultValue={user.phone} placeholder="+27 82 555 0199" />
          </div>
        </div>
      </section>

      <section className="rounded-2xl glass p-6">
        <h2 className="text-lg font-semibold text-fg mb-4">Farm & business</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>Company / farm name</Label>
            <Input name="companyName" defaultValue={profile.companyName} />
          </div>
          <div>
            <Label>Province</Label>
            <Select name="province" defaultValue={profile.province}>
              <option value="">Select province</option>
              {PROVINCES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Preferred crop</Label>
            <Input name="preferredCrop" defaultValue={profile.preferredCrop} />
          </div>
        </div>
      </section>

      {state.error ? <div className="text-sm text-red-400">{state.error}</div> : null}
      <div className="flex justify-end">
        <Button type="submit" loading={state.pending}>Save changes</Button>
      </div>
    </form>
  );
}