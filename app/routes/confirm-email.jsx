import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { confirmEmail } from "../api/api.js";

export default function ConfirmEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  // Send token to the backend confirmation endpoint.
  useEffect(() => {
    if (!token) {
      setStatus("error");
      setError("The confirmation link is missing its token");
      return;
    }

    confirmEmail(token)
      .then(() => setStatus("success"))
      .catch((err) => {
        setStatus("error");
        setError(err.message);
      });
  }, [token]);

  if (status === "loading") {
    return <p className="text-center">Confirming your email...</p>;
  }

  if (status === "success") {
    return (
      <div className="text-center">
        <h2 className="text-lg font-semibold">Email confirmed</h2>
        <p className="mt-3">Your account is ready to use.</p>
        <Link to="/login" className="mt-4 inline-block underline">
          Log in
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center">
      <h2 className="text-lg font-semibold">Email confirmation failed</h2>
      <p className="mt-3 text-red-500">{error}</p>
    </div>
  );
}
