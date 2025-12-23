const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const buildConfig = (options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const config = {
    credentials: 'include',
    ...options,
    headers
  };

  if (options.body && typeof options.body !== 'string') {
    config.body = JSON.stringify(options.body);
  }

  return config;
};

export const apiFetch = async (path, options) => {
  const response = await fetch(`${API_BASE_URL}${path}`, buildConfig(options));
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const err = new Error(errorBody.message || 'Request failed');
    err.status = response.status;
    throw err;
  }
  return response.json();
};
