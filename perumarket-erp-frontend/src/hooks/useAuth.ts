// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import type { AuthData } from '../types/auth';

export const useAuth = () => {
  const [authData, setAuthData] = useState<AuthData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAuthData = () => {
      try {
        const storedAuth = localStorage.getItem('auth');
        if (storedAuth) {
          setAuthData(JSON.parse(storedAuth));
        }
      } catch (error) {
        console.error('Error loading auth data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthData();
  }, []);

  const hasModuleAccess = (moduleName: string): boolean => {
    if (!authData?.modules) return false;
    return authData.modules.some(module => 
      module.nombre.toLowerCase() === moduleName.toLowerCase()
    );
  };

  const hasRouteAccess = (route: string): boolean => {
    if (!authData?.modules) return false;
    
    // Mapeo de rutas a nombres de módulos
    const routeToModuleMap: { [key: string]: string } = {
      '/dashboard': 'Dashboard',
      '/accesos': 'Accesos',
      '/empleados': 'Empleados',
      '/clientes': 'Clientes',
      '/inventario': 'Inventario',
      '/ventas': 'Ventas',
      '/pedidos': 'Pedidos',
      '/compras': 'Compras',
      '/proveedores': 'Proveedores',
      '/envios': 'Envíos',
      '/reportes': 'Reportes',
    };

    const moduleName = routeToModuleMap[route];
    return moduleName ? hasModuleAccess(moduleName) : false;
  };

  const getCurrentUser = () => {
    return authData?.user || null;
  };

  const logout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("logged");
    localStorage.removeItem("username");
    localStorage.removeItem("userRole");
    setAuthData(null);
  };

  return {
    authData,
    isLoading,
    hasModuleAccess,
    hasRouteAccess,
    getCurrentUser,
    logout,
    isAuthenticated: !!authData?.token
  };
};