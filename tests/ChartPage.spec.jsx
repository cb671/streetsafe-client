import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { render } from "vitest-browser-react";
import { createRoutesStub } from "react-router";
import ChartPage from "../app/routes/ChartPage.jsx";
import * as api from "../app/api/api.js";

vi.mock('../app/api/api.js', () => ({
  getBarChartData: vi.fn(),
  getPieChartData: vi.fn(),
  getLineChartData: vi.fn(),
  logout: vi.fn(),
}));

const Stub = createRoutesStub([{ path: "/trends", Component: ChartPage }]);

describe("ChartPage (real components)", () => {
  beforeEach(() => {
    api.getBarChartData.mockResolvedValue([{ category: "Theft", count: 5 }]);
    api.getPieChartData.mockResolvedValue([{ category: "Theft", percentage: 40 }]);
    api.getLineChartData.mockResolvedValue([{ period: "2024-01", total_crimes: 7 }]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("renders without crashing", async () => {
    const page = render(<Stub initialEntries={["/trends"]} />);
    expect(page.container).toBeTruthy();
  });

  test("loads all three real chart canvases", async () => {
    const page = render(<Stub initialEntries={["/trends"]} />);

    // wait for charts to load
    await new Promise(r => setTimeout(r, 0));

    // All charts render <canvas> elements
    const canvases = page.container.querySelectorAll("canvas");
    expect(canvases.length).toBe(3);
  });
});
