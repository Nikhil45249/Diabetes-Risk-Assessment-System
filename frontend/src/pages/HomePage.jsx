import { Link } from "react-router-dom";
import {
  Activity,
  ClipboardList,
  Cpu,
  BarChart3,
  ShieldCheck,
  ArrowRight,
  Stethoscope,
  Brain,
  HeartPulse,
} from "lucide-react";
import Disclaimer from "../components/Disclaimer";

const steps = [
  {
    icon: ClipboardList,
    title: "Complete Questionnaire",
    desc: "Answer questions about your demographics, lifestyle, family history, and symptoms.",
  },
  {
    icon: Cpu,
    title: "AI Analysis",
    desc: "Our machine-learning model analyses your responses using trained algorithms.",
  },
  {
    icon: BarChart3,
    title: "View Results",
    desc: "Receive your risk estimate, BMI, and personalised health recommendations.",
  },
];

const features = [
  {
    icon: Brain,
    title: "ML-Powered Predictions",
    desc: "Trained on multiple algorithms including Random Forest, SVM, and Logistic Regression.",
  },
  {
    icon: ShieldCheck,
    title: "No Lab Tests Needed",
    desc: "Uses lifestyle factors and self-reported symptoms — no blood work required.",
  },
  {
    icon: HeartPulse,
    title: "Health Recommendations",
    desc: "Get personalised suggestions based on your estimated risk level.",
  },
  {
    icon: Stethoscope,
    title: "Educational Tool",
    desc: "Designed for learning — clearly distinguishes estimates from clinical diagnoses.",
  },
];

export default function HomePage() {
  return (
    <div className="animate-fade-in">
      {/* ============================================================ */}
      {/* Hero                                                         */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-blue-800" id="hero">
        {/* Decorative blobs */}
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary-400/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-primary-100 backdrop-blur-sm mb-6">
              <Activity className="h-4 w-4" />
              College Mini Project — Machine Learning
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-tight">
              Diabetes Risk{" "}
              <span className="text-primary-200">Assessment</span>{" "}
              System
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-primary-100/90 max-w-lg">
              Estimate your diabetes risk using machine learning — no lab tests required.
              Answer a simple questionnaire about your lifestyle, family history, and symptoms.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/assessment" className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 font-semibold text-primary-700 shadow-xl shadow-black/10 transition-all hover:bg-primary-50 hover:shadow-2xl active:scale-[0.98]" id="hero-cta">
                Start Assessment <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/about" className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 px-7 py-3.5 font-semibold text-white transition-all hover:bg-white/10" id="hero-learn-more">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* How It Works                                                 */}
      {/* ============================================================ */}
      <section className="py-20 bg-slate-50" id="how-it-works">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle mt-2">Three simple steps to assess your risk</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((s, i) => (
              <div key={i} className="card text-center group">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-lg shadow-primary-600/25 transition-transform group-hover:scale-110">
                  <s.icon className="h-7 w-7" />
                </div>
                <span className="inline-block mb-2 text-xs font-bold text-primary-600 bg-primary-50 px-2.5 py-0.5 rounded-full">
                  Step {i + 1}
                </span>
                <h3 className="text-lg font-semibold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* Features                                                     */}
      {/* ============================================================ */}
      <section className="py-20 bg-white" id="features">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="section-title">Key Features</h2>
            <p className="section-subtitle mt-2">Built with modern machine learning and web technologies</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <div key={i} className="card group cursor-default">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-100 text-primary-700 transition-colors group-hover:bg-primary-600 group-hover:text-white">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-slate-900">{f.title}</h3>
                <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* Disclaimer                                                   */}
      {/* ============================================================ */}
      <section className="pb-20 pt-4 bg-white" id="home-disclaimer">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Disclaimer />
        </div>
      </section>
    </div>
  );
}
