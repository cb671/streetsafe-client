import React, { useState, useEffect } from "react";
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

const LineChart = () => {
  const [labels, setLabels] = useState([]);
  const [years, setYears] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/graphs/trends");
        const data = await res.json();
        setLabels(data.map(item => item.period.split('-')[0]));
        setYears(data.map(item => item.total_crimes));
        console.log(data.map(item => item.total));
      } catch (error) {
        console.error("Failed to fetch line chart data", error);
      }
    };
    fetchData();
  }, []);

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Crime Trends',
        data: years,
        fill: false,
        borderColor: '#F6F7F9',
        backgroundColor: 'rgba(5, 5, 5, 0.8)',
        tension: 0.1,
      },
    ],
  };

  if (labels.length === 0 || years.length === 0) {
    return <div>Loading...</div>;
  }

  return <Line data={data} />;
};

export default LineChart;
