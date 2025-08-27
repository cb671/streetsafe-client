import {describe, expect, test} from "vitest";
import {createRoutesStub} from "react-router";
import Home from "../app/routes/home.jsx";
import {render} from "vitest-browser-react";
import {MapProvider, useMap} from "../app/contexts/MapContext.jsx";
import {InnerMap} from "./common.jsx";
import {useEffect} from "react";
import { userEvent } from "@vitest/browser/context";


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

  // open the modal pop-up window
  let closePopUpModalButton;
  const clickPromise = new Promise((r) => (closePopUpModalButton = r));

  const { getByTestId, queryByTestId, getByRole} = await render(
    <MapProvider>
      <Stub initialEntries={["/"]} />
      <ExpectMapClick onFinish={closePopUpModalButton} />
  </MapProvider>
  );

  // wait for the simulated hexagon click to finish
  await clickPromise;

  // Pop-up modal is visible
  await expect.element(getByTestId("map-data-modal")).toBeInTheDocument();

  // Click the close button; getByRole can match accessible name of element (aria-label="close modal")
  await userEvent.click(getByRole("button", { name: /Close modal/i }))
  
  // Modal disappears
  expect(queryByTestId("map-data-model")).not.toBeInTheDocument();
});