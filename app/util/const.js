export const routeColors = {
  // keyed by crime level
  0: [251, 113, 133, 255],
  75: [253, 230, 138, 255],
  200: [187, 247, 208, 255],
  // go!
  [-1]: [165, 180, 252, 255]
}

export const routeNames = {
  // keyed by crime level
  0: "Direct",
  75: "Informed",
  200: "Cautious"
}

export const dev = process.env.NODE_ENV !== "production";
