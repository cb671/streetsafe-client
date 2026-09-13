import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import { createRoutesStub } from "react-router";
import * as api from "../app/api/api.js";
import ForgotPassword from "../app/routes/forgot-password.jsx";

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
});
