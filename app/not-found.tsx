import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-ink">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.08),transparent_60%)] pointer-events-none" />
      <div className="relative">
        <div className="text-[7rem] sm:text-[9rem] font-bold leading-none text-gradient tracking-tighter">
          404
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-white mt-4">
          This page is off the flight path.
        </h1>
        <p className="mt-2 text-fg-muted max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Button href="/">Back to home</Button>
          <Button href="/services" variant="secondary">Browse services</Button>
          <Button href="/contact" variant="ghost">Contact support</Button>
        </div>
        <div className="mt-12">
          <Link href="/" className="text-xs text-fg-muted hover:text-white">
            ← Return to KM Drone Services
          </Link>
        </div>
      </div>
    </div>
  );
}