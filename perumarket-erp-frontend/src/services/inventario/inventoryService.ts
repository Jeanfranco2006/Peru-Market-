import type { Product } from '../../types/inventario/inventory';
import { api } from '../api';

const API_PRODUCTOS = '/productos';

export interface MovimientoInventario {
  id: number;
  tipoMovimiento: 'ENTRADA' | 'SALIDA' | 'AJUSTE' | 'DEVOLUCION';
  cantidad: number;
  stockAnterior: number;
  stockNuevo: number;
  motivo: string;
  nombreAlmacen: string;
  fechaMovimiento: string;
  idUsuario: number;
}

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
      categoriaId: p.categoriaId ?? null,
      almacenId: p.almacenId ?? null,
      almacenNombre: p.almacenNombre,
      proveedorId: p.proveedorId ?? null,
      proveedorRazonSocial: p.proveedorRazonSocial,
      precioCompra: parseFloat(p.precioCompra),
      purchases: 0,
      sales: 0,
      orders: 0,
    }));
  },

  getProductById: async (id: number): Promise<Product> => {
    const response = await api.get(`${API_PRODUCTOS}/${id}`);
    const p = response.data;
    return {
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
      categoriaId: p.categoriaId ?? null,
      almacenId: p.almacenId ?? null,
      almacenNombre: p.almacenNombre,
      proveedorId: p.proveedorId ?? null,
      proveedorRazonSocial: p.proveedorRazonSocial,
      precioCompra: parseFloat(p.precioCompra),
      purchases: 0,
      sales: 0,
      orders: 0,
    };
  },

  getMovimientos: async (productoId: number): Promise<MovimientoInventario[]> => {
    const response = await api.get(`${API_PRODUCTOS}/${productoId}/movimientos`);
    return response.data;
  },

  deleteProduct: async (id: number): Promise<void> => {
    await api.delete(`${API_PRODUCTOS}/${id}`);
  }
};
