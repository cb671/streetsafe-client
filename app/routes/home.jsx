import { useMemo, useState } from "react";
import 'maplibre-gl/dist/maplibre-gl.css';
import Map from "../components/Map.jsx";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from "react-chartjs-2";
import '@deck.gl/widgets/stylesheet.css';


ChartJS.register(ArcElement, Tooltip, Legend);

const CRIME_LABELS = [
  'Burglary', 
  'Personal Theft',
  'Weapon Crime',
  'Bicycle Theft',
  'Damage',
  'Robbery',
  'Shoplifting',
  'Violent Crime', 
  'Antisocial', 
  'Drugs', 
  'Vehicle Crime'];

export default function Home() {
  const [crimeData, setCrimeData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleClick(info) {

    try {
      setIsLoading(true);

      const res = await fetch(`http://localhost:3000/api/map/hexagon/${info[0]}`);
      const data = await res.json();
      console.log(data);
      setCrimeData(data);
    } catch(err) {
      console.error("Failed to fetch crime data", err);
    } finally {
      setIsLoading(false);
    }
  }

  const pieChartData = useMemo(() => {
    if (!crimeData?.crimes) return null;

    const values = crimeData.crimes.slice(0, CRIME_LABELS.length);

    const bg_colours = [
      "rgba(255, 99, 132, 0.2)",
      "rgba(54, 162, 235, 0.2)",
      "rgba(255, 206, 86, 0.2)",
      "rgba(75, 192, 192, 0.2)",
      "rgba(153, 102, 255, 0.2)",
      "rgba(255, 159, 64, 0.2)",
      "rgba(201, 203, 207, 0.2)",
      "rgba(99, 255, 132, 0.2)",
      "rgba(235, 54, 162, 0.2)",
      "rgba(86, 255, 206, 0.2)",
      "rgba(192, 75, 192, 0.2)"
    ].slice(0, values.length);

    const border = [
      "rgba(255, 99, 132, 1)",
      "rgba(54, 162, 235, 1)",
      "rgba(255, 206, 86, 1)",
      "rgba(75, 192, 192, 1)",
      "rgba(153, 102, 255, 1)",
      "rgba(255, 159, 64, 1)",
      "rgba(201, 203, 207, 1)",
      "rgba(99, 255, 132, 1)",
      "rgba(235, 54, 162, 1)",
      "rgba(86, 255, 206, 1)",
      "rgba(192, 75, 192, 1)"
    ].slice(0, values.length);
  
  return {
    datasets: [
        {
          label: "Number of Crimes",
          data: values,
          backgroundColor: bg_colours,
          borderColor: border,
          borderWidth: 3
        }
      ]
    };
  }, [crimeData]);  


  return (
    <>
      {crimeData && (
        <div 
          className="fixed bottom-0 left-0 w-[100vw] h-[50vh] bg-black/75 text-white 
          backdrop-blur-2xl z-10 rounded-t-2xl overflow-y-auto"
          
          onWheel={(e) => e.stopPropagation()} // Prevents map zoom on scroll; map already has separate zoom function
          onTouchMove={(e) => e.stopPropagation()} // on mobile phones, prevents map panning
        >


            { crimeData && (
              <h1 className={"text-center m-4 text-2xl font-bold"}>
                {crimeData.name}
              </h1>
            )}

            <div className="flex items-center justify-center text-ms font-semibold">
                Click on the pie chart to see local crime data
            </div>
            

          <div className="max-w-md mx-auto text-white">
            {isLoading ? (
              <div className="flex items-center justify-center h-48 text-lg font-semibold">
                Loading Data...
              </div>
            ) : pieChartData ? (
              <Pie data={pieChartData} />
            ) : (
              <div className="flex items-center justify-center h-48 text-lg font-semibold">
                No data available
              </div>
            )}
          </div>

          <ul className="text-center m-4 text-xl">
            {crimeData.crimes.map((c, i) => (
              <li key={i}>Crime {i + 1}: {c}</li>
            ))}
          </ul>

          <h2 className="text-center m-4 text-2xl">
            Closest Police Station:
          </h2>
        </div>
      )}

      <Map onClick={handleClick}/>
    </>
  );
}
