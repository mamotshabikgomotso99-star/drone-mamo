import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="border-b border-leaf-700/10 bg-white/80 backdrop-blur-md py-4 sticky top-0 z-30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex">
            <Logo variant="compact" />
          </Link>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-12 relative">
        <div className="absolute inset-0 -z-10 grid-bg opacity-40" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_-20%,rgba(31,128,80,0.12),transparent_60%)]" />
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>
      <footer className="py-6 text-center text-xs text-fg-muted border-t border-leaf-700/10">
        © {new Date().getFullYear()} KM Drone Services
      </footer>
    </div>
  );
}