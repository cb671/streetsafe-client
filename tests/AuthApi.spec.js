import { afterEach, describe, expect, it, vi } from "vitest";
import { resendConfirmation } from "../app/api/api.js";

afterEach(() => vi.unstubAllGlobals());

describe("authentication API", () => {
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
