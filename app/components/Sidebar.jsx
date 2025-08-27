import React, { useState } from 'react';
import { LandPlot, ChartPie, GraduationCap, Home, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import "../app.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/go", icon: LandPlot, label: "Go" },
    { to: "/trends", icon: ChartPie, label: "Trends" },
    { to: "/learn", icon: GraduationCap, label: "Learn" },
  ];

  const isActive = (path) => location.pathname === path;

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>

      <button
        onClick={toggleSidebar}
        className="fixed bottom-4 left-4 z-[60] bg-darkgrey border border-whiteish/10 rounded-xl p-3 text-whiteish hover:bg-grey/60 transition-all duration-300 shadow-lg backdrop-blur"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>


      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}


      <div
        className={`fixed left-0 top-0 h-full w-64 bg-darkgrey border-r border-whiteish/10 z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >

        <div className="p-6 border-b border-whiteish/10">
          <h1 className="text-2xl font-heading text-whiteish">StreetSafe</h1>
          <p className="text-xs text-whiteish/60 mt-1">Stay informed. Stay safe.</p>
        </div>


        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                      isActive(item.to)
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'text-whiteish/70 hover:text-whiteish hover:bg-grey/60'
                    }`}
                  >
                    <IconComponent
                      size={20}
                      className={`transition-transform duration-300 ${
                        isActive(item.to) ? 'scale-110' : 'group-hover:scale-105'
                      }`}
                    />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>


        <div className="p-4 border-t border-whiteish/10">
          <div className="text-xs text-whiteish/40 text-center">
            © 2025 StreetSafe
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
