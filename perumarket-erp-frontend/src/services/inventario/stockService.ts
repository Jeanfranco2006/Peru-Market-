import type { Warehouse, Product } from '../../types/inventario/stock';
import { api } from '../api';

export const stockService = {
  fetchAllData: async (): Promise<{ warehouses: Warehouse[], products: Product[] }> => {
    try {
      const [almacenesRes, productosRes] = await Promise.all([
        api.get('/almacenes'),
        api.get('/productos')
      ]);

      const warehousesRaw: Warehouse[] = almacenesRes.data || [];
      const productsRaw: any[] = productosRes.data || [];

      const products: Product[] = productsRaw.map(p => ({
        id: p.id,
        nombre: p.nombre || p.name || 'Sin Nombre',
        sku: p.sku || 'N/A',
        categoria: p.categoriaNombre || p.categoria || 'General',
        stockActual: p.stockActual || 0,
        stockMinimo: p.stockMinimo || 0,
        stockMaximo: p.stockMaximo || 0,
        precioVenta: parseFloat(p.precioVenta || 0),
        almacenNombre: p.almacenNombre || 'Principal',
        unidad: p.unidadMedida || p.unidad || 'UNIDAD',
        ubicacion: p.ubicacionPrincipal || p.ubicacion || ''
      }));

      return { warehouses: warehousesRaw, products };

    } catch (error: any) {
      console.error('Error cargando almacenes y productos', error);
      throw new Error('No se pudieron cargar los datos del inventario.');
    }
  }
};
