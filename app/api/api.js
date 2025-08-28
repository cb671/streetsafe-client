import { dev } from '../util/const.js';

const API_ROOT = !dev ? '/api' : 'http://localhost:3000/api';

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
  return fetch(API_ROOT + '/graphs/totals?' + search.toString()).then((r) =>
    r.json()
  );
}

export async function login(email, password) {
  const response = await fetch(API_ROOT + '/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Login failed');
  }
  return response.json();
}

export async function register(name, email, password, postcode) {
  const response = await fetch(API_ROOT + '/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ name, email, password, postcode }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Register failed');
  }
  return response.json();
}

export async function getHexData(h3) {
  return fetch(`${API_ROOT}/map/hexagon/${h3}`).then((r) => r.json());
}

export async function calculateRoutes(from, to) {
  return fetch(`${API_ROOT}/go`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([from, to]),
  })
    .then((r) => r.json())
    .catch((err) => ({ message: err.toString() }));
}

export async function searchLocation(query, bias) {
  return fetch(
    `${API_ROOT}/go/search?q=${encodeURIComponent(query)}${bias ? '&bias=' + bias.longitude + ',' + bias.latitude : ''}`,
    {
      method: 'POST',
      credentials: 'include',
    }
  )
    .then((r) => r.json())
    .catch((err) => ({ message: err.toString() }));
}

export async function geocode(place) {
  return fetch(`${API_ROOT}/go/geocode?place=${encodeURIComponent(place)}`, {
    method: 'POST',
    credentials: 'include',
  })
    .then((r) => r.json())
    .catch((err) => ({ message: err.toString() }));
}

export async function reverseGeo(lon, lat) {
  return fetch(`${API_ROOT}/go/reverse`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([lon, lat]),
    credentials: 'include',
  })
    .then((r) => r.json())
    .catch((err) => ({ message: err.toString() }));
}
export function getEducationalResources(personalised = true) {
  const url = personalised
    ? API_ROOT + '/educational'
    : API_ROOT + '/educational?personalised=false';

  return fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  }).then((r) => r.json());
}

export function getEducationalResourcesByCrimeType(crimeType) {
  return fetch(API_ROOT + `/educational/crime-type/${crimeType}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  }).then((r) => r.json());
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

export function getUserProfile() {
  return fetch(API_ROOT + '/auth/profile', {
    credentials: 'include',
  })
    .then((r) => {
      if (r.ok) {
        return r.json();
      } else {
        throw new Error('User not authenticated');
      }
    })
    .catch((err) => {
      console.error('Failed to fetch user profile:', err);
      throw err;
    });
}

export const logout = async () => {
  try {
    const response = await fetch(API_ROOT + '/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }

    localStorage.removeItem('authToken');

    return await response.json();
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};
