import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { resetPassword } from "../api/api.js";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isLoading) return;

    setError("");

    if (!token) {
      setError(
        "The reset link is missing its token. Please request a new link.",
      );
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      await resetPassword(token, newPassword);
      setIsSuccess(true);
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.message || "Unable to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="mt-4 text-center text-green-500">
        <h2 className="text-lg font-semibold">Password Reset Successful</h2>
        <p role="status" className="mt-3">
          Your password has been reset successfully. You can now sign in with
          your new password.
        </p>
        <Link to="/login" className="mt-4 inline-block underline">
          Back to sign in
        </Link>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="text-center">
        <h2 className="text-lg font-semibold">Invalid reset link</h2>
        <p className="mt-3">
          This link is missing its reset token. Please request a new link.
        </p>
        <Link to="/forgot-password" className="mt-4 inline-block underline">
          Request a new reset link
        </Link>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-lg font-semibold text-center">Reset your password</h2>

      <form onSubmit={handleSubmit}>
        <div className="mt-6">
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium text-gray-700"
          >
            New Password
          </label>
          <input
            id="newPassword"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={isLoading}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mt-6">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? "Resetting..." : "Reset Password"}
        </button>
      </form>

      {error && (
        <p role="alert" className="mt-4 text-center text-red-500">
          {error}
        </p>
      )}

      <p className="mt-6 text-center text-sm">
        <Link to="/forgot-password" className="underline">
          Request a new reset link
        </Link>
      </p>
    </>
  );
}
