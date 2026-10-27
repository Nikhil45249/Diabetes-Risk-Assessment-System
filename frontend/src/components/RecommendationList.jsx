import { CheckCircle2 } from "lucide-react";

const generalRecommendations = {
  Low: [
    "Continue maintaining a healthy lifestyle with regular exercise.",
    "Keep a balanced diet rich in whole grains, fruits, and vegetables.",
    "Monitor your weight and BMI periodically.",
    "Schedule routine health check-ups annually.",
    "Stay hydrated and manage stress effectively.",
  ],
  Moderate: [
    "Consider consulting a healthcare professional for a comprehensive screening.",
    "Increase physical activity — aim for at least 150 minutes per week.",
    "Review your diet and reduce processed sugar and refined carbohydrates.",
    "Monitor blood sugar levels if advised by a doctor.",
    "Maintain a healthy weight — even modest loss can reduce risk.",
    "Limit alcohol consumption and avoid smoking.",
  ],
  High: [
    "Please consult a healthcare professional as soon as possible for proper evaluation.",
    "Request a fasting blood glucose or HbA1c test from your doctor.",
    "Adopt a structured meal plan focusing on low-glycaemic-index foods.",
    "Engage in regular physical activity approved by your healthcare provider.",
    "Monitor and manage blood pressure and cholesterol.",
    "Quit smoking and limit alcohol intake.",
    "Consider joining a diabetes prevention programme if available.",
  ],
};

export default function RecommendationList({ riskLevel }) {
  const items = generalRecommendations[riskLevel] || generalRecommendations.Moderate;

  return (
    <div className="card" id="recommendations-list">
      <h3 className="font-semibold text-slate-800 mb-4">General Health Recommendations</h3>
      <ul className="space-y-3">
        {items.map((item, idx) => (
          <li key={idx} className="flex gap-3">
            <CheckCircle2 className="h-5 w-5 text-primary-500 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-slate-600 leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
