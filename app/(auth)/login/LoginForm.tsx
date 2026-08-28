"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input, Label, FieldError } from "@/components/ui/form";
import { loginAction } from "@/actions/auth";
import { useToast } from "@/components/ui/toast";

export function LoginForm() {
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
    try {
      const res = await loginAction(form);
      if (!res.ok) {
        setState({ pending: false, error: res.error, fieldErrors: res.fieldErrors });
        t.toast({ title: "Sign in failed", description: res.error, tone: "error" });
      }
    } catch (err) {
      // NextAuth throws redirect — that's success
      if (err && typeof err === "object" && "digest" in err && String((err as any).digest).startsWith("NEXT_REDIRECT")) {
        return;
      }
      setState({ pending: false, error: "Unexpected error" });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <Label htmlFor="email" required>Email</Label>
        <Input id="email" name="email" type="email" required autoComplete="email" />
        <FieldError message={state.fieldErrors?.email?.[0]} />
      </div>
      <div>
        <Label htmlFor="password" required>Password</Label>
        <Input id="password" name="password" type="password" required autoComplete="current-password" />
        <FieldError message={state.fieldErrors?.password?.[0]} />
      </div>
      {state.error ? <div className="text-sm text-red-400">{state.error}</div> : null}
      <Button type="submit" loading={state.pending} className="w-full">
        Sign in
      </Button>
    </form>
  );
}
