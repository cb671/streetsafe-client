const API_ROOT = 'http://localhost:3000/api';

function getAuthHeaders() {
  return {
    'Content-Type': 'application/json'
  };
}

export function getMapData() {
    return fetch(API_ROOT + '/map', {
    }).then(r => r.json())
}

export function getEducationalResources(personalised = true) {
    const url = personalised
      ? API_ROOT + '/educational'
      : API_ROOT + '/educational?personalised=false';
      
    return fetch(url, {
      headers: getAuthHeaders(),
      credentials: 'include'
    }).then(r => r.json())
}
