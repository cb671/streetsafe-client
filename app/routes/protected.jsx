import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import { getUserProfile } from "../api/api.js";

export default function ProtectedRoute() {
  const [status, setStatus] = useState("loading");
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    getUserProfile()
      .then((data) => {
        if (isMounted) {
          setUser(data.user);
          setStatus("authenticated");
        }
        if (isMounted) setStatus("authenticated");
      })
      .catch(() => {
        if (isMounted) setStatus("unauthenticated");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (status === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Loading your dashboard...</p>
      </main>
    );
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet context={{ user }} />;
}
