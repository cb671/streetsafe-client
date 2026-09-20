import { Link, useOutletContext } from "react-router";
import { useState } from "react";
import { updatePostcode } from "~/api/api.js";
import useBookmarks from "../hooks/useBookmarks.js";
import BookmarkButton from "../components/BookmarkButton.jsx";

export default function Dashboard() {
  const { user } = useOutletContext();
  const bookmarks = useBookmarks(Boolean(user));
  const [postcode, setPostcode] = useState("");
  const [isEditingPostcode, setIsEditingPostcode] = useState(false);
  const [isSavingPostcode, setIsSavingPostcode] = useState(false);
  const [postcodeError, setPostcodeError] = useState("");
  const [postcodeMessage, setPostcodeMessage] = useState("");

  async function handlePostcodeSubmit(event) {
    event.preventDefault();

    setIsSavingPostcode(true);
    setPostcodeError("");
    setPostcodeMessage("");

    try {
      await updatePostcode(postcode.trim());

      setPostcodeMessage("Postcode saved. Open the home map to see your area.");
      setPostcode("");
      setIsEditingPostcode(false);
    } catch (error) {
      setPostcodeError(error.message);
    } finally {
      setIsSavingPostcode(false);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-heading text-4xl">Dashboard</h1>

      <p className="mt-2 text-gray-600">
        Your StreetSafe activity and account information.
      </p>

      <section
        aria-labelledby="saved-resources-heading"
        className="mt-8 rounded-xl bg-black/75 p-6 text-whiteish"
      >
        <h2 id="saved-resources-heading" className="text-xl font-semibold">
          Saved resources
        </h2>
        {bookmarks.loading && (
          <p role="status" className="mt-4">
            Loading saved resources...
          </p>
        )}
        {bookmarks.error && (
          <div role="alert" className="mt-4 text-red-200">
            <p>{bookmarks.error}</p>
            {bookmarks.expired ? (
              <Link to="/login" className="underline">
                Sign in again
              </Link>
            ) : (
              <button
                type="button"
                onClick={bookmarks.reload}
                disabled={bookmarks.loading}
                className="mt-2 underline"
              >
                Try again
              </button>
            )}
          </div>
        )}
        {bookmarks.ready &&
          !bookmarks.loading &&
          bookmarks.resources.length === 0 && (
            <p className="mt-4 text-whiteish/70">
              No saved resources yet.{" "}
              <Link to="/learn" className="text-blue-300 underline">
                Explore the Learn page
              </Link>{" "}
              and select a bookmark to save a resource here.
            </p>
          )}
        {bookmarks.resources.length > 0 && (
          <ul className="mt-4 space-y-4">
            {bookmarks.resources.map((resource) => (
              <li
                key={resource.id}
                className="flex items-start gap-4 rounded-lg border border-whiteish/15 p-4"
              >
                <div className="min-w-0 flex-1">
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-blue-300 underline hover:text-blue-200"
                  >
                    {resource.title}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                  <p className="mt-2 text-sm text-whiteish/70">
                    {resource.description}
                  </p>
                </div>
                <BookmarkButton resource={resource} bookmarks={bookmarks} />
              </li>
            ))}
          </ul>
        )}
      </section>

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

        {postcodeError && (
          <p role="alert" className="mt-2 text-red-300">
            {postcodeError}
          </p>
        )}

        {postcodeMessage && (
          <p role="status" className="mt-2 text-green-300">
            {postcodeMessage}
          </p>
        )}

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
          <form onSubmit={handlePostcodeSubmit} className="mt-4 space-y-4">
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
                disabled={isSavingPostcode}
                className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white disabled:opacity-50"
              >
                {isSavingPostcode ? "Saving..." : "Save postcode"}
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
