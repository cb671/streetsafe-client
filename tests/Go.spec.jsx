import {describe, expect, test, vi, beforeAll, afterAll} from "vitest";
import {createRoutesStub} from "react-router";
import Go from "../app/routes/go.jsx";
import {cleanup, render} from "vitest-browser-react";
import {MapProvider, useMap} from "../app/contexts/MapContext.jsx";
import {InnerMap} from "./common.jsx";
import {useEffect, useRef} from "react";
import { userEvent } from "@vitest/browser/context";
import {calculateRoutes, geocode, searchLocation} from "../app/api/api.js";
import {waitFor} from "@testing-library/react";
import searches from "./data/searches.json";
import lafossePlace from "./data/lafosse.json";

const mockGetCurrentPosition = vi.fn((successCallback, errorCallback) => {
  const mockPosition = {
    coords: {
      latitude: 51.5074,
      longitude: -0.1278,
      accuracy: 10,
      altitude: null,
      altitudeAccuracy: null,
      heading: null,
      speed: null
    },
    timestamp: Date.now()
  };

  successCallback(mockPosition);
});

const NavigatorMock = vi.fn(() => ({
  geolocation: {
    getCurrentPosition: mockGetCurrentPosition
  }
}))

const originalNavigator = window.navigator;

afterAll(() => {
  window.navigator = originalNavigator;
  vi.clearAllMocks();
});

vi.mock("../app/api/api.js", {spy: true});

const Stub = createRoutesStub([
  {
    path: "/go",
    Component: Go,
  },
]);

describe("map tests", () => {
  let capturedMapProps = null;
  Object.defineProperty(window, 'navigator', {
    value: {
      ...originalNavigator,
      geolocation: {
        getCurrentPosition: mockGetCurrentPosition,
        watchPosition: vi.fn(),
        clearWatch: vi.fn()
      }
    },
    writable: true
  });

  afterAll(() => {
    cleanup();
  });

  const TestMapPropsCapture = () => {
    const { mapProps } = useMap();

    useEffect(() => {
      if (mapProps) {
        capturedMapProps = mapProps;
      }
    }, [mapProps]);

    return null;
  };

  test("map focuses on user location", async() => {
    const page = render(
      <MapProvider>
        <Stub initialEntries={["/go"]}/>
        <InnerMap/>
        <TestMapPropsCapture />
      </MapProvider>
    );
    await vi.waitFor(() => {
      expect(capturedMapProps).not.toBeNull();
    });

    expect(capturedMapProps.userPosition).toHaveLength(2);
  });

  test("route creation flow", async() => {
    const page = render(
      <MapProvider>
        <Stub initialEntries={["/go"]}/>
        <InnerMap/>
        <TestMapPropsCapture />
      </MapProvider>
    );
    vi.mocked(searchLocation).mockResolvedValue(searches)
    await userEvent.type(document.getElementById("to"), "test");
    await waitFor(()=>expect(searchLocation).toBeCalled());
    expect(document.querySelector(".has-results .flex")).toBeDefined();
    vi.mocked(geocode).mockResolvedValue(lafossePlace);
    vi.mocked(calculateRoutes).mockResolvedValue([]);
    await userEvent.click(document.querySelector(".has-results .flex button"));
    await waitFor(()=>expect(geocode).toBeCalled());
    await waitFor(()=>expect(calculateRoutes).toBeCalled());
  });
});
