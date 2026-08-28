import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-ink">
      <div className="text-center">
        <Loader2 className="h-8 w-8 text-leaf-400 animate-spin mx-auto" />
        <div className="mt-3 text-sm text-fg-muted">Loading…</div>
      </div>
    </div>
  );
}