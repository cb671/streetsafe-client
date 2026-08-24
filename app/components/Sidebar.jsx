import React, { useEffect, useRef, useState } from "react";
import {
  ChartPie,
  GraduationCap,
  Home,
  LandPlot,
  LogIn,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import { logout } from "../api/api.js";
import "../app.css";

const navItems = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/go", icon: LandPlot, label: "Go" },
  { to: "/trends", icon: ChartPie, label: "Trends" },
  { to: "/learn", icon: GraduationCap, label: "Learn" },
  { to: "/login", icon: LogIn, label: "Login" },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const menuButtonRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsOpen(false);
      navigate("/login");
    }
  };

  const navigationLinks = (mobile = false) =>
    navItems.map(({ to, icon: Icon, label }) => (
      <li key={to}>
        <Link
          to={to}
          aria-current={isActive(to) ? "page" : undefined}
          className={`flex items-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300 ${
            mobile ? "px-4 py-3" : "px-4 py-2"
          } ${
            isActive(to)
              ? "bg-blue-500 text-white shadow-sm"
              : "text-whiteish/75 hover:bg-grey/60 hover:text-whiteish"
          }`}
        >
          <Icon size={18} aria-hidden="true" />
          <span>{label}</span>
        </Link>
      </li>
    ));

  return (
    <header className="sticky top-0 z-[1100] border-b border-whiteish/10 bg-darkgrey text-whiteish shadow-lg backdrop-blur-xl">
      <div className="flex min-h-16 items-center justify-between px-4 md:px-6">
        <Link
          to="/"
          className="rounded-md font-heading text-3xl tracking-wide focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-300"
          aria-label="StreetSafe home"
        >
          StreetSafe
        </Link>

        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-whiteish/15 text-whiteish transition-colors hover:bg-grey/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300 md:hidden"
          aria-label={isOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
        >
          {isOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
      </div>

      <nav
        className="hidden min-h-12 items-center border-t border-whiteish/10 px-6 md:flex"
        aria-label="Primary navigation"
      >
        <ul className="flex items-center gap-1">{navigationLinks()}</ul>
        <button
          type="button"
          onClick={handleLogout}
          className="ml-auto flex items-center gap-2 rounded-lg px-4 py-2 font-medium text-whiteish/75 transition-colors hover:bg-red-500/20 hover:text-whiteish focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300"
        >
          <LogOut size={18} aria-hidden="true" />
          <span>Logout</span>
        </button>
      </nav>

      {isOpen && (
        <nav
          id="mobile-navigation"
          className="border-t border-whiteish/10 p-3 md:hidden"
          aria-label="Mobile navigation"
        >
          <ul className="space-y-1">{navigationLinks(true)}</ul>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-1 flex w-full items-center gap-2 rounded-lg px-4 py-3 font-medium text-whiteish/75 transition-colors hover:bg-red-500/20 hover:text-whiteish focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300"
          >
            <LogOut size={18} aria-hidden="true" />
            <span>Logout</span>
          </button>
        </nav>
      )}
    </header>
  );
};

export default Sidebar;
