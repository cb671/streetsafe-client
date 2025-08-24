import 'maplibre-gl/dist/maplibre-gl.css';
import Map from "../components/Map.jsx";
import Icons from "../components/Icons.jsx";
import {useEffect} from "react";
import {useMap} from "../contexts/MapContext.jsx";
import {useNavigate} from "react-router";

export default function Go(){
  const {updateMapProps} = useMap();
  const nav = useNavigate();
  useEffect(()=>{
    navigator.geolocation.getCurrentPosition(geo => {
      updateMapProps({
        userPosition: [
          geo.coords.longitude,
          geo.coords.latitude,
        ]
      })
    }, err => {
      alert("Please allow access to your location to use the geo feature.");
      nav("/");
    });

    return () => {};
  }, []);
  return <>
    <div className={"fixed bottom-0 left-0 w-full z-10 pb-24"}>
      <Icons page={"go"}/>
    </div>
  </>
}
