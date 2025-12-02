import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  IoIosCart, 
  IoIosInformationCircle, 
  IoIosPeople, 
  IoIosDocument, 
  IoIosClipboard,  
  IoIosArchive, 
  IoMdAdd, 
  IoMdCloseCircle, 
  IoIosCash, 
  IoIosList, 
  IoMdCheckmark,
  IoIosWarning,
  IoIosCheckmarkCircle,
  IoIosHome,
  IoIosCube,
  IoIosBasket,
  IoIosRemove,
  IoIosAlert,
  IoIosLock
} from "react-icons/io";

interface ProductoCompra {
  id: number;
  nombre: string;
  precio_unitario: number;
  cantidad: number;
  descuento: number;
  subtotal: number;
  id_producto?: number;
  sku?: string;
  peso_total: number;
  id_codigo_barras?: number;
}

interface Proveedor {
  id: number;
  razon_social: string;
  ruc: string;
  contacto: string;
  telefono: string;
}

interface Almacen {
  id: number;
  nombre: string;
  codigo: string;
  capacidad_utilizada: number;
  capacidad_total: number;
  capacidad_peso_utilizada: number;
  capacidad_peso_total: number;
  responsable: string;
  direccion: string;
}

interface ProductoInventario {
  id: number;
  nombre: string;
  descripcion: string;
  sku: string;
  precio_compra: number;
  precio_venta: number;
  stock_actual: number;
  stock_minimo: number;
  stock_maximo: number;
  unidad_medida: string;
  categoria: string;
  proveedor_id: number;
  descuento_proveedor: number;
  peso_kg: number;
  ubicacion: string;
  almacen_id: number;
  imagen?: string;
  estado: 'ACTIVO' | 'INACTIVO';
}

export default function NewPurchase() {
  const navigate = useNavigate();
  
  const [proveedor, setProveedor] = useState<number | ''>('');
  const [tipoComprobante, setTipoComprobante] = useState('Factura');
  const [metodoPago, setMetodoPago] = useState('Contado');
  const [almacen, setAlmacen] = useState<number | ''>('');
  const [observaciones, setObservaciones] = useState('');
  
  const [productoSeleccionado, setProductoSeleccionado] = useState<number | ''>('');
  const [cantidad, setCantidad] = useState(1);
  const [precioUnitario, setPrecioUnitario] = useState(0);
  const [descuentoProveedor, setDescuentoProveedor] = useState(0);
  const [pesoProducto, setPesoProducto] = useState(0);
  
  const [showNotification, setShowNotification] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [alertaCapacidad, setAlertaCapacidad] = useState('');

  const proveedores: Proveedor[] = [
    { id: 1, razon_social: 'Tecnolimport SA', ruc: '20123456789', contacto: 'Juan Pérez', telefono: '987654321' },
    { id: 2, razon_social: 'ElectroPeru S.R.L.', ruc: '20198765432', contacto: 'María López', telefono: '987654322' },
    { id: 3, razon_social: 'Distribuidora XYZ', ruc: '20345678901', contacto: 'Carlos Rodríguez', telefono: '987654323' },
    { id: 4, razon_social: 'BULB Industries', ruc: '20456789012', contacto: 'Ana García', telefono: '987654324' },
  ];

  const almacenes: Almacen[] = [
    { 
      id: 1, 
      nombre: "Almacén Principal", 
      codigo: "ALM-PRIN", 
      capacidad_utilizada: 325, 
      capacidad_total: 500,
      capacidad_peso_utilizada: 1200,
      capacidad_peso_total: 2000,
      responsable: "Juan Pérez", 
      direccion: "Av. Industrial 123, Zona Industrial" 
    },
    { 
      id: 2, 
      nombre: "Almacén Norte", 
      codigo: "ALM-NORTE", 
      capacidad_utilizada: 90, 
      capacidad_total: 300,
      capacidad_peso_utilizada: 450,
      capacidad_peso_total: 1000,
      responsable: "María López", 
      direccion: "Av. Norte 456, Distrito Norte" 
    },
    { 
      id: 3, 
      nombre: "Almacén Sur", 
      codigo: "ALM-SUR", 
      capacidad_utilizada: 90, 
      capacidad_total: 200,
      capacidad_peso_utilizada: 300,
      capacidad_peso_total: 800,
      responsable: "Carlos Rodríguez", 
      direccion: "Calle Sur 789, Urbanización Sur" 
    },
  ];

  const productosInventario: ProductoInventario[] = [
    {
      id: 1,
      nombre: "ANITA TALLARIN",
      descripcion: "Ricos y deliciosos",
      sku: "BULB-FA-001",
      precio_compra: 4.50,
      precio_venta: 12.00,
      stock_actual: 12,
      stock_minimo: 5,
      stock_maximo: 50,
      unidad_medida: "Unidad",
      categoria: "Fideos",
      proveedor_id: 4,
      descuento_proveedor: 5,
      peso_kg: 0.5,
      ubicacion: "A-12-B-04",
      almacen_id: 1,
      estado: 'ACTIVO'
    },
    {
      id: 2,
      nombre: "LENTEJA VERDE",
      descripcion: "Menestra de alta calidad",
      sku: "MENS-LV-002",
      precio_compra: 6.00,
      precio_venta: 8.50,
      stock_actual: 4,
      stock_minimo: 5,
      stock_maximo: 30,
      unidad_medida: "Kilogramo",
      categoria: "Menestras",
      proveedor_id: 3,
      descuento_proveedor: 3,
      peso_kg: 1.0,
      ubicacion: "B-01-C-10",
      almacen_id: 2,
      estado: 'ACTIVO'
    },
    {
      id: 3,
      nombre: "RESISTENCIA M-10",
      descripcion: "Resistencia electrónica 10 ohms",
      sku: "ELEC-RM-003",
      precio_compra: 3.50,
      precio_venta: 5.00,
      stock_actual: 0,
      stock_minimo: 10,
      stock_maximo: 100,
      unidad_medida: "Unidad",
      categoria: "Electrónicos",
      proveedor_id: 2,
      descuento_proveedor: 2,
      peso_kg: 0.01,
      ubicacion: "C-05-D-01",
      almacen_id: 3,
      estado: 'INACTIVO'
    },
    {
      id: 4,
      nombre: "Laptop HP 15\"",
      descripcion: "Laptop empresarial 15 pulgadas",
      sku: "TEC-LP-004",
      precio_compra: 1200.00,
      precio_venta: 1500.00,
      stock_actual: 5,
      stock_minimo: 2,
      stock_maximo: 20,
      unidad_medida: "Unidad",
      categoria: "Electrónicos",
      proveedor_id: 1,
      descuento_proveedor: 8,
      peso_kg: 2.5,
      ubicacion: "A-01-B-01",
      almacen_id: 1,
      estado: 'ACTIVO'
    }
  ];

  const [productosEnCompra, setProductosEnCompra] = useState<ProductoCompra[]>([]);

  const productosDisponibles = proveedor 
    ? productosInventario.filter(
        producto => producto.proveedor_id === proveedor && producto.estado === "ACTIVO"
      )
    : [];

  const generarNumeroComprobante = () => {
    const serie = tipoComprobante === 'Factura' ? 'F001' : 'B001';
    const numero = Math.floor(100000 + Math.random() * 900000);
    return `${serie}-${numero}`;
  };

  useEffect(() => {
    if (productoSeleccionado) {
      const producto = productosInventario.find(p => p.id === productoSeleccionado);
      if (producto) {
        setPrecioUnitario(producto.precio_compra);
        setDescuentoProveedor(producto.descuento_proveedor);
        setPesoProducto(producto.peso_kg);
      }
    } else {
      setPrecioUnitario(0);
      setDescuentoProveedor(0);
      setPesoProducto(0);
    }
  }, [productoSeleccionado]);

  useEffect(() => {
    setProductoSeleccionado('');
    setPrecioUnitario(0);
    setDescuentoProveedor(0);
    setPesoProducto(0);
  }, [proveedor]);

  const calcularTotalesCompra = () => {
    const pesoTotal = productosEnCompra.reduce((sum, p) => sum + p.peso_total, 0);
    const volumenTotal = productosEnCompra.reduce((sum, p) => sum + (p.peso_total * 0.001), 0);
    
    return { pesoTotal, volumenTotal };
  };

  const verificarCapacidadAlmacen = () => {
    if (!almacen) return { tieneCapacidad: true, mensaje: '' };

    const almacenSeleccionado = almacenes.find(a => a.id === almacen);
    if (!almacenSeleccionado) return { tieneCapacidad: true, mensaje: '' };

    const { pesoTotal, volumenTotal } = calcularTotalesCompra();
    
    const capacidadVolumenDisponible = almacenSeleccionado.capacidad_total - almacenSeleccionado.capacidad_utilizada;
    const capacidadPesoDisponible = almacenSeleccionado.capacidad_peso_total - almacenSeleccionado.capacidad_peso_utilizada;

    if (volumenTotal > capacidadVolumenDisponible) {
      return { 
        tieneCapacidad: false, 
        mensaje: `El almacén no tiene suficiente capacidad volumétrica. Necesita ${volumenTotal.toFixed(2)}m³ pero solo tiene ${capacidadVolumenDisponible.toFixed(2)}m³ disponibles.` 
      };
    }

    if (pesoTotal > capacidadPesoDisponible) {
      return { 
        tieneCapacidad: false, 
        mensaje: `El almacén no tiene suficiente capacidad de peso. Necesita ${pesoTotal.toFixed(2)}kg pero solo tiene ${capacidadPesoDisponible.toFixed(2)}kg disponibles.` 
      };
    }

    return { 
      tieneCapacidad: true, 
      mensaje: `Capacidad suficiente: ${volumenTotal.toFixed(2)}m³ / ${capacidadVolumenDisponible.toFixed(2)}m³ - ${pesoTotal.toFixed(2)}kg / ${capacidadPesoDisponible.toFixed(2)}kg` 
    };
  };

  const añadirProducto = () => {
    if (!productoSeleccionado || cantidad <= 0 || precioUnitario <= 0 || !almacen) {
      alert('Por favor complete todos los campos del producto y seleccione un almacén');
      return;
    }

    const productoExistente = productosInventario.find(p => p.id === productoSeleccionado);
    if (!productoExistente) return;

    const productoYaExiste = productosEnCompra.find(p => p.id_producto === productoSeleccionado);
    if (productoYaExiste) {
      alert('Este producto ya está en la compra. Puede editar la cantidad desde la lista.');
      return;
    }

    const subtotalSinDescuento = precioUnitario * cantidad;
    const descuento = (subtotalSinDescuento * descuentoProveedor) / 100;
    const subtotalConDescuento = subtotalSinDescuento - descuento;
    const pesoTotal = productoExistente.peso_kg * cantidad;

    const nuevoProducto: ProductoCompra = {
      id: Date.now(),
      nombre: productoExistente.nombre,
      precio_unitario: precioUnitario,
      cantidad: cantidad,
      descuento: descuento,
      subtotal: subtotalConDescuento,
      id_producto: productoExistente.id,
      sku: productoExistente.sku,
      peso_total: pesoTotal
    };

    const productosTemporal = [...productosEnCompra, nuevoProducto];
    const pesoTotalTemporal = productosTemporal.reduce((sum, p) => sum + p.peso_total, 0);
    const almacenSeleccionado = almacenes.find(a => a.id === almacen);

    if (almacenSeleccionado && pesoTotalTemporal > (almacenSeleccionado.capacidad_peso_total - almacenSeleccionado.capacidad_peso_utilizada)) {
      alert('No se puede agregar el producto. Excedería la capacidad de peso del almacén.');
      return;
    }

    setProductosEnCompra(productosTemporal);
    
    setProductoSeleccionado('');
    setCantidad(1);
    setPrecioUnitario(0);
    setDescuentoProveedor(0);
    setPesoProducto(0);
  };

  const eliminarProducto = (id: number) => {
    setProductosEnCompra(productosEnCompra.filter(p => p.id !== id));
  };

  const actualizarCantidad = (id: number, nuevaCantidad: number) => {
    if (nuevaCantidad <= 0) {
      eliminarProducto(id);
      return;
    }

    setProductosEnCompra(productosEnCompra.map(p => {
      if (p.id === id) {
        const productoOriginal = productosInventario.find(prod => prod.id === p.id_producto);
        const descuentoPorcentaje = productoOriginal?.descuento_proveedor || 0;
        const subtotalSinDescuento = p.precio_unitario * nuevaCantidad;
        const descuento = (subtotalSinDescuento * descuentoPorcentaje) / 100;
        const subtotalConDescuento = subtotalSinDescuento - descuento;
        const pesoTotal = (productoOriginal?.peso_kg || 0) * nuevaCantidad;
        
        return { 
          ...p, 
          cantidad: nuevaCantidad, 
          descuento: descuento,
          subtotal: subtotalConDescuento,
          peso_total: pesoTotal
        };
      }
      return p;
    }));
  };

  const simularGuardadoBD = () => {
    const numeroComprobante = generarNumeroComprobante();

    const compraData = {
      id_proveedor: proveedor,
      id_almacen: almacen,
      tipo_comprobante: tipoComprobante,
      numero_comprobante: numeroComprobante,
      subtotal: subtotalNeto,
      igv: igv,
      total: totalAPagar,
      estado: 'COMPLETADO',
      fecha: new Date().toISOString(),
      observaciones: observaciones
    };

    const detallesData = productosEnCompra.map(producto => ({
      id_producto: producto.id_producto,
      cantidad: producto.cantidad,
      precio_unitario: producto.precio_unitario,
      descuento: producto.descuento,
      subtotal: producto.subtotal
    }));

    console.log('COMPRA REGISTRADA:', {
      compraData,
      detallesData,
      total_pagado_proveedor: totalAPagar
    });

    alert(`Compra registrada exitosamente!\n\nTotal pagado al proveedor: S/${totalAPagar.toFixed(2)}\nLos productos se han agregado al inventario.`);

    return true;
  };

  const registrarCompra = () => {
    if (!proveedor || !almacen) {
      alert('Por favor seleccione un proveedor y almacén');
      return;
    }
    
    if (productosEnCompra.length === 0) {
      alert('Por favor añada al menos un producto');
      return;
    }

    const capacidad = verificarCapacidadAlmacen();
    if (!capacidad.tieneCapacidad) {
      alert(capacidad.mensaje);
      return;
    }

    const confirmacion = window.confirm(
      `¿Está seguro de registrar la compra?\n\n` +
      `Proveedor: ${proveedores.find(p => p.id === proveedor)?.razon_social}\n` +
      `Almacén: ${almacenes.find(a => a.id === almacen)?.nombre}\n` +
      `Productos: ${productosEnCompra.length}\n` +
      `Total a pagar al proveedor: S/${totalAPagar.toFixed(2)}\n\n` +
      `Los productos se agregarán automáticamente al inventario.`
    );

    if (confirmacion) {
      const exito = simularGuardadoBD();
      
      if (exito) {
        setShowNotification(true);
        setTimeout(() => {
          setShowNotification(false);
          navigate('/compras/historial');
        }, 3000);
      }
    }
  };

  const cancelarCompra = () => {
    const confirmacion = window.confirm('¿Está seguro de cancelar la compra? Se perderán todos los datos.');
    
    if (confirmacion) {
      setProductosEnCompra([]);
      setProveedor('');
      setAlmacen('');
      setObservaciones('');
      setAlertaCapacidad('');
    }
  };

  useEffect(() => {
    if (almacen && productosEnCompra.length > 0) {
      const capacidad = verificarCapacidadAlmacen();
      setAlertaCapacidad(capacidad.mensaje);
    } else {
      setAlertaCapacidad('');
    }
  }, [productosEnCompra, almacen]);

  const subtotalBruto = productosEnCompra.reduce((sum, p) => sum + (p.precio_unitario * p.cantidad), 0);
  const descuentoTotal = productosEnCompra.reduce((sum, p) => sum + (p.precio_unitario * p.cantidad * 0.18), 0);
  const subtotalNeto = subtotalBruto - descuentoTotal;
  const igvRate = 0.18;
  const igv = subtotalNeto * igvRate;
  const totalAPagar = subtotalNeto + igv;
  const { pesoTotal, volumenTotal } = calcularTotalesCompra();

  const almacenSeleccionado = almacenes.find(a => a.id === almacen);
  const capacidadVolumenDisponible = almacenSeleccionado ? 
    almacenSeleccionado.capacidad_total - almacenSeleccionado.capacidad_utilizada : 0;
  const capacidadPesoDisponible = almacenSeleccionado ? 
    almacenSeleccionado.capacidad_peso_total - almacenSeleccionado.capacidad_peso_utilizada : 0;

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      {showNotification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-fade-in">
          <IoIosCheckmarkCircle className="w-5 h-5" />
          <span>Compra registrada exitosamente! Actualizando inventario...</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-xl p-6">
        <h1 className="text-3xl font-extrabold text-blue-700 mb-8 flex items-center border-b pb-4">
          <IoIosCart className="mr-3 w-10 h-10" /> Nueva Compra
        </h1>

        <div className="space-y-8">
          {/* Datos de Cabecera */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-blue-800 mb-4 flex items-center">
              <IoIosInformationCircle className="mr-2 w-5 h-5" /> Datos de Cabecera
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <IoIosPeople className="mr-2 w-4 h-4 text-blue-500" />
                  Proveedor *
                </label>
                <select 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={proveedor}
                  onChange={(e) => setProveedor(e.target.value ? Number(e.target.value) : '')}
                >
                  <option value="">Seleccionar proveedor</option>
                  {proveedores.map(prov => (
                    <option key={prov.id} value={prov.id}>
                      {prov.razon_social}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <IoIosHome className="mr-2 w-4 h-4 text-blue-500" />
                  Almacén Destino *
                </label>
                <select 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={almacen}
                  onChange={(e) => setAlmacen(e.target.value ? Number(e.target.value) : '')}
                >
                  <option value="">Seleccionar almacén</option>
                  {almacenes.map(alm => {
                    const capacidadVol = ((alm.capacidad_utilizada / alm.capacidad_total) * 100).toFixed(0);
                    const capacidadPeso = ((alm.capacidad_peso_utilizada / alm.capacidad_peso_total) * 100).toFixed(0);
                    return (
                      <option key={alm.id} value={alm.id}>
                        {alm.nombre} - {capacidadVol}% vol - {capacidadPeso}% peso
                      </option>
                    );
                  })}
                </select>
                {almacenSeleccionado && (
                  <div className="mt-2 text-xs text-gray-600 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center">
                        <IoIosCube className="w-3 h-3 mr-1" />
                        Volumen:
                      </span>
                      <span>{capacidadVolumenDisponible.toFixed(1)}m³ disponibles</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center">
                        <IoIosBasket  className="w-3 h-3 mr-1" />
                        Peso:
                      </span>
                      <span>{capacidadPesoDisponible.toFixed(1)}kg disponibles</span>
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <IoIosDocument className="mr-2 w-4 h-4 text-blue-500" />
                  Tipo Comprobante
                </label>
                <select 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={tipoComprobante}
                  onChange={(e) => setTipoComprobante(e.target.value)}
                >
                  <option value="Factura">Factura</option>
                  <option value="Boleta">Boleta</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <IoIosClipboard className="mr-2 w-4 h-4 text-blue-500" />
                  N° Comprobante
                </label>
                <div className="w-full p-3 bg-gray-100 text-gray-700 rounded-lg border font-semibold text-center">
                  {generarNumeroComprobante()}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Método de Pago
                </label>
                <select 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={metodoPago}
                  onChange={(e) => setMetodoPago(e.target.value)}
                >
                  <option value="Contado">Contado</option>
                  <option value="Crédito">Crédito</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observaciones
                </label>
                <textarea 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Ingrese observaciones adicionales sobre la compra..."
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Añadir Producto */}
          <div className="p-6 border border-gray-200 rounded-lg shadow-md bg-white">
            <h2 className="text-xl font-semibold text-gray-700 mb-6 flex items-center border-b pb-3">
              <IoIosArchive className="mr-2 w-5 h-5 text-red-500" /> Añadir Producto del Proveedor
            </h2>
            
            {!proveedor && (
              <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center">
                  <IoIosInformationCircle className="w-5 h-5 text-yellow-600 mr-2" />
                  <span className="text-yellow-700">
                    Primero seleccione un proveedor para ver sus productos disponibles
                  </span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Producto del Proveedor *
                </label>
                <select 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  value={productoSeleccionado}
                  onChange={(e) => setProductoSeleccionado(e.target.value ? Number(e.target.value) : '')}
                  disabled={!proveedor}
                >
                  <option value="">
                    {proveedor ? "Seleccionar producto" : "Primero seleccione un proveedor"}
                  </option>
                  {productosDisponibles.map(producto => (
                    <option key={producto.id} value={producto.id}>
                      {producto.nombre} - Stock: {producto.stock_actual}
                    </option>
                  ))}
                </select>
                {proveedor && productosDisponibles.length === 0 && (
                  <p className="text-xs text-red-600 mt-1 flex items-center">
                    <IoIosAlert className="w-3 h-3 mr-1" />
                    Este proveedor no tiene productos activos en el inventario.
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cantidad *
                </label>
                <input 
                  type="number" 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={cantidad}
                  onChange={(e) => setCantidad(Number(e.target.value))}
                  min={1}
                  disabled={!productoSeleccionado}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <IoIosLock className="mr-2 w-4 h-4 text-gray-500" />
                  Precio Proveedor (S/) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">S/</span>
                  <input 
                    type="number" 
                    className="w-full p-3 pl-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-100 cursor-not-allowed"
                    value={precioUnitario}
                    readOnly
                    placeholder="0.00"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1 flex items-center">
                  <IoIosLock className="w-3 h-3 mr-1" />
                  Precio fijado por el proveedor (no editable)
                </p>
              </div>
              
              <div className="flex items-end">
                <button 
                  className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 flex items-center justify-center transition-all shadow-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={añadirProducto}
                  disabled={!productoSeleccionado || cantidad <= 0 || precioUnitario <= 0 || !almacen}
                >
                  <IoMdAdd className="mr-2 w-5 h-5" /> Añadir
                </button>
              </div>
            </div>
            
            {productoSeleccionado && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 flex items-center">
                      <IoIosCash className="w-3 h-3 mr-1" />
                      Precio venta:
                    </span>
                    <div className="font-semibold text-green-600">
                      S/{productosInventario.find(p => p.id === productoSeleccionado)?.precio_venta}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600 flex items-center">
                      <IoIosBasket  className="w-3 h-3 mr-1" />
                      Peso unitario:
                    </span>
                    <div className="font-semibold">
                      {productosInventario.find(p => p.id === productoSeleccionado)?.peso_kg} kg
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Descuento proveedor:</span>
                    <div className="font-semibold">
                      {productosInventario.find(p => p.id === productoSeleccionado)?.descuento_proveedor}%
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600 flex items-center">
                      <IoIosCube className="w-3 h-3 mr-1" />
                      Peso total:
                    </span>
                    <div className="font-semibold">
                      {(pesoProducto * cantidad).toFixed(2)} kg
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Alerta de capacidad */}
          {alertaCapacidad && (
            <div className={`p-4 rounded-lg border flex items-center ${
              alertaCapacidad.includes('no tiene suficiente') 
                ? 'bg-red-50 border-red-200 text-red-700' 
                : 'bg-green-50 border-green-200 text-green-700'
            }`}>
              {alertaCapacidad.includes('no tiene suficiente') ? (
                <IoIosWarning className="w-5 h-5 mr-2 text-red-600" />
              ) : (
                <IoIosCheckmarkCircle className="w-5 h-5 mr-2 text-green-600" />
              )}
              <span>{alertaCapacidad}</span>
            </div>
          )}

          {/* Detalle de Productos */}
          <div className="mb-6 border rounded-lg overflow-hidden shadow-lg bg-white">
            <h3 className="text-lg font-semibold text-gray-700 p-4 bg-gray-100 border-b flex items-center justify-between">
              <span>Detalle de Productos ({productosEnCompra.length} productos)</span>
              <div className="flex items-center space-x-4 text-sm">
                <span className="flex items-center">
                  <IoIosBasket  className="w-4 h-4 mr-1" />
                  Peso total: {pesoTotal.toFixed(2)} kg
                </span>
                <span className="flex items-center">
                  <IoIosCube className="w-4 h-4 mr-1" />
                  Volumen: {volumenTotal.toFixed(3)} m³
                </span>
              </div>
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                    <th className="p-4 text-right text-xs font-medium text-gray-500 uppercase">P. Unitario</th>
                    <th className="p-4 text-right text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                    <th className="p-4 text-right text-xs font-medium text-gray-500 uppercase">Peso</th>
                    <th className="p-4 text-right text-xs font-medium text-gray-500 uppercase">Desc. Proveedor</th>
                    <th className="p-4 text-right text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                    <th className="p-4 text-center text-xs font-medium text-gray-500 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {productosEnCompra.map((p) => {
                    const productoInfo = productosInventario.find(prod => prod.id === p.id_producto);
                    return (
                      <tr key={p.id} className="hover:bg-gray-50">
                        <td className="p-4">
                          <div className="font-medium text-gray-900">{p.nombre}</div>
                          <div className="text-sm text-gray-500">{p.sku}</div>
                        </td>
                        <td className="p-4 text-right font-mono">S/{p.precio_unitario.toFixed(2)}</td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end space-x-3">
                            <button 
                              onClick={() => actualizarCantidad(p.id, p.cantidad - 1)}
                              className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                            >
                              <IoIosRemove className="w-4 h-4" />
                            </button>
                            <span className="font-medium text-lg w-12 text-center bg-gray-100 py-1 rounded">
                              {p.cantidad}
                            </span>
                            <button 
                              onClick={() => actualizarCantidad(p.id, p.cantidad + 1)}
                              className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                            >
                              <IoMdAdd className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                        <td className="p-4 text-right font-mono">
                          {p.peso_total.toFixed(2)} kg
                        </td>
                        <td className="p-4 text-right">
                          <div className="space-y-1">
                            <div className="font-mono text-red-600">-S/{p.descuento.toFixed(2)}</div>
                            <div className="text-xs text-gray-500">
                              ({productoInfo?.descuento_proveedor}%)
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-right font-bold font-mono">S/{p.subtotal.toFixed(2)}</td>
                        <td className="p-4 text-center">
                          <button 
                            className="text-red-600 p-2 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors"
                            onClick={() => eliminarProducto(p.id)}
                          >
                            <IoMdCloseCircle className="w-6 h-6" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Resumen Financiero */}
          <div className="bg-green-50 p-6 rounded-lg shadow-inner border border-green-200">
            <h3 className="text-xl font-bold text-green-700 mb-4 flex items-center">
              <IoIosCash className="mr-2 w-5 h-5" /> Resumen Financiero
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <label className="block text-sm font-medium text-gray-700 mb-2">Subtotal Bruto</label>
                <div className="text-2xl font-bold text-gray-900">S/{subtotalBruto.toFixed(2)}</div>
              </div>
              <div className="text-center">
                <label className="block text-sm font-medium text-gray-700 mb-2">Desc. Proveedor</label>
                <div className="text-xl font-semibold text-red-600">-S/{descuentoTotal.toFixed(2)}</div>
              </div>
              <div className="text-center">
                <label className="block text-sm font-medium text-gray-700 mb-2">IGV (18%)</label>
                <div className="text-xl font-semibold text-gray-700">S/{igv.toFixed(2)}</div>
              </div>
              <div className="text-center">
                <label className="block text-lg font-medium text-gray-700 mb-2">TOTAL A PAGAR</label>
                <div className="text-3xl font-extrabold text-green-700">S/{totalAPagar.toFixed(2)}</div>
              </div>
            </div>
          </div>

          {/* Botones finales */}
          <div className="flex justify-between border-t pt-6">
            <Link to="/compras/historial" className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center transition-all shadow-md font-medium">
              <IoIosList className="mr-2 w-5 h-5" /> Ir a Historial
            </Link>
            <div className="flex space-x-4">
              <button 
                className="px-6 py-3 border border-red-400 rounded-lg text-red-600 hover:bg-red-50 flex items-center transition-all font-medium"
                onClick={() => setShowCancelModal(true)}
              >
                <IoMdCloseCircle className="mr-2 w-5 h-5" /> Cancelar
              </button>
              <button 
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center transition-all shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={registrarCompra}
                disabled={productosEnCompra.length === 0 || !proveedor || !almacen || alertaCapacidad.includes('no tiene suficiente')}
              >
                <IoMdCheckmark className="mr-2 w-5 h-5" /> Registrar Compra
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Cancelar */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-yellow-100 p-2 rounded-full">
                  <IoIosWarning className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Cancelar Compra</h3>
                  <p className="text-sm text-gray-600">¿Estás seguro de que quieres cancelar? Se perderán todos los datos.</p>
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Continuar
                </button>
                <button
                  onClick={cancelarCompra}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 transition-colors"
                >
                  <IoIosWarning className="w-4 h-4" />
                  Sí, Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}