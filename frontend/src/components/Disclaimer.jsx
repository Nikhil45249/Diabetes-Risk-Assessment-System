import { AlertTriangle } from "lucide-react";

export default function Disclaimer({ className = "" }) {
  return (
    <div
      className={`rounded-xl border border-amber-200 bg-amber-50 p-4 ${className}`}
      id="disclaimer-banner"
      role="alert"
    >
      <div className="flex gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="text-sm font-semibold text-amber-800">Medical Disclaimer</h4>
          <p className="mt-1 text-sm text-amber-700 leading-relaxed">
            This tool is an <strong>educational project</strong> that uses a
            machine-learning model trained on <strong>synthetic data</strong>.
            Results are estimates only and do <strong>not</strong> constitute a
            medical diagnosis. Please consult a qualified healthcare professional
            for clinical advice.
          </p>
        </div>
      </div>
    </div>
  );
}
