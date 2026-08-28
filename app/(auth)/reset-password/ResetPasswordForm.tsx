"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Label, FieldError, FieldHint } from "@/components/ui/form";
import { resetPasswordAction } from "@/actions/auth";
import { useToast } from "@/components/ui/toast";

export function ResetPasswordForm() {
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const t = useToast();
  const [state, setState] = React.useState<{
    pending: boolean;
    error?: string;
    fieldErrors?: Record<string, string[]>;
    success?: string;
  }>({ pending: false });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    if (!token) {
      setState({ pending: false, error: "Reset link is missing the token." });
      return;
    }
    setState({ pending: true });
    const res = await resetPasswordAction(form);
    if (!res.ok) {
      setState({ pending: false, error: res.error, fieldErrors: res.fieldErrors });
    } else {
      setState({ pending: false, success: res.message });
      t.toast({ title: "Password updated", description: res.message, tone: "success" });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <input type="hidden" name="token" value={token} />
      <div>
        <Label htmlFor="password" required>New password</Label>
        <Input id="password" name="password" type="password" required autoComplete="new-password" />
        <FieldHint>At least 8 characters, with upper/lowercase and a number.</FieldHint>
        <FieldError message={state.fieldErrors?.password?.[0]} />
      </div>
      <div>
        <Label htmlFor="confirmPassword" required>Confirm new password</Label>
        <Input id="confirmPassword" name="confirmPassword" type="password" required autoComplete="new-password" />
        <FieldError message={state.fieldErrors?.confirmPassword?.[0]} />
      </div>
      {state.error ? <div className="text-sm text-red-400">{state.error}</div> : null}
      {state.success ? <div className="text-sm text-leaf-300">{state.success}</div> : null}
      <Button type="submit" loading={state.pending} className="w-full">
        Update password
      </Button>
    </form>
  );
}
