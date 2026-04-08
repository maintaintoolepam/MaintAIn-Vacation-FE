// Use an empty string so the browser makes relative requests to '/api'.
// This relies on Vite (dev) or Nginx (prod) to proxy the traffic to the backend correctly.
const BASE_URL = import.meta.env.VITE_BACKEND_URL || '';

const API_BASE = `${BASE_URL}/api`;

function getAuthHeader() {
  const username = sessionStorage.getItem('username');
  const password = sessionStorage.getItem('password');
  if (!username || !password) return {};
  return {
    Authorization: 'Basic ' + btoa(username + ':' + password),
  };
}

async function apiRequest(method, path, body) {
  const options = {
    method,
    headers: {
      ...getAuthHeader(),
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(API_BASE + path, options);

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(text || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) return null;

  return response.json();
}

export function fetchCurrentUser() {
  return apiRequest('GET', '/users/me');
}

export function fetchVacations() {
  return apiRequest('GET', '/vacations');
}

export function createVacation(data) {
  return apiRequest('POST', '/vacations', data);
}

export function deleteVacation(id) {
  return apiRequest('DELETE', '/vacations/' + id);
}