import {describe, expect, test} from "vitest";
import {createRoutesStub} from "react-router";
import Home from "../app/routes/home.jsx";
import {render} from "vitest-browser-react";
import {MapProvider, useMap} from "../app/contexts/MapContext.jsx";
import {InnerMap} from "./common.jsx";
import {useEffect} from "react";

const ExpectMapClick = ({onFinish}) => {
  const {mapProps} = useMap();
  useEffect(() => {
    if(!mapProps.onClick) return;
    (async() => {
      mapProps.onClick(["89195d1a803ffff"]);
      onFinish();
    })();
  }, [mapProps]);
}


const Stub = createRoutesStub([
  {
    path: "/",
    Component: Home,
  },
]);

test("hexagon click works", async() => {
  let clickResolve;
  const clickPromise = new Promise(r => clickResolve = r);
  const page = render(<MapProvider>
    <Stub initialEntries={["/"]}/>
    <InnerMap/>
    <ExpectMapClick onFinish={clickResolve}/>
  </MapProvider>);
  const canvas = page.getByLabelText("Map");
  await expect.element(canvas).toBeInTheDocument();
  await clickPromise;
  await expect.element(page.getByTestId("map-data-modal")).toBeInTheDocument();
});

test("icons render", async() => {
  const page = render(<MapProvider>
    <Stub initialEntries={["/"]}/>
  </MapProvider>);
  await expect.element(page.getByTestId("nav-icons")).toBeInTheDocument();
});

test("pop-up close button hides the modal when clicked", async() => {
  let popUpCloseButton;
  const closeModal = new Promise(r => popUpCloseButton = r);
  const page = render(<MapProvider>
    <Stub initialEntries={["/"]}/>
  </MapProvider>);
  expect.element(getByRole("button")).toBeInTheDocument
  await user.click(getByRole("button", { name: /Close modal/i }))
  
  // Modal disappears
  expect(queryByRole("button")).not.toBeInTheDocument();
});