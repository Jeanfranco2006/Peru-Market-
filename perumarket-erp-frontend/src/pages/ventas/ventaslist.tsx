import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiX, FiShoppingCart, FiTrash2, FiMinus, FiPlus, FiSearch,
  FiUserPlus, FiImage, FiBox, FiDollarSign, FiFileText, FiTruck, FiAlertTriangle
} from 'react-icons/fi';
import ModalCliente from './ModalCliente';
import ModalPago from './ModalPago';
import type { Cliente } from '../../types/clientes/Client';
import type { DetallePago, MetodoPago, Producto, ProductoVenta } from '../../types/ventas/ventas';
import { ventaService } from '../../services/ventas/ventaService';
import { useThemeClasses } from '../../hooks/useThemeClasses';

const ProductImage = ({
  src,
  alt,
  className = "w-full h-full object-cover",
  isDark = false
}: {
  src?: string | null;
  alt: string;
  className?: string;
  isDark?: boolean;
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  if (imageError || !src) {
    return (
      <div className={`${className} ${isDark ? 'bg-gray-700 text-gray-500' : 'bg-gray-100 text-gray-400'} flex flex-col items-center justify-center`}>
        <FiImage className="text-3xl mb-1 opacity-50" />
        <span className="text-[10px] font-medium uppercase tracking-wide">Sin imagen</span>
      </div>
    );
  }

  return (
    <div className={`w-full h-full relative overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
      {imageLoading && (
        <div className={`absolute inset-0 ${isDark ? 'bg-gray-600' : 'bg-gray-200'} animate-pulse flex items-center justify-center z-10`}>
          <FiImage className={`${isDark ? 'text-gray-500' : 'text-gray-300'} text-3xl`} />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} transition-all duration-700 ease-in-out ${imageLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
        onLoad={() => setImageLoading(false)}
        onError={() => {
          setImageError(true);
          setImageLoading(false);
        }}
      />
    </div>
  );
};

const VentasList: React.FC = () => {
  const navigate = useNavigate();
  const {
    isDark, colors, pageBg, card, heading, textTertiary, textSecondary,
    border, input, modalOverlay, modalContent, btnPrimary, btnSecondary
  } = useThemeClasses();

  // Estados principales
  const [productos, setProductos] = useState<Producto[]>([]);
  const [carrito, setCarrito] = useState<ProductoVenta[]>([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);
  const [busquedaProducto, setBusquedaProducto] = useState('');
  const [busquedaCliente, setBusquedaCliente] = useState('');
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clientesFiltrados, setClientesFiltrados] = useState<Cliente[]>([]);
  const [metodosPago, setMetodosPago] = useState<MetodoPago[]>([]);
  const [, setAlmacenes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Estados de modales
  const [mostrarModalCliente, setMostrarModalCliente] = useState(false);
  const [mostrarModalPago, setMostrarModalPago] = useState(false);
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [conEnvio, setConEnvio] = useState(false);
  const [direccionEnvio, setDireccionEnvio] = useState('');

  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  const cargarDatosIniciales = async () => {
    try {
      setLoading(true);
      const [metodos, clientesData, productosData, almacenesData] = await Promise.all([
        ventaService.cargarMetodosPago(),
        ventaService.fetchClientes(),
        ventaService.fetchProductos(),
        ventaService.fetchAlmacenes()
      ]);
      setMetodosPago(metodos);
      setClientes(clientesData);
      setProductos(productosData);
      setAlmacenes(almacenesData);
    } catch (error) {
      console.error('Error cargando datos iniciales:', error);
      alert('Error al cargar los datos iniciales');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (busquedaCliente.trim() === '') {
      setClientesFiltrados([]);
    } else {
      const filtrados = clientes.filter(cliente =>
        cliente.persona.nombres.toLowerCase().includes(busquedaCliente.toLowerCase()) ||
        cliente.persona.apellidoPaterno.toLowerCase().includes(busquedaCliente.toLowerCase()) ||
        cliente.persona.apellidoMaterno.toLowerCase().includes(busquedaCliente.toLowerCase()) ||
        cliente.persona.numeroDocumento.includes(busquedaCliente)
      );
      setClientesFiltrados(filtrados);
    }
  }, [busquedaCliente, clientes]);

  const limpiarCarrito = useCallback(() => {
    if (carrito.length === 0) return;
    if (!confirm('¿Estás seguro de limpiar el carrito?')) return;
    const productosActualizados = productos.map(p => {
      const itemCarrito = carrito.find(item => item.producto.id === p.id);
      if (!itemCarrito) return p;
      return { ...p, stock: p.stock + itemCarrito.cantidad };
    });
    setProductos(productosActualizados);
    setCarrito([]);
  }, [carrito, productos]);

  const agregarAlCarrito = useCallback((producto: Producto) => {
    if (producto.stock <= 0) {
      alert('No hay stock disponible');
      return;
    }
    const existe = carrito.find(item => item.producto.id === producto.id);
    if (existe) {
      if (producto.stock - 1 < 0) {
        alert('No hay más unidades disponibles');
        return;
      }
      setCarrito(carrito.map(item =>
        item.producto.id === producto.id
          ? { ...item, cantidad: item.cantidad + 1, subtotal: (item.cantidad + 1) * item.producto.precio }
          : item
      ));
    } else {
      setCarrito([...carrito, { producto, cantidad: 1, subtotal: producto.precio }]);
    }
    setProductos(productos.map(p =>
      p.id === producto.id ? { ...p, stock: p.stock - 1 } : p
    ));
  }, [carrito, productos]);

  const actualizarCantidad = useCallback((id: number, cantidad: number) => {
    const item = carrito.find(i => i.producto.id === id);
    if (!item) return;
    const diferencia = cantidad - item.cantidad;
    if (diferencia > 0) {
      const producto = productos.find(p => p.id === id);
      if (!producto || producto.stock < diferencia) {
        alert('No hay stock suficiente para aumentar la cantidad');
        return;
      }
    }
    if (cantidad === 0) {
      setCarrito(carrito.filter(item => item.producto.id !== id));
    } else {
      setCarrito(carrito.map(item =>
        item.producto.id === id
          ? { ...item, cantidad, subtotal: cantidad * item.producto.precio }
          : item
      ));
    }
    setProductos(productos.map(p =>
      p.id === id ? { ...p, stock: p.stock - diferencia } : p
    ));
  }, [carrito, productos]);

  const handleRegistrarCliente = async (clienteData: Omit<Cliente, 'clienteid'>) => {
    try {
      const nuevoCliente = await ventaService.registrarCliente(clienteData);
      setClientes([...clientes, nuevoCliente]);
      setClienteSeleccionado(nuevoCliente);
      setBusquedaCliente('');
      setMostrarModalCliente(false);
      alert('Cliente registrado exitosamente');
    } catch (error) {
      console.error('Error al registrar cliente:', error);
      alert('No se pudo registrar el cliente');
    }
  };

  const abrirModalPago = () => {
    if (carrito.length === 0) return alert('Agrega productos al carrito primero');
    if (!clienteSeleccionado) return alert('Selecciona un cliente primero');
    setMostrarModalPago(true);
  };

  const procesarVenta = async (detallesPago: DetallePago[]) => {
    try {
      if (!clienteSeleccionado || !clienteSeleccionado.id) {
        alert("Selecciona un cliente válido primero");
        return;
      }
      if (carrito.length === 0) {
        alert("Agrega productos al carrito primero");
        return;
      }
      const totalPagos = detallesPago.reduce((sum, pago) => sum + pago.monto, 0);
      const { total } = ventaService.calcularTotales(carrito);
      if (Math.abs(totalPagos - total) > 0.01) {
        alert(`El total de los pagos (S/ ${totalPagos.toFixed(2)}) no coincide con el total de la venta (S/ ${total.toFixed(2)})`);
        return;
      }
      const { idUsuario, idAlmacen } = ventaService.obtenerDatosSesion();
      const { subtotal, igv, total: totalVenta } = ventaService.calcularTotales(carrito);
      const ventaBody = {
        idCliente: clienteSeleccionado.id,
        idUsuario,
        idAlmacen,
        subtotal,
        igv,
        total: totalVenta,
        detalles: carrito.map(item => ({
          idProducto: item.producto.id,
          cantidad: item.cantidad,
          precioUnitario: item.producto.precio,
          subtotal: item.subtotal
        })),
        pagos: detallesPago.map(pago => ({
          id_metodo_pago: pago.id_metodo_pago,
          monto: pago.monto,
          referencia: pago.referencia || ''
        })),
        conEnvio,
        direccionEnvio: conEnvio ? direccionEnvio : undefined,
      };
      const resultado = await ventaService.procesarVenta(ventaBody);
      alert(`Venta #${resultado.id || resultado.numeroComprobante || '000'} procesada correctamente. Total: S/ ${totalVenta.toFixed(2)}`);
      setCarrito([]);
      setClienteSeleccionado(null);
      setBusquedaCliente('');
      setMostrarModalPago(false);
      setConEnvio(false);
      setDireccionEnvio('');
      await ventaService.fetchProductos().then(setProductos);
      navigate('/ventas');
    } catch (error: any) {
      console.error('Error en procesarVenta:', error);
      alert(error.message || "Ocurrió un error al procesar la venta");
    }
  };

  const cancelarVenta = () => {
    if (carrito.length > 0 && confirm('¿Seguro que quieres cancelar la venta?')) {
      limpiarCarrito();
      setClienteSeleccionado(null);
      setBusquedaCliente('');
    } else {
      navigate('/ventas');
    }
  };

  const productosFiltrados = useMemo(() =>
    productos.filter(producto =>
      producto.nombre.toLowerCase().includes(busquedaProducto.toLowerCase()) ||
      producto.categoria.nombre.toLowerCase().includes(busquedaProducto.toLowerCase())
    ), [productos, busquedaProducto]);

  const { subtotal, igv, total } = ventaService.calcularTotales(carrito);

  // ── Client Search Dropdown (reusable) ──
  const ClientDropdown = ({ filtrados, onSelect }: { filtrados: Cliente[]; onSelect: (c: Cliente) => void }) => (
    <div className={`absolute z-50 w-full mt-2 rounded-xl shadow-2xl border max-h-64 overflow-y-auto ${isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'}`}>
      {filtrados.map((cliente) => (
        <div
          key={cliente.persona.id}
          onClick={() => onSelect(cliente)}
          className={`p-3 cursor-pointer border-b last:border-0 transition-colors ${isDark ? 'hover:bg-gray-700 border-gray-700' : 'hover:bg-gray-50 border-gray-100'}`}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white flex-shrink-0"
              style={{ backgroundColor: colors[500] }}
            >
              {cliente.persona.nombres.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className={`font-bold text-sm truncate ${heading}`}>
                {cliente.persona.nombres} {cliente.persona.apellidoPaterno}
              </div>
              <div className={`text-xs ${textTertiary} font-mono`}>
                {cliente.persona.tipoDocumento}: {cliente.persona.numeroDocumento}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // ── Client Selected Card (reusable) ──
  const ClienteCard = ({ cliente, onRemove, compact = false }: { cliente: Cliente; onRemove: () => void; compact?: boolean }) => (
    <div className={`rounded-xl p-${compact ? '3' : '4'} border relative ${isDark ? 'bg-emerald-900/20 border-emerald-800' : 'bg-emerald-50 border-emerald-200'}`}>
      <button
        onClick={onRemove}
        className={`absolute top-2 right-2 p-1.5 rounded-full transition-colors ${isDark ? 'text-gray-500 hover:text-red-400 hover:bg-red-900/30' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`}
      >
        <FiX size={14} />
      </button>
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-md flex-shrink-0">
          {cliente.persona.nombres.charAt(0)}
        </div>
        <div>
          <p className={`font-bold text-sm leading-tight ${isDark ? 'text-emerald-300' : 'text-emerald-900'}`}>
            {cliente.persona.nombres} {cliente.persona.apellidoPaterno}
          </p>
          <p className={`text-xs font-mono mt-0.5 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
            {cliente.persona.numeroDocumento}
          </p>
        </div>
      </div>
      <div className={`flex items-center gap-1.5 mt-2 pt-2 border-t ${isDark ? 'border-emerald-800' : 'border-emerald-200'}`}>
        <svg className="w-3.5 h-3.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span className={`text-[10px] font-bold uppercase tracking-wide ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>Cliente Verificado</span>
      </div>
    </div>
  );

  // ── Loading skeleton ──
  if (loading) {
    return (
      <div className={`min-h-screen ${pageBg} p-4 lg:p-6`}>
        <div className="max-w-[1920px] mx-auto">
          <div className={`rounded-xl border p-4 mb-6 flex flex-col md:flex-row justify-between items-center gap-4 ${card}`}>
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-lg animate-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
              <div>
                <div className={`h-6 w-40 rounded animate-pulse mb-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
                <div className={`h-3 w-28 rounded animate-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`} />
              </div>
            </div>
            <div className="flex gap-3">
              <div className={`h-10 w-24 rounded-lg animate-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
              <div className={`h-10 w-32 rounded-lg animate-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 space-y-6">
              <div className={`p-2 rounded-xl border ${card}`}>
                <div className={`h-12 w-full rounded-lg animate-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className={`rounded-2xl border overflow-hidden ${card}`}>
                    <div className={`h-48 animate-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`} />
                    <div className="p-4 space-y-3">
                      <div className={`h-4 w-16 rounded animate-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
                      <div className={`h-5 w-3/4 rounded animate-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
                      <div className={`h-3 w-1/2 rounded animate-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`} />
                      <div className={`h-7 w-24 rounded animate-pulse mt-3 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden lg:block lg:col-span-4 space-y-5">
              <div className={`rounded-xl border p-5 ${card}`}>
                <div className={`h-5 w-32 rounded animate-pulse mb-4 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
                <div className={`h-10 w-full rounded-lg animate-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`} />
              </div>
              <div className={`rounded-xl border h-[400px] ${card}`}>
                <div className={`h-14 rounded-t-xl animate-pulse`} style={{ backgroundColor: colors[700] || colors[600] }} />
                <div className="p-4 space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className={`h-16 w-full rounded-xl animate-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${pageBg} p-4 lg:p-6 font-sans ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
      <div className="max-w-[1920px] mx-auto">

        {/* ── HEADER ── */}
        <div className={`rounded-xl shadow-sm border p-4 mb-6 flex flex-col md:flex-row justify-between items-center gap-4 ${card}`}>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg shadow-lg text-white" style={{ backgroundColor: colors[600] }}>
              <FiBox size={24} />
            </div>
            <div>
              <h1 className={`text-2xl font-bold tracking-tight leading-none ${heading}`}>Punto de Venta</h1>
              <p className={`text-xs font-medium mt-1 uppercase tracking-wide ${textTertiary}`}>Nueva Operación</p>
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button
              onClick={cancelarVenta}
              className={`flex-1 md:flex-none px-5 py-2.5 rounded-lg border transition-all font-medium text-sm flex items-center justify-center gap-2 ${
                isDark
                  ? 'border-gray-600 text-gray-300 hover:bg-red-900/30 hover:text-red-400 hover:border-red-800'
                  : 'border-gray-300 text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200'
              }`}
            >
              <FiX size={16} /> Cancelar
            </button>
            <button
              onClick={abrirModalPago}
              disabled={carrito.length === 0 || !clienteSeleccionado}
              className="flex-1 md:flex-none px-6 py-2.5 rounded-lg btn-primary shadow-md hover:shadow-lg transition-all font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
            >
              <FiDollarSign size={16} /> Procesar {total > 0 && `S/ ${total.toFixed(2)}`}
            </button>
          </div>
        </div>

        {/* ── GRID PRINCIPAL ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* ── COLUMNA IZQUIERDA: PRODUCTOS ── */}
          <div className="lg:col-span-8 space-y-6">

            {/* Buscador */}
            <div className={`p-2 rounded-xl shadow-sm border sticky top-4 z-20 ${card}`}>
              <div className="relative">
                <FiSearch className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-lg ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                <input
                  type="text"
                  placeholder="Buscar producto por nombre, código o categoría..."
                  value={busquedaProducto}
                  onChange={(e) => setBusquedaProducto(e.target.value)}
                  className={`w-full pl-12 pr-4 py-3 border-none rounded-lg focus:ring-2 transition-all ${
                    isDark
                      ? 'bg-gray-700 text-gray-200 placeholder-gray-500 focus:ring-[var(--color-primary-500)]/30'
                      : 'bg-gray-50 text-gray-700 placeholder-gray-400 focus:ring-[var(--color-primary-500)]/20'
                  }`}
                />
              </div>
            </div>

            {/* Panel de Cliente MÓVILES */}
            <div className={`lg:hidden rounded-xl shadow-sm border overflow-hidden mb-6 ${card}`}>
              <div className={`px-5 py-4 border-b flex items-center gap-2 ${border} ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <FiUserPlus style={{ color: colors[500] }} />
                <h2 className={`font-bold text-sm uppercase tracking-wide ${textSecondary}`}>Datos del Cliente</h2>
              </div>
              <div className="p-5">
                <div className="relative mb-3">
                  <FiSearch className={`absolute left-3 top-3 text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                  <input
                    type="text"
                    value={busquedaCliente}
                    onChange={(e) => setBusquedaCliente(e.target.value)}
                    placeholder="Buscar DNI o Nombre..."
                    className={`w-full pl-9 pr-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-1 transition-all ${input}`}
                  />
                  {busquedaCliente && clientesFiltrados.length > 0 && (
                    <ClientDropdown filtrados={clientesFiltrados} onSelect={(c) => { setClienteSeleccionado(c); setBusquedaCliente(''); }} />
                  )}
                </div>
                {!clienteSeleccionado ? (
                  <button
                    onClick={() => setMostrarModalCliente(true)}
                    className="w-full py-2.5 border-2 border-dashed rounded-lg transition-all text-sm font-bold flex items-center justify-center gap-2"
                    style={{ borderColor: `${colors[300]}`, color: colors[500] }}
                  >
                    <FiUserPlus /> Crear Nuevo Cliente
                  </button>
                ) : (
                  <ClienteCard cliente={clienteSeleccionado} onRemove={() => setClienteSeleccionado(null)} compact />
                )}
              </div>
            </div>

            {/* Product count */}
            <div className="flex items-center justify-between mb-1">
              <p className={`text-xs font-medium ${textTertiary}`}>
                {productosFiltrados.length} producto{productosFiltrados.length !== 1 ? 's' : ''} disponible{productosFiltrados.length !== 1 ? 's' : ''}
                {busquedaProducto && ' (filtrado)'}
              </p>
            </div>

            {/* Grid de Productos */}
            {productosFiltrados.length === 0 ? (
              <div className={`flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed ${isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}`}>
                <div className={`p-4 rounded-full mb-3 ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <FiSearch className={`text-3xl ${isDark ? 'text-gray-500' : 'text-gray-300'}`} />
                </div>
                <h3 className={`font-medium text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>No se encontraron productos</h3>
                <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Intenta con otro término de búsqueda</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 pb-10">
                {productosFiltrados.map((producto) => {
                  const hasStock = producto.stock > 0;
                  const lowStock = producto.stock > 0 && producto.stock <= 5;
                  return (
                    <div
                      key={producto.id}
                      className={`group rounded-2xl shadow-sm border overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-[380px] relative ${card}`}
                      style={{ ['--hover-border' as any]: colors[400] }}
                    >
                      {/* Stock Badge */}
                      <div className="absolute top-3 right-3 z-10">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold shadow-sm uppercase tracking-wide backdrop-blur-md ${
                          !hasStock ? 'bg-red-500/90 text-white' :
                          lowStock ? 'bg-amber-400/90 text-white' :
                          'bg-emerald-500/90 text-white'
                        }`}>
                          {hasStock ? `${producto.stock} ${producto.unidadMedida || 'UND'}` : 'AGOTADO'}
                        </span>
                      </div>

                      {/* Image */}
                      <div className={`h-48 overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <ProductImage
                          src={producto.imagen || ""}
                          alt={producto.nombre}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          isDark={isDark}
                        />
                      </div>

                      {/* Content */}
                      <div className="p-4 flex flex-col flex-1 justify-between">
                        <div>
                          <div className="mb-2">
                            <span
                              className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border"
                              style={{
                                color: colors[600],
                                backgroundColor: isDark ? `${colors[900]}30` : `${colors[50]}`,
                                borderColor: isDark ? `${colors[800]}` : `${colors[100]}`
                              }}
                            >
                              {producto.categoria.nombre}
                            </span>
                          </div>
                          <h3 className={`font-bold text-base leading-snug line-clamp-2 ${heading}`} title={producto.nombre}>
                            {producto.nombre}
                          </h3>
                          {producto.sku && (
                            <p className={`text-[10px] mt-0.5 font-mono ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                              SKU: {producto.sku}
                            </p>
                          )}
                        </div>
                        <div className={`flex items-end justify-between mt-3 pt-3 border-t ${border}`}>
                          <div className="flex flex-col">
                            <span className={`text-[10px] font-medium uppercase ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Precio Unitario</span>
                            <span className={`text-xl font-extrabold ${heading}`}>S/ {producto.precio.toFixed(2)}</span>
                          </div>
                          <button
                            onClick={() => agregarAlCarrito(producto)}
                            disabled={!hasStock}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-md ${
                              hasStock
                                ? 'text-white hover:scale-105 active:scale-95'
                                : `${isDark ? 'bg-gray-700 text-gray-500' : 'bg-gray-100 text-gray-300'} cursor-not-allowed`
                            }`}
                            style={hasStock ? { backgroundColor: colors[600] } : undefined}
                          >
                            <FiShoppingCart size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── VERSIÓN MÓVIL: Carrito Flotante ── */}
          <div className="lg:hidden">
            {!carritoAbierto && carrito.length > 0 && (
              <button
                onClick={() => setCarritoAbierto(true)}
                className="fixed bottom-6 right-6 text-white rounded-full shadow-2xl transition-all z-50 flex items-center gap-3 pr-5 pl-4 py-4 hover:scale-105 active:scale-95 border-4 border-white"
                style={{ background: `linear-gradient(to bottom right, ${colors[500]}, ${colors[700] || colors[600]})` }}
              >
                <div className="relative">
                  <FiShoppingCart size={24} />
                  {carrito.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                      {carrito.length}
                    </span>
                  )}
                </div>
                <div className="text-left">
                  <div className="text-xs font-medium opacity-90">Ver carrito</div>
                  <div className="text-lg font-black leading-none">S/ {total.toFixed(2)}</div>
                </div>
              </button>
            )}

            {carritoAbierto && (
              <>
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-200" onClick={() => setCarritoAbierto(false)} />
                <div className={`fixed inset-x-0 bottom-0 rounded-t-3xl shadow-2xl z-50 flex flex-col max-h-[85vh] ${isDark ? 'bg-gray-800' : 'bg-white'}`}>

                  {/* Header */}
                  <div
                    className="px-5 py-4 text-white rounded-t-3xl flex justify-between items-center shadow-md"
                    style={{ background: `linear-gradient(135deg, ${colors[600]}, ${colors[700] || colors[600]})` }}
                  >
                    <h2 className="font-bold text-sm uppercase tracking-wide flex items-center gap-2">
                      <FiShoppingCart size={16} /> Detalle de Venta
                    </h2>
                    <div className="flex items-center gap-3">
                      <div className="bg-white/15 px-3 py-1 rounded-full text-xs font-mono">{carrito.length} Items</div>
                      <button onClick={() => setCarritoAbierto(false)} className="text-white/70 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors">
                        <FiX size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Cart items */}
                  <div className={`flex-1 overflow-y-auto p-3 space-y-2 ${isDark ? 'bg-gray-850' : 'bg-gray-50'}`}>
                    {carrito.length === 0 ? (
                      <div className={`h-full flex flex-col items-center justify-center py-12 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        <FiFileText size={48} className={`mb-3 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
                        <p className="text-sm font-medium">El carrito está vacío</p>
                        <p className="text-xs">Agrega productos para comenzar</p>
                      </div>
                    ) : (
                      carrito.map((item) => (
                        <div key={item.producto.id} className={`p-3 rounded-xl border shadow-sm ${card}`}>
                          <div className="flex gap-3">
                            <div className={`w-16 h-16 rounded-lg overflow-hidden border flex-shrink-0 ${border}`}>
                              <ProductImage src={item.producto.imagen} alt={item.producto.nombre} className="w-full h-full object-cover" isDark={isDark} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className={`text-sm font-bold line-clamp-2 leading-tight mb-1 ${heading}`}>{item.producto.nombre}</h4>
                              <div className="flex items-center justify-between">
                                <p className={`text-xs ${textTertiary}`}>
                                  Unit: <span className={`font-medium ${textSecondary}`}>S/ {item.producto.precio.toFixed(2)}</span>
                                </p>
                                <span className={`font-bold text-sm ${heading}`}>S/ {item.subtotal.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                          <div className={`flex items-center justify-between mt-3 pt-3 border-t ${border}`}>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => actualizarCantidad(item.producto.id, item.cantidad - 1)}
                                className={`w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-500 hover:text-white transition-colors ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}
                              >
                                {item.cantidad === 1 ? <FiTrash2 size={12} /> : <FiMinus size={12} />}
                              </button>
                              <span className={`text-sm font-bold min-w-[2rem] text-center ${heading}`}>{item.cantidad}</span>
                              <button
                                onClick={() => actualizarCantidad(item.producto.id, item.cantidad + 1)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-white transition-colors"
                                style={{ backgroundColor: colors[600] }}
                              >
                                <FiPlus size={12} />
                              </button>
                            </div>
                            <button onClick={() => actualizarCantidad(item.producto.id, 0)} className="text-xs text-red-400 hover:text-red-600 font-medium">
                              Eliminar
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Footer */}
                  <div className={`p-4 border-t-2 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>

                    {/* Client section */}
                    <div className={`mb-4 pb-4 border-b ${border}`}>
                      {!clienteSeleccionado ? (
                        <div className="space-y-3">
                          <div className={`border rounded-lg p-3 ${isDark ? 'bg-amber-900/30 border-amber-800' : 'bg-amber-50 border-amber-200'}`}>
                            <div className="flex items-start gap-2">
                              <FiAlertTriangle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
                              <div className="flex-1">
                                <p className={`text-xs font-bold ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>Cliente no seleccionado</p>
                                <p className={`text-[10px] ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>Busca o crea un cliente para continuar</p>
                              </div>
                            </div>
                          </div>
                          <div className="relative">
                            <FiSearch className={`absolute left-3 top-3 text-sm z-10 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                            <input
                              type="text"
                              value={busquedaCliente}
                              onChange={(e) => setBusquedaCliente(e.target.value)}
                              placeholder="Buscar por DNI o nombre..."
                              className={`w-full pl-9 pr-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${input}`}
                            />
                            {busquedaCliente && clientesFiltrados.length > 0 && (
                              <div className={`absolute z-[60] w-full mt-2 border rounded-xl shadow-2xl max-h-48 overflow-y-auto ${isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'}`}>
                                <div className={`p-2 border-b ${isDark ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                                  <p className={`text-xs font-bold`} style={{ color: colors[500] }}>
                                    {clientesFiltrados.length} resultado{clientesFiltrados.length !== 1 ? 's' : ''}
                                  </p>
                                </div>
                                {clientesFiltrados.map((cliente) => (
                                  <div
                                    key={cliente.persona.id}
                                    onClick={() => { setClienteSeleccionado(cliente); setBusquedaCliente(''); }}
                                    className={`p-3 cursor-pointer border-b last:border-0 transition-colors ${isDark ? 'hover:bg-gray-700 border-gray-700' : 'hover:bg-gray-50 border-gray-100'}`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white flex-shrink-0" style={{ backgroundColor: colors[500] }}>
                                        {cliente.persona.nombres.charAt(0)}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className={`font-bold text-sm truncate ${heading}`}>{cliente.persona.nombres} {cliente.persona.apellidoPaterno}</div>
                                        <div className={`text-xs ${textTertiary} font-mono`}>{cliente.persona.tipoDocumento}: {cliente.persona.numeroDocumento}</div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                            {busquedaCliente && busquedaCliente.length >= 3 && clientesFiltrados.length === 0 && (
                              <div className={`absolute z-[60] w-full mt-2 border rounded-xl shadow-2xl p-4 ${isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'}`}>
                                <div className="text-center">
                                  <FiSearch className={`w-10 h-10 mx-auto mb-2 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
                                  <p className={`text-sm font-bold mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Cliente no encontrado</p>
                                  <button
                                    onClick={() => { setCarritoAbierto(false); setMostrarModalCliente(true); }}
                                    className="text-xs font-bold underline" style={{ color: colors[500] }}
                                  >
                                    Crear nuevo cliente
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                              <div className={`w-full border-t ${border}`}></div>
                            </div>
                            <div className="relative flex justify-center text-xs">
                              <span className={`px-2 font-medium ${isDark ? 'bg-gray-800 text-gray-500' : 'bg-white text-gray-500'}`}>o</span>
                            </div>
                          </div>
                          <button
                            onClick={() => { setCarritoAbierto(false); setMostrarModalCliente(true); }}
                            className="w-full py-2.5 btn-primary rounded-lg transition-all text-sm font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-95"
                          >
                            <FiUserPlus size={14} /> Crear Nuevo Cliente
                          </button>
                        </div>
                      ) : (
                        <ClienteCard cliente={clienteSeleccionado} onRemove={() => setClienteSeleccionado(null)} compact />
                      )}
                    </div>

                    {/* Totals */}
                    <div className="space-y-2 mb-3">
                      <div className={`flex justify-between text-xs ${textTertiary}`}>
                        <span>Subtotal</span>
                        <span className="font-mono">S/ {subtotal.toFixed(2)}</span>
                      </div>
                      <div className={`flex justify-between text-xs ${textTertiary}`}>
                        <span>IGV (18%)</span>
                        <span className="font-mono">S/ {igv.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className={`pt-3 border-t flex justify-between items-center mb-4 ${border}`}>
                      <span className={`font-bold text-sm uppercase ${textSecondary}`}>Total a Pagar</span>
                      <span className="text-2xl font-black tracking-tight" style={{ color: colors[500] }}>S/ {total.toFixed(2)}</span>
                    </div>
                    <div className="space-y-2">
                      <button
                        onClick={() => { setCarritoAbierto(false); abrirModalPago(); }}
                        disabled={!clienteSeleccionado}
                        className="w-full text-white py-3.5 rounded-xl font-bold shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale"
                        style={{ backgroundColor: colors[600] }}
                      >
                        <FiDollarSign size={16} />
                        {!clienteSeleccionado ? 'Selecciona un cliente' : 'Procesar Pago'}
                      </button>
                      {carrito.length > 0 && (
                        <button
                          onClick={() => { if (confirm('¿Estás seguro de vaciar el carrito?')) limpiarCarrito(); }}
                          className="w-full text-xs text-red-400 hover:text-red-600 hover:underline text-center transition-colors py-2"
                        >
                          Vaciar todo el carrito
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* ── VERSIÓN DESKTOP: Panel Lateral ── */}
          <div className="hidden lg:block lg:col-span-4 space-y-5 lg:sticky lg:top-4 h-fit">

            {/* Panel de Cliente */}
            <div className={`rounded-xl shadow-sm border overflow-hidden ${card}`}>
              <div className={`px-5 py-4 border-b flex items-center gap-2 ${border} ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <FiUserPlus style={{ color: colors[500] }} size={16} />
                <h2 className={`font-bold text-sm uppercase tracking-wide ${textSecondary}`}>Datos del Cliente</h2>
              </div>
              <div className="p-5">
                <div className="relative mb-3">
                  <FiSearch className={`absolute left-3 top-3 text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                  <input
                    type="text"
                    value={busquedaCliente}
                    onChange={(e) => setBusquedaCliente(e.target.value)}
                    placeholder="Buscar DNI o Nombre..."
                    className={`w-full pl-9 pr-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-1 transition-all ${input}`}
                  />
                  {busquedaCliente && clientesFiltrados.length > 0 && (
                    <ClientDropdown filtrados={clientesFiltrados} onSelect={(c) => { setClienteSeleccionado(c); setBusquedaCliente(''); }} />
                  )}
                </div>
                {!clienteSeleccionado ? (
                  <button
                    onClick={() => setMostrarModalCliente(true)}
                    className="w-full py-2.5 border-2 border-dashed rounded-lg transition-all text-sm font-bold flex items-center justify-center gap-2"
                    style={{ borderColor: `${colors[300]}`, color: colors[500] }}
                  >
                    <FiUserPlus size={14} /> Crear Nuevo Cliente
                  </button>
                ) : (
                  <ClienteCard cliente={clienteSeleccionado} onRemove={() => setClienteSeleccionado(null)} />
                )}
              </div>
            </div>

            {/* Panel del Carrito */}
            <div className={`rounded-xl shadow-lg border flex flex-col h-[500px] ${card}`}>
              <div
                className="px-5 py-4 border-b text-white rounded-t-xl flex justify-between items-center shadow-md z-10"
                style={{ background: `linear-gradient(135deg, ${colors[600]}, ${colors[700] || colors[600]})` }}
              >
                <h2 className="font-bold text-sm uppercase tracking-wide flex items-center gap-2">
                  <FiShoppingCart size={16} /> Detalle de Venta
                </h2>
                <div className="bg-white/15 px-2 py-1 rounded text-xs font-mono">{carrito.length} Items</div>
              </div>

              <div className={`flex-grow overflow-y-auto p-2 space-y-2 custom-scrollbar ${isDark ? 'bg-gray-850' : 'bg-gray-50'}`}>
                {carrito.length === 0 ? (
                  <div className={`h-full flex flex-col items-center justify-center opacity-70 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    <FiFileText size={48} className={`mb-3 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
                    <p className="text-sm font-medium">El carrito está vacío</p>
                    <p className="text-xs">Agrega productos para comenzar</p>
                  </div>
                ) : (
                  carrito.map((item) => (
                    <div key={item.producto.id} className={`group flex gap-3 p-3 border rounded-xl hover:shadow-md transition-all ${card}`}>
                      <div className={`w-16 h-16 rounded-lg overflow-hidden border flex-shrink-0 ${border}`}>
                        <ProductImage src={item.producto.imagen} alt={item.producto.nombre} className="w-full h-full object-cover" isDark={isDark} />
                      </div>
                      <div className="flex-grow min-w-0 flex flex-col justify-between">
                        <h4 className={`text-sm font-bold truncate ${heading}`} title={item.producto.nombre}>{item.producto.nombre}</h4>
                        <div className="flex justify-between items-end">
                          <p className={`text-xs ${textTertiary}`}>Unit: <span className={`font-medium ${textSecondary}`}>S/ {item.producto.precio.toFixed(2)}</span></p>
                          <span className={`font-bold text-sm ${heading}`}>S/ {item.subtotal.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className={`flex flex-col items-center justify-between pl-2 border-l ${border}`}>
                        <button
                          onClick={() => actualizarCantidad(item.producto.id, item.cantidad + 1)}
                          className="w-6 h-6 flex items-center justify-center rounded-md transition-colors text-[10px] text-white"
                          style={{ backgroundColor: colors[600] }}
                        >
                          <FiPlus />
                        </button>
                        <span className={`text-xs font-bold my-1 ${heading}`}>{item.cantidad}</span>
                        <button
                          onClick={() => actualizarCantidad(item.producto.id, item.cantidad - 1)}
                          className={`w-6 h-6 flex items-center justify-center rounded-md transition-colors text-[10px] ${isDark ? 'bg-gray-700 text-gray-300 hover:bg-red-500 hover:text-white' : 'bg-gray-100 text-gray-600 hover:bg-red-500 hover:text-white'}`}
                        >
                          {item.cantidad === 1 ? <FiTrash2 /> : <FiMinus />}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className={`p-5 border-t rounded-b-xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className="space-y-2 mb-4">
                  <div className={`flex justify-between text-xs ${textTertiary}`}>
                    <span>Subtotal</span>
                    <span className="font-mono">S/ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className={`flex justify-between text-xs ${textTertiary}`}>
                    <span>IGV (18%)</span>
                    <span className="font-mono">S/ {igv.toFixed(2)}</span>
                  </div>
                </div>
                <div className={`pt-3 border-t flex justify-between items-center ${border}`}>
                  <span className={`font-bold text-sm uppercase ${textSecondary}`}>Total a Pagar</span>
                  <span className="text-3xl font-black tracking-tight" style={{ color: colors[500] }}>S/ {total.toFixed(2)}</span>
                </div>
                {carrito.length > 0 && (
                  <button onClick={limpiarCarrito} className="w-full mt-3 text-xs text-red-400 hover:text-red-600 hover:underline text-center transition-colors">
                    Vaciar todo el carrito
                  </button>
                )}

                {/* Delivery toggle */}
                <div className={`mt-3 p-3 rounded-xl border ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={conEnvio} onChange={(e) => setConEnvio(e.target.checked)} className="w-4 h-4 rounded" style={{ accentColor: colors[500] }} />
                    <div className="flex items-center gap-2">
                      <FiTruck size={14} style={{ color: colors[500] }} />
                      <span className={`text-sm font-medium ${textSecondary}`}>Envio a domicilio</span>
                    </div>
                  </label>
                  {conEnvio && (
                    <input
                      type="text"
                      placeholder="Direccion de envio..."
                      value={direccionEnvio}
                      onChange={(e) => setDireccionEnvio(e.target.value)}
                      className={`mt-2 w-full px-3 py-2 rounded-lg text-sm border ${input}`}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modales */}
        <ModalCliente isOpen={mostrarModalCliente} onClose={() => setMostrarModalCliente(false)} onRegistrar={handleRegistrarCliente} />
        <ModalPago isOpen={mostrarModalPago} onClose={() => setMostrarModalPago(false)} onConfirmar={procesarVenta} cliente={clienteSeleccionado} total={total} metodosPago={metodosPago} conEnvio={conEnvio} direccionEnvio={direccionEnvio} />
      </div>
    </div>
  );
};

export default VentasList;
