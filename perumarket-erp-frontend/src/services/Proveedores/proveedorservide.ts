import axios from "axios";
import type { ProveedorData } from "../../types/proveedor/proveedor";

const API_BASE_URL = "http://localhost:8080/api/proveedores";

// Funciones CRUD limpias y tipadas
export const proveedorService = {

  getAll: async (query: string = "") => {
    const url = query
      ? `${API_BASE_URL}/buscar?q=${query}`
      : API_BASE_URL;
    const response = await axios.get<ProveedorData[]>(url);
    return response.data;
  },

  create: async (proveedor: ProveedorData) => {
    const response = await axios.post<ProveedorData>(API_BASE_URL, proveedor);
    return response.data;
  },

  update: async (id: number, proveedor: ProveedorData) => {
    const response = await axios.put<ProveedorData>(`${API_BASE_URL}/${id}`, proveedor);
    return response.data;
  },

  delete: async (id: number) => {
    await axios.delete(`${API_BASE_URL}/${id}`);
  }
};