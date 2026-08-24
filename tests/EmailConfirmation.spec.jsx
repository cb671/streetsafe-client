import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import { createRoutesStub } from "react-router";
import * as api from "../app/api/api.js";
import ConfirmEmail from "../app/routes/confirm-email.jsx";

vi.mock("../app/api/api.js", { spy: true });

const ConfirmationRoute = createRoutesStub([
  { path: "/confirm-email", Component: ConfirmEmail },
  { path: "/login", Component: () => <p>Login page</p> },
]);

beforeEach(() => vi.clearAllMocks());

describe("Email confirmation", () => {
  it("confirms a token and shows the success state", async () => {
    api.confirmEmail.mockResolvedValue({ message: "Email confirmed successfully" });
    const page = render(<ConfirmationRoute initialEntries={["/confirm-email?token=valid-token"]} />);

    await expect.element(page.getByText("Email confirmed")).toBeInTheDocument();
    expect(api.confirmEmail).toHaveBeenCalledWith("valid-token");
    expect(page.getByRole("link", { name: "Log in" })).toHaveAttribute("href", "/login");
  });

  it("shows a missing-token error without calling the API", async () => {
    const page = render(<ConfirmationRoute initialEntries={["/confirm-email"]} />);

    await expect.element(page.getByText("The confirmation link is missing its token")).toBeInTheDocument();
    expect(api.confirmEmail).not.toHaveBeenCalled();
  });

  it("shows the backend message for an invalid or expired token", async () => {
    api.confirmEmail.mockRejectedValue(new Error("Confirmation link is invalid or expired"));
    const page = render(<ConfirmationRoute initialEntries={["/confirm-email?token=expired"]} />);

    await expect.element(page.getByText("Confirmation link is invalid or expired")).toBeInTheDocument();
  });
});
