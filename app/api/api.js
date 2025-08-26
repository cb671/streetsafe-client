const API_ROOT = '/api';

export function getMapData() {
    return fetch(API_ROOT + '/map', {
      credentials: 'include'
    }).then(r => r.json())
}

export function getEducationalResources(personalised = true) {
    const url = personalised
      ? API_ROOT + '/educational'
      : API_ROOT + '/educational?personalised=false';
      
    return fetch(url, {
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    }).then(r => r.json())
}

export function getEducationalResourcesByCrimeType(crimeType) {
    return fetch(API_ROOT + `/educational/crime-type/${crimeType}`, {
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    }).then(r => r.json())
}
