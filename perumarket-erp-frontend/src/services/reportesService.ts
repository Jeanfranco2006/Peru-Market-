import { api } from './api';
import type { VentaResponse, CompraResponse, ProductoResponse } from './dashboardService';

// --- Tipos ---

export interface ReporteVentas {
  totalVentas: number;
  ingresoTotal: number;
  igvTotal: number;
  descuentoTotal: number;
  ventasCompletadas: number;
  ventasPendientes: number;
  ventasAnuladas: number;
  ticketPromedio: number;
  ventasDelDia: number;
  ingresoDelDia: number;
  ventasPorMes: { name: string; ingresos: number; cantidad: number }[];
  ventasPorVendedor: { nombre: string; ventas: number; total: number; porcentaje: number }[];
  ventasPorAlmacen: { nombre: string; ventas: number; total: number }[];
  detalleVentas: {
    id: number;
    fecha: string;
    cliente: string;
    vendedor: string;
    almacen: string;
    subtotal: number;
    igv: number;
    total: number;
    estado: string;
  }[];
}

export interface ReporteCompras {
  totalCompras: number;
  gastoTotal: number;
  igvTotal: number;
  comprasCompletadas: number;
  comprasPendientes: number;
  comprasAnuladas: number;
  compraPromedio: number;
  comprasPorMes: { name: string; gastos: number; cantidad: number }[];
  comprasPorProveedor: { nombre: string; compras: number; total: number; porcentaje: number }[];
  detalleCompras: {
    id: number;
    fecha: string;
    proveedor: string;
    subtotal: number;
    igv: number;
    total: number;
    estado: string;
  }[];
}

export interface ReporteInventario {
  totalProductos: number;
  productosActivos: number;
  productosInactivos: number;
  productosBajoStock: number;
  valorInventario: number;
  productosPorCategoria: { name: string; cantidad: number }[];
  productosPorAlmacen: { name: string; cantidad: number }[];
  productosStockBajo: { nombre: string; stock: number; minimo: number; almacen: string; categoria: string }[];
  productosTopValor: { nombre: string; precioVenta: number; stock: number; valorTotal: number }[];
}

const MESES = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];

function round(n: number): number {
  return Math.round(n * 100) / 100;
}

// --- Reporte de Ventas ---

function buildReporteVentas(ventas: VentaResponse[]): ReporteVentas {
  const hoy = new Date();
  const inicioHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  const año = hoy.getFullYear();

  const completadas = ventas.filter(v => v.estado === 'COMPLETADA');
  const pendientes = ventas.filter(v => v.estado === 'PENDIENTE');
  const anuladas = ventas.filter(v => v.estado === 'ANULADA');

  const ingresoTotal = completadas.reduce((s, v) => s + v.total, 0);
  const igvTotal = completadas.reduce((s, v) => s + v.igv, 0);
  const descuentoTotal = completadas.reduce((s, v) => s + v.descuentoTotal, 0);
  const ticketPromedio = completadas.length > 0 ? ingresoTotal / completadas.length : 0;

  const ventasHoy = completadas.filter(v => new Date(v.fecha) >= inicioHoy);
  const ingresoDelDia = ventasHoy.reduce((s, v) => s + v.total, 0);

  // Por mes
  const mesesMap: Record<number, { ingresos: number; cantidad: number }> = {};
  for (let i = 0; i < 12; i++) mesesMap[i] = { ingresos: 0, cantidad: 0 };
  completadas.forEach(v => {
    const f = new Date(v.fecha);
    if (f.getFullYear() === año) {
      mesesMap[f.getMonth()].ingresos += v.total;
      mesesMap[f.getMonth()].cantidad += 1;
    }
  });
  const ventasPorMes = MESES.map((name, i) => ({
    name,
    ingresos: round(mesesMap[i].ingresos),
    cantidad: mesesMap[i].cantidad,
  }));

  // Por vendedor
  const vendedorMap: Record<string, { ventas: number; total: number }> = {};
  completadas.forEach(v => {
    const key = v.nombreUsuario || 'Sin vendedor';
    if (!vendedorMap[key]) vendedorMap[key] = { ventas: 0, total: 0 };
    vendedorMap[key].ventas += 1;
    vendedorMap[key].total += v.total;
  });
  const ventasPorVendedor = Object.entries(vendedorMap)
    .map(([nombre, d]) => ({
      nombre,
      ventas: d.ventas,
      total: round(d.total),
      porcentaje: ingresoTotal > 0 ? round((d.total / ingresoTotal) * 100) : 0,
    }))
    .sort((a, b) => b.total - a.total);

  // Por almacén
  const almacenMap: Record<string, { ventas: number; total: number }> = {};
  completadas.forEach(v => {
    const key = v.nombreAlmacen || 'Sin almacén';
    if (!almacenMap[key]) almacenMap[key] = { ventas: 0, total: 0 };
    almacenMap[key].ventas += 1;
    almacenMap[key].total += v.total;
  });
  const ventasPorAlmacen = Object.entries(almacenMap)
    .map(([nombre, d]) => ({ nombre, ventas: d.ventas, total: round(d.total) }))
    .sort((a, b) => b.total - a.total);

  // Detalle
  const detalleVentas = ventas
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    .slice(0, 50)
    .map(v => ({
      id: v.id,
      fecha: v.fecha,
      cliente: v.nombreCliente || 'Cliente',
      vendedor: v.nombreUsuario || '-',
      almacen: v.nombreAlmacen || '-',
      subtotal: v.subtotal,
      igv: v.igv,
      total: v.total,
      estado: v.estado,
    }));

  return {
    totalVentas: ventas.length,
    ingresoTotal: round(ingresoTotal),
    igvTotal: round(igvTotal),
    descuentoTotal: round(descuentoTotal),
    ventasCompletadas: completadas.length,
    ventasPendientes: pendientes.length,
    ventasAnuladas: anuladas.length,
    ticketPromedio: round(ticketPromedio),
    ventasDelDia: ventasHoy.length,
    ingresoDelDia: round(ingresoDelDia),
    ventasPorMes,
    ventasPorVendedor,
    ventasPorAlmacen,
    detalleVentas,
  };
}

// --- Reporte de Compras ---

function buildReporteCompras(compras: CompraResponse[]): ReporteCompras {
  const año = new Date().getFullYear();
  const completadas = compras.filter(c => c.estado === 'COMPLETADA');
  const pendientes = compras.filter(c => c.estado === 'PENDIENTE');
  const anuladas = compras.filter(c => c.estado === 'ANULADA');

  const gastoTotal = completadas.reduce((s, c) => s + c.total, 0);
  const igvTotal = completadas.reduce((s, c) => s + c.igv, 0);
  const compraPromedio = completadas.length > 0 ? gastoTotal / completadas.length : 0;

  // Por mes
  const mesesMap: Record<number, { gastos: number; cantidad: number }> = {};
  for (let i = 0; i < 12; i++) mesesMap[i] = { gastos: 0, cantidad: 0 };
  completadas.forEach(c => {
    const f = new Date(c.fechaCompra);
    if (f.getFullYear() === año) {
      mesesMap[f.getMonth()].gastos += c.total;
      mesesMap[f.getMonth()].cantidad += 1;
    }
  });
  const comprasPorMes = MESES.map((name, i) => ({
    name,
    gastos: round(mesesMap[i].gastos),
    cantidad: mesesMap[i].cantidad,
  }));

  // Por proveedor
  const provMap: Record<string, { compras: number; total: number }> = {};
  completadas.forEach(c => {
    const key = c.proveedor?.razonSocial || 'Sin proveedor';
    if (!provMap[key]) provMap[key] = { compras: 0, total: 0 };
    provMap[key].compras += 1;
    provMap[key].total += c.total;
  });
  const comprasPorProveedor = Object.entries(provMap)
    .map(([nombre, d]) => ({
      nombre,
      compras: d.compras,
      total: round(d.total),
      porcentaje: gastoTotal > 0 ? round((d.total / gastoTotal) * 100) : 0,
    }))
    .sort((a, b) => b.total - a.total);

  // Detalle
  const detalleCompras = compras
    .sort((a, b) => new Date(b.fechaCompra).getTime() - new Date(a.fechaCompra).getTime())
    .slice(0, 50)
    .map(c => ({
      id: c.id,
      fecha: c.fechaCompra,
      proveedor: c.proveedor?.razonSocial || 'Sin proveedor',
      subtotal: c.subtotal,
      igv: c.igv,
      total: c.total,
      estado: c.estado,
    }));

  return {
    totalCompras: compras.length,
    gastoTotal: round(gastoTotal),
    igvTotal: round(igvTotal),
    comprasCompletadas: completadas.length,
    comprasPendientes: pendientes.length,
    comprasAnuladas: anuladas.length,
    compraPromedio: round(compraPromedio),
    comprasPorMes,
    comprasPorProveedor,
    detalleCompras,
  };
}

// --- Reporte de Inventario ---

function buildReporteInventario(productos: ProductoResponse[]): ReporteInventario {
  const activos = productos.filter(p => p.estado === 'ACTIVO');
  const inactivos = productos.filter(p => p.estado === 'INACTIVO');
  const bajoStock = activos.filter(p => p.stockActual <= p.stockMinimo);

  const valorInventario = activos.reduce((s, p) => s + (p.precioVenta * p.stockActual), 0);

  // Por categoría
  const catMap: Record<string, number> = {};
  activos.forEach(p => {
    const cat = p.categoriaNombre || 'Sin categoría';
    catMap[cat] = (catMap[cat] || 0) + 1;
  });
  const productosPorCategoria = Object.entries(catMap)
    .map(([name, cantidad]) => ({ name, cantidad }))
    .sort((a, b) => b.cantidad - a.cantidad);

  // Por almacén
  const almMap: Record<string, number> = {};
  activos.forEach(p => {
    const alm = p.almacenNombre || 'Sin almacén';
    almMap[alm] = (almMap[alm] || 0) + 1;
  });
  const productosPorAlmacen = Object.entries(almMap)
    .map(([name, cantidad]) => ({ name, cantidad }))
    .sort((a, b) => b.cantidad - a.cantidad);

  // Stock bajo
  const productosStockBajo = bajoStock
    .map(p => ({
      nombre: p.nombre,
      stock: p.stockActual,
      minimo: p.stockMinimo,
      almacen: p.almacenNombre || '-',
      categoria: p.categoriaNombre || '-',
    }))
    .sort((a, b) => a.stock - b.stock);

  // Top valor
  const productosTopValor = activos
    .map(p => ({
      nombre: p.nombre,
      precioVenta: p.precioVenta,
      stock: p.stockActual,
      valorTotal: round(p.precioVenta * p.stockActual),
    }))
    .sort((a, b) => b.valorTotal - a.valorTotal)
    .slice(0, 10);

  return {
    totalProductos: productos.length,
    productosActivos: activos.length,
    productosInactivos: inactivos.length,
    productosBajoStock: bajoStock.length,
    valorInventario: round(valorInventario),
    productosPorCategoria,
    productosPorAlmacen,
    productosStockBajo,
    productosTopValor,
  };
}

// --- Servicio público ---

export const reportesService = {
  async getReporteVentas(): Promise<ReporteVentas> {
    const res = await api.get<VentaResponse[]>('/ventas');
    return buildReporteVentas(res.data);
  },

  async getReporteCompras(): Promise<ReporteCompras> {
    const res = await api.get<CompraResponse[]>('/compras');
    return buildReporteCompras(res.data);
  },

  async getReporteInventario(): Promise<ReporteInventario> {
    const res = await api.get<ProductoResponse[]>('/productos');
    return buildReporteInventario(res.data);
  },
};
