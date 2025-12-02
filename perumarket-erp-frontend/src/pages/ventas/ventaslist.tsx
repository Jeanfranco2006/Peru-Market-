import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaShoppingCart, FaTrash, FaMinus, FaPlus, FaSearch, FaUserPlus } from 'react-icons/fa';
import ModalCliente from './ModalCliente';
import ModalPago from './ModalPago';
import type { Cliente } from '../../types/Client';
import type { DetallePago, MetodoPago, Producto, ProductoVenta } from '../../types/ventas';
import { ventaService } from '../../services/ventaService';

const VentasList: React.FC = () => {
  const navigate = useNavigate();

  // Estados principales
  const [productos, setProductos] = useState<Producto[]>([]);
  const [carrito, setCarrito] = useState<ProductoVenta[]>([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);
  const [busquedaProducto, setBusquedaProducto] = useState('');
  const [busquedaCliente, setBusquedaCliente] = useState('');
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
          ? {
            ...item,
            cantidad: item.cantidad + 1,
            subtotal: (item.cantidad + 1) * item.producto.precio
          }
          : item
      ));
    } else {
      setCarrito([...carrito, { producto, cantidad: 1, subtotal: producto.precio }]);
    }

    setProductos(productos.map(p =>
      p.id === producto.id
        ? { ...p, stock: p.stock - 1 }
        : p
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
      p.id === id
        ? { ...p, stock: p.stock - diferencia }
        : p
    ));
  }, [carrito, productos]);

  // Registrar cliente - CORREGIDO: Usa 'clienteid' en lugar de 'id'
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

  // Procesar venta
  const abrirModalPago = () => {
    if (carrito.length === 0) return alert('Agrega productos al carrito primero');
    if (!clienteSeleccionado) return alert('Selecciona un cliente primero');
    setMostrarModalPago(true);
  };

  // Procesar venta - CORREGIDO
  const procesarVenta = async (detallesPago: DetallePago[]) => {
    try {
      if (!clienteSeleccionado || !clienteSeleccionado.clienteid) {
        alert("⚠️ Selecciona un cliente válido primero");
        return;
      }
      
      if (carrito.length === 0) {
        alert("⚠️ Agrega productos al carrito primero");
        return;
      }

      // Validar que los pagos sumen el total
      const totalPagos = detallesPago.reduce((sum, pago) => sum + pago.monto, 0);
      const { total } = ventaService.calcularTotales(carrito);
      
      if (Math.abs(totalPagos - total) > 0.01) {
        alert(`⚠️ El total de los pagos (S/ ${totalPagos.toFixed(2)}) no coincide con el total de la venta (S/ ${total.toFixed(2)})`);
        return;
      }

      const { idUsuario, idAlmacen } = ventaService.obtenerDatosSesion();
      const { subtotal, igv, total: totalVenta } = ventaService.calcularTotales(carrito);

      // Preparar datos de la venta
      const ventaBody = {
        idCliente: clienteSeleccionado.clienteid,
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

      console.log('Venta body preparado:', ventaBody);

      // Registrar venta
      const resultado = await ventaService.procesarVenta(ventaBody);

      // Actualizar stock de cada producto
      await Promise.all(
        carrito.map(item => 
          ventaService.actualizarStock(item.producto.id, item.producto.stock)
        )
      );

      alert(`✅ Venta #${resultado.id || resultado.numeroComprobante || '000'} procesada correctamente. Total: S/ ${totalVenta.toFixed(2)}`);

      // Reset del estado
      setCarrito([]);
      setClienteSeleccionado(null);
      setBusquedaCliente('');
      setMostrarModalPago(false);

      // Recargar productos para actualizar stock
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

  // Filtrar productos
  const productosFiltrados = useMemo(() => 
    productos.filter(producto =>
      producto.nombre.toLowerCase().includes(busquedaProducto.toLowerCase()) ||
      producto.categoria.nombre.toLowerCase().includes(busquedaProducto.toLowerCase())
    ), [productos, busquedaProducto]);

  const { subtotal, igv, total } = ventaService.calcularTotales(carrito);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">VENTAS</h1>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
            <button
              onClick={cancelarVenta}
              className="flex items-center justify-center bg-gray-500 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <FaTimes className="mr-2" />
              <span className="text-sm sm:text-base">Cancelar</span>
            </button>
            <button
              onClick={abrirModalPago}
              disabled={carrito.length === 0 || !clienteSeleccionado}
              className="flex items-center justify-center bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaShoppingCart className="mr-2" />
              <span className="text-sm sm:text-base">Procesar Venta</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Columna izquierda - Productos */}
          <div className="lg:col-span-2">
            {/* Barra de búsqueda */}
            <div className="bg-white rounded-lg shadow p-3 sm:p-4 mb-4 sm:mb-6">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={busquedaProducto}
                  onChange={(e) => setBusquedaProducto(e.target.value)}
                  className="w-full border border-gray-300 rounded px-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Grid de productos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
              {productosFiltrados.map((producto) => (
                <div
                  key={producto.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="p-3 sm:p-4">
                    <img
                      src={producto.imagen || "/default-product.png"}
                      alt={producto.nombre}
                      className="w-full h-24 sm:h-32 object-cover rounded-md mb-2 sm:mb-3"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/default-product.png";
                      }}
                    />
                    <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base line-clamp-2">{producto.nombre}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mb-2">{producto.categoria.nombre}</p>
                    <div className="flex justify-between items-center mb-2 sm:mb-3">
                      <span className="text-base sm:text-lg font-bold text-blue-600">
                        S/ {producto.precio.toFixed(2)}
                      </span>
                      <span className={`text-xs sm:text-sm px-2 py-1 rounded-full ${producto.stock > 10
                        ? 'bg-green-100 text-green-800'
                        : producto.stock > 0
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                        }`}>
                        Stock: {producto.stock}
                      </span>
                    </div>
                    <button
                      onClick={() => agregarAlCarrito(producto)}
                      disabled={producto.stock <= 0}
                      className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {producto.stock > 0 ? 'Agregar al Carrito' : 'Sin Stock'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Columna derecha - Carrito */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Carrito de Venta</h2>

            {/* Selector de cliente */}
            <div className="mb-4 sm:mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cliente
              </label>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={busquedaCliente}
                  onChange={(e) => setBusquedaCliente(e.target.value)}
                  placeholder="Buscar cliente por nombre o DNI..."
                  className="w-full border border-gray-300 rounded px-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                />
              </div>

              {/* Lista de clientes filtrados */}
              {busquedaCliente && clientesFiltrados.length > 0 && (
                <div className="absolute z-20 w-full max-w-md mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {clientesFiltrados.map((cliente) => (
                    <div
                      key={cliente.persona.id}
                      onClick={() => {
                        setClienteSeleccionado(cliente);
                        setBusquedaCliente('');
                      }}
                      className="p-2 sm:p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                    >
                      <div className="font-medium text-sm sm:text-base">
                        {cliente.persona.nombres} {cliente.persona.apellidoPaterno} {cliente.persona.apellidoMaterno}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">
                        {cliente.persona.tipoDocumento}: {cliente.persona.numeroDocumento}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Mensaje si no hay clientes */}
              {busquedaCliente && clientesFiltrados.length === 0 && (
                <div className="absolute z-20 w-full max-w-md mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                  <div className="p-3 text-center">
                    <p className="text-gray-500 mb-2 text-sm">No se encontraron clientes</p>
                    <button
                      onClick={() => setMostrarModalCliente(true)}
                      className="flex items-center justify-center w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors text-sm"
                    >
                      <FaUserPlus className="mr-2" />
                      Registrar Nuevo Cliente
                    </button>
                  </div>
                </div>
              )}

              {/* Cliente seleccionado */}
              {clienteSeleccionado && (
                <div className="mt-2 sm:mt-3 p-2 sm:p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="font-medium text-green-800 text-sm sm:text-base">
                    {clienteSeleccionado.persona.nombres} {clienteSeleccionado.persona.apellidoPaterno} {clienteSeleccionado.persona.apellidoMaterno}
                  </div>
                  <div className="text-xs sm:text-sm text-green-600">
                    {clienteSeleccionado.persona.tipoDocumento}: {clienteSeleccionado.persona.numeroDocumento}
                  </div>
                  <button
                    onClick={() => setClienteSeleccionado(null)}
                    className="text-xs text-red-600 hover:text-red-800 mt-1"
                  >
                    Cambiar cliente
                  </button>
                </div>
              )}

              {/* Botón para registrar nuevo cliente */}
              {!clienteSeleccionado && !busquedaCliente && (
                <button
                  onClick={() => setMostrarModalCliente(true)}
                  className="flex items-center justify-center w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors mt-2 text-sm sm:text-base"
                >
                  <FaUserPlus className="mr-2" />
                  Registrar Nuevo Cliente
                </button>
              )}
            </div>

            {/* Botón limpiar carrito */}
            {carrito.length > 0 && (
              <button
                onClick={limpiarCarrito}
                className="flex items-center justify-center w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition-colors mb-4 text-sm sm:text-base"
              >
                <FaTrash className="mr-2" />
                Limpiar Carrito
              </button>
            )}

            {/* Lista de productos en carrito */}
            <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 max-h-64 sm:max-h-96 overflow-y-auto">
              {carrito.length === 0 ? (
                <p className="text-gray-500 text-center py-4 text-sm sm:text-base">
                  No hay productos en el carrito
                </p>
              ) : (
                carrito.map((item) => (
                  <div
                    key={item.producto.id}
                    className="flex items-center justify-between p-2 sm:p-3 border rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-xs sm:text-sm truncate">
                        {item.producto.nombre}
                      </p>
                      <p className="text-xs text-gray-600">
                        S/ {item.producto.precio.toFixed(2)} c/u
                      </p>
                    </div>

                    <div className="flex items-center gap-1 sm:gap-2 ml-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          actualizarCantidad(item.producto.id, item.cantidad - 1);
                        }}
                        className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                      >
                        <FaMinus size={8} />
                      </button>

                      <input
                        type="number"
                        value={item.cantidad}
                        onChange={(e) => {
                          const nuevaCantidad = parseInt(e.target.value, 10);
                          actualizarCantidad(item.producto.id, isNaN(nuevaCantidad) ? 1 : nuevaCantidad);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-10 sm:w-12 text-center text-xs sm:text-sm border rounded-md no-spinner"
                        min="1"
                      />

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          actualizarCantidad(item.producto.id, item.cantidad + 1);
                        }}
                        className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                      >
                        <FaPlus size={8} />
                      </button>
                    </div>

                    <span className="font-semibold w-14 sm:w-20 text-right text-xs sm:text-sm">
                      S/ {item.subtotal.toFixed(2)}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Resumen de compra */}
            <div className="border-t pt-3 sm:pt-4">
              <div className="space-y-1 sm:space-y-2 text-sm sm:text-base">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span>S/ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">IGV (18%):</span>
                  <span>S/ {igv.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold border-t pt-2 text-base sm:text-lg">
                  <span>Total:</span>
                  <span className="text-blue-600">S/ {total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modales */}
        <ModalCliente
          isOpen={mostrarModalCliente}
          onClose={() => setMostrarModalCliente(false)}
          onRegistrar={handleRegistrarCliente}
        />

        <ModalPago
          isOpen={mostrarModalPago}
          onClose={() => setMostrarModalPago(false)}
          onConfirmar={procesarVenta}
          cliente={clienteSeleccionado}
          total={total}
          metodosPago={metodosPago}
        />
      </div>
    </div>
  );
};

export default VentasList;