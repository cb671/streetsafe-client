// import React from 'react';
import {LandPlot, ChartPie, GraduationCap, Map} from 'lucide-react'
import {useNavigate} from 'react-router'
import "../app.css"

const Icons = ({page}) => {
  const navigate = useNavigate();

  const navItems = [
    { to: "/trends", label: "Trends", Icon: ChartPie },
    page === "go"
      ? { to: "/", label: "Crime", Icon: Map }
      : { to: "/go", label: "Go", Icon: LandPlot },
    { to: "/learn", label: "Learn", Icon: GraduationCap },
  ];

  return (
    <div
      className={`fixed bottom-0 left-0 z-[1000] flex w-full justify-center gap-10 rounded-t-lg bg-darkgrey p-2 text-center text-whiteish fill-whiteish pointer-events-auto`}
      data-testid={"nav-icons"}
    >
      {navItems.map(({to, label, Icon}) => (
        <button
          key={to}
          type="button"
          className="flex cursor-pointer flex-col items-center gap-1"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            navigate(to);
          }}
        >
          <Icon size={48}/>
          <p>{label}</p>
        </button>
      ))}
    </div>
  );
};

export default Icons;
