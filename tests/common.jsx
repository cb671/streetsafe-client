import {useMap} from "../app/contexts/MapContext.jsx";
import MapComponent from "../app/components/Map.jsx";

export const InnerMap = () => {
  const { mapProps } = useMap();
  return <>
    <MapComponent {...mapProps}/>
  </>
}
