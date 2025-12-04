import type { Warehouse, Product } from '../../types/inventario/stock.types';

const API_ALMACENES_URL = 'http://localhost:8080/api/almacenes';
const API_PRODUCTOS_URL = 'http://localhost:8080/api/productos';

export const stockService = {
  fetchAllData: async (): Promise<{ warehouses: Warehouse[], products: Product[] }> => {
    const [almacenesResponse, productosResponse] = await Promise.all([
      fetch(API_ALMACENES_URL),
      fetch(API_PRODUCTOS_URL)
    ]);

    if (!almacenesResponse.ok) throw new Error('No se pudieron cargar los almacenes.');
    if (!productosResponse.ok) throw new Error('No se pudieron cargar los productos.');

    const warehousesRaw = await almacenesResponse.json();
    const productsRaw = await productosResponse.json();

    // Mapeo seguro para garantizar que las propiedades existan
    const products: Product[] = productsRaw.map((p: any) => ({
        id: p.id,
        nombre: p.nombre || p.name || 'Sin Nombre', // Fallback si el backend usa "name"
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
  }
};