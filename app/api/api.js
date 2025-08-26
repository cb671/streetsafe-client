const API_ROOT = 'http://localhost:3000/api';

export function getMapData() {
    return fetch(API_ROOT + '/map').then(r => r.json())
}


export async function login(username, password) {
    const response = await fetch(API_ROOT + '/auth/login', {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        credentials: 'include',
        body: JSON.stringify({ username, password })
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
    }
    return response.json();
}



export async function register(username, email, password, postcode) {
    const response = await fetch(API_ROOT + '/auth/register', {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        credentials: 'include',
        body: JSON.stringify({ username, email, password, postcode })
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Register failed');
    }
    return response.json();
}

