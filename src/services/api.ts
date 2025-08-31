import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { Accept: 'application/json' },
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    if (config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  if (config.data instanceof FormData) {
    if (config.headers && 'Content-Type' in config.headers) {
      delete (config.headers as Record<string, unknown>)['Content-Type'];
    }
  } else {
    if (config.headers) {
      config.headers['Content-Type'] = 'application/json';
    }
  }

  if (config.method === 'put' && config.data instanceof FormData) {
    config.data.append('_method', 'PUT');
    config.method = 'post';
  }

  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    if (status === 401 || status === 419) {
      localStorage.removeItem('auth_token');
      delete api.defaults.headers.common['Authorization'];
    }
    return Promise.reject(err);
  }
);

export default api;
