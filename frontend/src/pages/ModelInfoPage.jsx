import { useState, useEffect } from "react";
import { getModelInfo } from "../services/assessmentApi";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { Brain, Database, AlertCircle, BarChart3 } from "lucide-react";

const ALGORITHMS = [
  {
    name: "Logistic Regression",
    desc: "A linear model that estimates probabilities using a logistic function. Works well when the decision boundary is approximately linear.",
  },
  {
    name: "Decision Tree",
    desc: "Builds a tree of if/then rules. Easy to interpret but may overfit without depth limits.",
  },
  {
    name: "Random Forest",
    desc: "An ensemble of many decision trees that vote on the final prediction. Reduces overfitting and generally improves accuracy.",
  },
  {
    name: "Support Vector Machine (SVM)",
    desc: "Finds the optimal hyperplane that maximises the margin between classes. Effective in high-dimensional spaces.",
  },
  {
    name: "K-Nearest Neighbors (KNN)",
    desc: "Classifies a sample based on the majority label among its k closest neighbours in feature space.",
  },
];

export default function ModelInfoPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetch() {
      try {
        const res = await getModelInfo();
        setData(res.data);
      } catch {
        setError("Unable to fetch model information. Make sure all services are running.");
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  if (loading) return <LoadingSpinner message="Loading model information…" />;

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
        <p className="text-red-600 font-medium">{error}</p>
      </div>
    );
  }

  const evaluationResults = data?.evaluation_results || {};
  const bestModel = data?.best_model || "N/A";

  // Prepare comparison chart data
  const comparisonData = Object.entries(evaluationResults).map(([name, metrics]) => ({
    name: name.length > 12 ? name.slice(0, 12) + "…" : name,
    fullName: name,
    Accuracy: +(metrics.accuracy * 100).toFixed(1),
    Precision: +(metrics.precision * 100).toFixed(1),
    Recall: +(metrics.recall * 100).toFixed(1),
    F1: +(metrics.f1_score * 100).toFixed(1),
  }));

  // Radar data for the best model
  const bestMetrics = evaluationResults[bestModel];
  const radarData = bestMetrics
    ? [
        { metric: "Accuracy", value: +(bestMetrics.accuracy * 100).toFixed(1) },
        { metric: "Precision", value: +(bestMetrics.precision * 100).toFixed(1) },
        { metric: "Recall", value: +(bestMetrics.recall * 100).toFixed(1) },
        { metric: "F1 Score", value: +(bestMetrics.f1_score * 100).toFixed(1) },
      ]
    : [];

  return (
    <div className="animate-fade-in py-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center">
          <h1 className="section-title">Model Information</h1>
          <p className="section-subtitle mt-2">
            Technical details about the machine learning models used in this system.
          </p>
        </div>

        {/* ---- Algorithms ---- */}
        <section id="algorithms-section">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="h-5 w-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-slate-900">Algorithms Used</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ALGORITHMS.map((a) => (
              <div
                key={a.name}
                className={`card ${a.name === bestModel ? "border-2 border-primary-400 ring-2 ring-primary-200" : ""}`}
              >
                {a.name === bestModel && (
                  <span className="inline-block mb-2 text-[10px] font-bold text-primary-700 bg-primary-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Selected Model
                  </span>
                )}
                <h3 className="font-semibold text-slate-800 text-sm">{a.name}</h3>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ---- Dataset ---- */}
        <section id="dataset-section">
          <div className="flex items-center gap-2 mb-4">
            <Database className="h-5 w-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-slate-900">Dataset Information</h2>
          </div>
          <div className="card">
            <div className="grid gap-4 sm:grid-cols-3 text-sm">
              <div>
                <p className="text-slate-500">Type</p>
                <p className="font-semibold text-slate-800 capitalize">{data?.dataset?.type || "N/A"}</p>
              </div>
              <div>
                <p className="text-slate-500">Total Samples</p>
                <p className="font-semibold text-slate-800">{data?.dataset?.samples?.toLocaleString() || "N/A"}</p>
              </div>
              <div>
                <p className="text-slate-500">Train / Test Split</p>
                <p className="font-semibold text-slate-800">
                  {data?.dataset?.train_size || "—"} / {data?.dataset?.test_size || "—"}
                </p>
              </div>
            </div>
            {data?.dataset?.note && (
              <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-700">
                ⚠️ {data.dataset.note}
              </div>
            )}
          </div>
        </section>

        {/* ---- Comparison Chart ---- */}
        {comparisonData.length > 0 && (
          <section id="comparison-chart">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-5 w-5 text-primary-600" />
              <h2 className="text-lg font-semibold text-slate-900">Model Comparison</h2>
            </div>
            <div className="card">
              <p className="text-xs text-slate-500 mb-4">Performance on the synthetic test set (%). Higher is better.</p>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={comparisonData} barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }}
                    formatter={(value) => `${value}%`}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="Accuracy" fill="#0d9488" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Precision" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Recall" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="F1" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        )}

        {/* ---- Radar Chart for best model ---- */}
        {radarData.length > 0 && (
          <section id="radar-chart">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Best Model Performance — <span className="text-primary-600">{bestModel}</span>
            </h2>
            <div className="card">
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                  <PolarGrid stroke="#cbd5e1" />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Radar
                    name={bestModel}
                    dataKey="value"
                    stroke="#0d9488"
                    fill="#0d9488"
                    fillOpacity={0.25}
                    strokeWidth={2}
                  />
                  <Tooltip formatter={(v) => `${v}%`} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </section>
        )}

        {/* ---- Detailed Metrics Table ---- */}
        {Object.keys(evaluationResults).length > 0 && (
          <section id="metrics-table">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Detailed Metrics</h2>
            <div className="card overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-2 pr-4 font-semibold text-slate-700">Model</th>
                    <th className="text-right py-2 px-3 font-semibold text-slate-700">Accuracy</th>
                    <th className="text-right py-2 px-3 font-semibold text-slate-700">Precision</th>
                    <th className="text-right py-2 px-3 font-semibold text-slate-700">Recall</th>
                    <th className="text-right py-2 px-3 font-semibold text-slate-700">F1 Score</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(evaluationResults).map(([name, m]) => (
                    <tr
                      key={name}
                      className={`border-b border-slate-100 ${name === bestModel ? "bg-primary-50" : ""}`}
                    >
                      <td className="py-2 pr-4 font-medium text-slate-800">
                        {name} {name === bestModel && <span className="text-xs text-primary-600">★</span>}
                      </td>
                      <td className="text-right py-2 px-3 text-slate-600">{(m.accuracy * 100).toFixed(1)}%</td>
                      <td className="text-right py-2 px-3 text-slate-600">{(m.precision * 100).toFixed(1)}%</td>
                      <td className="text-right py-2 px-3 text-slate-600">{(m.recall * 100).toFixed(1)}%</td>
                      <td className="text-right py-2 px-3 text-slate-600">{(m.f1_score * 100).toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ---- Limitations ---- */}
        <section id="limitations-section">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Limitations</h2>
          <div className="card">
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex gap-2">
                <span className="text-red-400 font-bold">•</span>
                The model is trained on <strong>synthetic data</strong> and is not clinically validated.
              </li>
              <li className="flex gap-2">
                <span className="text-red-400 font-bold">•</span>
                No laboratory test results (blood glucose, HbA1c) are used — predictions rely solely on self-reported data.
              </li>
              <li className="flex gap-2">
                <span className="text-red-400 font-bold">•</span>
                Risk categories are derived from a weighted scoring model, not from medical guidelines.
              </li>
              <li className="flex gap-2">
                <span className="text-red-400 font-bold">•</span>
                This is an <strong>educational project</strong> designed for learning ML concepts.
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
