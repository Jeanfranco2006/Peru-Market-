import axios from 'axios';
import type { ProveedorData } from '../../types/proveedor/proveedorType';

const API_URL = 'http://localhost:8080/api/proveedores'; // Ajusta tu URL base

export const ProveedorService = {
  getAll: async (query: string = '') => {
    const url = query ? `${API_URL}/buscar?q=${query}` : API_URL;
    const response = await axios.get<ProveedorData[]>(url);
    return response.data;
  },

  create: async (data: ProveedorData) => {
    const response = await axios.post<ProveedorData>(API_URL, data);
    return response.data;
  },

  update: async (id: number, data: ProveedorData) => {
    const response = await axios.put<ProveedorData>(`${API_URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    await axios.delete(`${API_URL}/${id}`);
  }
};