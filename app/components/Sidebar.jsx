import React, { useEffect, useRef, useState } from "react";
import {
  ChartPie,
  ChevronDown,
  GraduationCap,
  Home,
  LandPlot,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  UserRound,
  X,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import { getUserProfile, logout } from "../api/api.js";
import "../app.css";

const navItems = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/go", icon: LandPlot, label: "Go" },
  { to: "/trends", icon: ChartPie, label: "Trends" },
  { to: "/learn", icon: GraduationCap, label: "Learn" },
];

const Sidebar = () => {
  // 1. State and refs
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const menuButtonRef = useRef(null);
  const profileMenuRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  // 2. Helper values/functions
  const isActive = (path) => location.pathname === path;

  // 3. Effects, including Step 4 and Step 5
  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      try {
        const data = await getUserProfile();
        console.log("Profile response:", data);

        if (isMounted) {
          setUser(data.user);
        }
      } catch (error) {
        console.error("Profile menu could not load user:", error);

        if (isMounted) {
          setUser(null);
        }
      }
    };

    loadUser();

    return () => {
      isMounted = false;
    };
  }, [location.pathname]);

  useEffect(() => {
    setIsOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    // Existing Escape-key handling
    if (!isProfileOpen) return;

    const closeProfileMenu = (event) => {
      if (!profileMenuRef.current?.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("pointerdown", closeProfileMenu);

    return () => {
      document.removeEventListener("pointerdown", closeProfileMenu);
    };
  }, [isProfileOpen]);

  useEffect(() => {
    if (!isOpen && !isProfileOpen) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        setIsProfileOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    window.addEventListener("keydown", closeOnEscape);

    return () => {
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen, isProfileOpen]);

  // 4. Event handlers
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
      setIsOpen(false);
      setIsProfileOpen(false);
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

  const profileControl = (mobile = false) => {
    return (
      <div
        ref={profileMenuRef}
        className={`relative ${mobile ? "w-full" : ""}`}
      >
        <button
          type="button"
          onClick={() => setIsProfileOpen((open) => !open)}
          className={`flex items-center gap-2 rounded-lg font-medium
            text-whiteish/75 transition-colors hover:bg-grey/60
            hover:text-whiteish focus-visible:outline-2
            focus-visible:outline-offset-2 focus-visible:outline-blue-300
            ${mobile ? "w-full px-4 py-3" : "px-4 py-2"}`}
          aria-expanded={isProfileOpen}
          aria-haspopup="menu"
        >
          <UserRound size={18} aria-hidden="true" />

          <span className="min-w-0 truncate">
            {user?.name || user?.email || "Guest"}
          </span>

          <ChevronDown
            size={16}
            aria-hidden="true"
            className={`transition-transform ${
              isProfileOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isProfileOpen && (
          <div
            role="menu"
            className={
              mobile
                ? "mt-1 rounded-lg border border-whiteish/10 bg-grey/40 p-2"
                : "absolute right-0 top-full mt-2 w-64 rounded-xl border border-whiteish/10 bg-gray-900 p-2 shadow-xl"
            }
          >
            <div className="border-b border-whiteish/10 px-3 py-2">
              <p className="font-medium text-whiteish">
                {user?.name || "Welcome"}
              </p>

              <p className="truncate text-sm text-whiteish/60">
                {user?.email || "You are not currently signed in"}
              </p>
            </div>

            {user ? (
              <>
                <Link
                  to="/dashboard"
                  role="menuitem"
                  aria-current={isActive("/dashboard") ? "page" : undefined}
                  className={`mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2
                  font-medium transition-colors
                  focus-visible:outline-2 focus-visible:outline-blue-300 ${
                    isActive("/dashboard")
                      ? "bg-blue-500 text-white"
                      : "text-whiteish/75 hover:bg-grey/60 hover:text-whiteish"
                  }`}
                >
                  <LayoutDashboard size={18} aria-hidden="true" />
                  <span>Dashboard</span>
                </Link>

                <button
                  type="button"
                  role="menuitem"
                  onClick={handleLogout}
                  className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2
                text-left font-medium text-whiteish/75 transition-colors
                hover:bg-grey/60 hover:text-whiteish
                focus-visible:outline-2 focus-visible:outline-blue-300"
                >
                  <LogOut size={18} aria-hidden="true" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  role="menuitem"
                  className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 
                  font-medium text-whiteish/75 transition-colors
                  hover:bg-grey/60 hover:text-whiteish
                  focus-visible:outline-2 focus-visible:outline-blue-300"
                >
                  <LogIn size={18} aria-hidden="true" />
                  <span>Login</span>
                </Link>

                <Link
                  to="/register"
                  role="menuitem"
                  className="mt-1 flex w-full items-center gap-2 rounded-lg
                  px-3 py-2 font-medium text-whiteish/75
                  transition-colors hover:bg-grey/60 hover:text-whiteish
                  focus-visible:outline-2
                  focus-visible:outline-blue-300"
                >
                  <UserRound size={18} aria-hidden="true" />
                  <span>Create account</span>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    );
  };

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
          {isOpen ? (
            <X size={22} aria-hidden="true" />
          ) : (
            <Menu size={22} aria-hidden="true" />
          )}
        </button>
      </div>

      <nav
        className="hidden min-h-12 items-center border-t border-whiteish/10 px-6 md:flex"
        aria-label="Primary navigation"
      >
        <ul className="flex items-center gap-1">{navigationLinks()}</ul>

        <div className="ml-auto">{profileControl()}</div>
      </nav>

      {isOpen && (
        <nav
          id="mobile-navigation"
          className="border-t border-whiteish/10 p-3 md:hidden"
          aria-label="Mobile navigation"
        >
          <ul className="space-y-1">{navigationLinks(true)}</ul>
          <div className="mt-1 border-t border-whiteish/10 pt-1">
            {profileControl(true)}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Sidebar;
