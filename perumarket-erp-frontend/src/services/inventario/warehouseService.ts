import type { Warehouse, Product, WarehouseUpdateDTO } from '../../types/inventario/warehouse';
import { api } from '../api';

export const warehouseService = {

  // Obtiene almacenes y productos, y realiza el cruce de datos
  fetchWarehousesData: async (): Promise<{ warehouses: Warehouse[], totalProductTypes: number }> => {
    try {
      const [almacenesRes, productosRes] = await Promise.all([
        api.get('/almacenes'),
        api.get('/productos')
      ]);

      const almacenesData: Warehouse[] = almacenesRes.data || [];
      const productosData: Product[] = productosRes.data || [];

      // Cruce de datos
      const warehousesWithRealData = almacenesData.map((w: any) => {
        const productsInWarehouse = productosData.filter(p => p.almacenNombre === w.nombre);

        const stockActualTotal = productsInWarehouse
          .reduce((sum, p) => sum + (p.stockActual || 0), 0);

        const stockMaximoTotal = productsInWarehouse
          .reduce((sum, p) => sum + (p.stockMaximo || 0), 0);

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

    } catch (error) {
      console.error(error);
      throw new Error('Error al obtener datos de almacenes y productos.');
    }
  },

  updateWarehouse: async (id: number, data: WarehouseUpdateDTO): Promise<void> => {
    try {
      await api.put(`/almacenes/${id}`, data);

    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        'Error al actualizar el almacén';

      throw new Error(message);
    }
  }

};
