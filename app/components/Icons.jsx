import React from 'react';
import {Layers, ChartPie, GraduationCap} from 'lucide-react'

const Icons = () => {
  return (
    <div className='flex justify-between gap-4 align-items absolute bottom-10 left-[50%]'>
      <Layers color='white' size={30} />
      <ChartPie color='white' size={30} />
      <GraduationCap color='white' size={30} />
    </div>
  );
};

export default Icons;
