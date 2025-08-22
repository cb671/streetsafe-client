import {MapProvider, useMap} from "../contexts/MapContext.jsx";
import MapComponent from "../components/Map.jsx";
import {Outlet, useLocation} from "react-router";

export default function Layout({children}){
  return <MapProvider>
    <LayoutContent>
      <Outlet />
    </LayoutContent>
  </MapProvider>
}

function LayoutContent({children}){

  let location = useLocation();
  const { mapProps } = useMap();
  return <>
    {children}
    <MapComponent {...mapProps} mode={location.pathname === "/go" ? "go" : ""}/>
  </>
}
