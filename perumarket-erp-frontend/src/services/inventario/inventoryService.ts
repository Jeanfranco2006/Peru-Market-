// inventory.ts
import type { Product } from '../../types/inventario/inventory';
import { api } from '../api'; 

const API_PRODUCTOS = '/productos';

export const inventoryService = {
  getAllProducts: async (): Promise<Product[]> => {
    const response = await api.get(API_PRODUCTOS);
    const data: any[] = response.data;

    return data.map(p => ({
      id: p.id,
      nombre: p.nombre,
      descripcion: p.descripcion,
      categoriaNombre: p.categoriaNombre,
      estado: p.estado,
      precioVenta: parseFloat(p.precioVenta),
      sku: p.sku,
      codigoBarrasPrincipal: p.codigoBarrasPrincipal,
      stockActual: p.stockActual,
      stockMinimo: p.stockMinimo,
      stockMaximo: p.stockMaximo,
      imagen: p.imagen || '',
      pesoKg: parseFloat(p.pesoKg),
      unidadMedida: p.unidadMedida,
      ubicacionPrincipal: p.ubicacionPrincipal,
      almacenNombre: p.almacenNombre,
      proveedorRazonSocial: p.proveedorRazonSocial,
      precioCompra: parseFloat(p.precioCompra),

      // Datos simulados
      purchases: p.id * 2,
      sales: p.id * 5,
      orders: p.id * 1,
    }));
  },

  deleteProduct: async (id: number): Promise<void> => {
    await api.delete(`${API_PRODUCTOS}/${id}`);
  }
};
