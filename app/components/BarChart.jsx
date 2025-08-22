import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Barchart() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetch("api/graphs/totals")
      .then((res) => res.json())
      .then((data) => {
        // ⚡ Adjust depending on your API response
        const labels = data.map((item) => item.category);
        const values = data.map((item) => item.count);

        setChartData({
          labels,
          datasets: [
            {
              label: "Total Crimes",
              data: values,
              backgroundColor: "rgb(84,84,84)",
              borderColor: "rgb(84,84,84)",
              borderWidth: 2,
            },
          ],
        });
      });
  }, []);

  const options = {
    responsive: true,
    plugins: {
      title: { display: true, text: "Crime Totals", color:"white" },
      legend: {
        position: "top",
        labels: { color: "white" }
       },
    },
    scales: {
      x: {
        ticks: { color: "white" },
        grid: {
          color: "rgba(255,255,255,0.2)",   // ✅ x-axis grid lines
          borderColor: "white",             // ✅ x-axis border line
        }
      },
      y: {
        ticks: { color: "white" },
        grid: {
         color: "rgba(255,255,255,0.2)",   // ✅ x-axis grid lines
         borderColor: "white",             // ✅ x-axis border line
        }
      },
    }
  };

  

  return (
    <div>
      {chartData ? <Bar data={chartData} options={options} />
       : <p>Loading...</p>}
    </div>
  );
}
