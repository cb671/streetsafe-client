import {useState} from "react";
import Map from "../components/Map.jsx";
import { data } from "react-router";

export default function Home() {
  // const [clicked, setClicked] = useState(null);
  const [crimeData, setCrimeData] = useState(null);

  async function handleClick({h3index}) {
    const h3Index = h3index?.object?.h3index || h3index.h3;
    if (!h3Index) return;
  }

  try {
    const res = await fetch(`http://localhost:3000/api/map/hexagon/${h3index}`);
    const data = await res.json();
    setCrimeData(data);
  } catch(err) {
    console.error("Failed to fetch crime data", err);
  }
}




  return (
    <>
      {crimeData && (
        <div className="fixed bottom-0 left-0 w-[100vw] h-[50vh] bg-black/75 backdrop-blur-2xl z-10 rounded-t-2xl">
          <h1 className={"text-center m-4 text-2xl font-bold"}>
            {crimeData.name} - {crimeData.h3}
          </h1>
          <ul className="mt-4">
            {crimeData.crimes.map((c, i) => (
              <li key={i}>Crime</li>
            ))}
          </ul>
        </div>
      )}

      <Map onClick={e=>{
        setClicked(e);
      }}/>
    </>
  );
}
