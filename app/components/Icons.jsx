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
        <Link to="/trends"><ChartPie size={48}/></Link>
        <p>Trends</p>
      </div>
      {page === "go" ? <div>
        <Link to="/"><Map size={48}/></Link>
        <p>Crime</p>
      </div> : <div>
        <Link to="/go"><LandPlot size={48}/></Link>
        <p>Go</p>
      </div>}
      <div>
        <Link to="/learn"> <GraduationCap size={48}/></Link>
        <p>Learn</p>
      </div>
    </div>
  );
};

export default Icons;
