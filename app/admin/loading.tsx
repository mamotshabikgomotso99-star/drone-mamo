import { Loader2 } from "lucide-react";

export default function AdminLoading() {
  return (
    <div className="px-4 sm:px-6 lg:px-10 py-8 sm:py-12">
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 text-leaf-400 animate-spin" />
      </div>
    </div>
  );
}