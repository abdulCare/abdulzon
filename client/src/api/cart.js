import { apiFetch } from './client.js';

export const fetchCart = async () => apiFetch('/cart');

export const addCartItem = async (payload) =>
  apiFetch('/cart/items', {
    method: 'POST',
    body: payload
  });

export const updateCartItem = async (productId, quantity) =>
  apiFetch(`/cart/items/${productId}`, {
    method: 'PATCH',
    body: { quantity }
  });

export const removeCartItem = async (productId) =>
  apiFetch(`/cart/items/${productId}`, {
    method: 'DELETE'
  });
