import { expect, test, describe, vi, beforeEach } from "vitest";
import {render} from "vitest-browser-react";
import {MapProvider} from "../app/contexts/MapContext.jsx";
import {InnerMap} from "./common.jsx";
import * as api from "../app/api/api.js";

vi.mock("../app/api/api.js", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getMapData: vi.fn(),
  };
});

beforeEach(() => {
  vi.clearAllMocks();
  api.getMapData.mockResolvedValue([]);
});

test("map renders", async () => {
  const page = render(<>
    <MapProvider>
      <InnerMap/>
    </MapProvider>
  </>);
  const canvas = page.getByLabelText("Map");
  await expect.element(canvas).toBeInTheDocument()
});

test("shows loading map data message until data resolves", async () => {
  let resolveMapData;
  api.getMapData.mockImplementationOnce(
    () => new Promise((resolve) => {
      resolveMapData = resolve;
    })
  );

  const page = render(
    <MapProvider>
      <InnerMap/>
    </MapProvider>
  );

  await expect.element(page.getByText("Loading map data...")).toBeInTheDocument();

  resolveMapData([]);
  await new Promise((resolve) => setTimeout(resolve, 0));

  await expect.element(page.getByText("Loading map data...")).not.toBeInTheDocument();
});

test("map renders (go)", async () => {
  const page = render(<>
    <MapProvider>
      <InnerMap page={"go"}/>
    </MapProvider>
  </>);
  const canvas = page.getByLabelText("Map");
  await expect.element(canvas).toBeInTheDocument()
});
