import {useEffect, useMemo, useState} from "react";
import 'maplibre-gl/dist/maplibre-gl.css';
import Map from "../components/Map.jsx";
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js';
import {Pie} from "react-chartjs-2";
import '@deck.gl/widgets/stylesheet.css';
import Icons from "../components/Icons.jsx";
import {initialPosition, useMap} from "../contexts/MapContext.jsx";
import {getHexData, getUserProfile} from "../api/api.js";

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
  'Vehicle Crime'];

export default function Home(){
  const [crimeData, setCrimeData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const {setLocation} = useMap();

  const closeModal = () => setCrimeData(null);

  useEffect(() => {
    const fetchAndSetUserLocation = async () => {
      let pos = initialPosition;
      try {
        const data = await getUserProfile();

        if (data.user && data.user.h3) {
          try {
            const h3Module = await import('h3-js');

            const [lat, lng] = h3Module.cellToLatLng(data.user.h3);
            pos.latitude = lat;
            pos.longitude = lng;
            pos.zoom = 12;
            pos.bearing = 0;
          } catch (importError) {
            console.error('Failed to import h3-js or convert H3 to coordinates:', importError);
          }
        }
      } catch (error) {
        console.error('Failed to get user location:', error);
      }
      setLocation(pos);
    };

    fetchAndSetUserLocation();
  }, []);

  async function handleClick(info){
    try{
      setIsLoading(true);

      const data = await getHexData(info[0]);
      console.log(data);
      setCrimeData(data);
    }catch(err){
      console.error("Failed to fetch crime data", err);
    }finally{
      setIsLoading(false);
    }
  }

  const pieChartData = useMemo(() => {
    if(!crimeData?.crimes) return null;

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

  const {setClickHandler, clearClickHandler} = useMap();
  useEffect(()=>{
    setClickHandler(handleClick);

    return () => clearClickHandler();
  }, []);


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

      {crimeData ? (
        <div
          className="fixed bottom-0 left-0 w-[100vw] h-[60vh] bg-black/75 text-white
          backdrop-blur-2xl z-10 rounded-t-2xl overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="crime-modal-title"
          data-testid={"map-data-modal"}

          onClick={(e) => e.stopPropagation()}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
        {/* Close button */}
        <button type="button"
          className="absolute right-3 top-3 inline-flex h-2 w-9 items-center justify-center
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

          <div className="max-w-md mx-auto text-white px-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-48 text-lg font-semibold">
                Loading Data...
              </div>
            ) : pieChartData ? (

            <div className="w-full h-78 flex justify-center">

              <Pie
                data={pieChartData}
                options={{
                    responsive: true,
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
            ) : (
              <div className="flex items-center justify-center h-48 text-lg font-semibold">
                No data available
              </div>
            )}
          </div>

          {crimeData.emergencyServices && (
            <div className="px-4 mt-6 pb-6">
              <h2 className="text-center mb-4 text-xl font-semibold">
                Closest Emergency Services
              </h2>

              <div className="space-y-4">

                {crimeData.emergencyServices.police && (
                  <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-600/30">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-blue-300">Police Station</h3>
                        <p className="text-sm text-gray-300">{crimeData.emergencyServices.police.name}</p>
                      </div>
                    </div>
                  </div>
                )}

                {crimeData.emergencyServices.hospital && (
                  <div className="bg-red-900/30 rounded-lg p-4 border border-red-600/30">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-red-300">Hospital</h3>
                        <p className="text-sm text-gray-300">{crimeData.emergencyServices.hospital.name}</p>
                        <p className="text-xs text-gray-400">{crimeData.emergencyServices.hospital.type}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : <Icons/>}
    </>
  );
}
