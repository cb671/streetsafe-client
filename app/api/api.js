const API_ROOT = 'http://localhost:3000/api';

function getAuthHeaders() {

  return {
    'Content-Type': 'application/json'
  };
}

export function getMapData() {
    return fetch(API_ROOT + '/map', {
      headers: getAuthHeaders()
    }).then(r => r.json())
}

export function getEducationalResources() {
    return fetch(API_ROOT + '/educational', {
      headers: getAuthHeaders(),
      credentials: 'include'
    }).then(r => r.json())
}
