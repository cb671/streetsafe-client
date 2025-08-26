const API_ROOT = 'http://localhost:3000/api';

export function getMapData() {
  return fetch(API_ROOT + '/map').then((r) => r.json());
}

export function getLineChartData(filter) {
  const search = filterParamsBuilder(filter);
  return fetch(API_ROOT + '/graphs/trends?' + search.toString()).then((r) =>
    r.json()
  );
}

export function getBarChartData(filter) {
  const search = filterParamsBuilder(filter);
  console.log(search);
  return fetch(API_ROOT + '/graphs/totals?'+ search.toString()).then((r) =>
    r.json()
  );
}

export function getPieChartData(filter) {
  const search = filterParamsBuilder(filter);
  return fetch(API_ROOT + '/graphs/proportions?' + search.toString()).then(
    (r) => r.json()
  );
}

function filterParamsBuilder({
  startDate,
  endDate,
  location,
  radius,
  crimeTypes,
}) {
  const search = new URLSearchParams();
  if (startDate) search.set('startDate', startDate);
  if (endDate) search.set('endDate', endDate);
  if (location) search.set('location', location);
  if (radius) search.set('radius', radius);
  if (crimeTypes && Array.isArray(crimeTypes) && crimeTypes.length > 0) {
    crimeTypes.forEach((type) => search.append('crimeTypes', type));
  }
  return search;
}
