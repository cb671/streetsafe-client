import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import { createRoutesStub, Outlet } from "react-router";
import { userEvent } from "@vitest/browser/context";
import * as api from "../app/api/api.js";
import Learn from "../app/routes/learn.jsx";
import Dashboard from "../app/routes/dashboard.jsx";
import { updatePostcode } from "../app/api/api.js";

vi.mock("../app/api/api.js", () => ({
  getUserProfile: vi.fn(),
  getEducationalResources: vi.fn(),
  getEducationalResourcesByCrimeType: vi.fn(),
  getSavedResources: vi.fn(),
  saveResource: vi.fn(),
  removeSavedResource: vi.fn(),
  updatePostcode: vi.fn(),
}));

const resource = {
  id: 3,
  title: "Safety guide",
  description: "Stay safe at home.",
  type: "guide",
  target_crime_type: "burglary",
  url: "https://example.com/safety",
};
const LearnRoute = createRoutesStub([{ path: "/learn", Component: Learn }]);
const DashboardRoute = createRoutesStub([
  {
    Component: () => (
      <Outlet
        context={{
          user: { id: 7, name: "Reader", email: "reader@example.com" },
        }}
      />
    ),
    children: [{ path: "/dashboard", Component: Dashboard }],
  },
]);

beforeEach(() => {
  vi.resetAllMocks();
  api.getUserProfile.mockResolvedValue({ user: { id: 7 } });
  api.getEducationalResources.mockResolvedValue({
    resources: [resource],
    personalisation: { isPersonalised: false },
  });
  api.getSavedResources.mockResolvedValue({ resources: [] });
  api.saveResource.mockResolvedValue({ saved: true });
  api.removeSavedResource.mockResolvedValue(undefined);
  api.updatePostcode.mockResolvedValue(undefined);
});

describe("Resource bookmarks", () => {
  it("hides bookmark buttons and does not fetch bookmarks for visitors", async () => {
    api.getUserProfile.mockRejectedValue(new Error("Sign in"));
    const page = render(<LearnRoute initialEntries={["/learn"]} />);
    await expect
      .element(page.getByRole("heading", { name: resource.title }))
      .toBeInTheDocument();
    await expect
      .element(page.getByRole("button", { name: /save resource/i }))
      .not.toBeInTheDocument();
    expect(api.getSavedResources).not.toHaveBeenCalled();
  });

  it("saves and removes a resource with a pressed bookmark state", async () => {
    const page = render(<LearnRoute initialEntries={["/learn"]} />);
    const save = page.getByRole("button", {
      name: `Save resource: ${resource.title}`,
    });
    await expect.element(save).toBeEnabled();
    await userEvent.click(save);
    const remove = page.getByRole("button", {
      name: `Remove saved resource: ${resource.title}`,
    });
    await expect.element(remove).toHaveAttribute("aria-pressed", "true");
    expect(api.saveResource).toHaveBeenCalledWith(3);
    await userEvent.click(remove);
    await expect.element(save).toHaveAttribute("aria-pressed", "false");
    expect(api.removeSavedResource).toHaveBeenCalledWith(3);
  });

  it("restores previously saved bookmarks", async () => {
    api.getSavedResources.mockResolvedValue({ resources: [resource] });
    const page = render(<LearnRoute initialEntries={["/learn"]} />);
    await expect
      .element(page.getByRole("button", { name: /remove saved resource/i }))
      .toHaveAttribute("aria-pressed", "true");
  });

  it("retains the unsaved state when saving fails", async () => {
    api.saveResource.mockRejectedValue(new Error("Unable to save. Try again."));
    const page = render(<LearnRoute initialEntries={["/learn"]} />);
    const save = page.getByRole("button", { name: /save resource:/i });
    await expect.element(save).toBeEnabled();
    await userEvent.click(save);
    await expect
      .element(page.getByRole("alert"))
      .toHaveTextContent("Unable to save");
    await expect.element(save).toHaveAttribute("aria-pressed", "false");
  });

  it("hides bookmarks when the session expires", async () => {
    api.saveResource.mockRejectedValue(
      Object.assign(new Error("Please sign in."), { status: 401 }),
    );
    const page = render(<LearnRoute initialEntries={["/learn"]} />);
    const save = page.getByRole("button", { name: /save resource:/i });
    await expect.element(save).toBeEnabled();
    await userEvent.click(save);
    await expect
      .element(page.getByRole("alert"))
      .toHaveTextContent("Please sign in.");
    await expect.element(save).not.toBeInTheDocument();
  });

  it("lists saved resources on the dashboard and removes them", async () => {
    api.getSavedResources.mockResolvedValue({ resources: [resource] });
    const page = render(<DashboardRoute initialEntries={["/dashboard"]} />);
    const link = page.getByRole("link", { name: /safety guide/i });
    await expect.element(link).toHaveAttribute("href", resource.url);
    await userEvent.click(
      page.getByRole("button", { name: /remove saved resource/i }),
    );
    await expect
      .element(page.getByText(/no saved resources yet/i))
      .toBeInTheDocument();
    await expect.element(link).not.toBeInTheDocument();
  });

  it("offers a retry when saved resources fail to load", async () => {
    api.getSavedResources.mockRejectedValueOnce(
      new Error("Unable to load bookmarks"),
    );
    const page = render(<DashboardRoute initialEntries={["/dashboard"]} />);
    await expect
      .element(page.getByRole("alert"))
      .toHaveTextContent("Unable to load bookmarks");
    await userEvent.click(page.getByRole("button", { name: "Try again" }));
    await expect
      .element(page.getByText(/no saved resources yet/i))
      .toBeInTheDocument();
  });
});
