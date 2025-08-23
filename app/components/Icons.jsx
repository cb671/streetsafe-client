import React from 'react';
import {LandPlot, ChartPie, GraduationCap} from 'lucide-react'
import {Link} from 'react-router'
import "../app.css"

const Icons = () => {
  return (
    <div className='flex text-whiteish fill-whiteish w-full align-items p-2 rounded-t-lg rounded-r-lg justify-center gap-10 align-items absolute bottom-0 bg-darkgrey z-50'>
       <div >
       <Link to="/go"><LandPlot size={48} /></Link>
       <p className='ml-3' >Go</p>
       </div>
       <div>
         <Link to=""><ChartPie  size={48} /></Link>
         <p className='' >Trends</p>
       </div>
        <div>
        <Link to="/learn"> <GraduationCap size={48} /></Link>
         <p className='ml-1' >Learn</p>
       </div>
    </div>
  );
};

export default Icons;
