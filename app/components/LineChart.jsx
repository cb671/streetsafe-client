import React, { useState, useEffect } from "react";
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import {getLineChartData} from "../api/api.js"

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

const LineChart = ({filter}) => {
  const [labels, setLabels] = useState([]);
  const [years, setYears] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getLineChartData(filter)
        console.log(data)
        setLabels(data.map(item => item.period.split('-')[0]));
        setYears(data.map(item => item.total_crimes));
      } catch (error) {
        console.error("Failed to fetch line chart data", error);
      }
    };
    fetchData();
  }, [filter]);

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

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    }
  };

  if (labels.length === 0 || years.length === 0) {
    return <div>Loading...</div>;
  }

  return <Line data={data} options={options} />;
};

export default LineChart;
