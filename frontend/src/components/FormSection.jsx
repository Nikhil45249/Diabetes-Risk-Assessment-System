import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

/**
 * Collapsible form section with number badge and title.
 */
export default function FormSection({ number, title, subtitle, icon: Icon, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="card" id={`form-section-${number}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-left"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100 text-sm font-bold text-primary-700">
            {number}
          </span>
          {Icon && <Icon className="h-5 w-5 text-primary-600" />}
          <div>
            <h3 className="font-semibold text-slate-800">{title}</h3>
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
        </div>
        {open ? (
          <ChevronUp className="h-5 w-5 text-slate-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-slate-400" />
        )}
      </button>

      {open && (
        <div className="mt-5 animate-fade-in">
          {children}
        </div>
      )}
    </div>
  );
}
