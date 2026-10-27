/**
 * Visual BMI gauge indicator.
 */
export default function BMIIndicator({ bmi }) {
  if (bmi == null) return null;
  const numBmi = typeof bmi === "number" ? bmi : parseFloat(bmi);
  if (isNaN(numBmi)) return null;

  const categories = [
    { label: "Underweight", range: "< 18.5", color: "bg-blue-400", textColor: "text-blue-700", min: 0, max: 18.5 },
    { label: "Normal",      range: "18.5 – 24.9", color: "bg-emerald-400", textColor: "text-emerald-700", min: 18.5, max: 25 },
    { label: "Overweight",  range: "25 – 29.9", color: "bg-amber-400", textColor: "text-amber-700", min: 25, max: 30 },
    { label: "Obese",       range: "≥ 30", color: "bg-red-400", textColor: "text-red-700", min: 30, max: 50 },
  ];

  const current = categories.find((c) => numBmi >= c.min && numBmi < c.max) || categories[categories.length - 1];

  // Marker position (0-100%)
  const clampedBmi = Math.min(Math.max(numBmi, 12), 48);
  const pct = ((clampedBmi - 12) / (48 - 12)) * 100;

  return (
    <div className="card" id="bmi-indicator">
      <h3 className="font-semibold text-slate-800 mb-1">Body Mass Index (BMI)</h3>
      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-3xl font-bold text-slate-900">{numBmi.toFixed(1)}</span>
        <span className={`text-sm font-semibold px-2.5 py-0.5 rounded-full ${current.color}/20 ${current.textColor}`}>
          {current.label}
        </span>
      </div>

      {/* Gauge bar */}
      <div className="relative h-3 rounded-full overflow-hidden flex">
        {categories.map((c) => (
          <div key={c.label} className={`${c.color} flex-1`} />
        ))}
      </div>

      {/* Marker */}
      <div className="relative h-4 mt-0.5">
        <div
          className="absolute -translate-x-1/2 transition-all duration-500"
          style={{ left: `${pct}%` }}
        >
          <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px] border-l-transparent border-r-transparent border-b-slate-800" />
        </div>
      </div>

      {/* Labels */}
      <div className="flex text-[10px] text-slate-500 mt-1">
        {categories.map((c) => (
          <div key={c.label} className="flex-1 text-center">
            <span className="block font-medium">{c.label}</span>
            <span>{c.range}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
