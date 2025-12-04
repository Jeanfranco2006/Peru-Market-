import type { Warehouse, Product, WarehouseUpdateDTO } from '../../types/inventario/warehouse.types';

const API_ALMACENES_URL = 'http://localhost:8080/api/almacenes';
const API_PRODUCTOS_URL = 'http://localhost:8080/api/productos';

export const warehouseService = {
  // Obtiene almacenes y productos, y realiza el cruce de datos
  fetchWarehousesData: async (): Promise<{ warehouses: Warehouse[], totalProductTypes: number }> => {
    const [almacenesResponse, productosResponse] = await Promise.all([
      fetch(API_ALMACENES_URL),
      fetch(API_PRODUCTOS_URL)
    ]);

    if (!almacenesResponse.ok) throw new Error(`Error ${almacenesResponse.status}: Almacenes`);
    if (!productosResponse.ok) throw new Error(`Error ${productosResponse.status}: Productos`);

    const almacenesData = await almacenesResponse.json();
    const productosData: Product[] = await productosResponse.json();

    // Lógica de Negocio: Calcular datos reales por almacén
    const warehousesWithRealData = almacenesData.map((w: any) => {
      const productsInWarehouse = productosData.filter(p => p.almacenNombre === w.nombre);
      
      const stockActualTotal = productsInWarehouse.reduce((sum, p) => sum + p.stockActual, 0);
      const stockMaximoTotal = productsInWarehouse.reduce((sum, p) => sum + (p.stockMaximo || 0), 0);

      return {
        ...w,
        productsCount: productsInWarehouse.length,
        capacityUsed: stockActualTotal,
        capacityTotalUnits: stockMaximoTotal,
      };
    });

    return {
      warehouses: warehousesWithRealData,
      totalProductTypes: productosData.length
    };
  },

  updateWarehouse: async (id: number, data: WarehouseUpdateDTO): Promise<void> => {
    const response = await fetch(`${API_ALMACENES_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al actualizar el almacén');
    }
  }
};