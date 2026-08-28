"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
      {/* Full-bleed aerial farmland background fills the entire viewport */}
      <FarmlandScene />

      {/* Content overlay */}
      <div className="relative z-20 mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-4 pt-24 pb-16 sm:px-6 sm:pt-28 lg:px-8 lg:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-leaf-500/40 bg-white/70 px-4 py-1.5 text-xs font-medium text-leaf-700 backdrop-blur-md mb-8 animate-fade-in shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            Premium drone services for South African agriculture
          </div>

          <h1 className="font-semibold tracking-tight text-balance">
            <span className="block text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.95] text-white drop-shadow-[0_2px_8px_rgba(6,40,24,0.55)]">
              Precision agriculture,
            </span>
            <span className="block text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.95] mt-2 text-white drop-shadow-[0_2px_12px_rgba(6,40,24,0.65)]">
              delivered from above.
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-8 text-lg sm:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed drop-shadow-[0_1px_4px_rgba(6,40,24,0.6)]"
          >
            KM Drone Services helps South African farmers spray, monitor, map
            and protect their crops with surgical precision — reducing chemical
            use, cutting costs, and lifting yields.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Button href="/book" size="xl">
              Book a drone service <ArrowRight className="h-5 w-5" />
            </Button>
            <Button href="/services" variant="secondary" size="xl">
              <Play className="h-4 w-4" /> Explore our services
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-12 flex items-center justify-center gap-x-8 gap-y-4 flex-wrap text-xs text-white/90"
          >
            <Trust label="Agricultural-grade drones" />
            <Divider />
            <Trust label="Operating across SA" />
            <Divider />
            <Trust label="Operator-led, data-backed" />
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 bottom-6 z-20 animate-bounce text-white/80">
        <ChevronDown className="h-5 w-5" />
      </div>
    </section>
  );
}

function Trust({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2 drop-shadow-[0_1px_3px_rgba(6,40,24,0.6)]">
      <span className="h-1.5 w-1.5 rounded-full bg-leaf-300 animate-pulse" />
      {label}
    </span>
  );
}
function Divider() {
  return <span className="hidden sm:block h-4 w-px bg-white/40" />;
}

/* ----------------------------------------------------------------
 * CabbageField — realistic cabbage patch rendered as tidy rows of
 * blue-green rosette heads sitting on dark soil. Each head is a
 * cluster of 3 overlapping ellipses (outer leaf, mid leaf, inner
 * highlight) with a faint shadow on the soil beneath it. Cabbages
 * are spaced on a 36×42 grid (rows running top→bottom) so they
 * look like an actual planted patch from above.
 * ---------------------------------------------------------------- */
function CabbageField({
  x,
  y,
  w,
  h,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
}) {
  const heads: { cx: number; cy: number; r: number }[] = [];
  const stepX = 36;
  const stepY = 42;
  const rowOffsets = [0, 6, 3, 9, 4];
  for (let cy = y + 24; cy < y + h - 8; cy += stepY) {
    const row = Math.floor((cy - y) / stepY);
    const offsetX = x + 14 + (rowOffsets[row % rowOffsets.length] ?? 0);
    for (let cx = offsetX; cx < x + w - 8; cx += stepX) {
      const r = 14 + ((cx * 7 + cy * 11) % 5);
      heads.push({ cx, cy, r });
    }
  }

  return (
    <g aria-hidden>
      <rect x={x} y={y} width={w} height={h} fill="#3d2914" />
      {Array.from({ length: Math.floor(h / 12) }).map((_, i) => (
        <line
          key={`cabb-furrow-${i}`}
          x1={x}
          y1={y + 12 + i * 12}
          x2={x + w}
          y2={y + 12 + i * 12}
          stroke="rgba(0,0,0,0.20)"
          strokeWidth="1"
        />
      ))}
      {heads.map((h_, i) => (
        <g key={`cab-${i}`} transform={`translate(${h_.cx} ${h_.cy})`}>
          <ellipse cx={2} cy={3} rx={h_.r * 1.05} ry={h_.r * 0.45} fill="url(#cabShadow)" />
          <ellipse cx={0} cy={0} rx={h_.r} ry={h_.r * 0.85} fill="#6c8f5a" />
          <ellipse cx={-1} cy={-1} rx={h_.r * 0.78} ry={h_.r * 0.68} fill="#84a76c" />
          <ellipse cx={-2} cy={-2} rx={h_.r * 0.5} ry={h_.r * 0.45} fill="#b8d39a" />
          <ellipse cx={0} cy={0} rx={h_.r * 0.92} ry={h_.r * 0.78} fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="0.7" />
        </g>
      ))}
      <rect x={x} y={y} width={w} height={3} fill="#241505" opacity="0.7" />
      <rect x={x} y={y + h - 3} width={w} height={3} fill="#241505" opacity="0.7" />
      <rect x={x} y={y} width={3} height={h} fill="#241505" opacity="0.7" />
      <rect x={x + w - 3} y={y} width={3} height={h} fill="#241505" opacity="0.7" />
    </g>
  );
}

/* ----------------------------------------------------------------
 * SeededBeds — young emerging seedlings: fine parallel stripes of
 * fresh light-green over dark soil. Reads as "newly planted rows"
 * from the air.
 * ---------------------------------------------------------------- */
function SeededBeds({
  x,
  y,
  w,
  h,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
}) {
  const rows: number[] = [];
  for (let ry = y + 8; ry < y + h - 4; ry += 9) rows.push(ry);
  return (
    <g aria-hidden>
      <rect x={x} y={y} width={w} height={h} fill="#3d2914" />
      {rows.map((ry, i) => (
        <line
          key={`seed-${i}`}
          x1={x + 4}
          y1={ry}
          x2={x + w - 4}
          y2={ry}
          stroke="#8fb86a"
          strokeWidth="1.6"
          opacity={0.55 + ((i % 3) * 0.1)}
        />
      ))}
      {Array.from({ length: Math.floor((w * h) / 220) }).map((_, i) => {
        const sx = x + 6 + ((i * 37) % (w - 12));
        const sy = y + 6 + ((i * 19) % (h - 12));
        return (
          <circle
            key={`sdot-${i}`}
            cx={sx}
            cy={sy}
            r="0.9"
            fill="#9bc26a"
            opacity="0.7"
          />
        );
      })}
      <rect x={x} y={y} width={w} height={3} fill="#241505" opacity="0.7" />
      <rect x={x} y={y + h - 3} width={w} height={3} fill="#241505" opacity="0.7" />
      <rect x={x} y={y} width={3} height={h} fill="#241505" opacity="0.7" />
      <rect x={x + w - 3} y={y} width={3} height={h} fill="#241505" opacity="0.7" />
    </g>
  );
}

/* ----------------------------------------------------------------
 * FarmlandScene — full-bleed aerial view of farmland built in SVG.
 * Layered: sky/horizon haze → crop fields → soil → vegetation.
 * The farmland fills the entire viewport edge-to-edge.
 * ---------------------------------------------------------------- */
function FarmlandScene() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Base: aerial farmland rendered as a large SVG with perspective */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1600 1000"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <defs>
          {/* Sky / horizon haze — lighter & dustier for realism */}
          <linearGradient id="haze" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d6dde0" />
            <stop offset="60%" stopColor="#c8d0c8" />
            <stop offset="100%" stopColor="#a8b6a2" stopOpacity="0" />
          </linearGradient>

          {/* Warm dark tilled soil — used for fallow patches & carrot beds base */}
          <linearGradient id="soil" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5a3e22" />
            <stop offset="100%" stopColor="#3d2914" />
          </linearGradient>

          {/* Soft shadow under each cabbage head (radial, on soil) */}
          <radialGradient id="cabShadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(0,0,0,0.35)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>

          {/* Carrot bed — alternating soil + canopy stripes (vertical oriented
              beds running top→bottom). One bed is ~26px wide. */}
          <pattern id="carrot-bed" width="26" height="100" patternUnits="userSpaceOnUse">
            <rect width="26" height="100" fill="#3d2914" />
            {/* raised bed ridge highlight */}
            <rect x="0" y="0" width="26" height="100" fill="#4a3220" />
            {/* feathery carrot tops — irregular small green blobs */}
            <ellipse cx="6"  cy="20" rx="4.5" ry="2.6" fill="#3e6a32" />
            <ellipse cx="13" cy="32" rx="4"   ry="2.4" fill="#4a7a3c" />
            <ellipse cx="20" cy="44" rx="4.6" ry="2.6" fill="#3a6530" />
            <ellipse cx="6"  cy="56" rx="4.4" ry="2.5" fill="#46763a" />
            <ellipse cx="14" cy="68" rx="4.2" ry="2.4" fill="#3e6a32" />
            <ellipse cx="20" cy="80" rx="4.5" ry="2.6" fill="#4a7a3c" />
            <ellipse cx="7"  cy="92" rx="4.3" ry="2.5" fill="#3a6530" />
            {/* subtle furrow shadow */}
            <rect x="0" y="0" width="26" height="100" fill="url(#carrot-furrow)" />
          </pattern>

          <linearGradient id="carrot-furrow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(0,0,0,0.25)" />
            <stop offset="50%" stopColor="rgba(0,0,0,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.25)" />
          </linearGradient>

          {/* Tilled-soil pattern — fine furrow stripes for fallow fields */}
          <pattern id="tilled" width="10" height="60" patternUnits="userSpaceOnUse">
            <rect width="10" height="60" fill="#3d2914" />
            <rect x="0" y="0" width="10" height="60" fill="#4a3220" />
            <line x1="3" y1="0" x2="3" y2="60" stroke="rgba(0,0,0,0.35)" strokeWidth="1" />
            <line x1="7" y1="0" x2="7" y2="60" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          </pattern>

          {/* Soft Gaussian blur for distant tree line */}
          <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
          <filter id="softer" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="14" />
          </filter>
        </defs>

        {/* ====== Sky ====== */}
        {/* Horizon haze */}
        <rect x="0" y="0" width="1600" height="220" fill="url(#haze)" />
        {/* Far-distant mountain/forest band (very soft) */}
        <g filter="url(#softer)" opacity="0.35">
          <ellipse cx="220"  cy="230" rx="260" ry="22" fill="#5a6e58" />
          <ellipse cx="640"  cy="238" rx="320" ry="20" fill="#52674f" />
          <ellipse cx="1100" cy="232" rx="380" ry="24" fill="#5a6e58" />
          <ellipse cx="1500" cy="240" rx="220" ry="18" fill="#52674f" />
        </g>
        {/* Distant tree line */}
        <g filter="url(#soft)" opacity="0.7">
          <ellipse cx="200"  cy="248" rx="220" ry="22" fill="#3f5a36" />
          <ellipse cx="520"  cy="252" rx="280" ry="20" fill="#4a6a3c" />
          <ellipse cx="900"  cy="250" rx="320" ry="24" fill="#3d5a31" />
          <ellipse cx="1280" cy="252" rx="240" ry="20" fill="#466a3a" />
          <ellipse cx="1500" cy="256" rx="180" ry="18" fill="#3e5a32" />
        </g>

        {/* ====== Earth base ====== */}
        {/* Whole canvas soil */}
        <rect x="0" y="240" width="1600" height="760" fill="#3d2914" />
        {/* Slight darker foreground fade */}
        <rect x="0" y="700" width="1600" height="300" fill="rgba(0,0,0,0.18)" />

        {/* ====== FIELDS (organized in a realistic patchwork) ====== */}

        {/* FIELD 1 — Carrot rows, top-left band */}
        <rect x="0" y="260" width="430" height="220" fill="url(#carrot-bed)" />
        {/* raised-bed highlight between groups every ~3 beds */}
        {[0, 78, 156, 234, 312].map((x, i) => (
          <rect key={`c1-edge-${i}`} x={x} y="260" width="3" height="220" fill="#2a1a08" opacity="0.55" />
        ))}
        {/* dirt border */}
        <rect x="0" y="260" width="430" height="3"   fill="#2a1a08" opacity="0.6" />
        <rect x="0" y="477" width="430" height="3"   fill="#2a1a08" opacity="0.6" />
        <rect x="0" y="260" width="3"   height="220" fill="#2a1a08" opacity="0.6" />

        {/* FIELD 2 — Cabbage patch, top-center (the star field — clearly visible heads) */}
        <CabbageField x={445} y={260} w={430} h={220} />

        {/* FIELD 3 — Tilled fallow soil, top-right */}
        <rect x="885" y="260" width="370" height="220" fill="url(#tilled)" />
        <rect x="885" y="260" width="370" height="3"   fill="#2a1a08" opacity="0.6" />
        <rect x="885" y="477" width="370" height="3"   fill="#2a1a08" opacity="0.6" />
        <rect x="885" y="260" width="3"   height="220" fill="#2a1a08" opacity="0.6" />
        <rect x="1252" y="260" width="3"  height="220" fill="#2a1a08" opacity="0.6" />

        {/* FIELD 4 — Young seedlings (fine grass-green stripes), far right top */}
        <SeededBeds x={1265} y={260} w={335} h={220} />

        {/* FIELD 5 — Carrot rows, mid-left (below FIELD 1) */}
        <rect x="0" y="490" width="320" height="200" fill="url(#carrot-bed)" />
        {[0, 78, 156, 234].map((x, i) => (
          <rect key={`c5-edge-${i}`} x={x} y="490" width="3" height="200" fill="#2a1a08" opacity="0.55" />
        ))}
        <rect x="0"  y="490" width="320" height="3"   fill="#2a1a08" opacity="0.6" />
        <rect x="0"  y="687" width="320" height="3"   fill="#2a1a08" opacity="0.6" />
        <rect x="0"  y="490" width="3"   height="200" fill="#2a1a08" opacity="0.6" />

        {/* FIELD 6 — Cabbage patch, mid-center (another clear cabbage plot) */}
        <CabbageField x={330} y={490} w={380} h={200} />

        {/* FIELD 7 — Carrot rows, mid-right */}
        <rect x="720" y="490" width="280" height="200" fill="url(#carrot-bed)" />
        {[0, 78, 156, 234].map((x, i) => (
          <rect key={`c7-edge-${i}`} x={720 + x} y="490" width="3" height="200" fill="#2a1a08" opacity="0.55" />
        ))}
        <rect x="720"  y="490" width="280" height="3"   fill="#2a1a08" opacity="0.6" />
        <rect x="720"  y="687" width="280" height="3"   fill="#2a1a08" opacity="0.6" />
        <rect x="720"  y="490" width="3"   height="200" fill="#2a1a08" opacity="0.6" />
        <rect x="997"  y="490" width="3"   height="200" fill="#2a1a08" opacity="0.6" />

        {/* FIELD 8 — Cabbage patch, mid-far-right */}
        <CabbageField x={1010} y={490} w={590} h={200} />

        {/* FIELD 9 — Carrot rows, bottom band */}
        <rect x="0" y="700" width="700" height="300" fill="url(#carrot-bed)" />
        {[0, 78, 156, 234, 312, 390, 468, 546, 624].map((x, i) => (
          <rect key={`c9-edge-${i}`} x={x} y="700" width="3" height="300" fill="#2a1a08" opacity="0.55" />
        ))}
        <rect x="0" y="700" width="700" height="3"   fill="#2a1a08" opacity="0.6" />
        <rect x="0" y="700" width="3"   height="300" fill="#2a1a08" opacity="0.6" />

        {/* FIELD 10 — Tilled fallow, bottom-right */}
        <rect x="710" y="700" width="450" height="300" fill="url(#tilled)" />
        <rect x="710" y="700" width="450" height="3"   fill="#2a1a08" opacity="0.6" />
        <rect x="710" y="997" width="450" height="3"   fill="#2a1a08" opacity="0.6" />
        <rect x="710" y="700" width="3"   height="300" fill="#2a1a08" opacity="0.6" />
        <rect x="1157" y="700" width="3"  height="300" fill="#2a1a08" opacity="0.6" />

        {/* FIELD 11 — Seedling stripes, bottom far-right */}
        <SeededBeds x={1170} y={700} w={430} h={300} />

        {/* ====== A few standalone trees along field edges ====== */}
        <g>
          {[
            [10,   475], [445, 252], [875, 252], [1260, 252],
            [10,   690], [715, 690], [10, 990], [705, 990], [1165, 990],
          ].map(([cx, cy], i) => (
            <g key={i} transform={`translate(${cx} ${cy})`} opacity="0.9">
              <ellipse cx="0"  cy="14" rx="22" ry="6" fill="rgba(0,0,0,0.4)" />
              <ellipse cx="0"  cy="0"  rx="18" ry="14" fill="#2a4a22" />
              <ellipse cx="-4" cy="-3" rx="12" ry="9"  fill="#3a5e2c" />
              <ellipse cx="6"  cy="-5" rx="9"  ry="6"  fill="#476a36" />
            </g>
          ))}
        </g>

        {/* Subtle dusty atmosphere — fades distant horizon into earth */}
        <rect x="0" y="200" width="1600" height="120" fill="url(#haze)" opacity="0.6" />

        {/* Soft cloud-shadow band, very subtle */}
        <g opacity="0.10" filter="url(#softer)">
          <ellipse cx="300"  cy="500" rx="340" ry="60" fill="#ffffff" />
          <ellipse cx="1100" cy="780" rx="380" ry="70" fill="#ffffff" />
        </g>
      </svg>

      {/* Atmospheric gradient overlay for depth */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.05) 25%, rgba(0,0,0,0.0) 50%, rgba(0,0,0,0.15) 80%, rgba(0,0,0,0.45) 100%)",
        }}
      />

      {/* Soft sky glow top */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-40"
        style={{
          background:
            "linear-gradient(180deg, rgba(207,228,216,0.55) 0%, rgba(207,228,216,0) 100%)",
        }}
      />

      {/* Subtle film grain */}
      <div className="pointer-events-none absolute inset-0 noise-bg opacity-40" />

      {/* ====== Center stage — one large hero drone hovering in the middle ====== */}
      <CenterDrone />
    </div>
  );
}

/* ----------------------------------------------------------------
 * CenterDrone — a single large agricultural drone centered in the
 * hero viewport with gentle hover micro-motion, slow yaw rotation,
 * and a soft ground shadow directly beneath it. Replaces the
 * previous multi-drone flying fleet with one focal aircraft.
 * ---------------------------------------------------------------- */
function CenterDrone() {
  const SIZE = 520; // big, focal-scale for the hero

  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      {/* Soft ground shadow — sits directly under the drone, pulses subtly */}
      <motion.div
        className="absolute left-1/2 top-[68%] -translate-x-1/2"
        aria-hidden
      >
        <motion.div
          initial={{ scaleX: 1, opacity: 0.45 }}
          animate={{ scaleX: [1, 0.92, 1], opacity: [0.45, 0.3, 0.45] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="h-6 rounded-full"
          style={{
            width: SIZE * 0.55,
            background:
              "radial-gradient(ellipse at center, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.0) 70%)",
            filter: "blur(8px)",
          }}
        />
      </motion.div>

      {/* The hero drone — centered, with hover + gentle yaw */}
      <motion.div
        className="absolute left-1/2 top-1/2"
        style={{ x: "-50%", y: "-50%" }}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        aria-hidden
      >
        <motion.div
          animate={{
            y: [0, -16, 0, -8, 0],
            rotate: [-2, 1.5, -1, 1.2, -2],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <DroneAircraft size={SIZE} />
        </motion.div>
      </motion.div>
    </div>
  );
}

/* Realistic agricultural quadcopter — sized and detailed for hero use */
function DroneAircraft({ size = 120 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size * 0.625}
      viewBox="0 0 320 200"
      fill="none"
      className="drop-shadow-[0_10px_18px_rgba(6,40,24,0.45)]"
    >
      <defs>
        <linearGradient id="bodyTop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f4f5f3" />
          <stop offset="100%" stopColor="#c9ccc5" />
        </linearGradient>
        <linearGradient id="bodyBottom" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3d36" />
          <stop offset="100%" stopColor="#1c1f19" />
        </linearGradient>
        <linearGradient id="arm" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2a2d27" />
          <stop offset="100%" stopColor="#14170f" />
        </linearGradient>
        <linearGradient id="tank" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1f8050" />
          <stop offset="100%" stopColor="#0a3f24" />
        </linearGradient>
        <linearGradient id="boom" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8a8d85" />
          <stop offset="100%" stopColor="#4a4d45" />
        </linearGradient>
        <radialGradient id="motor" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#5a5d55" />
          <stop offset="100%" stopColor="#1c1f19" />
        </radialGradient>
        <linearGradient id="prop" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(0,0,0,0)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.6)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </linearGradient>
      </defs>

      {/* Spray booms (long arms below body) */}
      <g>
        <rect x="20" y="92" width="120" height="6" rx="3" fill="url(#boom)" />
        <rect x="180" y="92" width="120" height="6" rx="3" fill="url(#boom)" />
        {[40, 60, 80, 100, 120, 200, 220, 240, 260, 280].map((x, i) => (
          <g key={i}>
            <rect x={x - 2} y="98" width="4" height="10" rx="1" fill="#2a2d27" />
            <circle cx={x} cy="112" r="1.5" fill="#1f8050" />
          </g>
        ))}
      </g>

      {/* Connecting arms from body to motors */}
      <g fill="url(#arm)">
        <rect x="40" y="74" width="60" height="8" rx="3" transform="rotate(-18 70 78)" />
        <rect x="220" y="74" width="60" height="8" rx="3" transform="rotate(18 250 78)" />
        <rect x="40" y="74" width="60" height="6" rx="3" transform="rotate(18 70 78)" opacity="0.5" />
        <rect x="220" y="74" width="60" height="6" rx="3" transform="rotate(-18 250 78)" opacity="0.5" />
      </g>

      {/* Motor housings at the four arm tips */}
      <g>
        {[
          { x: 36, y: 56 },
          { x: 284, y: 56 },
          { x: 36, y: 132 },
          { x: 284, y: 132 },
        ].map((p, i) => (
          <g key={i} transform={`translate(${p.x} ${p.y})`}>
            <circle r="16" fill="url(#motor)" stroke="#0a0c08" strokeWidth="1.5" />
            <circle r="6" fill="#1c1f19" />
            <circle r="2" fill="#5a5d55" />
          </g>
        ))}
      </g>

      {/* Spinning propellers — CSS-animated */}
      <g className="prop-spin-fast">
        {[
          { x: 36, y: 56 },
          { x: 284, y: 56 },
        ].map((p, i) => (
          <g key={`top-${i}`} transform={`translate(${p.x} ${p.y})`}>
            <ellipse rx="30" ry="3" fill="url(#prop)" />
            <ellipse rx="3" ry="30" fill="url(#prop)" />
          </g>
        ))}
      </g>
      <g className="prop-spin-slow">
        {[
          { x: 36, y: 132 },
          { x: 284, y: 132 },
        ].map((p, i) => (
          <g key={`bot-${i}`} transform={`translate(${p.x} ${p.y})`}>
            <ellipse rx="30" ry="3" fill="url(#prop)" />
            <ellipse rx="3" ry="30" fill="url(#prop)" />
          </g>
        ))}
      </g>

      {/* Main body — top fairing */}
      <g>
        <ellipse cx="160" cy="98" rx="58" ry="18" fill="url(#tank)" stroke="#062818" strokeWidth="1.5" />
        <ellipse cx="160" cy="92" rx="50" ry="10" fill="rgba(255,255,255,0.18)" />
        <path
          d="M 100 90 Q 160 70 220 90 L 220 100 Q 160 118 100 100 Z"
          fill="url(#bodyBottom)"
        />
        <path
          d="M 110 88 Q 160 60 210 88 Q 210 94 160 96 Q 110 94 110 88 Z"
          fill="url(#bodyTop)"
          stroke="#1c1f19"
          strokeWidth="1"
        />
        <rect x="148" y="100" width="24" height="12" rx="3" fill="#1c1f19" />
        <circle cx="160" cy="106" r="3" fill="#34d273" />
        <circle cx="160" cy="78" r="2.5" fill="#ff5a4a" className="led-blink" />
      </g>

      {/* Landing skids */}
      <g stroke="#2a2d27" strokeWidth="3" strokeLinecap="round" fill="none">
        <path d="M 130 116 L 130 132" />
        <path d="M 190 116 L 190 132" />
        <path d="M 120 132 L 200 132" />
      </g>
    </svg>
  );
}
