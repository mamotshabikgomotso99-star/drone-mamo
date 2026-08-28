"use client";

import { motion } from "framer-motion";

/**
 * LiveDrone — a detailed animated drone that sweeps diagonally across a
 * dedicated section between the Hero and the ServicesGrid.
 *
 * Composition:
 *   - Diagonal arc flight path (framer-motion)
 *   - 4 spinning rotors (CSS keyframes, staggered speeds)
 *   - Body tilt, antenna, camera gimbal
 *   - LED status dots (pulse)
 *   - Translucent scan cone on the ground
 *   - Soft ground shadow that follows the drone
 *
 * Decorative — pointer-events-none + aria-hidden.
 * Mirrors the no-reduced-motion precedent set by Hero's DroneFlight.
 */
export function LiveDrone() {
  return (
    <section
      aria-hidden
      className="pointer-events-none relative h-[260px] w-full overflow-hidden sm:h-[320px]"
    >
      {/* Inline keyframes for rotor spin + LED blink */}
      <style>{`
        @keyframes rotor-spin-cw { to { transform: rotate(360deg); } }
        @keyframes rotor-spin-ccw { to { transform: rotate(-360deg); } }
        @keyframes led-blink {
          0%, 60%, 100% { opacity: 1; }
          70%, 90% { opacity: 0.25; }
        }
        .rotor-cw  { animation: rotor-spin-cw  0.22s linear infinite; transform-origin: center; }
        .rotor-ccw { animation: rotor-spin-ccw 0.26s linear infinite; transform-origin: center; }
        .led-blink { animation: led-blink 1.8s ease-in-out infinite; }
      `}</style>

      {/* Diagonal arc: bottom-left → upper-mid → bottom-right */}
      <motion.div
        initial={{ x: "-20%", y: "60%" }}
        animate={{ x: "120%", y: ["60%", "20%", "60%"] }}
        transition={{
          duration: 26,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.5, 1],
        }}
        className="absolute left-0 top-0 will-change-transform"
      >
        <Drone />

        {/* Soft ground shadow — follows the drone vertically */}
        <motion.div
          initial={{ opacity: 0.15 }}
          animate={{ opacity: [0.15, 0.45, 0.15] }}
          transition={{
            duration: 26,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.5, 1],
          }}
          className="mx-auto mt-2 h-3 w-28 rounded-full bg-[rgba(31,128,80,0.30)] blur-md"
        />
      </motion.div>

      {/* Scan cone — fixed at section mid, fades in/out with the arc */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.55, 0] }}
        transition={{
          duration: 26,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.5, 1],
        }}
        className="absolute left-1/2 top-[55%] -translate-x-1/2"
      >
        <svg
          width="220"
          height="160"
          viewBox="0 0 220 160"
          fill="none"
          className="opacity-90"
        >
          <defs>
            <linearGradient id="scan-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34d273" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#1f8050" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M 100 0 L 220 150 L -20 150 Z"
            fill="url(#scan-grad)"
          />
          {/* Faint scan lines on the ground */}
          {[170, 180, 190].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="220"
              y2={y}
              stroke="#1f8050"
              strokeOpacity="0.15"
              strokeWidth="1"
            />
          ))}
        </svg>
      </motion.div>
    </section>
  );
}

/** The drone itself — ~140px wide, ~110px tall. */
function Drone() {
  // Rotor positions relative to the 200×140 viewBox.
  // Each rotor is rendered as a <g> with transform-origin set to its center
  // via inline style so the CSS keyframe rotation pivots correctly.
  const rotors = [
    { cx: 28, cy: 30, dir: "cw" as const, speed: "rotor-cw" },
    { cx: 172, cy: 30, dir: "ccw" as const, speed: "rotor-ccw" },
    { cx: 28, cy: 110, dir: "ccw" as const, speed: "rotor-ccw" },
    { cx: 172, cy: 110, dir: "cw" as const, speed: "rotor-cw" },
  ];

  return (
    <div
      className="relative"
      style={{ transform: "rotate(-3deg)", width: 200, height: 140 }}
    >
      <svg
        width="200"
        height="140"
        viewBox="0 0 200 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_8px_18px_rgba(31,128,80,0.25)]"
      >
        <defs>
          {/* Body gradient — matches Logo.tsx pattern */}
          <linearGradient id="liveDroneBody" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4ba070" />
            <stop offset="100%" stopColor="#0f5632" />
          </linearGradient>
          <linearGradient id="liveDroneArm" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1f8050" />
            <stop offset="100%" stopColor="#0f5632" />
          </linearGradient>
        </defs>

        {/* X-frame arms — from body corners out to rotors */}
        <g
          stroke="url(#liveDroneArm)"
          strokeWidth="3"
          strokeLinecap="round"
        >
          <line x1="62" y1="52" x2="28" y2="30" />
          <line x1="138" y1="52" x2="172" y2="30" />
          <line x1="62" y1="88" x2="28" y2="110" />
          <line x1="138" y1="88" x2="172" y2="110" />
        </g>

        {/* Antenna */}
        <line
          x1="100"
          y1="48"
          x2="100"
          y2="32"
          stroke="#1f8050"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <circle cx="100" cy="30" r="2" fill="#34d273" />

        {/* Body — rounded rect with gradient */}
        <rect
          x="62"
          y="52"
          width="76"
          height="36"
          rx="10"
          fill="url(#liveDroneBody)"
          stroke="#0f5632"
          strokeWidth="1.2"
        />

        {/* Body accent stripe */}
        <rect
          x="70"
          y="60"
          width="60"
          height="3"
          rx="1.5"
          fill="#34d273"
          opacity="0.55"
        />

        {/* Camera gimbal — under the body */}
        <circle cx="100" cy="96" r="9" fill="#141610" stroke="#0f5632" strokeWidth="1.5" />
        <circle cx="100" cy="96" r="4" fill="#1f8050" />
        <circle cx="100" cy="96" r="1.6" fill="#34d273" />

        {/* LED status dots — blink */}
        <circle cx="74" cy="84" r="1.8" fill="#34d273" className="led-blink" />
        <circle cx="126" cy="60" r="1.8" fill="#d4b15f" className="led-blink" style={{ animationDelay: "0.6s" }} />

        {/* Rotors */}
        {rotors.map((r, i) => (
          <g
            key={i}
            className={r.speed}
            style={{ transformOrigin: `${r.cx}px ${r.cy}px` }}
          >
            {/* Two crossed blades, blurred to suggest spin */}
            <g
              stroke="#1f8050"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.85"
              style={{ filter: "blur(1.4px)" }}
            >
              <line x1={r.cx - 14} y1={r.cy} x2={r.cx + 14} y2={r.cy} />
              <line x1={r.cx} y1={r.cy - 14} x2={r.cx} y2={r.cy + 14} />
            </g>
            {/* Rotor hub */}
            <circle cx={r.cx} cy={r.cy} r="3" fill="#0f5632" stroke="#1f8050" strokeWidth="1" />
            <circle cx={r.cx} cy={r.cy} r="1.2" fill="#34d273" />
          </g>
        ))}
      </svg>
    </div>
  );
}
