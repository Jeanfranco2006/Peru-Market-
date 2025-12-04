import type { Product } from '../../types/inventario/inventory.types';

const API_BASE = 'http://localhost:8080/api';
const API_PRODUCTOS = `${API_BASE}/productos`;

export const inventoryService = {
  getAllProducts: async (): Promise<Product[]> => {
    const response = await fetch(API_PRODUCTOS);
    if (!response.ok) throw new Error('Error al cargar la lista de productos.');
    const data: any[] = await response.json();

    // Mapeo de datos (Preservando tu lógica original)
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
    const response = await fetch(`${API_PRODUCTOS}/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'No se pudo eliminar el producto.');
    }
  }
};