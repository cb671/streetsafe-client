const API_ROOT = 'http://localhost:3000/api';

export function getMapData() {
    return fetch(API_ROOT + '/map').then(r => r.json())
}

