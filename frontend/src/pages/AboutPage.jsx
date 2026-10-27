import {
  Target,
  Layers,
  Code2,
  GraduationCap,
  ArrowRight,
  Monitor,
  Server,
  Cpu,
} from "lucide-react";
import { Link } from "react-router-dom";

const objectives = [
  "Demonstrate how ML can be used for health-risk estimation.",
  "Build a full-stack application with three independent services.",
  "Train, evaluate, and compare multiple classification algorithms.",
  "Create a user-friendly questionnaire that does not require lab tests.",
  "Present predictions responsibly with clear disclaimers.",
];

const techStack = [
  { layer: "Frontend", items: ["React 18", "Vite", "Tailwind CSS", "Recharts", "Lucide Icons", "React Router"] },
  { layer: "Backend", items: ["Node.js", "Express", "Axios", "CORS", "dotenv"] },
  { layer: "ML Service", items: ["Python", "FastAPI", "scikit-learn", "pandas", "NumPy", "joblib"] },
  { layer: "Dev Tools", items: ["VS Code", "Git / GitHub", "Postman"] },
];

export default function AboutPage() {
  return (
    <div className="animate-fade-in py-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="section-title">About This Project</h1>
          <p className="section-subtitle mt-2 max-w-xl mx-auto">
            A college mini project demonstrating machine learning for
            diabetes risk assessment.
          </p>
        </div>

        {/* ---- Objectives ---- */}
        <section id="objectives-section">
          <div className="flex items-center gap-2 mb-5">
            <Target className="h-5 w-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-slate-900">Project Objectives</h2>
          </div>
          <div className="card">
            <ul className="space-y-3">
              {objectives.map((o, i) => (
                <li key={i} className="flex gap-3 text-sm text-slate-600">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700 flex-shrink-0">
                    {i + 1}
                  </span>
                  {o}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---- Tech Stack ---- */}
        <section id="tech-stack-section">
          <div className="flex items-center gap-2 mb-5">
            <Code2 className="h-5 w-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-slate-900">Technologies Used</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {techStack.map((ts) => (
              <div key={ts.layer} className="card">
                <h3 className="font-semibold text-primary-700 mb-3">{ts.layer}</h3>
                <div className="flex flex-wrap gap-2">
                  {ts.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ---- Architecture ---- */}
        <section id="architecture-section">
          <div className="flex items-center gap-2 mb-5">
            <Layers className="h-5 w-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-slate-900">System Architecture</h2>
          </div>
          <div className="card">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-6">
              {/* Frontend */}
              <div className="flex flex-col items-center gap-2 px-6 py-4 rounded-xl bg-blue-50 border border-blue-200 min-w-[140px]">
                <Monitor className="h-8 w-8 text-blue-600" />
                <span className="font-semibold text-blue-800 text-sm">React Frontend</span>
                <span className="text-[10px] text-blue-500">:5173</span>
              </div>
              <ArrowRight className="h-5 w-5 text-slate-400 rotate-90 sm:rotate-0" />
              {/* Backend */}
              <div className="flex flex-col items-center gap-2 px-6 py-4 rounded-xl bg-emerald-50 border border-emerald-200 min-w-[140px]">
                <Server className="h-8 w-8 text-emerald-600" />
                <span className="font-semibold text-emerald-800 text-sm">Express Backend</span>
                <span className="text-[10px] text-emerald-500">:5000</span>
              </div>
              <ArrowRight className="h-5 w-5 text-slate-400 rotate-90 sm:rotate-0" />
              {/* ML Service */}
              <div className="flex flex-col items-center gap-2 px-6 py-4 rounded-xl bg-purple-50 border border-purple-200 min-w-[140px]">
                <Cpu className="h-8 w-8 text-purple-600" />
                <span className="font-semibold text-purple-800 text-sm">FastAPI ML Service</span>
                <span className="text-[10px] text-purple-500">:8000</span>
              </div>
            </div>

            <div className="mt-4 text-sm text-slate-500 space-y-1.5">
              <p>1. User submits the questionnaire on the React frontend.</p>
              <p>2. React sends validated data to the Express backend via REST API.</p>
              <p>3. Express validates again and forwards features to the Python ML service.</p>
              <p>4. FastAPI preprocesses features, runs the trained model, and returns the prediction.</p>
              <p>5. Express returns a consistent JSON response to React.</p>
              <p>6. React displays the risk level, BMI, recommendations, and disclaimer.</p>
            </div>
          </div>
        </section>

        {/* ---- Educational Purpose ---- */}
        <section id="educational-section">
          <div className="flex items-center gap-2 mb-5">
            <GraduationCap className="h-5 w-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-slate-900">Educational Purpose</h2>
          </div>
          <div className="card">
            <p className="text-sm text-slate-600 leading-relaxed">
              This project was developed as a <strong>college mini project</strong> to
              demonstrate the integration of machine learning with modern web technologies.
              It is intended purely for educational and demonstration purposes.
              The predictions generated by this system are <strong>not clinically validated</strong>{" "}
              and must not be used as a substitute for professional medical advice,
              diagnosis, or treatment.
            </p>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center pt-4">
          <Link to="/assessment" className="btn-primary" id="about-cta">
            Try the Assessment <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
