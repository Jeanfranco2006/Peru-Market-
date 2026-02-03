// api.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Interceptor para agregar el token automáticamente
api.interceptors.request.use(
  (config) => {
    const authData = localStorage.getItem('auth');
    if (authData) {
      const { token } = JSON.parse(authData);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Solo redirigir al login si el 401 viene del endpoint de autenticación
    // o si es una respuesta explícita de token inválido/expirado.
    // NO redirigir si es un error de red o si el backend simplemente no tiene auth.
    if (error.response?.status === 401) {
      const url = error.config?.url || '';
      // Solo forzar logout si el error viene de un endpoint protegido real
      // y no por una falla general de conectividad
      if (url.includes('/auth/') || error.response?.data?.message?.includes('token')) {
        localStorage.removeItem('auth');
        localStorage.removeItem('logged');
        localStorage.removeItem('usuarioId');
        localStorage.removeItem('almacenId');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);