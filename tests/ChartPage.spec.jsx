import { describe, expect, test, vi , beforeEach, afterEach} from "vitest";
import { createRoutesStub } from "react-router";
import ChartPage from "../app/routes/ChartPage.jsx";
import { render } from "vitest-browser-react";
import * as api from '../app/api/api.js';

// Mock the API functions to prevent fetch errors during testing
vi.mock('../app/api/api.js', () => ({
  getBarChartData: vi.fn(),
  getPieChartData: vi.fn(),
  getLineChartData: vi.fn(),
  logout: vi.fn(), // add this
}));

// Mock the chart components to avoid complex chart rendering in tests
vi.mock('../app/components/BarChart', () => ({
  default: ({ filter, className }) => (
    <div data-testid="bar-chart" className={className}>
      Bar Chart - Filter: {JSON.stringify(filter)}
    </div>
  )
}));

vi.mock('../app/components/PieChart', () => ({
  default: ({ filter }) => (
    <div data-testid="pie-chart">
      Pie Chart - Filter: {JSON.stringify(filter)}
    </div>
  )
}));

vi.mock('../app/components/LineChart', () => ({
  default: ({ filter }) => (
    <div data-testid="line-chart">
      Line Chart - Filter: {JSON.stringify(filter)}
    </div>
  )
}));

// Mock the Sidebar component
vi.mock('../app/components/Sidebar', () => ({
  default: () => <div data-testid="sidebar">Sidebar</div>
}));

const Stub = createRoutesStub([
  {
    path: "/trends",
    Component: ChartPage,
  },
]);

describe("ChartPage", () => {
  beforeEach(() => {
    // Set up default mock responses
    api.getBarChartData.mockResolvedValue([
      { category: 'Burglary', count: 150 },
      { category: 'Theft', count: 200 },
      { category: 'Violence', count: 100 }
    ]);

    api.getPieChartData.mockResolvedValue([
      { category: 'Burglary', percentage: 30 },
      { category: 'Theft', percentage: 40 },
      { category: 'Violence', percentage: 30 }
    ]);

    api.getLineChartData.mockResolvedValue([
      { period: '2024-01', total_crimes: 120 },
      { period: '2024-02', total_crimes: 140 },
      { period: '2024-03', total_crimes: 110 }
    ]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("renders without crashing", async () => {
    const page = render(
      <Stub initialEntries={["/trends"]} />
    );

    await expect.element(page.container).toBeInTheDocument();
  });

  test("loads all three graphs", async () => {
    const page = render(
      <Stub initialEntries={["/trends"]} />
    );

    // Check if all chart components are rendered
    await expect.element(page.getByTestId("bar-chart")).toBeInTheDocument();
    await expect.element(page.getByTestId("pie-chart")).toBeInTheDocument();
    await expect.element(page.getByTestId("line-chart")).toBeInTheDocument();
  });

  test("filter icon toggles TrendFilter", async () => {
    const page = render(<Stub initialEntries={["/trends"]} />);

    // Icon present
    await expect.element(page.getByTestId("list-filter")).toBeInTheDocument();

    // Click the icon
    await page.user.click(page.getByTestId("list-filter"));

    // TrendFilter appears (look for heading or button text)
    await expect.element(await page.findByText("Trends")).toBeInTheDocument();
    await expect.element(await page.findByText("Filter")).toBeInTheDocument();

    // Close via the × button
    await page.user.click(page.getByText("×"));
    // Overlay removed
    await expect.element(page.queryByText("Trends")).not.toBeInTheDocument();
  });
});
