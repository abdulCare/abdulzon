import { apiFetch } from './client.js';

export const fetchProducts = async (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.search) params.append('search', filters.search);
  if (filters.category) params.append('category', filters.category);

  const query = params.toString();
  return apiFetch(`/products${query ? `?${query}` : ''}`);
};

export const fetchProductById = async (id) => apiFetch(`/products/${id}`);
