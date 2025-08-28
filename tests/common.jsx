import {useMap} from "../app/contexts/MapContext.jsx";
import MapComponent from "../app/components/Map.jsx";
import {useEffect} from "react";

export const InnerMap = ({page}) => {
  const { mapProps, updateMapProps, setLocation } = useMap();
  useEffect(()=>{
    if(page === "go"){
      updateMapProps({
        userPosition: [
          0, 0
        ]
      });
      setLocation({latitude: 0, longitude: 0});
    }
  }, [])
  return <>
    <MapComponent page={page} {...mapProps}/>
  </>
}
