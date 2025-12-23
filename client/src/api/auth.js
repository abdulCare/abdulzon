import { apiFetch } from './client.js';

export const register = async (payload) =>
  apiFetch('/auth/register', {
    method: 'POST',
    body: payload
  });

export const login = async (payload) =>
  apiFetch('/auth/login', {
    method: 'POST',
    body: payload
  });

export const logout = async () =>
  apiFetch('/auth/logout', {
    method: 'POST'
  });

export const currentUser = async () => apiFetch('/auth/me');
