import { useState } from "react";
import { Link } from "react-router";
import { register, resendConfirmation } from "../api/api.js";

export default function Register() {
  const [registrationResult, setRegistrationResult] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [postcode, setPostcode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const data = await register(username, email, password, postcode);

      if (data.requiresEmailConfirmation) {
        setRegistrationResult(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setError("");
    setResendMessage("");

    try {
      const data = await resendConfirmation(email);
      setResendMessage(data.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsResending(false);
    }
  };

  if (registrationResult) {
    return (
      <div className="text-center">
        <h2 className="text-lg font-semibold">Check your email</h2>

        <p className="mt-3">{registrationResult.message}</p>

        <p className="mt-3 text-sm text-gray-500">
          We sent a confirmation link to {email}.
        </p>

        <button
          type="button"
          onClick={handleResend}
          disabled={isResending}
          className="mt-4 rounded-full bg-gray-500 px-4 py-2 font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isResending ? "Resending..." : "Resend confirmation email"}
        </button>

        {resendMessage && <p className="mt-3">{resendMessage}</p>}
        {error && <p className="mt-3 text-red-500">{error}</p>}

        <Link to="/login" className="mt-4 block underline">
          Go to login
        </Link>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-lg font-semibold text-center">Register</h2>

      <form
        onSubmit={handleSubmit}
        data-testid="form"
        className="mt-6 space-y-4"
      >
        <div className="px-4">
          <label htmlFor="username" className="block text-sm">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
            className="h-8 mt-1 block w-full rounded-md border border-gray-300 bg-white/80 px-3
                        py-3 text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g. john_doe"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="px-4">
          <label htmlFor="email" className="block text-sm">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            className="h-8 mt-1 block w-full rounded-md border border-gray-300 bg-white/80 px-3 
                        py-3 text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="px-4">
          <label htmlFor="password" className="block text-sm">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            className="h-8 mt-1 block w-full rounded-md border border-gray-300 bg-white/80 px-3
                        py-3 text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="px-4">
          <label htmlFor="postcode" className="block text-sm">
            Postcode
          </label>
          <input
            id="postcode"
            name="postcode"
            type="text"
            required
            className="h-8 mt-1 block w-full rounded-md border border-gray-300 bg-white/80 px-3 
                        py-3 text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
          />
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center bg-gray-500 hover:bg-blue-700 
                        disabled:cursor-not-allowed disabled:opacity-50
                        text-white font-bold py-2 px-4 rounded-full"
          >
            {isLoading ? "Registering..." : "Submit"}
          </button>
        </div>
      </form>

      {error && <div className="text-center text-red-500">{error}</div>}

      <p className="mt-6 text-center text-sm text-gray-500">
        Already registered?{" "}
        <Link to="/login" className="underline">
          Log In here
        </Link>
      </p>
    </>
  );
}
