import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white select-none whitespace-nowrap",
  {
    variants: {
      variant: {
        primary:
          "bg-leaf-600 text-white hover:bg-leaf-700 active:bg-leaf-800 shadow-[0_8px_24px_-8px_rgba(31,128,80,0.45)] hover:shadow-[0_12px_32px_-8px_rgba(31,128,80,0.65)]",
        secondary:
          "bg-ash-100 text-fg hover:bg-ash-200 border border-leaf-700/15 hover:border-leaf-700/25",
        outline:
          "border border-leaf-700/20 text-fg hover:bg-leaf-50 hover:border-leaf-600/40",
        ghost: "text-fg-dim hover:text-fg hover:bg-ash-100",
        gold:
          "bg-gradient-to-r from-gold-400 to-gold-500 text-white hover:from-gold-300 hover:to-gold-400 shadow-[0_8px_24px_-8px_rgba(181,140,47,0.4)]",
        danger:
          "bg-red-50 border border-red-300 text-red-700 hover:bg-red-100",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-11 px-5 text-sm",
        lg: "h-14 px-7 text-base",
        xl: "h-16 px-9 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  href?: string;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild, href, loading, children, disabled, ...props }, ref) => {
    const classes = cn(buttonVariants({ variant, size }), className);
    if (href && !asChild) {
      return (
        <Link href={href} className={classes}>
          {children}
        </Link>
      );
    }
    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
        ) : null}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };