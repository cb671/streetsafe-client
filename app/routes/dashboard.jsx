import { useOutletContext } from "react-router-dom";
import { useState } from "react";

export default function Dashboard() {
  const { user } = useOutletContext();
  const [isEditingPostcode, setIsEditingPostcode] = useState(false);
  const [postcode, setPostcode] = useState("");

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-heading text-4xl">Dashboard</h1>

      <p className="mt-2 text-gray-600">
        Your StreetSafe activity and account information.
      </p>

      <section className="mt-8 rounded-xl bg-black/75 p-6 text-whiteish">
        <p className="flex gap-2">
          <span className="font-semibold">Username:</span>
          <span>{user.name}</span>
        </p>
      </section>

      <section className="mt-8 rounded-xl bg-black/75 p-6 text-whiteish">
        <p className="flex gap-2">
          <span className="font-semibold">Email:</span>
          <span>{user.email}</span>
        </p>
      </section>

      <section className="mt-8 rounded-xl bg-black/75 p-6 text-whiteish">
        <h2 className="text-xl font-semibold">Home area</h2>

        <p className="mt-2">
          <span>Status:{user?.h3 ? "Configured" : "Not configured"}</span>
        </p>

        {!isEditingPostcode ? (
          <button
            type="button"
            onClick={() => setIsEditingPostcode(true)}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white"
          >
            {user?.h3 ? "Change postcode" : "Add postcode"}
          </button>
        ) : (
          <form className="mt-4 space-y-4">
            <div>
              <label htmlFor="postcode" className="block text-sm font-medium">
                New postcode
              </label>

              <input
                id="postcode"
                name="postcode"
                type="text"
                autoComplete="postal-code"
                placeholder="Enter your full or partial postcode"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                required
                className="mt-1 block w-full max-w-sm rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white"
              >
                Save postcode
              </button>

              <button
                type="button"
                onClick={() => {
                  setPostcode("");
                  setIsEditingPostcode(false);
                }}
                className="rounded-lg border border-whiteish/30 px-4 py-2"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </section>
    </main>
  );
}
