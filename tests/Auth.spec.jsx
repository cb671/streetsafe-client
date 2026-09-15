import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import { userEvent } from "@vitest/browser/context";
import { waitFor } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import * as api from "../app/api/api.js";
import Login from "../app/routes/login.jsx";
import Register from "../app/routes/register.jsx";
import AuthLayout from "../app/routes/auth.jsx";

vi.mock("../app/api/api.js", { spy: true });

const AuthRoutes = createRoutesStub([
  { path: "/", Component: () => <p>Home page</p> },
  { path: "/login", Component: Login },
  { path: "/register", Component: Register },
  { path: "/dashboard", Component: () => <p>Dashboard page</p> },
]);

async function completeRegistrationForm() {
  await userEvent.fill(document.querySelector('input[name="username"]'), "Bob");
  await userEvent.fill(
    document.querySelector('input[name="email"]'),
    "bob@example.com",
  );
  await userEvent.fill(
    document.querySelector('input[name="password"]'),
    "password123",
  );
  await userEvent.fill(
    document.querySelector('input[name="postcode"]'),
    "N16 5JJ",
  );
}

beforeEach(() => vi.clearAllMocks());

describe("Register", () => {
  it("preserves a password filled without change events across renders and submits it", async () => {
    api.register.mockRejectedValue(new Error("Please try again."));
    const page = render(<AuthRoutes initialEntries={["/register"]} />);
    await completeRegistrationForm();

    const passwordInput = document.querySelector('input[name="password"]');
    // Simulate a password manager writing directly without notifying React.
    passwordInput.value = "generated-Test-42!";
    await userEvent.fill(document.querySelector('input[name="postcode"]'), "N16 6AA");
    expect(passwordInput.value).toBe("generated-Test-42!");

    await userEvent.click(page.getByRole("button", { name: "Submit" }));
    await expect.element(page.getByText("Please try again.")).toBeInTheDocument();
    expect(api.register).toHaveBeenCalledWith(
      "Bob", "bob@example.com", "generated-Test-42!", "N16 6AA",
    );
    expect(passwordInput.value).toBe("generated-Test-42!");
  });

  it("renders the registration form", () => {
    const page = render(<AuthRoutes initialEntries={["/register"]} />);
    expect(page.getByTestId("form")).toBeInTheDocument();
  });

  it("shows check-email guidance and does not navigate home", async () => {
    api.register.mockResolvedValue({
      message: "Registration successful. Please check your email.",
      requiresEmailConfirmation: true,
      confirmationEmailSent: true,
    });
    const page = render(<AuthRoutes initialEntries={["/register"]} />);

    await completeRegistrationForm();
    await userEvent.click(page.getByRole("button", { name: "Submit" }));

    await waitFor(() => expect(api.register).toHaveBeenCalled());
    expect(api.register).toHaveBeenCalledWith(
      "Bob",
      "bob@example.com",
      "password123",
      "N16 5JJ",
    );
    await expect
      .element(page.getByRole("heading", { name: "Check your email" }))
      .toBeInTheDocument();
    expect(document.body.textContent).not.toContain("Home page");
  });

  it("offers a resend action when initial email delivery fails", async () => {
    api.register.mockResolvedValue({
      message: "Registration succeeded, but the email could not be sent.",
      requiresEmailConfirmation: true,
      confirmationEmailSent: false,
    });
    const page = render(<AuthRoutes initialEntries={["/register"]} />);

    await completeRegistrationForm();
    await userEvent.click(page.getByRole("button", { name: "Submit" }));

    await expect
      .element(page.getByRole("button", { name: "Resend confirmation email" }))
      .toBeInTheDocument();
  });

  it("resends confirmation to the registered email", async () => {
    api.register.mockResolvedValue({
      message: "Please check your email.",
      requiresEmailConfirmation: true,
      confirmationEmailSent: true,
    });
    api.resendConfirmation.mockResolvedValue({
      message: "A new confirmation email has been sent.",
    });
    const page = render(<AuthRoutes initialEntries={["/register"]} />);

    await completeRegistrationForm();
    await userEvent.click(page.getByRole("button", { name: "Submit" }));
    await userEvent.click(
      page.getByRole("button", { name: "Resend confirmation email" }),
    );

    await waitFor(() =>
      expect(api.resendConfirmation).toHaveBeenCalledWith("bob@example.com"),
    );
    await expect
      .element(page.getByText("A new confirmation email has been sent."))
      .toBeInTheDocument();
  });
});

describe("Login", () => {
  it.each([false, true])("submits login with rememberMe=%s and navigates home", async (rememberMe) => {
    api.login.mockResolvedValue({ message: "Login successful" });
    const page = render(<AuthRoutes initialEntries={["/login"]} />);

    const checkbox = page.getByRole("checkbox", { name: "Remember me" });
    await expect.element(checkbox).not.toBeChecked();
    if (rememberMe) await userEvent.click(checkbox);

    await userEvent.fill(
      document.querySelector('input[name="username"]'),
      "bob@example.com",
    );
    await userEvent.fill(
      document.querySelector('input[name="password"]'),
      "password123",
    );
    await userEvent.click(page.getByRole("button", { name: "Submit" }));

    await waitFor(() =>
      expect(api.login).toHaveBeenCalledWith("bob@example.com", "password123", rememberMe),
    );
    await expect.element(page.getByText("Dashboard page")).toBeInTheDocument();
  });

  it("shows confirmation guidance when login rejects an unconfirmed email", async () => {
    api.login.mockRejectedValue(
      new Error("Email address has not been confirmed"),
    );
    const page = render(<AuthRoutes initialEntries={["/login"]} />);

    await userEvent.fill(
      document.querySelector('input[name="username"]'),
      "bob@example.com",
    );
    await userEvent.fill(
      document.querySelector('input[name="password"]'),
      "password123",
    );
    await userEvent.click(page.getByRole("button", { name: "Submit" }));

    await expect
      .element(page.getByText("Email address has not been confirmed"))
      .toBeInTheDocument();
    await expect
      .element(
        page.getByText(
          "Check your inbox for the confirmation link before signing in.",
        ),
      )
      .toBeInTheDocument();
  });
});

describe("Auth layout", () => {
  it("renders its heading", () => {
    const AuthLayoutStub = createRoutesStub([
      { path: "/auth", Component: AuthLayout },
    ]);
    const page = render(<AuthLayoutStub initialEntries={["/auth"]} />);
    expect(page.getByTestId("authheading")).toBeInTheDocument();
  });
});
