"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  React.useEffect(() => {
    console.error("[app:error]", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-ink">
      <div className="text-[5rem] sm:text-[6rem] font-bold leading-none text-gradient tracking-tighter">
        ⚠
      </div>
      <h1 className="text-2xl font-semibold text-white mt-2">
        Something went wrong.
      </h1>
      <p className="mt-2 text-fg-muted max-w-md mx-auto">
        An unexpected error occurred. Our team has been notified.
      </p>
      {error.digest ? (
        <div className="mt-3 text-xs font-mono text-fg-muted">
          Error ID: {error.digest}
        </div>
      ) : null}
      <div className="mt-8 flex gap-3 justify-center">
        <Button onClick={() => reset()}>Try again</Button>
        <Button href="/" variant="ghost">Go home</Button>
      </div>
    </div>
  );
}