import { expect, test} from "vitest";
import {render} from "vitest-browser-react";
import {MapProvider, useMap} from "../app/contexts/MapContext.jsx";
import MapComponent from "../app/components/Map.jsx";
import {useEffect} from "react";
import Home from "../app/routes/home.jsx";

test("renders map", async () => {
  const page = render(<>
    <MapProvider>
      <InnerMap/>
    </MapProvider>
  </>);
  const canvas = page.getByLabelText("Map");
  await expect.element(canvas).toBeInTheDocument()
});

test("hexagon click works", async () => {
  let resolve ;
  const p = new Promise(r => resolve = r);
  const page = render(<>
    <MapProvider>
      <Home/>
    </MapProvider>
  </>);
  const canvas = page.getByLabelText("Map");
  await expect.element(canvas).toBeInTheDocument();
  await p;
});

const InnerMap = () => {
  const { mapProps } = useMap();
  return <>
    <MapComponent {...mapProps}/>
  </>
}

const ExpectMapClick = ({onFinish}) => {
  const { mapProps } = useMap();
  useEffect(()=>{
    setTimeout(()=>{
      console.log(mapProps);
      mapProps.onClick(["89195d1a803ffff"]);
      onFinish();
    }, 1000);
  }, [])
  return;
}
