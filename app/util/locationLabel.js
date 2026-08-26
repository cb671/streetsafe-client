const PRECISE_LOCATION_FIELDS = [
  "road",
  "pedestrian",
  "footway",
  "path",
  "localFeature",
  "local_feature",
];

function firstTextValue(source, fields) {
  if (!source || typeof source !== "object") return null;

  for (const field of fields) {
    const value = source[field];
    if (typeof value === "string" && value.trim()) return value.trim();
  }

  return null;
}

export function shortenH3(h3) {
  if (typeof h3 !== "string" || !h3.trim()) return null;

  return h3.trim().slice(0, 5);
}

export function getHexagonLocationLabel(data) {
  if (!data || typeof data !== "object") return "Unknown location";

  const preciseLocation =
    firstTextValue(data, PRECISE_LOCATION_FIELDS) ||
    firstTextValue(data.address, PRECISE_LOCATION_FIELDS) ||
    firstTextValue(data.nominatim?.address, PRECISE_LOCATION_FIELDS);

  if (preciseLocation) return preciseLocation;

  const broadLocation = (
    firstTextValue(data, ["name", "display_name"]) || "Unknown location"
  ).split(",", 1)[0].trim();
  const shortH3 = shortenH3(data.h3);

  return shortH3 ? `${broadLocation} · ${shortH3}` : broadLocation;
}
