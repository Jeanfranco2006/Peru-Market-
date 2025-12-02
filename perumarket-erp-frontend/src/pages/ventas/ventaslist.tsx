import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaShoppingCart, FaTrash, FaMinus, FaPlus, FaSearch, FaUserPlus } from 'react-icons/fa';
import ModalCliente from './ModalCliente';
import ModalPago from './ModalPago';
import type { Cliente } from '../../types/Client';



interface categoria {
  id: number;
  nombre: string;
}
interface Producto {
  id: number;
  nombre: string;
  precio: number;
  imagen?: string;
  stock: number;
  categoria: categoria;
}

interface ProductoVenta {
  producto: Producto;
  cantidad: number;
  subtotal: number;
}

interface MetodoPago {
  id: number;
  nombre: string;
  descripcion: string;
  estado: string;
}

interface DetallePago {
  id_metodo_pago: number;
  monto: number;
  referencia: string;
}

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
  const [almacenes, setAlmacenes] = useState([]);

  // Estados de modales
  const [mostrarModalCliente, setMostrarModalCliente] = useState(false);
  const [mostrarModalPago, setMostrarModalPago] = useState(false);

  // Inicializar datos
  useEffect(() => {

    cargarMetodosPago();
    fetchClientes();
    fetchProductos();
    fetchAlmacenes();
  }, []);


  const fetchProductos = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/productos");
      const data = await response.json();

      // ADAPTAR datos reales a tu modelo
      const productosAdaptados: Producto[] = data.map((p: any) => ({
        id: p.id,
        nombre: p.nombre,
        precio: p.precioVenta,      // <<--- aquí el precio real
        imagen: p.imagen ?? "",
        stock: p.stockActual,       // <<--- aquí el stock real
        categoria: {
          id: p.categoriaId ?? 0,
          nombre: p.categoriaNombre ?? "Sin categoría"
        }
      }));

      setProductos(productosAdaptados);
    } catch (error) {
      console.error("Error cargando productos:", error);
    }
  };

  const fetchAlmacenes = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/almacenes");
      const data = await response.json();
      setAlmacenes(data);
    } catch (error) {
      console.error("Error cargando almacenes:", error);
    }
  };


  // Cargar clientes desde BD
  const fetchClientes = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/clientes'); // tu endpoint real
      const data: Cliente[] = await response.json();
      setClientes(data);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
    }
  };

  // Cargar métodos de pago
  const cargarMetodosPago = () => {
    const metodosEjemplo: MetodoPago[] = [
      { id: 1, nombre: 'Efectivo', descripcion: 'Pago en efectivo', estado: 'activo' },
      { id: 2, nombre: 'Tarjeta Débito', descripcion: 'Pago con tarjeta de débito', estado: 'activo' },
      { id: 3, nombre: 'Tarjeta Crédito', descripcion: 'Pago con tarjeta de crédito', estado: 'activo' },
      { id: 4, nombre: 'Transferencia', descripcion: 'Transferencia bancaria', estado: 'activo' },
      { id: 5, nombre: 'Yape', descripcion: 'Pago con Yape', estado: 'activo' }
    ];
    setMetodosPago(metodosEjemplo);
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
  const limpiarCarrito = () => {
    // 1. Devolver el stock al inventario visual
    const productosActualizados = productos.map(p => {
      const itemCarrito = carrito.find(item => item.producto.id === p.id);

      if (!itemCarrito) return p;

      return {
        ...p,
        stock: p.stock + itemCarrito.cantidad
      };
    });

    setProductos(productosActualizados);

    // 2. Limpiar carrito
    setCarrito([]);
  };

  const agregarAlCarrito = (producto: Producto) => {
    // 1. Evitar agregar si no hay stock
    if (producto.stock <= 0) {
      alert('❌ No hay stock disponible');
      return;
    }

    // 2. Verificar si ya está en el carrito
    const existe = carrito.find(item => item.producto.id === producto.id);

    if (existe) {
      // Si existe pero ya no hay más stock para aumentar
      if (producto.stock - 1 < 0) {
        alert('❌ No hay más unidades disponibles');
        return;
      }

      // 3. Aumentar cantidad en carrito
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
      // 4. Agregar nuevo producto al carrito
      setCarrito([...carrito, { producto, cantidad: 1, subtotal: producto.precio }]);
    }

    // 5. Descontar stock en la lista de productos
    setProductos(productos.map(p =>
      p.id === producto.id
        ? { ...p, stock: p.stock - 1 }
        : p
    ));
  };

  const actualizarCantidad = (id: number, cantidad: number) => {
    const item = carrito.find(i => i.producto.id === id);
    if (!item) return;

    const diferencia = cantidad - item.cantidad; // positivo = aumenta, negativo = disminuye

    // Si diferencia es positiva → el usuario quiere añadir más
    if (diferencia > 0) {
      const producto = productos.find(p => p.id === id);
      if (!producto) return;

      if (producto.stock < diferencia) {
        alert('❌ No hay stock suficiente para aumentar la cantidad');
        return;
      }
    }

    // 1. Actualizar carrito
    if (cantidad === 0) {
      setCarrito(carrito.filter(item => item.producto.id !== id));
    } else {
      setCarrito(carrito.map(item =>
        item.producto.id === id
          ? { ...item, cantidad, subtotal: cantidad * item.producto.precio }
          : item
      ));
    }

    // 2. Actualizar stock visual
    setProductos(productos.map(p =>
      p.id === id
        ? { ...p, stock: p.stock - diferencia }
        : p
    ));
  };


  // Registrar cliente (POST a BD)
  const handleRegistrarCliente = async (clienteData: Omit<Cliente, 'id'>) => {
    try {
      const response = await fetch('http://localhost:8080/api/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clienteData)
      });
      const nuevoCliente: Cliente = await response.json();
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

  // Procesar venta, cancelar venta, filtrado de productos y cálculo de totales
  const abrirModalPago = () => {
    if (carrito.length === 0) return alert('Agrega productos al carrito primero');
    if (!clienteSeleccionado) return alert('Selecciona un cliente primero');
    setMostrarModalPago(true);
  };
  const procesarVenta = async (detallesPago: DetallePago[]) => {
    try {
      if (!clienteSeleccionado) return alert("Selecciona un cliente primero");
      if (carrito.length === 0) return alert("Agrega productos al carrito primero");

      // 1️⃣ Totales
      const subtotal = carrito.reduce((sum, item) => sum + item.subtotal - (item.subtotal * 0.18), 0);
      const subtotalproduct = carrito.reduce((sum, item) => sum + item.subtotal, 0);
      const igv = subtotalproduct * 0.18;
      const total =  subtotal+ igv;

      // 2️⃣ Obtener usuario logueado y almacén seleccionado
      const idUsuario = Number(localStorage.getItem("usuarioId")); // o desde tu estado global
      const idAlmacen = Number(localStorage.getItem("almacenId")) || 1; // fallback 1 si no hay seleccionado
      if (!idUsuario || idUsuario <= 0) {
        return alert("❌ Usuario no válido. Por favor, inicia sesión de nuevo.");
      }

      if (!idAlmacen || idAlmacen <= 0) {
        return alert("❌ Almacén no válido. Selecciona un almacén.");
      }
      // 3️⃣ Preparar body para backend
      const ventaBody = {
        idCliente: clienteSeleccionado?.clienteid, // o clienteId según tu DTO
        idUsuario,
        idAlmacen,
        subtotal,
        igv,
        total,
        detalles: carrito.map(item => ({
          idProducto: item.producto.id,
          cantidad: item.cantidad,
          precioUnitario: item.producto.precio,
          subtotal: item.subtotal
        })),
        pagos: detallesPago
      };

      // 4️⃣ Registrar venta en backend
      const ventaResponse = await fetch("http://localhost:8080/api/ventas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ventaBody)
      });

      if (!ventaResponse.ok) {
        const errorText = await ventaResponse.text();
        console.error("ERROR BACKEND:", errorText);
        throw new Error("❌ Error al registrar la venta");
      }

      // 5️⃣ Actualizar stock en backend para cada producto
      for (const item of carrito) {
        const nuevoStock = item.producto.stock; // stock visual ya descontado

        await fetch(`http://localhost:8080/api/productos/${item.producto.id}/stock`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stock: nuevoStock })
        });
      }

      // 6️⃣ Confirmación
      alert(`✅ Venta procesada correctamente. Total S/ ${total.toFixed(2)}`);

      // 7️⃣ Reset del carrito y cliente
      setCarrito([]);
      setClienteSeleccionado(null);
      setBusquedaCliente('');
      setMostrarModalPago(false);

      navigate('/ventas');

    } catch (error) {
      console.error(error);
      alert("❌ Ocurrió un error al procesar la venta");
    }
  };



  const cancelarVenta = () => {
    if (carrito.length > 0 && confirm('¿Seguro que quieres cancelar la venta?')) {
      setCarrito([]);
      setClienteSeleccionado(null);
      setBusquedaCliente('');
    } else {
      navigate('/ventas');
    }
  };

  // Filtrar productos
  const productosFiltrados = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(busquedaProducto.toLowerCase()) ||
    producto.categoria.nombre.toLowerCase().includes(busquedaProducto.toLowerCase())
  );

  const subtotal = carrito.reduce((sum, item) => sum + item.subtotal - (item.subtotal * 0.18), 0);
  const subtotalproduct = carrito.reduce((sum, item) => sum + item.subtotal, 0);
  const igv = subtotalproduct * 0.18;
  const total = subtotal + igv;

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
              className="flex items-center justify-center bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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
                      src={producto.imagen}
                      alt={producto.nombre}
                      className="w-full h-24 sm:h-32 object-cover rounded-md mb-2 sm:mb-3"
                    />
                    <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base line-clamp-2">{producto.nombre}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mb-2">{producto.categoria.nombre}</p>
                    <div className="flex justify-between items-center mb-2 sm:mb-3">
                      <span className="text-base sm:text-lg font-bold text-blue-600">
                        S/ {producto.precio.toFixed(2)}
                      </span>
                      <span className={`text-xs sm:text-sm px-2 py-1 rounded-full ${producto.stock > 10
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        Stock: {producto.stock}
                      </span>
                    </div>
                    <button
                      onClick={() => agregarAlCarrito(producto)}
                      className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm sm:text-base"
                    >
                      Agregar al Carrito
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
                    {/* --- INFORMACIÓN DEL PRODUCTO ---- */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-xs sm:text-sm truncate">
                        {item.producto.nombre}
                      </p>
                      <p className="text-xs text-gray-600">
                        S/ {item.producto.precio.toFixed(2)} c/u
                      </p>
                    </div>

                    {/* --- CONTROLES DE CANTIDAD ---- */}
                    <div className="flex items-center gap-1 sm:gap-2 ml-2">

                      {/* Botón - */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          actualizarCantidad(item.producto.id, item.cantidad - 1);
                        }}
                        className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                      >
                        <FaMinus size={8} />
                      </button>

                      {/* Input de cantidad */}
                      <input
                        type="number"
                        value={item.cantidad}
                        onChange={(e) => {
                          const nuevaCantidad = parseInt(e.target.value, 10);
                          actualizarCantidad(item.producto.id, isNaN(nuevaCantidad) ? 1 : nuevaCantidad);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-10 sm:w-12 text-center text-xs sm:text-sm border rounded-md no-spinner"
                      />

                      {/* Botón + */}
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

                    {/* Subtotal */}
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
