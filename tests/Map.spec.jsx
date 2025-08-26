import { expect, test, describe } from "vitest";
import {render} from "vitest-browser-react";
import {MapProvider, useMap} from "../app/contexts/MapContext.jsx";
import MapComponent from "../app/components/Map.jsx";
import {useEffect} from "react";
import Home from "../app/routes/home.jsx";
import {createRoutesStub} from "react-router";
import {InnerMap} from "./common.jsx";

test("map renders", async () => {
  const page = render(<>
    <MapProvider>
      <InnerMap/>
    </MapProvider>
  </>);
  const canvas = page.getByLabelText("Map");
  await expect.element(canvas).toBeInTheDocument()
});
