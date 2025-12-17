import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import {
  IoIosCart, IoIosPeople, IoIosDocument, IoIosClipboard,  
  IoIosArchive, IoMdAdd, IoMdCloseCircle, IoIosList, 
  IoMdCheckmark, IoIosWarning, IoIosCheckmarkCircle, 
  IoIosHome, IoIosBasket, IoIosRemove, IoIosLock, IoIosSearch, IoMdImage, IoMdCard
} from "react-icons/io";
import { FaBoxOpen, FaWarehouse } from "react-icons/fa";
import { api } from '../../services/api'; 

// --- CONFIGURACIÓN ---
const API_URL = 'http://localhost:8080'; 
// NOTA: Este ID debe venir de tu contexto de autenticación (Login)
const ID_USUARIO_ACTUAL = 1; 

// --- INTERFACES ---

interface ProductoCompra {
  id: number;          
  id_producto: number; 
  nombre: string;
  precio_unitario: number;
  cantidad: number;
  subtotal: number;
  sku: string;
  peso_total: number;
  imagen?: string;
}

interface Proveedor {
  id: number;
  razon_social?: string; // Según tu SQL
  razonSocial?: string;  // Por si Spring Boot lo convierte
  ruc: string;
}

interface Almacen {
  id: number;
  nombre: string;
  codigo: string;
  // Dato real de la base de datos
  capacidad_m3: number; 
  // Dato que tu backend debería calcular (Suma de inventario actual)
  // Si no viene, asumiremos 0 en el frontend.
  ocupacion_calculada?: number; 
}

interface ProductoProveedorDTO {
  id: number;          
  productoId: number;  
  nombre: string;
  codigo: string;      
  precio_compra: number;
  peso_kg: number;
  imagen?: string;
}

export default function NewPurchase() {
  const navigate = useNavigate();
  
  // --- ESTADOS DE DATOS ---
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [almacenes, setAlmacenes] = useState<Almacen[]>([]);
  const [productosDisponibles, setProductosDisponibles] = useState<ProductoProveedorDTO[]>([]);

  // --- FORMULARIO CABECERA ---
  const [proveedor, setProveedor] = useState<number | ''>('');
  const [tipoComprobante, setTipoComprobante] = useState('ORDEN_COMPRA');
  const [almacen, setAlmacen] = useState<number | ''>('');
  const [metodoPago, setMetodoPago] = useState('Contado'); 
  const [observaciones, setObservaciones] = useState('');
  
  // --- LOGICA MODAL Y SELECCIÓN ---
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [filtroProductoModal, setFiltroProductoModal] = useState('');
  const [productoActual, setProductoActual] = useState<ProductoProveedorDTO | null>(null);
  const [cantidad, setCantidad] = useState(1);
  
  // --- CARRITO DE COMPRA ---
  const [productosEnCompra, setProductosEnCompra] = useState<ProductoCompra[]>([]);
  
  // --- UI ---
  const [showNotification, setShowNotification] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  // Helper para leer el nombre del proveedor sea snake_case o camelCase
  const getNombreProveedor = (p: Proveedor) => p.razon_social || p.razonSocial || "Proveedor";

  // 1. CARGA INICIAL DE DATOS
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [resProv, resAlm] = await Promise.all([
          api.get('/proveedores'),
          api.get('/almacenes')
        ]);
        
        setProveedores(resProv.data);
        
        // Mapeo seguro de almacenes
        const almacenesProcesados = resAlm.data.map((alm: any) => ({
            id: alm.id,
            nombre: alm.nombre,
            codigo: alm.codigo,
            capacidad_m3: alm.capacidad_m3 || 0,
            // Aquí intentamos leer la ocupación si el backend la envía.
            // Si tu backend aún no la calcula, será 0.
            ocupacion_calculada: alm.ocupacion_calculada || alm.capacidad_usada || 0
        }));
        
        setAlmacenes(almacenesProcesados);

      } catch (error) {
        console.error("Error al cargar datos maestros:", error);
        // Opcional: Mostrar toast de error
      }
    };
    cargarDatos();
  }, []);

  // 2. CARGAR PRODUCTOS AL SELECCIONAR PROVEEDOR
  useEffect(() => {
    setProductoActual(null);
    setProductosDisponibles([]);
    setProductosEnCompra([]); 
    
    if (proveedor) {
      cargarProductosDelProveedor(Number(proveedor));
    }
  }, [proveedor]);

  const cargarProductosDelProveedor = async (idProveedor: number) => {
    setLoadingData(true);
    try {
      const res = await api.get(`/proveedores/${idProveedor}/productos`);
      setProductosDisponibles(res.data);
    } catch (error) {
      console.error("Error cargando productos:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const generarNumeroComprobante = () => {
    const serie = tipoComprobante === 'FACTURA' ? 'F001' : (tipoComprobante === 'BOLETA' ? 'B001' : 'OC01');
    return `${serie}-${Math.floor(Date.now() / 1000).toString().slice(-6)}`; 
  };

  // --- LÓGICA DE CAPACIDAD DEL ALMACÉN SELECCIONADO ---
  const infoAlmacenSeleccionado = useMemo(() => {
     if (!almacen) return null;
     const alm = almacenes.find(a => a.id === Number(almacen));
     if (!alm) return null;

     // Cálculo de porcentaje para la barra visual
     const capacidad = alm.capacidad_m3 || 1; // Evitar división por cero
     const ocupado = alm.ocupacion_calculada || 0;
     const porcentaje = Math.min((ocupado / capacidad) * 100, 100);
     
     // Color de la barra según ocupación
     let color = "bg-emerald-500";
     if (porcentaje > 60) color = "bg-amber-500";
     if (porcentaje > 90) color = "bg-red-500";

     return { ...alm, porcentajeVisual: porcentaje, colorBarra: color };
  }, [almacen, almacenes]);


  // --- HANDLERS DE AGREGADO ---
  const handleSelectProductFromModal = (prod: ProductoProveedorDTO) => {
    if (productosEnCompra.some(p => p.id_producto === prod.productoId)) {
      alert("⚠️ Este producto ya está en la lista.");
      return;
    }
    setProductoActual(prod);
    setCantidad(1);
    setIsProductModalOpen(false);
    setFiltroProductoModal('');
  };

  const añadirProductoAlCarrito = () => {
    if (!productoActual || cantidad <= 0) return;

    // VALIDACIÓN BÁSICA DE PESO (Opcional, si tuviéramos capacidad en KG)
    /* const pesoEstimado = productoActual.peso_kg * cantidad;
    if (infoAlmacenSeleccionado) {
       // Lógica futura para validar capacidad vs peso
    } 
    */

    const subtotal = productoActual.precio_compra * cantidad;
    const nuevoItem: ProductoCompra = {
      id: Date.now(),
      id_producto: productoActual.productoId,
      nombre: productoActual.nombre,
      precio_unitario: productoActual.precio_compra,
      cantidad: cantidad,
      subtotal: subtotal,
      sku: productoActual.codigo,
      peso_total: productoActual.peso_kg * cantidad,
      imagen: productoActual.imagen
    };

    setProductosEnCompra([...productosEnCompra, nuevoItem]);
    setProductoActual(null);
    setCantidad(1);
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
        return {
          ...p,
          cantidad: nuevaCantidad,
          subtotal: p.precio_unitario * nuevaCantidad,
          peso_total: (p.peso_total / p.cantidad) * nuevaCantidad 
        };
      }
      return p;
    }));
  };

  // --- ENVÍO AL BACKEND ---
  const registrarCompra = async () => {
    if (!proveedor || !almacen || productosEnCompra.length === 0) {
        alert("Por favor complete los campos obligatorios y agregue productos.");
        return;
    }
    if (!window.confirm("¿Estás seguro de registrar esta compra?")) return;

    // Mapeo exacto a tu base de datos
    const compraPayload = {
      id_proveedor: proveedor,          
      id_almacen: almacen,              
      id_usuario: ID_USUARIO_ACTUAL,    
      tipo_comprobante: tipoComprobante,
      numero_comprobante: generarNumeroComprobante(),
      
      // Totales
      subtotal: subtotalBruto,          
      igv: igv,                        
      total: totalAPagar,              
      estado: 'PENDIENTE',             
      
      // Detalles
      detalles: productosEnCompra.map(p => ({
        id_producto: p.id_producto,     
        cantidad: p.cantidad,           
        precio_unitario: p.precio_unitario, 
        subtotal: p.subtotal            
      }))
    };

    try {
      await api.post('/compras', compraPayload);
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
        navigate('/compras/historial');
      }, 2500);

    } catch (error) {
      console.error("Error al registrar:", error);
      alert("Hubo un error al guardar la compra. Revise la consola.");
    }
  };

  // Cálculos de Totales
  const subtotalBruto = productosEnCompra.reduce((sum, p) => sum + p.subtotal, 0);
  const igv = subtotalBruto * 0.18;
  const totalAPagar = subtotalBruto + igv;

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen font-sans pb-28">
      
      {/* Notificación de Éxito */}
      {showNotification && (
        <div className="fixed top-6 right-6 bg-emerald-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-[999] animate-bounce-in">
          <IoIosCheckmarkCircle className="w-6 h-6" />
          <span className="font-semibold">¡Compra registrada correctamente!</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
            <span className="bg-blue-600 text-white p-2 rounded-lg shadow-lg shadow-blue-200">
              <IoIosCart />
            </span>
            Nueva Compra
          </h1>
          <p className="text-slate-500 mt-1 ml-1 text-sm">Ingreso de mercadería a almacén</p>
        </div>

        {/* --- TARJETA 1: INFORMACIÓN GENERAL --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <IoIosDocument /> Datos de Cabecera
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* 1. Proveedor */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 ml-1">Proveedor *</label>
              <select 
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500"
                value={proveedor}
                onChange={(e) => setProveedor(e.target.value ? Number(e.target.value) : '')}
              >
                <option value="">-- Seleccionar --</option>
                {proveedores.map(prov => (
                  <option key={prov.id} value={prov.id}>
                    {getNombreProveedor(prov)}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Almacén con Barra de Capacidad */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 ml-1">Almacén Destino *</label>
              <select 
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500"
                value={almacen}
                onChange={(e) => setAlmacen(e.target.value ? Number(e.target.value) : '')}
              >
                <option value="">-- Seleccionar --</option>
                {almacenes.map(alm => (
                  <option key={alm.id} value={alm.id}>{alm.nombre}</option>
                ))}
              </select>

              {/* Barra Visual de Capacidad */}
              {infoAlmacenSeleccionado && (
                  <div className="mt-2 bg-slate-50 border border-slate-200 rounded p-2 animate-fadeIn">
                     <div className="flex justify-between items-end text-xs mb-1">
                        <span className="font-bold text-slate-600 flex gap-1 items-center">
                            <FaWarehouse /> Disponibilidad
                        </span>
                        <span className="text-slate-500">
                           {/* Muestra capacidad restante aproximada */}
                           <b className="text-slate-800">
                             {(infoAlmacenSeleccionado.capacidad_m3 - (infoAlmacenSeleccionado.ocupacion_calculada || 0)).toFixed(0)} m³
                           </b> libres
                        </span>
                     </div>
                     <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                            className={`h-full rounded-full transition-all duration-700 ${infoAlmacenSeleccionado.colorBarra}`} 
                            style={{ width: `${infoAlmacenSeleccionado.porcentajeVisual}%` }}
                        ></div>
                     </div>
                     <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                        <span>0%</span>
                        <span>Total: {infoAlmacenSeleccionado.capacidad_m3} m³</span>
                     </div>
                  </div>
              )}
            </div>

            {/* 3. Método de Pago */}
            <div className="space-y-1.5">
               <label className="text-xs font-bold text-slate-500 ml-1">Método de Pago</label>
               <div className="relative">
                  <IoMdCard className="absolute left-3 top-3 text-slate-400" />
                  <select 
                     className="w-full pl-9 pr-2.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500"
                     value={metodoPago}
                     onChange={(e) => setMetodoPago(e.target.value)}
                  >
                     <option value="Contado">Contado</option>
                     <option value="Crédito">Crédito</option>
                     <option value="Transferencia">Transferencia</option>
                  </select>
               </div>
            </div>

            {/* 4. Comprobante */}
            <div className="space-y-1.5">
               <label className="text-xs font-bold text-slate-500 ml-1">Comprobante</label>
               <div className="flex gap-2">
                 <select 
                    className="w-1/2 p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-medium"
                    value={tipoComprobante}
                    onChange={(e) => setTipoComprobante(e.target.value)}
                 >
                   <option value="ORDEN_COMPRA">Orden Compra</option>
                   <option value="FACTURA">Factura</option>
                   <option value="BOLETA">Boleta</option>
                 </select>
                 <div className="w-1/2 p-2.5 bg-slate-100 border border-slate-200 rounded-lg text-sm font-bold text-slate-500 text-center select-none truncate flex items-center justify-center">
                    {generarNumeroComprobante()}
                 </div>
               </div>
            </div>

             {/* 5. Observaciones (Full Width) */}
             <div className="md:col-span-2 lg:col-span-4 space-y-1.5">
               <label className="text-xs font-bold text-slate-500 ml-1">Observaciones</label>
               <input 
                  type="text"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Entrega programada para mañana..."
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
               />
            </div>
          </div>
        </div>

        {/* --- TARJETA 2: AGREGAR PRODUCTO --- */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden relative">
           <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
           <div className="p-6">
              <div className="flex flex-col lg:flex-row gap-6 items-end">
                
                {/* Botón Selector Modal */}
                <div className="w-full lg:w-1/3">
                   <label className="text-xs font-bold text-slate-500 ml-1 mb-1.5 block">Producto</label>
                   <button 
                     onClick={() => setIsProductModalOpen(true)}
                     disabled={!proveedor}
                     className="w-full h-[50px] border-2 border-dashed border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center gap-2 font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                   >
                     {productoActual ? (
                        <span className="text-slate-800 flex items-center gap-2 truncate px-2">
                           <IoMdCheckmark className="text-green-500 text-xl" />
                           {productoActual.nombre}
                        </span>
                     ) : (
                        <>
                          <IoIosSearch className="text-xl group-hover:scale-110 transition-transform" />
                          {proveedor ? "Buscar en Catálogo" : "Seleccione Proveedor"}
                        </>
                     )}
                   </button>
                </div>

                {/* Inputs Cantidad/Precio */}
                <div className="flex-1 grid grid-cols-2 gap-4">
                   <div>
                      <label className="text-xs font-bold text-slate-500 ml-1 mb-1.5 block">Costo Unit. (S/)</label>
                      <div className="relative">
                        <IoIosLock className="absolute left-3 top-3.5 text-slate-400"/>
                        <input 
                          type="number" 
                          readOnly
                          value={productoActual?.precio_compra || ''}
                          placeholder="0.00"
                          className="w-full pl-9 pr-4 py-3 bg-slate-100 border-slate-200 rounded-xl font-bold text-slate-600 cursor-not-allowed"
                        />
                      </div>
                   </div>
                   <div>
                      <label className="text-xs font-bold text-slate-500 ml-1 mb-1.5 block">Cantidad</label>
                      <input 
                        type="number" 
                        min="1"
                        value={cantidad}
                        onChange={(e) => setCantidad(Number(e.target.value))}
                        disabled={!productoActual}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-blue-500"
                      />
                   </div>
                </div>

                {/* Botón Acción */}
                <div className="w-full lg:w-auto">
                   <button 
                     onClick={añadirProductoAlCarrito}
                     disabled={!productoActual || cantidad <= 0}
                     className="w-full h-[50px] px-8 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 shadow-lg shadow-slate-300 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:shadow-none active:scale-95"
                   >
                     <IoMdAdd className="text-xl"/> AÑADIR
                   </button>
                </div>
              </div>
           </div>
        </div>

        {/* --- TARJETA 3: LISTADO Y TOTALES --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
           <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-bold text-slate-700 flex items-center gap-2">
                 <IoIosList className="text-lg"/> Detalle de Compra
              </h3>
              <span className="text-xs font-bold bg-white px-3 py-1 rounded border text-slate-500">
                 {productosEnCompra.length} items
              </span>
           </div>
           
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-white text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                       <th className="p-4">Producto</th>
                       <th className="p-4 text-right">Precio Unit.</th>
                       <th className="p-4 text-center">Cantidad</th>
                       <th className="p-4 text-right">Subtotal</th>
                       <th className="p-4 text-center">Acción</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50 text-sm">
                    {productosEnCompra.length === 0 ? (
                       <tr>
                          <td colSpan={5} className="p-12 text-center text-slate-400">
                             <FaBoxOpen className="w-12 h-12 mx-auto mb-3 opacity-20"/>
                             <p>Tu carrito de compra está vacío.</p>
                          </td>
                       </tr>
                    ) : (
                       productosEnCompra.map(item => (
                          <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                             <td className="p-4">
                                <div className="flex items-center gap-3">
                                   <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                                      {item.imagen ? (
                                         <img src={`${API_URL}${item.imagen}`} alt="" className="w-full h-full object-cover"/>
                                      ) : (
                                         <IoMdImage className="text-slate-300 text-lg"/>
                                      )}
                                   </div>
                                   <div>
                                      <div className="font-bold text-slate-800">{item.nombre}</div>
                                      <div className="text-xs text-slate-400 font-mono">{item.sku}</div>
                                   </div>
                                </div>
                             </td>
                             <td className="p-4 text-right font-mono text-slate-600">S/ {item.precio_unitario.toFixed(2)}</td>
                             <td className="p-4 text-center">
                                <div className="inline-flex items-center bg-white border border-slate-200 rounded-lg h-8">
                                   <button onClick={() => actualizarCantidad(item.id, item.cantidad - 1)} className="px-2 hover:bg-slate-100 text-slate-500 h-full rounded-l-lg">-</button>
                                   <span className="px-2 font-bold text-slate-700 min-w-[30px] text-center">{item.cantidad}</span>
                                   <button onClick={() => actualizarCantidad(item.id, item.cantidad + 1)} className="px-2 hover:bg-slate-100 text-slate-500 h-full rounded-r-lg">+</button>
                                </div>
                             </td>
                             <td className="p-4 text-right font-bold text-slate-800">S/ {item.subtotal.toFixed(2)}</td>
                             <td className="p-4 text-center">
                                <button onClick={() => eliminarProducto(item.id)} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition-all">
                                   <IoMdCloseCircle className="text-xl"/>
                                </button>
                             </td>
                          </tr>
                       ))
                    )}
                 </tbody>
              </table>
           </div>
           
           {/* Sección Totales */}
           {productosEnCompra.length > 0 && (
             <div className="bg-slate-50 p-6 border-t border-slate-200">
                <div className="flex flex-col sm:flex-row justify-end items-center gap-6 sm:gap-12">
                   <div className="text-right">
                      <div className="text-xs font-bold text-slate-400 uppercase">Subtotal</div>
                      <div className="font-bold text-slate-700 text-lg">S/ {subtotalBruto.toFixed(2)}</div>
                   </div>
                   <div className="text-right">
                      <div className="text-xs font-bold text-slate-400 uppercase">IGV (18%)</div>
                      <div className="font-bold text-slate-700 text-lg">S/ {igv.toFixed(2)}</div>
                   </div>
                   <div className="bg-white px-6 py-3 rounded-xl border border-green-200 shadow-sm text-right min-w-[200px]">
                      <div className="text-xs font-bold text-green-600 uppercase tracking-wider">Total a Pagar</div>
                      <div className="text-3xl font-extrabold text-green-700">S/ {totalAPagar.toFixed(2)}</div>
                   </div>
                </div>
             </div>
           )}
        </div>

        {/* --- FOOTER DE ACCIONES FINAL --- */}
        <div className="flex flex-col-reverse sm:flex-row justify-end items-center gap-4 pt-6 border-t border-slate-200">
            <button 
               onClick={() => setShowCancelModal(true)} 
               className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-slate-300 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
            >
               Cancelar Operación
            </button>
            <button 
               onClick={registrarCompra}
               disabled={productosEnCompra.length === 0}
               className="w-full sm:w-auto px-12 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold shadow-xl shadow-blue-200 hover:shadow-2xl hover:-translate-y-1 transition-all disabled:opacity-50 disabled:shadow-none disabled:translate-y-0 flex items-center justify-center gap-2"
            >
               <IoMdCheckmark className="text-2xl"/> CONFIRMAR COMPRA
            </button>
        </div>

      </div>

      {/* --- MODAL CATÁLOGO PRODUCTOS --- */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsProductModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-4xl max-h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fadeInUp">
             {/* Modal Header */}
             <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white z-10">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <IoIosArchive className="text-blue-500"/> Catálogo del Proveedor
                  </h3>
                  <p className="text-xs text-slate-400">Selecciona el producto para agregar a la compra</p>
                </div>
                <button onClick={() => setIsProductModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                  <IoMdCloseCircle className="text-2xl"/>
                </button>
             </div>

             {/* Modal Buscador */}
             <div className="p-4 bg-slate-50 border-b border-slate-100">
                <div className="relative">
                  <IoIosSearch className="absolute left-3 top-3 text-slate-400 text-lg"/>
                  <input 
                    type="text" 
                    placeholder="Buscar por nombre o código..."
                    autoFocus
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                    value={filtroProductoModal}
                    onChange={(e) => setFiltroProductoModal(e.target.value)}
                  />
                </div>
             </div>

             {/* Modal Grid */}
             <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50/50">
                {loadingData ? (
                   <div className="flex justify-center items-center h-40 text-slate-400">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-2"></div> Cargando catálogo...
                   </div>
                ) : (
                   <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {productosDisponibles
                        .filter(p => {
                           const txt = filtroProductoModal.toLowerCase();
                           return (p.nombre || '').toLowerCase().includes(txt) || (p.codigo || '').toLowerCase().includes(txt);
                        })
                        .map(prod => (
                          <div 
                            key={prod.id} 
                            onClick={() => handleSelectProductFromModal(prod)}
                            className="group bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-lg cursor-pointer transition-all overflow-hidden flex flex-col relative"
                          >
                             {/* Imagen */}
                             <div className="aspect-square bg-slate-100 flex items-center justify-center overflow-hidden relative">
                                {prod.imagen ? (
                                   <img src={`${API_URL}${prod.imagen}`} alt={prod.nombre} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"/>
                                ) : (
                                   <IoMdImage className="text-slate-300 text-4xl"/>
                                )}
                                <div className="absolute inset-0 bg-blue-900/0 group-hover:bg-blue-900/10 transition-colors"></div>
                             </div>
                             {/* Info */}
                             <div className="p-3 flex flex-col flex-1">
                                <div className="text-xs font-bold text-slate-400 mb-1">{prod.codigo}</div>
                                <h4 className="font-bold text-slate-700 text-sm leading-tight mb-2 line-clamp-2 flex-1">{prod.nombre}</h4>
                                <div className="mt-auto flex justify-between items-end">
                                   <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold">
                                      S/ {prod.precio_compra.toFixed(2)}
                                   </div>
                                   <div className="text-xs text-slate-400 font-medium">
                                      {prod.peso_kg} kg
                                   </div>
                                </div>
                             </div>
                             {/* Check si ya está agregado */}
                             {productosEnCompra.some(x => x.id_producto === prod.productoId) && (
                                <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full shadow-md z-10">
                                   <IoMdCheckmark className="text-xs"/>
                                </div>
                             )}
                          </div>
                      ))}
                      {productosDisponibles.length === 0 && (
                         <div className="col-span-full py-10 text-center text-slate-400">
                            No se encontraron productos.
                         </div>
                      )}
                   </div>
                )}
             </div>
          </div>
        </div>
      )}

      {/* --- MODAL CONFIRMACIÓN CANCELAR --- */}
      {showCancelModal && (
        <div className="fixed inset-0 z-[70] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 animate-zoomIn">
            <div className="text-center">
               <div className="bg-amber-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-500">
                  <IoIosWarning className="text-3xl"/>
               </div>
               <h3 className="text-lg font-bold text-slate-800">¿Cancelar Compra?</h3>
               <p className="text-slate-500 text-sm mt-2 mb-6">Si sales ahora se perderán todos los datos ingresados.</p>
               <div className="flex gap-3">
                  <button onClick={() => setShowCancelModal(false)} className="flex-1 py-2.5 border border-slate-300 rounded-lg text-slate-600 font-semibold hover:bg-slate-50">Volver</button>
                  <button onClick={() => navigate('/compras')} className="flex-1 py-2.5 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 shadow-lg shadow-red-200">Sí, Salir</button>
               </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}