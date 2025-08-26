import { expect, test} from "vitest";
import {render} from "vitest-browser-react";
import {MapProvider, useMap} from "../app/contexts/MapContext.jsx";
import MapComponent from "../app/components/Map.jsx";
import {useEffect} from "react";
import Home from "../app/routes/home.jsx";
import {createRoutesStub} from "react-router";

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
  const Stub = createRoutesStub([
    {
      path: "/",
      Component: Home,
    },
  ]);
  const p = new Promise(r => resolve = r);
  const page = render(<>
    <MapProvider>
      <Stub initialEntries={["/"]}/>
      <InnerMap/>
      <ExpectMapClick onFinish={resolve}/>
    </MapProvider>
  </>);
  const canvas = page.getByLabelText("Map");
  await expect.element(canvas).toBeInTheDocument();
  await p;
  await expect.element(page.getByTestId("map-data-modal")).toBeInTheDocument();
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
    if(!mapProps.onClick) return;
    (async () => {
      mapProps.onClick(["89195d1a803ffff"]);
      onFinish();
    } )();
  }, [mapProps])
  return;
}
