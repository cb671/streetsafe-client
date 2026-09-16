import { Bookmark } from "lucide-react";

export default function BookmarkButton({ resource, bookmarks }) {
  if (bookmarks.expired) return null;
  const saved = bookmarks.resources.some((item) => item.id === resource.id);
  const label = `${saved ? "Remove saved resource" : "Save resource"}: ${resource.title}`;
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={saved}
      aria-busy={bookmarks.pending.has(resource.id)}
      disabled={!bookmarks.ready || bookmarks.pending.has(resource.id)}
      onClick={() => bookmarks.toggle(resource)}
      className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300 disabled:opacity-50 disabled:cursor-wait ${saved ? "border-blue-400/50 bg-blue-500/20 text-blue-300" : "border-whiteish/20 text-whiteish/70 hover:bg-white/10 hover:text-whiteish"}`}
    >
      <Bookmark size={21} fill={saved ? "currentColor" : "none"} aria-hidden="true" />
    </button>
  );
}
