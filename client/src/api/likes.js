import { apiFetch } from './client.js';

export const fetchLikes = async () => apiFetch('/likes');

export const likeProduct = async (productId) =>
  apiFetch(`/likes/${productId}`, {
    method: 'POST'
  });

export const unlikeProduct = async (productId) =>
  apiFetch(`/likes/${productId}`, {
    method: 'DELETE'
  });
