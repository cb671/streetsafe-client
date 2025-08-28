import { describe, expect, test, vi } from "vitest";
import { createRoutesStub } from "react-router";
import ChartPage from "../app/routes/ChartPage.jsx";
import { render } from "vitest-browser-react";
import * as api from '../app/api/api.js';

// Mock the API functions to prevent fetch errors during testing
vi.mock('../app/api/api.js', () => ({
  getBarChartData: vi.fn(),
  getPieChartData: vi.fn(),
  getLineChartData: vi.fn()
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

  test("renders all chart components", async () => {
    const page = render(
      <Stub initialEntries={["/trends"]} />
    );

    // Check if all chart components are rendered
    await expect.element(page.getByTestId("bar-chart")).toBeInTheDocument();
    await expect.element(page.getByTestId("pie-chart")).toBeInTheDocument();
    await expect.element(page.getByTestId("line-chart")).toBeInTheDocument();
    await expect.element(page.getByTestId("sidebar")).toBeInTheDocument();
  });

  test("bar chart has correct styling class", async () => {
    const page = render(
      <Stub initialEntries={["/trends"]} />
    );

    const barChart = page.getByTestId("bar-chart");
    await expect.element(barChart).toBeInTheDocument();

    // Check that the bar chart has the border class
    await expect.element(barChart).toHaveClass("border");
  });

  test("charts display initial filter state", async () => {
    const page = render(
      <Stub initialEntries={["/trends"]} />
    );

    // Check that charts show the initial filter values
    const barChart = page.getByTestId("bar-chart");
    await expect.element(barChart).toBeInTheDocument();

    // The initial filter should have empty values and default groupBy
    await expect.element(page.getByText(/startDate.*""/)).toBeInTheDocument();
    await expect.element(page.getByText(/location.*""/)).toBeInTheDocument();
    await expect.element(page.getByText(/radius.*""/)).toBeInTheDocument();
    await expect.element(page.getByText(/groupBy.*"year"/)).toBeInTheDocument();
    await expect.element(page.getByText(/crimeTypes.*\[\]/)).toBeInTheDocument();
  });

  test("charts are properly positioned in layout", async () => {
    const page = render(
      <Stub initialEntries={["/trends"]} />
    );

    // Check that charts are rendered in the correct order
    const charts = page.getAllByTestId(/chart$/);
    expect(charts).toHaveLength(3);

    // Verify the order: bar chart, pie chart, line chart
    expect(charts[0]).toHaveAttribute('data-testid', 'bar-chart');
    expect(charts[1]).toHaveAttribute('data-testid', 'pie-chart');
    expect(charts[2]).toHaveAttribute('data-testid', 'line-chart');
  });

  test("chart containers have proper styling", async () => {
    const page = render(
      <Stub initialEntries={["/trends"]} />
    );

    // Check that chart containers have the expected styling classes
    const chartContainers = page.container.querySelectorAll('.bg-black\\/75');
    expect(chartContainers.length).toBeGreaterThan(0);

    // Verify that charts are wrapped in styled containers
    const barChartContainer = page.getByTestId("bar-chart").closest('.bg-black\\/75');
    expect(barChartContainer).toBeTruthy();
  });
});
