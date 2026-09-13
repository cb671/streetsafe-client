import { useState } from "react";
import { Link } from "react-router";
import { forgotPassword } from "../api/api.js";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    setError("");

    try {
      await forgotPassword(email);
      setIsSent(true);
    } catch (err) {
      setError(err.message || "Unable to request a password reset. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-lg font-semibold text-center">Forgot password?</h2>
      {isSent ? (
        <p role="status" className="mt-6 text-center text-sm">
          If an account exists for this email, a password reset link has been sent.
          Check your inbox and spam folder.
        </p>
      ) : (
        <>
          <p className="mt-3 text-center text-sm">
            Enter your account email to request a password reset link.
          </p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4" aria-busy={isLoading}>
            <div className="px-8">
              <label htmlFor="email" className="block text-sm">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                disabled={isLoading}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white/80 px-3 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center bg-gray-500 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 text-white font-bold py-2 px-4 rounded-full"
              >
                {isLoading ? "Sending..." : "Send reset link"}
              </button>
            </div>
          </form>
        </>
      )}
      {error && <p role="alert" className="mt-4 text-center text-red-500">{error}</p>}
      <p className="mt-6 text-center text-sm text-gray-500">
        <Link to="/login" className="underline">Back to sign in</Link>
      </p>
    </>
  );
}
