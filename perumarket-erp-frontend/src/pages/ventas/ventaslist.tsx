import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaShoppingCart, FaTrash, FaMinus, FaPlus, FaSearch, FaUserPlus, FaImage, FaBoxOpen, FaMoneyBillWave, FaReceipt } from 'react-icons/fa';
import ModalCliente from './ModalCliente';
import ModalPago from './ModalPago';
import type { Cliente } from '../../types/clientes/Client';
import type { DetallePago, MetodoPago, Producto, ProductoVenta } from '../../types/ventas/ventas';
import { ventaService } from '../../services/ventas/ventaService';

const ProductImage = ({
  src,
  alt,
  className = "w-full h-full object-cover"
}: {
  src?: string | null;
  alt: string;
  className?: string;
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  if (imageError || !src) {
    return (
      <div className={`${className} bg-slate-100 flex flex-col items-center justify-center text-slate-400`}>
        <FaImage className="text-3xl mb-1 opacity-50" />
        <span className="text-[10px] font-medium uppercase tracking-wide">Sin imagen</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative overflow-hidden bg-slate-100">
      {imageLoading && (
        <div className={`absolute inset-0 bg-slate-200 animate-pulse flex items-center justify-center z-10`}>
          <FaImage className="text-slate-300 text-3xl" />
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

  // Estados principales
  const [productos, setProductos] = useState<Producto[]>([]);
  const [carrito, setCarrito] = useState<ProductoVenta[]>([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);
  const [busquedaProducto, setBusquedaProducto] = useState('');
  const [busquedaCliente, setBusquedaCliente] = useState('');
  const [buscandoClientes, setBuscandoClientes] = useState(false);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clientesFiltrados, setClientesFiltrados] = useState<Cliente[]>([]);
  const [metodosPago, setMetodosPago] = useState<MetodoPago[]>([]);
  const [almacenes, setAlmacenes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Estados de modales
  const [mostrarModalCliente, setMostrarModalCliente] = useState(false);
  const [mostrarModalPago, setMostrarModalPago] = useState(false);

  // Inicializar datos
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

  // Filtrar clientes
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

  // Funciones del carrito
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
      alert('❌ No hay stock disponible');
      return;
    }

    const existe = carrito.find(item => item.producto.id === producto.id);

    if (existe) {
      if (producto.stock - 1 < 0) {
        alert('❌ No hay más unidades disponibles');
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
        alert('❌ No hay stock suficiente para aumentar la cantidad');
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
        alert("⚠️ Selecciona un cliente válido primero");
        return;
      }
      if (carrito.length === 0) {
        alert("⚠️ Agrega productos al carrito primero");
        return;
      }

      const totalPagos = detallesPago.reduce((sum, pago) => sum + pago.monto, 0);
      const { total } = ventaService.calcularTotales(carrito);

      if (Math.abs(totalPagos - total) > 0.01) {
        alert(`⚠️ El total de los pagos (S/ ${totalPagos.toFixed(2)}) no coincide con el total de la venta (S/ ${total.toFixed(2)})`);
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
        }))
      };

      const resultado = await ventaService.procesarVenta(ventaBody);

      await Promise.all(
        carrito.map(item =>
          ventaService.actualizarStock(item.producto.id, item.producto.stock)
        )
      );

      alert(`✅ Venta #${resultado.id || resultado.numeroComprobante || '000'} procesada correctamente. Total: S/ ${totalVenta.toFixed(2)}`);

      setCarrito([]);
      setClienteSeleccionado(null);
      setBusquedaCliente('');
      setMostrarModalPago(false);
      await ventaService.fetchProductos().then(setProductos);
      navigate('/ventas');

    } catch (error: any) {
      console.error('Error en procesarVenta:', error);
      alert(error.message || "❌ Ocurrió un error al procesar la venta");
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-600 font-medium animate-pulse">Cargando sistema de ventas...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 lg:p-6 font-sans text-slate-800">
      <div className="max-w-[1920px] mx-auto">

        {/* === HEADER FORMAL === */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 rounded-lg shadow-lg shadow-blue-200 text-white">
              <FaBoxOpen size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight leading-none">Punto de Venta</h1>
              <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-wide">Nueva Operación</p>
            </div>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <button
              onClick={cancelarVenta}
              className="flex-1 md:flex-none px-5 py-2.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all font-medium text-sm flex items-center justify-center gap-2"
            >
              <FaTimes /> Cancelar
            </button>
            <button
              onClick={abrirModalPago}
              disabled={carrito.length === 0 || !clienteSeleccionado}
              className="flex-1 md:flex-none px-6 py-2.5 rounded-lg bg-slate-800 text-white hover:bg-slate-900 shadow-md hover:shadow-lg transition-all font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
            >
              <FaMoneyBillWave /> Procesar {total > 0 && `S/ ${total.toFixed(2)}`}
            </button>
          </div>
        </div>

        {/* === GRID PRINCIPAL === */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* === COLUMNA IZQUIERDA: PRODUCTOS (8 cols) === */}
          <div className="lg:col-span-8 space-y-6">

            {/* Buscador Moderno */}
            <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-200 sticky top-4 z-20">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 text-lg" />
                <input
                  type="text"
                  placeholder="Buscar producto por nombre, código o categoría..."
                  value={busquedaProducto}
                  onChange={(e) => setBusquedaProducto(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-lg focus:ring-2 focus:ring-blue-500/20 text-slate-700 placeholder-slate-400 transition-all"
                />
              </div>
            </div>

            {/* Grid de Cards Mejoradas */}
            {productosFiltrados.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                <div className="bg-slate-50 p-4 rounded-full mb-3">
                  <FaSearch className="text-slate-300 text-3xl" />
                </div>
                <h3 className="text-slate-600 font-medium text-lg">No se encontraron productos</h3>
                <p className="text-slate-400 text-sm">Intenta con otro término de búsqueda</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 pb-10">
                {productosFiltrados.map((producto) => {
                  const hasStock = producto.stock > 0;
                  const lowStock = producto.stock > 0 && producto.stock <= 5;

                  return (
                    <div
                      key={producto.id}
                      className="group bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col h-[380px] relative"
                    >
                      {/* Badge de Stock */}
                      <div className="absolute top-3 right-3 z-10">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold shadow-sm uppercase tracking-wide backdrop-blur-md ${!hasStock ? 'bg-red-500/90 text-white' :
                            lowStock ? 'bg-amber-400/90 text-white' :
                              'bg-emerald-500/90 text-white'
                          }`}>
                          {hasStock ? `${producto.stock} UND` : 'AGOTADO'}
                        </span>
                      </div>

                      {/* Imagen con efecto zoom */}
                      <div className="h-48 overflow-hidden bg-slate-50">
                        <ProductImage
                          src={producto.imagen || ""}
                          alt={producto.nombre}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>

                      {/* Contenido */}
                      <div className="p-4 flex flex-col flex-1 justify-between">
                        <div>
                          <div className="mb-2">
                            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-1 rounded-md border border-blue-100">
                              {producto.categoria.nombre}
                            </span>
                          </div>
                          <h3 className="font-bold text-slate-800 text-base leading-snug line-clamp-2" title={producto.nombre}>
                            {producto.nombre}
                          </h3>
                        </div>

                        <div className="flex items-end justify-between mt-3 pt-3 border-t border-slate-100">
                          <div className="flex flex-col">
                            <span className="text-[10px] text-slate-400 font-medium uppercase">Precio Unitario</span>
                            <span className="text-xl font-extrabold text-slate-900">S/ {producto.precio.toFixed(2)}</span>
                          </div>
                          <button
                            onClick={() => agregarAlCarrito(producto)}
                            disabled={!hasStock}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-md ${hasStock
                                ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 shadow-blue-200'
                                : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                              }`}
                          >
                            <FaShoppingCart className="text-sm" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* === COLUMNA DERECHA: PANELES (4 cols - Sticky) === */}
          <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-4 h-fit">

            {/* 1. Panel de Cliente */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                <FaUserPlus className="text-blue-600" />
                <h2 className="font-bold text-slate-700 text-sm uppercase tracking-wide">Datos del Cliente</h2>
              </div>

              <div className="p-5">
                <div className="relative mb-3">
                  <FaSearch className="absolute left-3 top-3 text-slate-400 text-sm" />
                  <input
                    type="text"
                    value={busquedaCliente}
                    onChange={(e) => setBusquedaCliente(e.target.value)}
                    placeholder="Buscar DNI o Nombre..."
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                  {/* Dropdown Resultados Cliente */}
                  {busquedaCliente && clientesFiltrados.length > 0 && (
                    <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl max-h-64 overflow-y-auto custom-scrollbar">
                      {clientesFiltrados.map((cliente) => (
                        <div
                          key={cliente.persona.id}
                          onClick={() => {
                            setClienteSeleccionado(cliente);
                            setBusquedaCliente('');
                          }}
                          className="p-3 hover:bg-blue-50 cursor-pointer border-b border-slate-100 last:border-0 transition-colors"
                        >
                          <div className="font-bold text-slate-800 text-sm">
                            {cliente.persona.nombres} {cliente.persona.apellidoPaterno}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            DOC: <span className="font-mono text-slate-600">{cliente.persona.numeroDocumento}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {!clienteSeleccionado ? (
                  <button
                    onClick={() => setMostrarModalCliente(true)}
                    className="w-full py-2.5 border-2 border-dashed border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all text-sm font-bold flex items-center justify-center gap-2"
                  >
                    <FaUserPlus /> Crear Nuevo Cliente
                  </button>
                ) : (
                  <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100 relative">
                    <button
                      onClick={() => setClienteSeleccionado(null)}
                      className="absolute top-2 right-2 text-slate-400 hover:text-red-500 p-1.5 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <FaTimes size={12} />
                    </button>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                        {clienteSeleccionado.persona.nombres.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm leading-tight">
                          {clienteSeleccionado.persona.nombres} {clienteSeleccionado.persona.apellidoPaterno}
                        </p>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">
                          {clienteSeleccionado.persona.numeroDocumento}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <span className="text-[10px] bg-white border border-blue-100 text-blue-600 px-2 py-0.5 rounded shadow-sm">Cliente Verificado</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Panel del Carrito */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 flex flex-col h-[500px]">
              <div className="px-5 py-4 border-b border-slate-200 bg-slate-900 text-white rounded-t-xl flex justify-between items-center shadow-md z-10">
                <h2 className="font-bold text-sm uppercase tracking-wide flex items-center gap-2">
                  <FaShoppingCart className="text-blue-400" /> Detalle de Venta
                </h2>
                <div className="bg-slate-800 px-2 py-1 rounded text-xs font-mono text-blue-200">
                  {carrito.length} Items
                </div>
              </div>

              {/* Lista Scrollable */}
              <div className="flex-grow overflow-y-auto p-2 space-y-2 bg-slate-50 custom-scrollbar">
                {carrito.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-70">
                    <FaReceipt size={48} className="mb-3 text-slate-300" />
                    <p className="text-sm font-medium">El carrito está vacío</p>
                    <p className="text-xs">Agrega productos para comenzar</p>
                  </div>
                ) : (
                  carrito.map((item) => (
                    <div key={item.producto.id} className="group flex gap-3 p-3 bg-white border border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all">
                      <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-100 flex-shrink-0">
                        <img src={item.producto.imagen || ""} alt="" className="w-full h-full object-cover" />
                      </div>

                      <div className="flex-grow min-w-0 flex flex-col justify-between">
                        <h4 className="text-sm font-bold text-slate-800 truncate" title={item.producto.nombre}>
                          {item.producto.nombre}
                        </h4>
                        <div className="flex justify-between items-end">
                          <p className="text-xs text-slate-500">Unit: <span className="font-medium text-slate-700">S/ {item.producto.precio.toFixed(2)}</span></p>
                          <span className="font-bold text-slate-900 text-sm">S/ {item.subtotal.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-center justify-between pl-2 border-l border-slate-100">
                        <button
                          onClick={() => actualizarCantidad(item.producto.id, item.cantidad + 1)}
                          className="w-6 h-6 flex items-center justify-center bg-slate-100 text-slate-600 rounded-md hover:bg-blue-600 hover:text-white transition-colors text-[10px]"
                        >
                          <FaPlus />
                        </button>
                        <span className="text-xs font-bold text-slate-800 my-1">{item.cantidad}</span>
                        <button
                          onClick={() => actualizarCantidad(item.producto.id, item.cantidad - 1)}
                          className="w-6 h-6 flex items-center justify-center bg-slate-100 text-slate-600 rounded-md hover:bg-red-500 hover:text-white transition-colors text-[10px]"
                        >
                          {item.cantidad === 1 ? <FaTrash /> : <FaMinus />}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer Totales */}
              <div className="p-5 bg-white border-t border-slate-200 rounded-b-xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Subtotal</span>
                    <span className="font-mono">S/ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>IGV (18%)</span>
                    <span className="font-mono">S/ {igv.toFixed(2)}</span>
                  </div>
                </div>
                <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                  <span className="font-bold text-slate-800 text-sm uppercase">Total a Pagar</span>
                  <span className="text-3xl font-black text-blue-600 tracking-tight">S/ {total.toFixed(2)}</span>
                </div>
                {carrito.length > 0 && (
                  <button
                    onClick={limpiarCarrito}
                    className="w-full mt-3 text-xs text-red-400 hover:text-red-600 hover:underline text-center transition-colors"
                  >
                    Vaciar todo el carrito
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Modales */}
        <ModalCliente isOpen={mostrarModalCliente} onClose={() => setMostrarModalCliente(false)} onRegistrar={handleRegistrarCliente} />
        <ModalPago isOpen={mostrarModalPago} onClose={() => setMostrarModalPago(false)} onConfirmar={procesarVenta} cliente={clienteSeleccionado} total={total} metodosPago={metodosPago} />
      </div>
    </div>
  );
};

export default VentasList;