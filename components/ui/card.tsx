import * as React from "react";
import { cn } from "./utils";

export function Card({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl glass p-6",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mb-4", className)} {...rest}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...rest }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-lg font-semibold tracking-tight text-fg", className)} {...rest}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...rest }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-fg-muted mt-1", className)} {...rest}>
      {children}
    </p>
  );
}

export function CardContent({ className, children, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("text-sm text-fg-dim", className)} {...rest}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mt-5 flex items-center", className)} {...rest}>
      {children}
    </div>
  );
}

export function Badge({
  className,
  tone = "default",
  children,
}: React.HTMLAttributes<HTMLSpanElement> & {
  tone?:
    | "default"
    | "leaf"
    | "gold"
    | "red"
    | "blue"
    | "amber"
    | "violet"
    | "indigo"
    | "emerald"
    | "zinc";
}) {
  const tones: Record<string, string> = {
    default: "bg-ash-100 text-fg-dim border-leaf-700/10",
    leaf: "bg-leaf-50 text-leaf-700 border-leaf-500/30",
    gold: "bg-amber-50 text-gold-500 border-gold-500/30",
    red: "bg-red-50 text-red-700 border-red-300",
    blue: "bg-blue-50 text-blue-700 border-blue-300",
    amber: "bg-amber-50 text-amber-700 border-amber-300",
    violet: "bg-violet-50 text-violet-700 border-violet-300",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-300",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-300",
    zinc: "bg-ash-100 text-ash-600 border-leaf-700/10",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Stat({
  label,
  value,
  hint,
  trend,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  trend?: { value: string; up?: boolean };
  icon?: React.ReactNode;
}) {
  return (
    <Card className="flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs uppercase tracking-wider text-fg-muted">{label}</span>
        {icon ? <div className="text-leaf-600">{icon}</div> : null}
      </div>
      <div className="text-3xl font-semibold tracking-tight text-fg">{value}</div>
      {(hint || trend) && (
        <div className="mt-2 flex items-center gap-2 text-xs">
          {trend ? (
            <span className={trend.up ? "text-leaf-600" : "text-red-600"}>
              {trend.up ? "▲" : "▼"} {trend.value}
            </span>
          ) : null}
          {hint ? <span className="text-fg-muted">{hint}</span> : null}
        </div>
      )}
    </Card>
  );
}