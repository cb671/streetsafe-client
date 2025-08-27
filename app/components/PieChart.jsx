import React, { useState, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import {getPieChartData} from '../api/api.js'

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({filter}) => {
  const [labels, setLabels] = useState([]);
  const [values, setValues] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPieChartData(filter);
        setLabels(data.map((item) => item.category));
        setValues(data.map((item) => item.percentage));
      } catch (error) {
        console.error("Failed to fetch chart data", error);
      }
    };
    fetchData();
  }, [filter]);

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Crime proportions',
        data: values,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  const options = {
    plugins: {
      legend: {
        position: "right",
        labels: {
          usePointStyle: true, // Show legend as dots
          pointStyle: 'circle', // Use circle shape
        },
      },
    },
  };


  if (labels.length === 0 || values.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <Pie data={data} options={options} />
  );
}

export default PieChart
