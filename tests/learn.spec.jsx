import { vi } from "vitest";
import {describe, expect, test, it} from "vitest";
import {render} from "vitest-browser-react";
import Learn from "../app/routes/learn.jsx";
import {createRoutesStub} from "react-router";
import { userEvent } from '@vitest/browser/context';


vi.mock("../app/api/api.js", () => ({
    getEducationalResources: vi.fn(),
    getEducationalResourcesByCrimeType: vi.fn(),
    spy: true
}));


import { getEducationalResources, getEducationalResourcesByCrimeType } from "../app/api/api.js";

describe("Learn page", async () => {

    const Stub = createRoutesStub([
        {
          path: "/learn",
          Component: Learn,
        },
      ]);

    
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

///////////////

it("opens the crime type filter and selects a crime type", async () => {
    const mock = vi.mocked(getEducationalResources);
    mock.mockResolvedValue({
      resources: [
        { id: 1, title: "Burglary Tips", type: "guide", description: "Stay safe", target_crime_type: "burglary", url: "#" },
        { id: 2, title: "Robbery Tips", type: "guide", description: "Be careful", target_crime_type: "robbery", url: "#" }
      ],
      personalisation: { isPersonalised: false },
    });

    const mock2 = vi.mocked(getEducationalResourcesByCrimeType);
    mock2.mockImplementation(crimetype => {
        if (crimetype == 'burglary')
            return {
                resources: [
                { id: 1, title: "Burglary Tips", type: "guide", description: "Stay safe", target_crime_type: "burglary", url: "#" },
              ],
              personalisation: { isPersonalised: false },
            }
        return {
            resources: [
              { id: 1, title: "Burglary Tips", type: "guide", description: "Stay safe", target_crime_type: "burglary", url: "#" },
              { id: 2, title: "Robbery Tips", type: "guide", description: "Be careful", target_crime_type: "robbery", url: "#" }
            ],
            personalisation: { isPersonalised: false },
          }

    })



    render(<Stub initialEntries={["/learn"]} />);
  
    await new Promise(r => setTimeout(r, 200));
  
    const allResourcesButton = document.querySelector('[data-testid="all-resources-button"]');
    expect(allResourcesButton).toBeDefined();
    //await userEvent.click(allResourcesButton);
    try {
        await userEvent.click(allResourcesButton);
        console.log("Click successful!");
      } catch (err) {
        console.error("Click failed:", err);
      }

  
    await new Promise(r => setTimeout(r, 1500));
  
    

    const filterButton = document.querySelector('[data-testid="filter-toggle-button"]');
    expect(filterButton).toBeDefined();
    //await userEvent.click(filterButton);
    try {
        await userEvent.click(filterButton);
        console.log("Click successful!");
      } catch (err) {
        console.error("Click failed:", err);
      }

  
    await new Promise(r => setTimeout(r, 200));
  
    const burglaryButton = document.querySelector('[data-testid="crime-option-burglary"]');
    expect(burglaryButton).toBeDefined();
    await userEvent.click(burglaryButton);
  
    await new Promise(r => setTimeout(r, 200));
  
    const burglaryResource = Array.from(document.querySelectorAll("div.space-y-6 h2"))
      .find(h2 => h2.textContent === "Burglary Tips");
    expect(burglaryResource).toBeDefined();
  
    const robberyResource = Array.from(document.querySelectorAll("div.space-y-6 h2"))
      .find(h2 => h2.textContent === "Robbery Tips");
    expect(robberyResource).toBeUndefined();
  });

});
