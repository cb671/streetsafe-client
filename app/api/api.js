const API_ROOT = 'http://localhost:3000/api';

export function getMapData() {
    return fetch(API_ROOT + '/map').then(r => r.json())
}

export function getHexData(h3) {
    return fetch(`${API_ROOT}/map/hexagon/${h3}`).then(r=>r.json())
}

export function calculateRoutes(from, to){
    return fetch(`${API_ROOT}/`)
}
