import { api } from './api';

export interface VentaResponse {
  id: number;
  subtotal: number;
  descuentoTotal: number;
  igv: number;
  total: number;
  estado: string;
  fecha: string;
  nombreCliente: string;
  nombreAlmacen: string;
  nombreUsuario: string;
  detalles: {
    id: number;
    idProducto: number;
    nombreProducto: string;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
  }[];
}

export interface CompraResponse {
  id: number;
  total: number;
  subtotal: number;
  igv: number;
  estado: string;
  fechaCompra: string;
  proveedor?: { razonSocial: string };
  detalles?: {
    producto: { id: number; nombre: string };
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
  }[];
}

export interface ProductoResponse {
  id: number;
  nombre: string;
  precioVenta: number;
  precioCompra: number;
  estado: string;
  categoriaNombre: string;
  stockActual: number;
  stockMinimo: number;
  almacenNombre: string;
}

export interface ClienteResponse {
  id: number;
  tipo: string;
  estado: string;
  persona: {
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
  };
}

export interface DashboardStats {
  totalVentas: number;
  ingresoVentas: number;
  totalCompras: number;
  gastoCompras: number;
  productosActivos: number;
  productosBajoStock: number;
  clientesActivos: number;
  ventasPorMes: { name: string; ventas: number; compras: number }[];
  ventasPorDia: { name: string; ventas: number; ingresos: number }[];
  topProductos: { name: string; cantidad: number; ingresos: number }[];
  ventasRecientes: {
    id: number;
    cliente: string;
    total: number;
    estado: string;
    fecha: string;
  }[];
  distribucionCategorias: { name: string; value: number }[];
}

const MESES = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
const DIAS_SEMANA = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

function agruparVentasPorMes(ventas: VentaResponse[], compras: CompraResponse[]): DashboardStats['ventasPorMes'] {
  const año = new Date().getFullYear();
  const mesesMap: Record<number, { ventas: number; compras: number }> = {};

  for (let i = 0; i < 12; i++) {
    mesesMap[i] = { ventas: 0, compras: 0 };
  }

  ventas.forEach(v => {
    if (v.estado === 'COMPLETADA') {
      const fecha = new Date(v.fecha);
      if (fecha.getFullYear() === año) {
        mesesMap[fecha.getMonth()].ventas += v.total;
      }
    }
  });

  compras.forEach(c => {
    if (c.estado === 'COMPLETADA') {
      const fecha = new Date(c.fechaCompra);
      if (fecha.getFullYear() === año) {
        mesesMap[fecha.getMonth()].compras += c.total;
      }
    }
  });

  return MESES.map((name, i) => ({
    name,
    ventas: Math.round(mesesMap[i].ventas * 100) / 100,
    compras: Math.round(mesesMap[i].compras * 100) / 100,
  }));
}

function agruparVentasPorDiaSemana(ventas: VentaResponse[]): DashboardStats['ventasPorDia'] {
  const hoy = new Date();
  const hace7Dias = new Date(hoy);
  hace7Dias.setDate(hoy.getDate() - 6);

  const diasMap: Record<number, { ventas: number; ingresos: number }> = {};
  for (let i = 0; i < 7; i++) {
    diasMap[i] = { ventas: 0, ingresos: 0 };
  }

  ventas.forEach(v => {
    if (v.estado === 'COMPLETADA') {
      const fecha = new Date(v.fecha);
      if (fecha >= hace7Dias && fecha <= hoy) {
        const dia = fecha.getDay();
        diasMap[dia].ventas += 1;
        diasMap[dia].ingresos += v.total;
      }
    }
  });

  return DIAS_SEMANA.map((name, i) => ({
    name,
    ventas: diasMap[i].ventas,
    ingresos: Math.round(diasMap[i].ingresos * 100) / 100,
  }));
}

function calcularTopProductos(ventas: VentaResponse[]): DashboardStats['topProductos'] {
  const productosMap: Record<string, { cantidad: number; ingresos: number }> = {};

  ventas.forEach(v => {
    if (v.estado === 'COMPLETADA' && v.detalles) {
      v.detalles.forEach(d => {
        const key = d.nombreProducto || `Producto ${d.idProducto}`;
        if (!productosMap[key]) {
          productosMap[key] = { cantidad: 0, ingresos: 0 };
        }
        productosMap[key].cantidad += d.cantidad;
        productosMap[key].ingresos += d.subtotal;
      });
    }
  });

  return Object.entries(productosMap)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.ingresos - a.ingresos)
    .slice(0, 5);
}

function calcularDistribucionCategorias(productos: ProductoResponse[]): DashboardStats['distribucionCategorias'] {
  const categoriasMap: Record<string, number> = {};

  productos.forEach(p => {
    if (p.estado === 'ACTIVO') {
      const cat = p.categoriaNombre || 'Sin categoría';
      categoriasMap[cat] = (categoriasMap[cat] || 0) + 1;
    }
  });

  return Object.entries(categoriasMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);
}

export const dashboardService = {
  async getDashboardData(): Promise<DashboardStats> {
    const [ventasRes, comprasRes, productosRes, clientesRes] = await Promise.all([
      api.get<VentaResponse[]>('/ventas').catch(() => ({ data: [] as VentaResponse[] })),
      api.get<CompraResponse[]>('/compras').catch(() => ({ data: [] as CompraResponse[] })),
      api.get<ProductoResponse[]>('/productos').catch(() => ({ data: [] as ProductoResponse[] })),
      api.get<ClienteResponse[]>('/clientes').catch(() => ({ data: [] as ClienteResponse[] })),
    ]);

    const ventas = ventasRes.data;
    const compras = comprasRes.data;
    const productos = productosRes.data;
    const clientes = clientesRes.data;

    const ventasCompletadas = ventas.filter(v => v.estado === 'COMPLETADA');
    const comprasCompletadas = compras.filter(c => c.estado === 'COMPLETADA');
    const productosActivos = productos.filter(p => p.estado === 'ACTIVO');

    const ingresoVentas = ventasCompletadas.reduce((sum, v) => sum + v.total, 0);
    const gastoCompras = comprasCompletadas.reduce((sum, c) => sum + c.total, 0);
    const productosBajoStock = productosActivos.filter(p => p.stockActual <= p.stockMinimo);
    const clientesActivos = clientes.filter(c => c.estado === 'ACTIVO');

    const ventasRecientes = ventas
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
      .slice(0, 5)
      .map(v => ({
        id: v.id,
        cliente: v.nombreCliente || 'Cliente',
        total: v.total,
        estado: v.estado,
        fecha: v.fecha,
      }));

    return {
      totalVentas: ventasCompletadas.length,
      ingresoVentas: Math.round(ingresoVentas * 100) / 100,
      totalCompras: comprasCompletadas.length,
      gastoCompras: Math.round(gastoCompras * 100) / 100,
      productosActivos: productosActivos.length,
      productosBajoStock: productosBajoStock.length,
      clientesActivos: clientesActivos.length,
      ventasPorMes: agruparVentasPorMes(ventas, compras),
      ventasPorDia: agruparVentasPorDiaSemana(ventas),
      topProductos: calcularTopProductos(ventas),
      ventasRecientes,
      distribucionCategorias: calcularDistribucionCategorias(productos),
    };
  },
};
