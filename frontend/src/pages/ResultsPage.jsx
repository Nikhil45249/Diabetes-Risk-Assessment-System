import { useLocation, Link, Navigate } from "react-router-dom";
import { ClipboardList, RotateCcw } from "lucide-react";
import RiskResultCard from "../components/RiskResultCard";
import BMIIndicator from "../components/BMIIndicator";
import RecommendationList from "../components/RecommendationList";
import Disclaimer from "../components/Disclaimer";

export default function ResultsPage() {
  const location = useLocation();
  const { result, formData } = location.state || {};

  // Guard: redirect if no data
  if (!result || !result.prediction) {
    return <Navigate to="/assessment" replace />;
  }

  const { prediction, disclaimer } = result;
  const { risk_level, bmi, probability } = prediction;

  // Build summary items from the submitted form data
  const summaryItems = formData
    ? [
        { label: "Age", value: `${formData.age} years` },
        { label: "Gender", value: formData.gender },
        { label: "Height", value: `${formData.height_cm} cm` },
        { label: "Weight", value: `${formData.weight_kg} kg` },
        { label: "Family History", value: formData.family_history ? "Yes" : "No" },
        { label: "Physical Activity", value: formData.physical_activity },
        { label: "Smoking", value: formData.smoking ? "Yes" : "No" },
        { label: "Alcohol", value: formData.alcohol ? "Yes" : "No" },
        { label: "Healthy Diet", value: formData.healthy_diet ? "Yes" : "No" },
        { label: "Frequent Thirst", value: formData.frequent_thirst ? "Yes" : "No" },
        { label: "Frequent Urination", value: formData.frequent_urination ? "Yes" : "No" },
        { label: "Fatigue", value: formData.fatigue ? "Yes" : "No" },
        { label: "Blurred Vision", value: formData.blurred_vision ? "Yes" : "No" },
        { label: "Slow Wound Healing", value: formData.slow_wound_healing ? "Yes" : "No" },
      ]
    : [];

  return (
    <div className="animate-fade-in py-10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center">
          <h1 className="section-title">Your Assessment Results</h1>
          <p className="section-subtitle mt-2">
            Based on the information you provided, here is your estimated risk level.
          </p>
        </div>

        {/* Risk result */}
        <RiskResultCard riskLevel={risk_level} probability={probability} />

        {/* BMI */}
        <BMIIndicator bmi={bmi} />

        {/* Recommendations */}
        <RecommendationList riskLevel={risk_level} />

        {/* Submitted data summary */}
        {summaryItems.length > 0 && (
          <div className="card" id="submitted-data-summary">
            <div className="flex items-center gap-2 mb-4">
              <ClipboardList className="h-5 w-5 text-primary-600" />
              <h3 className="font-semibold text-slate-800">Submitted Information</h3>
            </div>
            <div className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
              {summaryItems.map((item) => (
                <div key={item.label} className="flex justify-between py-1.5 border-b border-slate-100 last:border-0">
                  <span className="text-sm text-slate-500">{item.label}</span>
                  <span className="text-sm font-medium text-slate-800">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <Disclaimer />
        {disclaimer && (
          <p className="text-center text-xs text-slate-400 italic">{disclaimer}</p>
        )}

        {/* Action */}
        <div className="flex justify-center pt-2">
          <Link to="/assessment" className="btn-primary" id="new-assessment-btn">
            <RotateCcw className="h-4 w-4" /> New Assessment
          </Link>
        </div>
      </div>
    </div>
  );
}
