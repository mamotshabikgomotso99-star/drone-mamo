import * as React from "react";
import { cn } from "./utils";

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("text-center py-16 px-6 rounded-2xl glass", className)}>
      {icon ? <div className="mx-auto mb-4 text-fg-muted">{icon}</div> : null}
      <h3 className="text-base font-semibold text-fg">{title}</h3>
      {description ? (
        <p className="mt-1 text-sm text-fg-muted max-w-md mx-auto">{description}</p>
      ) : null}
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("rounded-md shimmer bg-ash-100", className)} />;
}

export function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "inline-block h-5 w-5 rounded-full border-2 border-current border-t-transparent animate-spin",
        className,
      )}
      role="status"
      aria-label="Loading"
    />
  );
}