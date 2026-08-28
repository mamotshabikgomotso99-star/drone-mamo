"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input, Label, FieldError } from "@/components/ui/form";
import { forgotPasswordAction } from "@/actions/auth";
import { useToast } from "@/components/ui/toast";

export function ForgotPasswordForm() {
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
    setState({ pending: true });
    const res = await forgotPasswordAction(form);
    if (!res.ok) {
      setState({ pending: false, error: res.error, fieldErrors: res.fieldErrors });
    } else {
      setState({ pending: false, success: res.message });
      t.toast({ title: "Check your inbox", description: res.message, tone: "success" });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <Label htmlFor="email" required>Email</Label>
        <Input id="email" name="email" type="email" required autoComplete="email" />
        <FieldError message={state.fieldErrors?.email?.[0]} />
      </div>
      {state.error ? <div className="text-sm text-red-400">{state.error}</div> : null}
      {state.success ? (
        <div className="text-sm text-leaf-300">{state.success}</div>
      ) : null}
      <Button type="submit" loading={state.pending} className="w-full">
        Send reset link
      </Button>
    </form>
  );
}
