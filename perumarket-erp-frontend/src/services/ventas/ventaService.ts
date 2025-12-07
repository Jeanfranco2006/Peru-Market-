import type { Cliente } from '../../types/clientes/Client';
import type { DetallePago, MetodoPago, Producto, ProductoVenta, VentaRequest } from '../../types/ventas/ventas';
import { api } from '../api';

// Función helper para limpiar objetos
const limpiarObjeto = (obj: any): any =>
  Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined && v !== null));

export const ventaService = {
  // Productos
  async fetchProductos(): Promise<Producto[]> {
    try {
      const { data } = await api.get('/productos');
      return data.map((p: any) => ({
        id: p.id,
        nombre: p.nombre,
        precio: p.precioVenta,
        imagen: p.imagen ? `${import.meta.env.VITE_API_URL}/uploads/${p.imagen}` : "/img/products/default-product.png",

        stock: p.stockActual,
        categoria: {
          id: p.categoriaId ?? 0,
          nombre: p.categoriaNombre ?? "Sin categoría"
        }
      }));
    } catch (error) {
      console.error("Error cargando productos:", error);
      throw error;
    }
  },

  // Almacenes
  async fetchAlmacenes(): Promise<any[]> {
    try {
      const { data } = await api.get('/almacenes');
      return data;
    } catch (error) {
      console.error("Error cargando almacenes:", error);
      throw error;
    }
  },

  // Clientes
  async fetchClientes(): Promise<Cliente[]> {
    try {
      const { data } = await api.get('/clientes');
      return data.map((cliente: any) => ({
        clienteid: cliente.clienteid || cliente.id,
        persona: cliente.persona,
        tipo: cliente.tipo || 'NORMAL',
        fechaCreacion: cliente.fechaCreacion || new Date().toISOString(),
        fechaActualizacion: cliente.fechaActualizacion || new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error al cargar clientes:', error);
      throw error;
    }
  },

  async registrarCliente(clienteData: Omit<Cliente, 'clienteid'>): Promise<Cliente> {
    try {
      const { data } = await api.post('/clientes', limpiarObjeto(clienteData));
      return {
        id: data.id || data.id,
        persona: data.persona,
        tipo: data.tipo || 'NORMAL',
        fechaCreacion: data.fechaCreacion || new Date().toISOString(),
        fechaActualizacion: data.fechaActualizacion || new Date().toISOString()
      };
    } catch (error) {
      console.error('Error al registrar cliente:', error);
      throw error;
    }
  },

  // Métodos de pago
  async cargarMetodosPago(): Promise<MetodoPago[]> {
    return [
      { id: 1, nombre: 'Efectivo', descripcion: 'Pago en efectivo', estado: 'activo' },
      { id: 2, nombre: 'Tarjeta Débito', descripcion: 'Pago con tarjeta de débito', estado: 'activo' },
      { id: 3, nombre: 'Tarjeta Crédito', descripcion: 'Pago con tarjeta de crédito', estado: 'activo' },
      { id: 4, nombre: 'Transferencia', descripcion: 'Transferencia bancaria', estado: 'activo' },
      { id: 5, nombre: 'Yape', descripcion: 'Pago con Yape', estado: 'activo' }
    ];
  },

  // Stock
  async actualizarStock(idProducto: number, stock: number): Promise<void> {
    try {
      await api.put(`/productos/${idProducto}/stock`, { stock });
    } catch (error) {
      console.error(`Error actualizando stock del producto ${idProducto}:`, error);
      throw error;
    }
  },

  // Venta
  async procesarVenta(ventaData: VentaRequest): Promise<{ id: number; numeroComprobante: string }> {
    try {
      const datosLimpios = {
        idCliente: Number(ventaData.idCliente),
        idUsuario: Number(ventaData.idUsuario),
        idAlmacen: Number(ventaData.idAlmacen),
        subtotal: Number(ventaData.subtotal.toFixed(2)),
        igv: Number(ventaData.igv.toFixed(2)),
        total: Number(ventaData.total.toFixed(2)),
        detalles: ventaData.detalles.map(detalle => ({
          idProducto: Number(detalle.idProducto),
          cantidad: Number(detalle.cantidad),
          precioUnitario: Number(detalle.precioUnitario.toFixed(2)),
          subtotal: Number(detalle.subtotal.toFixed(2))
        })),
        pagos: ventaData.pagos.map(pago => ({
          id_metodo_pago: Number(pago.id_metodo_pago),
          monto: Number(pago.monto.toFixed(2)),
          referencia: pago.referencia || ''
        }))
      };

      console.log('Enviando venta:', datosLimpios);

      const { data } = await api.post('/ventas', datosLimpios);
      return data;
    } catch (error) {
      console.error("Error procesando venta:", error);
      throw error;
    }
  },

  // Calcular totales
  calcularTotales(carrito: ProductoVenta[]) {
    const subtotalProduct = carrito.reduce((sum, item) => sum + item.subtotal, 0);
    const igv = subtotalProduct * 0.18;
    const subtotal = subtotalProduct - igv;
    const total = subtotalProduct;

    return {
      subtotal: Number(subtotal.toFixed(2)),
      igv: Number(igv.toFixed(2)),
      total: Number(total.toFixed(2)),
      subtotalProduct: Number(subtotalProduct.toFixed(2))
    };
  },

  // Obtener datos de sesión
  obtenerDatosSesion() {
    const idUsuario = Number(localStorage.getItem("usuarioId"));
    const idAlmacen = Number(localStorage.getItem("almacenId")) || 1;

    if (!idUsuario || idUsuario <= 0) {
      throw new Error("Usuario no válido. Por favor, inicia sesión de nuevo.");
    }

    if (!idAlmacen || idAlmacen <= 0) {
      throw new Error("Almacén no válido. Selecciona un almacén.");
    }

    return { idUsuario, idAlmacen };
  }
};
