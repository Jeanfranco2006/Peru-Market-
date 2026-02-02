
import { api } from './../api'; 
import type { ProveedorData } from '../../types/proveedor/proveedorType';

const ENDPOINT = '/proveedores'; 

export const ProveedorService = {
  getAll: async (query: string = '') => {
    // Si hay query usa /proveedores/buscar, si no, usa /proveedores
    const url = query ? `${ENDPOINT}/buscar?q=${query}` : ENDPOINT;
    const response = await api.get<ProveedorData[]>(url);
    return response.data;
  },

  create: async (data: ProveedorData) => {
    // Aquí automáticamente usará el token gracias al interceptor en api.ts
    const response = await api.post<ProveedorData>(ENDPOINT, data);
    return response.data;
  },

  update: async (id: number, data: ProveedorData) => {
    const response = await api.put<ProveedorData>(`${ENDPOINT}/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(`${ENDPOINT}/${id}`);
  }
};