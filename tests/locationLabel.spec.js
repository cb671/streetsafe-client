import { describe, expect, test } from "vitest";
import {
  getHexagonLocationLabel,
  shortenH3,
} from "../app/util/locationLabel.js";

describe("hexagon location labels", () => {
  test("includes the permanent area reference", () => {
    expect(
      getHexagonLocationLabel({
        name: "Woodberry Down, London",
        areaReference: "Area 4",
        h3: "89190d1a803ffff",
      }),
    ).toBe("Woodberry Down · Area 4");
  });

  test("prefers a precise Nominatim road", () => {
    expect(
      getHexagonLocationLabel({
        name: "Gorbals",
        areaReference: "Area 5",
        nominatim: { address: { road: "Crown Street" } },
      }),
    ).toBe("Crown Street · Area 5");
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
