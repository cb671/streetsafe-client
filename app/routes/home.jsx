import {useState} from "react";
import Map from "../components/Map.jsx";

export default function Home() {
  const [clicked, setClicked] = useState(null);
  return (
    <>
      {
        clicked && <div className="fixed bottom-0 left-0 w-[100vw] h-[50vh] bg-black/75 backdrop-blur-2xl z-10 rounded-t-2xl">
          <h1 className={"text-center m-4 text-2xl font-bold"}>{clicked[0]} - h3 index</h1>
        </div>
      }

      <Map onClick={e=>{
        setClicked(e);
      }}/>
    </>
  );
}
