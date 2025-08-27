import { vi } from "vitest";
import {describe, expect, test, it} from "vitest";
import {render} from "vitest-browser-react";
import Learn from "../app/routes/learn.jsx";
import {createRoutesStub} from "react-router";

vi.mock("../app/api/api.js", () => ({
    getEducationalResources: vi.fn(),
  getEducationalResourcesByCrimeType: vi.fn(),
  spy: true
}));


import { getEducationalResources } from "../app/api/api.js";

describe("Learn page", async () => {

    //const {default: Learn} = await import("../app/routes/learn.jsx")
    const Stub = createRoutesStub([
        {
          path: "/learn",
          Component: Learn,
        },
      ]);

    /*vi.mock("../app/api/api.js", () => ({
        getEducationalResources: vi.fn(),
        getEducationalResourcesByCrimeType: vi.fn()
      }));
    */
    //const {getEducationalResources} = await import("../app/api/api.js")

  it("shows a loading message", () => {

    const page = render(<Stub initialEntries={["/learn"]}/>);
    expect(page.getByText(/loading educational resources/i)).toBeInTheDocument();
  });

  it("renders resources when API works", async () => {
    const mock = vi.mocked(getEducationalResources);
    mock.mockResolvedValueOnce({
      resources: [
        {
          id: 1,
          title: "Safety Tips",
          description: "Stay safe",
          type: "guide",
          target_crime_type: "burglary",
          url: "https://example.com",
        },
      ],
      personalisation: { isPersonalised: false },
    });
    const page = render(<Stub initialEntries={["/learn"]}/>);
    await new Promise(r=>setTimeout(r, 200));
    expect(page.getByText("Safety Tips")).toBeInTheDocument()

  });

  it("shows error when API fails", async () => {
    vi.mocked(getEducationalResources).mockRejectedValueOnce(new Error("API is down"));
    const page = render(<Stub initialEntries={["/learn"]}/>);
    await new Promise(r=>setTimeout(r, 200));
    expect(page.getByText(/error loading resources/i)).toBeInTheDocument()
    
  });
});
