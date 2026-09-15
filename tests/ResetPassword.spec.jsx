import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import { createRoutesStub } from "react-router";
import * as api from "../app/api/api.js";
import ResetPassword from "../app/routes/reset-password.jsx";
import { userEvent } from "@vitest/browser/context";

vi.mock("../app/api/api.js", () => ({
  resetPassword: vi.fn(),
}));

const ResetPasswordRoute = createRoutesStub([
  { path: "/reset-password", Component: ResetPassword },
]);

beforeEach(() => vi.resetAllMocks());

describe("Reset password", () => {
  it("renders the password reset form when a token is present", async () => {
    const page = render(
      <ResetPasswordRoute
        initialEntries={["/reset-password?token=valid-token"]}
      />,
    );

    await expect
      .element(page.getByRole("heading", { name: "Reset your password" }))
      .toBeInTheDocument();

    await expect
      .element(page.getByLabelText("New Password", { exact: true }))
      .toBeEnabled();

    await expect
      .element(page.getByLabelText("Confirm Password", { exact: true }))
      .toBeEnabled();

    await expect
      .element(
        page.getByRole("button", { name: "Reset Password", exact: true }),
      )
      .toBeEnabled();
  });

  it("submits the new password with the token and shows success", async () => {
    api.resetPassword.mockResolvedValue({
      message: "Password reset successfully",
    });

    const page = render(
      <ResetPasswordRoute
        initialEntries={["/reset-password?token=valid-token"]}
      />,
    );

    await userEvent.fill(
      page.getByLabelText("New Password", { exact: true }),
      "newPassword123",
    );

    await userEvent.fill(
      page.getByLabelText("Confirm Password", { exact: true }),
      "newPassword123",
    );

    await userEvent.click(
      page.getByRole("button", { name: "Reset Password", exact: true }),
    );

    await expect
      .element(page.getByRole("status"))
      .toHaveTextContent("Your password has been reset successfully.");

    expect(api.resetPassword).toHaveBeenLastCalledWith(
      "valid-token",
      "newPassword123",
    );
    expect(api.resetPassword).toHaveBeenCalledTimes(1);

    await expect
      .element(page.getByLabelText("New Password", { expect: true }))
      .not.toBeInTheDocument();
  });
});
