"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input, Label, FieldError, FieldHint } from "@/components/ui/form";
import { registerAction } from "@/actions/auth";
import { useToast } from "@/components/ui/toast";

export function RegisterForm() {
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
      const res = await registerAction(form);
      if (!res.ok) {
        setState({ pending: false, error: res.error, fieldErrors: res.fieldErrors });
        t.toast({ title: "Registration failed", description: res.error, tone: "error" });
      }
    } catch (err) {
      if (err && typeof err === "object" && "digest" in err && String((err as any).digest).startsWith("NEXT_REDIRECT")) {
        return;
      }
      setState({ pending: false, error: "Unexpected error" });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <Label htmlFor="name" required>Full name</Label>
        <Input id="name" name="name" required autoComplete="name" />
        <FieldError message={state.fieldErrors?.name?.[0]} />
      </div>
      <div>
        <Label htmlFor="email" required>Email</Label>
        <Input id="email" name="email" type="email" required autoComplete="email" />
        <FieldError message={state.fieldErrors?.email?.[0]} />
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" name="phone" placeholder="+27 82 555 0199" />
        <FieldHint>Format: +27 82 555 0199 or 0825550199</FieldHint>
        <FieldError message={state.fieldErrors?.phone?.[0]} />
      </div>
      <div>
        <Label htmlFor="password" required>Password</Label>
        <Input id="password" name="password" type="password" required autoComplete="new-password" />
        <FieldHint>At least 8 characters, with upper/lowercase and a number.</FieldHint>
        <FieldError message={state.fieldErrors?.password?.[0]} />
      </div>
      <div>
        <Label htmlFor="confirmPassword" required>Confirm password</Label>
        <Input id="confirmPassword" name="confirmPassword" type="password" required autoComplete="new-password" />
        <FieldError message={state.fieldErrors?.confirmPassword?.[0]} />
      </div>
      {state.error ? <div className="text-sm text-red-400">{state.error}</div> : null}
      <Button type="submit" loading={state.pending} className="w-full">
        Create account
      </Button>
    </form>
  );
}
