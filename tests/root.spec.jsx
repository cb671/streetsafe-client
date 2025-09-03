import {describe, expect, test} from "vitest";
import {createRoutesStub} from "react-router";
import Home from "../app/routes/home.jsx";
import {render} from "vitest-browser-react";
import {MapProvider, useMap} from "../app/contexts/MapContext.jsx";
import {InnerMap} from "./common.jsx";
import {useEffect} from "react";
import { userEvent } from "@vitest/browser/context";
import {waitFor} from "@testing-library/react";
import {Layout} from "../app/root.jsx";


const ExpectMapClick = ({onFinish}) => {
  const {mapProps} = useMap();
  useEffect(() => {
    if(!mapProps.onClick) return;
    (async() => {
      await new Promise(r=>setTimeout(r, 500));
      mapProps.onClick(["89195d1a803ffff"]);
      onFinish();
    })();
  }, [mapProps]);
}


const Stub = createRoutesStub([
  {
    path: "/",
    Component: Layout,
  },
]);

test("root renders", async() => {
  const page = render(<MapProvider>
    <Stub initialEntries={["/"]}/>
  </MapProvider>);
  await expect.element(document.querySelector("body")).toBeInTheDocument();
});
