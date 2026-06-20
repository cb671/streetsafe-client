// import React from 'react';
import {LandPlot, ChartPie, GraduationCap, Map} from 'lucide-react'
import {Link} from 'react-router'
import "../app.css"

const Icons = ({page}) => {
  return (
    <div
      className={`flex text-whiteish fill-whiteish w-full align-items p-2 rounded-t-lg justify-center gap-10 align-items absolute bottom-0 bg-darkgrey z-50 fixed text-center`}
      data-testid={"nav-icons"}
    >
      <div>
        <Link to="/trends" className="flex flex-col items-center gap-1">
          <ChartPie size={48}/>
          <p>Trends</p>
        </Link>
      </div>
      {page === "go" ? <div>
        <Link to="/" className="flex flex-col items-center gap-1">
          <Map size={48}/>
          <p>Crime</p>
        </Link>
      </div> : <div>
        <Link to="/go" className="flex flex-col items-center gap-1">
          <LandPlot size={48}/>
          <p>Go</p>
        </Link>
      </div>}
      <div>
        <Link to="/learn" className="flex flex-col items-center gap-1">
          <GraduationCap size={48}/>
          <p>Learn</p>
        </Link>
      </div>
    </div>
  );
};

export default Icons;
