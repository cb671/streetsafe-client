import { describe, it, expect, vi, beforeEach } from "vitest";
import TrendFilter from "../app/components/TrendFilter.jsx";
import { render } from "vitest-browser-react";
import * as api from "../app/api/api.js";
import { TreeDeciduous } from "lucide-react";
import { userEvent } from "@vitest/browser/context";
import { waitFor } from "@testing-library/react";

vi.mock("../app/api/api.js", { spy: true });

describe("TrendFilter", () => {
  it("calls handleFilter", async () => {
    const handleFilter = vi.fn();
    const page = render(
      <TrendFilter handleFilter={handleFilter} filter={{ crimeTypes: [] }} />,
    );
    const filterButton = page.getByRole("button", {
      name: "Filter",
      exact: true,
    });

    await expect.element(filterButton).toBeInTheDocument();
    await userEvent.click(filterButton);
    await waitFor(() => expect(handleFilter).toBeCalled());
  });
});
