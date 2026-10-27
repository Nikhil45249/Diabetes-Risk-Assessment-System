import { ShieldCheck, ShieldAlert, ShieldX } from "lucide-react";

const riskConfig = {
  Low: {
    icon: ShieldCheck,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    ring: "ring-emerald-400/30",
    gradient: "from-emerald-500 to-teal-500",
    label: "Low Risk",
  },
  Moderate: {
    icon: ShieldAlert,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    ring: "ring-amber-400/30",
    gradient: "from-amber-500 to-orange-500",
    label: "Moderate Risk",
  },
  High: {
    icon: ShieldX,
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    ring: "ring-red-400/30",
    gradient: "from-red-500 to-rose-600",
    label: "High Risk",
  },
};

export default function RiskResultCard({ riskLevel, probability }) {
  const config = riskConfig[riskLevel] || riskConfig.Moderate;
  const Icon = config.icon;

  return (
    <div
      className={`card border-2 ${config.border} ${config.bg} ring-4 ${config.ring} text-center animate-slide-up`}
      id="risk-result-card"
    >
      <div className="flex flex-col items-center gap-3">
        {/* Icon circle */}
        <div className={`flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${config.gradient} shadow-lg`}>
          <Icon className="h-10 w-10 text-white" />
        </div>

        <h2 className="text-2xl font-bold text-slate-900">Predicted Risk Level</h2>
        <span className={`text-3xl font-extrabold ${config.color}`}>{config.label}</span>

        {/* Probability breakdown */}
        {probability && (
          <div className="mt-3 w-full max-w-xs">
            <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wider">Probability Breakdown</p>
            {Object.entries(probability).map(([label, prob]) => {
              const numProb = typeof prob === "number" ? prob : parseFloat(prob) || 0;
              const pct = (numProb * 100).toFixed(1);
              const barColor =
                label === "Low" ? "bg-emerald-500" : label === "Moderate" ? "bg-amber-500" : "bg-red-500";
              return (
                <div key={label} className="mb-2">
                  <div className="flex justify-between text-xs mb-0.5">
                    <span className="font-medium text-slate-700">{label}</span>
                    <span className="text-slate-500">{pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${barColor} transition-all duration-700`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
