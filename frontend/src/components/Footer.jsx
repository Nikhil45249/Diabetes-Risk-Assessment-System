import { Link } from "react-router-dom";
import { Activity, Github, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white" id="site-footer">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-700">
                <Activity className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-slate-900">
                Diabe<span className="text-primary-600">Check</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed">
              An educational machine learning project for diabetes risk estimation.
              Not intended for clinical use.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-slate-900 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[
                { to: "/", label: "Home" },
                { to: "/assessment", label: "Risk Assessment" },
                { to: "/model-info", label: "Model Info" },
                { to: "/about", label: "About" },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-slate-500 hover:text-primary-600 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech stack */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-slate-900 uppercase tracking-wider">Tech Stack</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>React + Vite</li>
              <li>Node.js + Express</li>
              <li>Python + FastAPI</li>
              <li>scikit-learn</li>
            </ul>
          </div>

          {/* Disclaimer */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-slate-900 uppercase tracking-wider">Disclaimer</h4>
            <p className="text-sm text-slate-500 leading-relaxed">
              This tool is for educational purposes only and does not provide
              medical diagnoses. Always consult a healthcare professional.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-6 sm:flex-row">
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} DiabetCheck — College Mini Project
          </p>
          <p className="flex items-center gap-1 text-sm text-slate-400">
            Made with <Heart className="h-3.5 w-3.5 text-red-400 fill-red-400" /> for learning
          </p>
        </div>
      </div>
    </footer>
  );
}
