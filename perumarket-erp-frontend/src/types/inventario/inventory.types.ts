export interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  categoriaNombre: string;
  estado: 'ACTIVO' | 'INACTIVO' | string;
  precioVenta: number;
  sku: string;
  codigoBarrasPrincipal: string;
  stockActual: number;
  stockMinimo: number;
  stockMaximo: number;
  imagen: string;
  
  // Propiedades adicionales
  pesoKg: number;
  unidadMedida: string;
  ubicacionPrincipal: string;
  almacenNombre: string;
  proveedorRazonSocial: string;
  precioCompra: number;

  // Propiedades calculadas/simuladas
  purchases: number;
  sales: number;
  orders: number;
}

export type StockStatus = 'Disponible' | 'Stock Bajo' | 'Sin Stock';