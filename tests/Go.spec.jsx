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
import routes from "./data/routes.json";
import lafossePlace from "./data/lafosse.json";
import {calculateStepProgress} from "../app/util/go-progress.js";

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
    // entering location
    vi.mocked(searchLocation).mockResolvedValue(searches)
    await userEvent.type(document.getElementById("to"), "test");
    await waitFor(()=>expect(searchLocation).toBeCalled());
    expect(document.querySelector(".has-results .flex")).toBeDefined();

    // selecting location
    vi.mocked(geocode).mockResolvedValue(lafossePlace);
    vi.mocked(calculateRoutes).mockResolvedValue(routes);
    await userEvent.click(document.querySelector(".has-results .flex button"));
    await waitFor(()=>expect(geocode).toBeCalled());
    await waitFor(()=>expect(calculateRoutes).toBeCalled());

    // selecting route
    await waitFor(()=>expect(document.querySelector("#route-75")))
    await userEvent.click(document.querySelector("#route-75"));
    await waitFor(()=>expect(document.querySelector("#begin-journey:disabled")).toBeFalsy())
    await userEvent.click(document.querySelector("#begin-journey"));

    // checking first instruction is on screen
    await waitFor(()=>expect(page.getByText(
      routes[0].routes[0].legs[0].steps[0].maneuver.instruction
    )).toBeDefined());
  });
});

describe("go-progress tests", () => {
  const step1 = {
    geometry: {
      coordinates: [
        [-0.1276, 51.5074],
        [-0.1266, 51.5084]
      ]
    }
  };

  const step2 = {
    geometry: {
      coordinates: [
        [-0.1256, 51.5094],
        [-0.1246, 51.5104]
      ]
    }
  };

  test('returns 0m when at starting point of current step', () => {
    const result = calculateStepProgress(51.5074, -0.1276, step1, step2);
    expect(result).toBeCloseTo(0, 1);
  });

  test('returns positive meters when midway through step', () => {
    const midLat = (51.5074 + 51.5084) / 2;
    const midLng = (-0.1276 + -0.1266) / 2;
    const result = calculateStepProgress(midLat, midLng, step1, step2);
    expect(result).toBeGreaterThan(0);
    expect(result).toBeLessThan(200);
  });

  test('returns full step distance when at end of step', () => {
    const result = calculateStepProgress(51.5084, -0.1266, step1, step2);
    expect(result).toBeGreaterThan(0);
  });
})
