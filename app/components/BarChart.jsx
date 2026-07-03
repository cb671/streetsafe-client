import React, { useEffect, useState } from 'react';
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
  const [chartData, setChartData] = useState({ labels: [], counts: [] });

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const data = await getBarChartData(filter);
        if (!isMounted) return;

        const items = Array.isArray(data) ? data : [];

        setChartData({
          labels: items.map((item) => item.category),
          counts: items.map((item) => item.count),
        });
      } catch (error) {
        console.error('Error fetching bar chart data:', error);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [filter]);

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Total Crimes',
        data: chartData.counts,
        backgroundColor: 'rgb(84,84,84)',
        borderColor: 'rgb(84,84,84)',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    resizeDelay: 150,
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
          color: 'rgba(255,255,255,0.2)',
          borderColor: 'white',
        },
      },
    },
  };

  if (chartData.labels.length === 0 || chartData.counts.length === 0) {
    return <div className='text-whiteish'>Loading...</div>;
  }

  const chartHeight = Math.max(320, chartData.labels.length * 48);

  return (
    <div style={{ height: `${chartHeight}px` }}>
      <Bar data={data} options={options} redraw />
    </div>
  );
}
