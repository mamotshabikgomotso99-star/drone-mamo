import * as React from "react";
import { cn } from "@/components/ui/utils";

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  variant?: "default" | "compact" | "mark";
  showText?: boolean;
}

/**
 * KM Drone Services logo:
 * - Stylised drone frame forming an X
 * - Leaf/field circle behind, signalling precision agriculture
 * - Bold "KM" monogram at center
 */
export function Logo({
  variant = "default",
  showText = true,
  className,
  ...props
}: LogoProps) {
  if (variant === "mark") {
    return (
      <svg
        viewBox="0 0 64 64"
        className={cn("h-8 w-8", className)}
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <defs>
          <linearGradient id="km-mark-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4ba070" />
            <stop offset="100%" stopColor="#0f5632" />
          </linearGradient>
        </defs>
        <circle cx="32" cy="32" r="30" fill="url(#km-mark-grad)" opacity="0.14" />
        <circle cx="32" cy="32" r="22" fill="none" stroke="url(#km-mark-grad)" strokeWidth="1.5" />
        <g stroke="#1f8050" strokeWidth="2" strokeLinecap="round">
          <line x1="14" y1="14" x2="50" y2="50" />
          <line x1="50" y1="14" x2="14" y2="50" />
          <circle cx="14" cy="14" r="3" fill="#1f8050" />
          <circle cx="50" cy="14" r="3" fill="#1f8050" />
          <circle cx="14" cy="50" r="3" fill="#1f8050" />
          <circle cx="50" cy="50" r="3" fill="#1f8050" />
        </g>
        <text
          x="32"
          y="38"
          textAnchor="middle"
          fontFamily="ui-sans-serif, system-ui"
          fontWeight="700"
          fontSize="13"
          fill="#141610"
          letterSpacing="-0.5"
        >
          KM
        </text>
      </svg>
    );
  }

  if (variant === "compact") {
    return (
      <svg
        viewBox="0 0 200 48"
        className={cn("h-9", className)}
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <defs>
          <linearGradient id="km-compact-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4ba070" />
            <stop offset="100%" stopColor="#0f5632" />
          </linearGradient>
        </defs>
        <circle cx="24" cy="24" r="20" fill="url(#km-compact-grad)" opacity="0.14" />
        <circle cx="24" cy="24" r="14" fill="none" stroke="url(#km-compact-grad)" strokeWidth="1.2" />
        <g stroke="#1f8050" strokeWidth="1.5" strokeLinecap="round">
          <line x1="14" y1="14" x2="34" y2="34" />
          <line x1="34" y1="14" x2="14" y2="34" />
          <circle cx="14" cy="14" r="2" fill="#1f8050" />
          <circle cx="34" cy="14" r="2" fill="#1f8050" />
          <circle cx="14" cy="34" r="2" fill="#1f8050" />
          <circle cx="34" cy="34" r="2" fill="#1f8050" />
        </g>
        <text
          x="56"
          y="22"
          fontFamily="ui-sans-serif, system-ui"
          fontWeight="700"
          fontSize="14"
          fill="#141610"
          letterSpacing="-0.3"
        >
          KM DRONE
        </text>
        <text
          x="56"
          y="38"
          fontFamily="ui-sans-serif, system-ui"
          fontWeight="500"
          fontSize="11"
          fill="#4a4d45"
          letterSpacing="2"
        >
          SERVICES
        </text>
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 240 56"
      className={cn("h-10", className)}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <linearGradient id="km-full-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4ba070" />
          <stop offset="100%" stopColor="#0f5632" />
        </linearGradient>
      </defs>
      <circle cx="28" cy="28" r="24" fill="url(#km-full-grad)" opacity="0.14" />
      <circle cx="28" cy="28" r="17" fill="none" stroke="url(#km-full-grad)" strokeWidth="1.4" />
      <g stroke="#1f8050" strokeWidth="1.7" strokeLinecap="round">
        <line x1="14" y1="14" x2="42" y2="42" />
        <line x1="42" y1="14" x2="14" y2="42" />
        <circle cx="14" cy="14" r="2.5" fill="#1f8050" />
        <circle cx="42" cy="14" r="2.5" fill="#1f8050" />
        <circle cx="14" cy="42" r="2.5" fill="#1f8050" />
        <circle cx="42" cy="42" r="2.5" fill="#1f8050" />
      </g>
      {showText ? (
        <>
          <text
            x="68"
            y="26"
            fontFamily="ui-sans-serif, system-ui"
            fontWeight="700"
            fontSize="17"
            fill="#141610"
            letterSpacing="-0.4"
          >
            KM Drone Services
          </text>
          <text
            x="68"
            y="44"
            fontFamily="ui-sans-serif, system-ui"
            fontWeight="500"
            fontSize="11"
            fill="#4a4d45"
            letterSpacing="3"
          >
            PRECISION AGRICULTURE
          </text>
        </>
      ) : null}
    </svg>
  );
}

export default Logo;