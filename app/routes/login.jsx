import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { login } from "../api/api.js";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await login(username, password, rememberMe);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-lg font-semibold text-center">Sign In</h2>

      <form
        onSubmit={handleSubmit}
        data-testid="form"
        className="mt-6 space-y-4"
      >
        <div className="px-8">
          <label htmlFor="username" className="block text-sm">
            Email
          </label>
          <input
            id="username"
            name="username"
            type="email"
            autoComplete="username"
            inputMode="text"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white/80 px-3
                        py-3 text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g. john_doe@hello.com"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="px-8">
          <label htmlFor="password" className="block text-sm">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white/80 px-3 
                        py-3 text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="***********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="px-8">
          <label htmlFor="rememberMe" className="flex items-center gap-2 text-sm">
            <input
              id="rememberMe"
              name="rememberMe"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isLoading}
              className="h-4 w-4 rounded border-gray-300 accent-indigo-600 focus:ring-2 focus:ring-indigo-500"
            />
            Remember me
          </label>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center bg-gray-500 hover:bg-blue-700 
                        disabled:cursor-not-allowed disabled:opacity-50
                        text-white font-bold py-2 px-4 rounded-full"
          >
            {isLoading ? "Signing in..." : "Submit"}
          </button>
        </div>
      </form>

      {error && <div className="text-center text-red-500">{error}</div>}
      {error.toLowerCase().includes("confirm") && (
        <p className="mt-3 text-center text-sm text-gray-500">
          Check your inbox for the confirmation link before signing in.
        </p>
      )}

      <p className="mt-6 text-center text-sm text-gray-500">
        <Link to="/forgot-password" className="underline">
          Forgot password?
        </Link>
      </p>

      <p className="mt-6 text-center text-sm text-gray-500">
        New to StreetSafe?{" "}
        <Link to="/register" className="underline">
          Register here
        </Link>
      </p>
    </>
  );
}
