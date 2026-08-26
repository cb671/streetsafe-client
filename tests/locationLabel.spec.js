import { describe, expect, test } from "vitest";
import {
  getHexagonLocationLabel,
  shortenH3,
} from "../app/util/locationLabel.js";

describe("hexagon location labels", () => {
  test("disambiguates a broad location with the selected H3 cell", () => {
    expect(
      getHexagonLocationLabel({
        name: "Gorbals, Glasgow, Glasgow City",
        h3: "89190d1a803ffff",
      }),
    ).toBe("Gorbals · 89190");
  });

  test("prefers a precise Nominatim road", () => {
    expect(
      getHexagonLocationLabel({
        name: "Gorbals",
        h3: "89195d1a803ffff",
        address: { road: "Crown Street" },
      }),
    ).toBe("Crown Street");
  });

  test("supports a nested Nominatim address", () => {
    expect(
      getHexagonLocationLabel({
        name: "Gorbals",
        nominatim: { address: { pedestrian: "Hospital Street" } },
      }),
    ).toBe("Hospital Street");
  });

  test("limits identifiers to five characters", () => {
    expect(shortenH3("abc123")).toBe("abc12");
  });
});
