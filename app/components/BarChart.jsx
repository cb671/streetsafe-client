import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { getBarChartData } from '../api/api.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Barchart({ filter }) {
  const [labels, setLabels] = useState([]);
  const [years, setYears] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getBarChartData(filter);
        setLabels(data.map((item) => item.category));
        setYears(data.map((item) => item.count));
        console.log(labels);
        console.log(years);
      } catch (error) {
        console.error('Error fetching bar chart data:', error);
      }
    };
    fetchData();
  }, [filter]);

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Total Crimes',
        data: years,
        backgroundColor: 'rgb(84,84,84)',
        borderColor: 'rgb(84,84,84)',
        borderWidth: 2,
      },
    ],
  };
  const options = {
    maintainAspectRatio: false,
    responsive: true,
    indexAxis: 'y',
    plugins: {
      title: { display: true, text: 'Crime Totals', color: 'white' },
      legend: {
        position: 'bottom',
        labels: { color: 'white' },
      },
    },
    scales: {
      x: {
        ticks: { color: 'white' },
        grid: {
          color: 'rgba(255,255,255,0.2)',
          borderColor: 'white',
        },
      },
      y: {
        beginAtZero: true,
        ticks: { color: 'white', autoSkip: false, maxTicksLimit: 20, font: { size: 12 } },
        grid: {
          color: 'rgba(255,255,255,0.2)', // ✅ x-axis grid lines
          borderColor: 'white', // ✅ x-axis border line
        },
      },
    },
  };

  if (labels.length === 0 || years.length === 0) {
    return <div>Loading...</div>;
  }

  return <Bar data={data} options={options} />;
}
