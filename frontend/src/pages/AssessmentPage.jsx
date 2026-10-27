import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  HeartPulse,
  Stethoscope,
  RotateCcw,
  Send,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import FormSection from "../components/FormSection";
import Disclaimer from "../components/Disclaimer";
import LoadingSpinner from "../components/LoadingSpinner";
import { submitAssessment } from "../services/assessmentApi";

// ---------------------------------------------------------------------------
// Initial form state
// ---------------------------------------------------------------------------
const INITIAL = {
  age: "",
  gender: "",
  height_cm: "",
  weight_kg: "",
  family_history: "",
  physical_activity: "",
  smoking: "",
  alcohol: "",
  healthy_diet: "",
  frequent_thirst: "",
  frequent_urination: "",
  fatigue: "",
  blurred_vision: "",
  slow_wound_healing: "",
};

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------
function validate(form) {
  const errors = {};

  if (!form.age || form.age < 1 || form.age > 120) errors.age = "Enter a valid age (1–120).";
  if (!form.gender) errors.gender = "Select your gender.";
  if (!form.height_cm || form.height_cm < 50 || form.height_cm > 300) errors.height_cm = "Enter valid height (50–300 cm).";
  if (!form.weight_kg || form.weight_kg < 10 || form.weight_kg > 400) errors.weight_kg = "Enter valid weight (10–400 kg).";
  if (form.family_history === "") errors.family_history = "Required.";
  if (!form.physical_activity) errors.physical_activity = "Required.";
  if (form.smoking === "") errors.smoking = "Required.";
  if (form.alcohol === "") errors.alcohol = "Required.";
  if (form.healthy_diet === "") errors.healthy_diet = "Required.";
  if (form.frequent_thirst === "") errors.frequent_thirst = "Required.";
  if (form.frequent_urination === "") errors.frequent_urination = "Required.";
  if (form.fatigue === "") errors.fatigue = "Required.";
  if (form.blurred_vision === "") errors.blurred_vision = "Required.";
  if (form.slow_wound_healing === "") errors.slow_wound_healing = "Required.";

  return errors;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function AssessmentPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const set = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setApiError("");
  };

  const handleBoolChange = (field, val) => set(field, val === "true");

  // Calculate live BMI preview
  const bmiPreview =
    form.height_cm > 0 && form.weight_kg > 0
      ? (form.weight_kg / Math.pow(form.height_cm / 100, 2)).toFixed(1)
      : null;

  // Compute completion percentage
  const totalFields = Object.keys(INITIAL).length;
  const filledFields = Object.values(form).filter((v) => v !== "" && v !== null && v !== undefined).length;
  const progress = Math.round((filledFields / totalFields) * 100);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      const friendlyLabels = {
        age: "Age",
        gender: "Gender",
        height_cm: "Height",
        weight_kg: "Weight",
        family_history: "Family History",
        physical_activity: "Physical Activity",
        smoking: "Smoking",
        alcohol: "Alcohol",
        healthy_diet: "Healthy Diet",
        frequent_thirst: "Frequent Thirst",
        frequent_urination: "Frequent Urination",
        fatigue: "Fatigue",
        blurred_vision: "Blurred Vision",
        slow_wound_healing: "Slow Wound Healing",
      };
      const missing = Object.keys(errs)
        .map((k) => friendlyLabels[k] || k)
        .join(", ");
      setApiError(`Please complete all required fields before submitting: ${missing}`);
      return;
    }

    setLoading(true);
    setApiError("");

    try {
      const payload = {
        age: Math.round(Number(form.age)),
        gender: form.gender,
        height_cm: Number(form.height_cm),
        weight_kg: Number(form.weight_kg),
        family_history: Boolean(form.family_history),
        physical_activity: form.physical_activity,
        smoking: Boolean(form.smoking),
        alcohol: Boolean(form.alcohol),
        healthy_diet: Boolean(form.healthy_diet),
        frequent_thirst: Boolean(form.frequent_thirst),
        frequent_urination: Boolean(form.frequent_urination),
        fatigue: Boolean(form.fatigue),
        blurred_vision: Boolean(form.blurred_vision),
        slow_wound_healing: Boolean(form.slow_wound_healing),
      };

      const result = await submitAssessment(payload);

      // Navigate to results with data
      navigate("/results", { state: { result, formData: payload } });
    } catch (err) {
      const details = err.response?.data?.error?.details;
      let msg =
        (Array.isArray(details) && details.length > 0
          ? `Validation failed: ${details.join("; ")}`
          : null) ||
        err.response?.data?.error?.message ||
        "Unable to reach the server. Please make sure the backend is running.";

      if (typeof msg !== "string") {
        try {
          msg = JSON.stringify(msg);
        } catch {
          msg = "An error occurred while processing your request.";
        }
      }
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  const fillSampleData = (type = "moderate") => {
    setErrors({});
    setApiError("");
    if (type === "low") {
      setForm({
        age: "24",
        gender: "Female",
        height_cm: "165",
        weight_kg: "58",
        family_history: false,
        physical_activity: "High",
        smoking: false,
        alcohol: false,
        healthy_diet: true,
        frequent_thirst: false,
        frequent_urination: false,
        fatigue: false,
        blurred_vision: false,
        slow_wound_healing: false,
      });
    } else {
      setForm({
        age: "52",
        gender: "Male",
        height_cm: "172",
        weight_kg: "88",
        family_history: true,
        physical_activity: "Low",
        smoking: true,
        alcohol: true,
        healthy_diet: false,
        frequent_thirst: true,
        frequent_urination: true,
        fatigue: true,
        blurred_vision: false,
        slow_wound_healing: false,
      });
    }
  };

  const handleReset = () => {
    setForm(INITIAL);
    setErrors({});
    setApiError("");
  };

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------
  const RadioGroup = ({ field, label }) => (
    <div>
      <label className="label">{label}</label>
      <div className="flex gap-4">
        {[
          { value: "true", label: "Yes" },
          { value: "false", label: "No" },
        ].map((opt) => (
          <label
            key={opt.value}
            className={`flex-1 cursor-pointer rounded-xl border-2 py-2.5 text-center text-sm font-medium transition-all ${
              String(form[field]) === opt.value
                ? "border-primary-500 bg-primary-50 text-primary-700"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
            }`}
          >
            <input
              type="radio"
              className="sr-only"
              name={field}
              value={opt.value}
              checked={String(form[field]) === opt.value}
              onChange={(e) => handleBoolChange(field, e.target.value)}
            />
            {opt.label}
          </label>
        ))}
      </div>
      {errors[field] && <p className="text-xs text-red-500 mt-1">{errors[field]}</p>}
    </div>
  );

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <LoadingSpinner message="Analysing your responses…" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="bg-gradient-to-b from-primary-50 to-slate-50 py-10">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="section-title text-center">Diabetes Risk Assessment</h1>
          <p className="section-subtitle text-center mt-2">
            Complete the questionnaire below to receive your estimated risk level.
          </p>

          {/* Progress bar */}
          <div className="mt-6 mb-2">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary-500 to-blue-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Quick Demo Fill Buttons */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Quick Demo Profiles:</span>
            <button
              type="button"
              onClick={() => fillSampleData("moderate")}
              className="rounded-lg bg-primary-100 hover:bg-primary-200 text-primary-800 font-medium px-2.5 py-1 transition-colors flex items-center gap-1 shadow-sm"
              id="fill-demo-high-btn"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary-600" /> High/Moderate Risk
            </button>
            <button
              type="button"
              onClick={() => fillSampleData("low")}
              className="rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-medium px-2.5 py-1 transition-colors flex items-center gap-1 shadow-sm"
              id="fill-demo-low-btn"
            >
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" /> Low Risk
            </button>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pb-16 -mt-2 space-y-5"
        id="assessment-form"
      >
        {/* Top Validation / API Error Banner */}
        {apiError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 flex items-start gap-2 animate-fade-in" id="top-api-error">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold">Notice:</strong> {apiError}
            </div>
          </div>
        )}
        {/* ---------------------------------------------------------------- */}
        {/* Section 1: Personal Information                                  */}
        {/* ---------------------------------------------------------------- */}
        <FormSection number={1} title="Personal Information" subtitle="Demographics & body metrics" icon={User}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="age">Age</label>
              <input
                id="age"
                type="number"
                className="input-field"
                placeholder="e.g. 35"
                value={form.age}
                onChange={(e) => set("age", e.target.value)}
                min={1}
                max={120}
              />
              {errors.age && <p className="text-xs text-red-500 mt-1">{errors.age}</p>}
            </div>

            <div>
              <label className="label" htmlFor="gender">Gender</label>
              <select
                id="gender"
                className="select-field"
                value={form.gender}
                onChange={(e) => set("gender", e.target.value)}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              {errors.gender && <p className="text-xs text-red-500 mt-1">{errors.gender}</p>}
            </div>

            <div>
              <label className="label" htmlFor="height">Height (cm)</label>
              <input
                id="height"
                type="number"
                className="input-field"
                placeholder="e.g. 165"
                value={form.height_cm}
                onChange={(e) => set("height_cm", e.target.value)}
                min={50}
                max={300}
              />
              {errors.height_cm && <p className="text-xs text-red-500 mt-1">{errors.height_cm}</p>}
            </div>

            <div>
              <label className="label" htmlFor="weight">Weight (kg)</label>
              <input
                id="weight"
                type="number"
                className="input-field"
                placeholder="e.g. 70"
                value={form.weight_kg}
                onChange={(e) => set("weight_kg", e.target.value)}
                min={10}
                max={400}
              />
              {errors.weight_kg && <p className="text-xs text-red-500 mt-1">{errors.weight_kg}</p>}
            </div>
          </div>

          {/* Live BMI preview */}
          {bmiPreview && (
            <div className="mt-4 rounded-lg bg-primary-50 border border-primary-100 px-4 py-2.5 text-sm">
              <span className="text-slate-600">Your BMI: </span>
              <span className="font-bold text-primary-700">{bmiPreview}</span>
            </div>
          )}
        </FormSection>

        {/* ---------------------------------------------------------------- */}
        {/* Section 2: Family History & Lifestyle                            */}
        {/* ---------------------------------------------------------------- */}
        <FormSection number={2} title="Family History & Lifestyle" subtitle="Risk factors related to daily habits" icon={HeartPulse}>
          <div className="space-y-4">
            <RadioGroup field="family_history" label="Do you have a family history of diabetes?" />

            <div>
              <label className="label" htmlFor="activity">Physical Activity Level</label>
              <select
                id="activity"
                className="select-field"
                value={form.physical_activity}
                onChange={(e) => set("physical_activity", e.target.value)}
              >
                <option value="">Select level</option>
                <option value="Low">Low (little or no exercise)</option>
                <option value="Medium">Medium (moderate exercise)</option>
                <option value="High">High (regular vigorous exercise)</option>
              </select>
              {errors.physical_activity && <p className="text-xs text-red-500 mt-1">{errors.physical_activity}</p>}
            </div>

            <RadioGroup field="smoking" label="Do you smoke?" />
            <RadioGroup field="alcohol" label="Do you consume alcohol?" />
            <RadioGroup field="healthy_diet" label="Do you follow a generally healthy diet?" />
          </div>
        </FormSection>

        {/* ---------------------------------------------------------------- */}
        {/* Section 3: Symptoms                                              */}
        {/* ---------------------------------------------------------------- */}
        <FormSection number={3} title="Symptom Checklist" subtitle="Self-reported symptoms" icon={Stethoscope}>
          <div className="space-y-4">
            <RadioGroup field="frequent_thirst" label="Do you experience frequent or excessive thirst?" />
            <RadioGroup field="frequent_urination" label="Do you experience frequent urination?" />
            <RadioGroup field="fatigue" label="Do you often feel unusually fatigued?" />
            <RadioGroup field="blurred_vision" label="Do you have episodes of blurred vision?" />
            <RadioGroup field="slow_wound_healing" label="Do your wounds heal slowly?" />
          </div>
        </FormSection>

        {/* ---------------------------------------------------------------- */}
        {/* API Error                                                        */}
        {/* ---------------------------------------------------------------- */}
        {apiError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700" id="api-error">
            <strong>Error:</strong> {apiError}
          </div>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* Actions                                                          */}
        {/* ---------------------------------------------------------------- */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button type="submit" className="btn-primary flex-1" id="submit-btn">
            <Send className="h-4 w-4" /> Submit Assessment
          </button>
          <button type="button" onClick={handleReset} className="btn-secondary sm:w-auto" id="reset-btn">
            <RotateCcw className="h-4 w-4" /> Reset
          </button>
        </div>

        <Disclaimer className="mt-4" />
      </form>
    </div>
  );
}
