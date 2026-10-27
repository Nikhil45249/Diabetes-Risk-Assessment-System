import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Activity, Menu, X } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/assessment", label: "Assessment" },
  { to: "/model-info", label: "Model Info" },
  { to: "/about", label: "About" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const navLinkClass = ({ isActive }) =>
    `relative px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-lg ${
      isActive
        ? "text-primary-700 bg-primary-50"
        : "text-slate-600 hover:text-primary-700 hover:bg-primary-50/60"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group" id="nav-logo">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-600/30 transition-transform group-hover:scale-105">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-slate-900 hidden sm:inline">
            Diabe<span className="text-primary-600">Check</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1" id="desktop-nav">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={navLinkClass} id={`nav-${l.label.toLowerCase().replace(" ", "-")}`}>
              {l.label}
            </NavLink>
          ))}
          <Link to="/assessment" className="btn-primary ml-3 text-sm py-2 px-5" id="nav-cta">
            Start Assessment
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          id="mobile-menu-toggle"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="md:hidden border-t border-slate-200 bg-white animate-fade-in px-4 pb-4 pt-2" id="mobile-nav">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={navLinkClass}
              onClick={() => setOpen(false)}
            >
              <span className="block py-1">{l.label}</span>
            </NavLink>
          ))}
          <Link
            to="/assessment"
            className="btn-primary mt-3 w-full text-sm py-2.5"
            onClick={() => setOpen(false)}
          >
            Start Assessment
          </Link>
        </nav>
      )}
    </header>
  );
}
