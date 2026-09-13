import { afterEach, describe, expect, it, vi } from "vitest";
import { forgotPassword, resendConfirmation } from "../app/api/api.js";

afterEach(() => vi.unstubAllGlobals());

describe("authentication API", () => {
  it("requests a password reset using the backend email contract", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ message: "Reset requested" }),
    });
    vi.stubGlobal("fetch", fetchMock);
    await forgotPassword(" bob@example.com ");
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringMatching(/\/auth\/forgot-password$/),
      expect.objectContaining({
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "bob@example.com" }),
      }),
    );
  });

  it("reports backend password reset errors", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Email sending failed" }),
    }));
    await expect(forgotPassword("bob@example.com")).rejects.toThrow("Email sending failed");
  });

  it("handles non-JSON reset errors", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: false,
      json: async () => { throw new SyntaxError("Invalid JSON"); },
    }));
    await expect(forgotPassword("bob@example.com")).rejects.toThrow("Unable to request a password reset");
  });

  it("posts the email when resending confirmation", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ message: "Confirmation sent" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    await resendConfirmation("bob@example.com");

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringMatching(/\/auth\/resend-confirmation$/),
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: "bob@example.com" }),
      }),
    );
  });
});
