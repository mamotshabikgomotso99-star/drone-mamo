"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label, FieldError } from "@/components/ui/form";
import { submitContactAction } from "@/actions/admin";
import { useToast } from "@/components/ui/toast";

export function ContactForm() {
  const [state, setState] = React.useState<{
    pending: boolean;
    error?: string;
    fieldErrors?: Record<string, string[]>;
    success?: string;
  }>({ pending: false });

  const t = useToast();
  const formRef = React.useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setState({ pending: true });
    const res = await submitContactAction(form);
    if (!res.ok) {
      setState({ pending: false, error: res.error, fieldErrors: res.fieldErrors });
      t.toast({ title: "We couldn't send your message", description: res.error, tone: "error" });
    } else {
      setState({ pending: false, success: res.message });
      t.toast({ title: "Message sent", description: res.message, tone: "success" });
      formRef.current?.reset();
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name" required>Name</Label>
          <Input id="name" name="name" required />
          <FieldError message={state.fieldErrors?.name?.[0]} />
        </div>
        <div>
          <Label htmlFor="email" required>Email</Label>
          <Input id="email" name="email" type="email" required />
          <FieldError message={state.fieldErrors?.email?.[0]} />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" placeholder="+27 11 555 0100" />
        </div>
        <div>
          <Label htmlFor="subject" required>Subject</Label>
          <Input id="subject" name="subject" required />
          <FieldError message={state.fieldErrors?.subject?.[0]} />
        </div>
      </div>
      <div>
        <Label htmlFor="message" required>Message</Label>
        <Textarea id="message" name="message" rows={6} required />
        <FieldError message={state.fieldErrors?.message?.[0]} />
      </div>
      {state.error ? (
        <div className="text-sm text-red-400">{state.error}</div>
      ) : null}
      {state.success ? (
        <div className="text-sm text-leaf-700">{state.success}</div>
      ) : null}
      <Button type="submit" loading={state.pending}>
        Send message
      </Button>
    </form>
  );
}