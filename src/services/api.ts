import axios, { AxiosHeaders } from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { Accept: 'application/json' },
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  // Normaliza headers a AxiosHeaders (evita reasignar a {} o {...})
  const headers = AxiosHeaders.from(config.headers);

  // Bearer token si existe
  const token = localStorage.getItem('auth_token');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Content-Type según payload
  if (config.data instanceof FormData) {
    // Para FormData no seteamos Content-Type (el navegador maneja el boundary)
    headers.delete('Content-Type');
  } else {
    headers.set('Content-Type', 'application/json');
  }

  // PUT con FormData -> _method=PUT y method POST (para Laravel)
  const method = (config.method ?? 'get').toLowerCase();
  if (method === 'put' && config.data instanceof FormData) {
    config.data.append('_method', 'PUT');
    config.method = 'post';
  }

  // Asigna los headers normalizados de vuelta
  config.headers = headers;
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
