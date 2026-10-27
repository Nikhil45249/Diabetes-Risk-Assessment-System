import { Loader2 } from "lucide-react";

export default function LoadingSpinner({ message = "Processing…" }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 animate-fade-in" id="loading-spinner">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-primary-400/20 blur-xl animate-pulse-slow" />
        <Loader2 className="h-12 w-12 text-primary-600 animate-spin relative" />
      </div>
      <p className="text-slate-500 font-medium">{message}</p>
    </div>
  );
}
