import { apiFetch } from './client.js';

export const createOrder = async (payload) => apiFetch('/orders', {
  method: 'POST',
  body: payload
});

export const fetchOrder = async (id) => apiFetch(`/orders/${id}`);

export const fetchOrders = async () => apiFetch('/orders');
