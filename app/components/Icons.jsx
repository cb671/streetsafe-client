import React from 'react';
import {LandPlot, ChartPie, GraduationCap} from 'lucide-react'
import {Link} from 'react-router'
import "../app.css"

const Icons = () => {
  return (
    <div className='flex w-[100%] align-items pt-1.5 h-[65px] rounded-t-lg rounded-r-lg justify-center gap-10 align-items absolute bottom-0 bg-darkgrey'>
       <Link to="/"><LandPlot color='white' size={50} /></Link>
       <Link to="/"><ChartPie color='white' size={50} /></Link>
       <Link to="/"> <GraduationCap color='white' size={50} /></Link>
    </div>
  );
};

export default Icons;
