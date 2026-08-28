import * as React from "react";
import { cn } from "./utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, leftSlot, rightSlot, ...props }, ref) => {
    return (
      <div
        className={cn(
          "relative flex items-center rounded-xl border bg-white transition-colors",
          "border-leaf-700/15 focus-within:border-leaf-600 focus-within:ring-2 focus-within:ring-leaf-500/20",
          invalid && "border-red-400",
          className,
        )}
      >
        {leftSlot ? <div className="pl-3 text-fg-muted">{leftSlot}</div> : null}
        <input
          ref={ref}
          className={cn(
            "w-full bg-transparent px-4 py-3 text-sm text-fg placeholder:text-fg-muted focus:outline-none disabled:opacity-50",
            leftSlot && "pl-2",
            rightSlot && "pr-2",
          )}
          {...props}
        />
        {rightSlot ? <div className="pr-3 text-fg-muted">{rightSlot}</div> : null}
      </div>
    );
  },
);
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }
>(({ className, invalid, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full rounded-xl border bg-white px-4 py-3 text-sm text-fg placeholder:text-fg-muted focus:outline-none focus:border-leaf-600 focus:ring-2 focus:ring-leaf-500/20 transition-colors min-h-[100px] resize-y",
      invalid ? "border-red-400" : "border-leaf-700/15",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean }
>(({ className, invalid, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "w-full rounded-xl border bg-white px-4 py-3 text-sm text-fg focus:outline-none focus:border-leaf-600 focus:ring-2 focus:ring-leaf-500/20 transition-colors appearance-none cursor-pointer",
      "bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%231f8050%22 stroke-width=%222%22><polyline points=%226 9 12 15 18 9%22/></svg>')] bg-no-repeat bg-right pr-10",
      "[background-position:right_0.75rem_center] [background-size:18px_18px]",
      invalid ? "border-red-400" : "border-leaf-700/15",
      className,
    )}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = "Select";

export function Label({
  className,
  children,
  required,
  htmlFor,
}: React.LabelHTMLAttributes<HTMLLabelElement> & { required?: boolean }) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "text-xs font-medium uppercase tracking-wider text-fg-muted mb-2 block",
        className,
      )}
    >
      {children}
      {required ? <span className="text-leaf-600 ml-1">*</span> : null}
    </label>
  );
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-red-600 mt-1.5">{message}</p>;
}

export function FieldHint({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-fg-muted mt-1.5">{children}</p>;
}