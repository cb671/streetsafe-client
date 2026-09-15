import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import { createRoutesStub } from "react-router";
import * as api from "../app/api/api.js";
import ForgotPassword from "../app/routes/forgot-password.jsx";
import { userEvent } from "@vitest/browser/context";

vi.mock("../app/api/api.js", () => ({
  forgotPassword: vi.fn(),
}));

const ForgotPasswordRoute = createRoutesStub([
  { path: "/forgot-password", Component: ForgotPassword },
]);

beforeEach(() => vi.resetAllMocks());

describe("Forgot password", () => {
  it("renders the password reset form", async () => {
    const page = render(
      <ForgotPasswordRoute initialEntries={["/forgot-password"]} />,
    );

    await expect
      .element(page.getByRole("heading", { name: "Forgot password?" }))
      .toBeInTheDocument();

    await expect.element(page.getByLabelText("Email")).toBeEnabled();

    await expect
      .element(page.getByRole("button", { name: "Send reset link" }))
      .toBeEnabled();
  });

  it("submits the email and shows the success message", async () => {
    api.forgotPassword.mockResolvedValue({
      message: "Request requested",
    });

    const page = render(
      <ForgotPasswordRoute initialEntries={["/forgot-password"]} />,
    );

    await userEvent.fill(page.getByLabelText("Email"), "bob@example.com");
    await userEvent.click(
      page.getByRole("button", { name: "Send reset link" }),
    );

    await expect(page.getByRole("status")).toHaveTextContent(
      "If an account exists for this email, a password reset link has been sent.",
    );

    expect(api.forgotPassword).toHaveBeenLastCalledWith("bob@example.com");
    expect(api.forgotPassword).toHaveBeenCalledTimes(1);

    await expect.element(page.getByLabelText("Email")).not.toBeInTheDocument(1);
  });
});
