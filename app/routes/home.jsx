import { useMemo, useState } from "react";
import 'maplibre-gl/dist/maplibre-gl.css';
import Map from "../components/Map.jsx";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from "react-chartjs-2";
import '@deck.gl/widgets/stylesheet.css';
import PieChart from "../components/PieChart.jsx";


ChartJS.register(ArcElement, Tooltip, Legend);

// crime labels corresponding to numbers in API hexagon data
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
  'Vehicle Crime'
];

export default function Home() {
  const [crimeData, setCrimeData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const closeModal = () => setCrimeData(null);

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
        labels: CRIME_LABELS.slice(0, values.length),

    datasets: [
        {
          label: "Number of Crimes",
          data: values,
          backgroundColor: bg_colours,
          borderColor: border,
          borderWidth: 1,
        },
      ],
    };
  }, [crimeData]);  

  // modal pop-up with data:

  return (
    <>

      {isLoading && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
          <div className="rounded-lg bg-black/80 text-white px-4 py-2 text-lg">
          Loading data...
          </div>
        </div>
      )}

      {crimeData && (
        <div 
          className="fixed bottom-0 left-0 w-[100vw] h-[60vh] bg-black/75 text-white 
          backdrop-blur-2xl z-10 rounded-t-2xl overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="crime-modal-title"
          
          onClick={(e) => e.stopPropagation()}
          onWheel={(e) => e.stopPropagation()} 
          onTouchMove={(e) => e.stopPropagation()} 
        >
        {/* Close button */}
        <button type="button" 
          class="absolute right-3 top-3 inline-flex h-2 w-9 items-center justify-center
                 rounded-full text-white transform transition duration-500 hover:scale-125"
          aria-label="Close modal"
          onClick={closeModal}
        >
          ✕
        </button>


            { crimeData && (
              <h1 className={"text-center m-4 text-2xl font-bold"}>
                {crimeData.name}
              </h1>
            )}            

          <div className="max-w-md mx-auto text-white">
            {isLoading ? (
              <div className="flex items-center justify-center h-48 text-lg font-semibold">
                Loading Data...
              </div>
            ) : pieChartData ? (

            <div className="w-full flex justify-center">   
              <div style={{ width: 375, height: 320 }}>

              <Pie 
                data={pieChartData}
                options={{
                    responsive: true,
                    maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'right',
                          labels: {
                            color: '#fff',
                            boxWidth: 20,
                            padding: 15,
                            usePointStyle: true, // Show legend as dots
                            pointStyle: 'circle', // Use circle shape
                          }
                        }
                      }
                    }}
                />
              </div>
            </div>
            ) : (
              <div className="flex items-center justify-center h-48 text-lg font-semibold">
                No data available
              </div>
            )}
          </div>

        </div>
      )}

      <Map onClick={handleClick}/>
    </>
  );
}
