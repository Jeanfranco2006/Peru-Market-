import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import {
  IoIosCart, IoIosDocument, IoIosArchive, IoMdAdd, IoMdCloseCircle, 
  IoIosList, IoMdCheckmark, IoIosWarning, IoIosCheckmarkCircle, 
  IoIosLock, IoIosSearch, IoMdImage, IoMdBarcode, IoMdCopy, IoMdPrint, IoMdTrash
} from "react-icons/io";
import { FaWarehouse, FaBoxOpen, FaTruckLoading } from "react-icons/fa";
import { api } from '../../services/api'; 
import { useWarehouseList } from '../../hooks/inventario/useWarehouseList';

// --- CONFIGURACIÓN ---
const API_URL = 'http://localhost:8080'; 
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
  razon_social?: string; 
  razonSocial?: string;  
  ruc: string;
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

interface BarcodeData {
  nombre: string;
  codigoBarras: string;
}

export default function NewPurchase() {
  const navigate = useNavigate();
  const { warehouses: almacenes } = useWarehouseList();

  // --- ESTADOS ---
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [productosDisponibles, setProductosDisponibles] = useState<ProductoProveedorDTO[]>([]);

  // Formulario
  const [proveedor, setProveedor] = useState<number | ''>('');
  const [tipoComprobante, setTipoComprobante] = useState('ORDEN_COMPRA');
  const [almacen, setAlmacen] = useState<number | ''>('');
  const [metodoPago, setMetodoPago] = useState('Contado'); 
  const [observaciones, setObservaciones] = useState('');
  
  // Modales y Selección
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [filtroProductoModal, setFiltroProductoModal] = useState('');
  const [productoActual, setProductoActual] = useState<ProductoProveedorDTO | null>(null);
  const [cantidad, setCantidad] = useState(1);
  
  // Carrito
  const [productosEnCompra, setProductosEnCompra] = useState<ProductoCompra[]>([]);
  
  // UI
  const [showNotification, setShowNotification] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  // Barcode
  const [barcodeModalOpen, setBarcodeModalOpen] = useState(false);
  const [currentBarcodeData, setCurrentBarcodeData] = useState<BarcodeData | null>(null);

  const getNombreProveedor = (p: Proveedor) => p.razon_social || p.razonSocial || "Proveedor";

  // --- EFECTOS ---
  useEffect(() => {
    const cargarProveedores = async () => {
      try {
        const resProv = await api.get('/proveedores');
        setProveedores(resProv.data);
      } catch (error) {
        console.error("Error al cargar proveedores:", error);
      }
    };
    cargarProveedores();
  }, []);

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

  // --- CALCULOS ---
  const volumenAgregado = useMemo(() => 
    productosEnCompra.reduce((sum, p) => sum + p.peso_total, 0)
  , [productosEnCompra]);

  const infoAlmacenSeleccionado = useMemo(() => {
     if (!almacen) return null;
     const alm = almacenes.find(a => a.id === Number(almacen));
     if (!alm) return null;

     const capacidadTotalUnits = alm.capacityTotalUnits || 0;
     const capacityUsedUnits = alm.capacityUsed || 0;
     const capacidadM3 = alm.capacidadM3 || 0; 

     let occupiedM3_Base = 0;
     if (capacidadTotalUnits > 0) {
        occupiedM3_Base = (capacityUsedUnits / capacidadTotalUnits) * capacidadM3;
     }

     const occupiedM3_Total = occupiedM3_Base + volumenAgregado;
     const percentageSafe = capacidadM3 > 0 
        ? Math.round((occupiedM3_Total / capacidadM3) * 100) 
        : 0;

     // Colores más modernos
     let colorBarra = 'bg-emerald-500';
     let colorTexto = 'text-emerald-700';
     let colorFondo = 'bg-emerald-50';

     if (percentageSafe > 80) {
        colorBarra = 'bg-rose-500'; colorTexto = 'text-rose-700'; colorFondo = 'bg-rose-50';
     } else if (percentageSafe > 50) {
        colorBarra = 'bg-amber-500'; colorTexto = 'text-amber-700'; colorFondo = 'bg-amber-50';
     }

     return { 
       ...alm, 
       capacidadM3,
       occupiedM3_Total,
       percentage: percentageSafe, 
       colorBarra, colorTexto, colorFondo
     };
  }, [almacen, almacenes, volumenAgregado]);

  // --- HANDLERS ---
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
    const pesoProductoNuevo = productoActual.peso_kg * cantidad;

    if (infoAlmacenSeleccionado) {
       if ((infoAlmacenSeleccionado.occupiedM3_Total + pesoProductoNuevo) > infoAlmacenSeleccionado.capacidadM3) {
          alert(`⚠️ Capacidad excedida. Falta espacio para ${pesoProductoNuevo.toFixed(2)} m³.`);
          return;
       }
    }

    const subtotal = productoActual.precio_compra * cantidad;
    const nuevoItem: ProductoCompra = {
      id: Date.now(),
      id_producto: productoActual.productoId,
      nombre: productoActual.nombre,
      precio_unitario: productoActual.precio_compra,
      cantidad: cantidad,
      subtotal: subtotal,
      sku: productoActual.codigo,
      peso_total: pesoProductoNuevo, 
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
    if (nuevaCantidad <= 0) { eliminarProducto(id); return; }
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

  // --- BARCODE LOGIC ---
  const openBarcodeModal = (item: ProductoCompra) => {
    setCurrentBarcodeData({ nombre: item.nombre, codigoBarras: item.sku });
    setBarcodeModalOpen(true);
  };

  const copyBarcode = () => {
    if (currentBarcodeData?.codigoBarras) {
      navigator.clipboard.writeText(currentBarcodeData.codigoBarras);
      alert('Copiado!');
    }
  };

  const printBarcode = () => {
    if (currentBarcodeData?.codigoBarras) {
      const barcodeUrl = `https://barcode.tec-it.com/barcode.ashx?data=${currentBarcodeData.codigoBarras}&code=Code128&translate-esc=on`;
      const w = window.open('', '_blank');
      if (w) {
        w.document.write(`
            <html><head><title>${currentBarcodeData.nombre}</title>
            <style>body{text-align:center;font-family:sans-serif;padding:20px;} @media print{.np{display:none;}}</style>
            </head><body>
            <h3>${currentBarcodeData.nombre}</h3>
            <img src='${barcodeUrl}' style='max-width:100%;'/>
            <div class="np" style="margin-top:20px"><button onclick="window.print()">🖨️ Imprimir</button></div>
            <script>window.onload=function(){setTimeout(function(){window.print();},1000);}</script>
            </body></html>
        `);
        w.document.close();
      }
    }
  };

  // --- GUARDAR ---
  const registrarCompra = async () => {
    if (!proveedor || !almacen || productosEnCompra.length === 0) {
        alert("⚠️ Por favor completa los datos obligatorios.");
        return;
    }
    if (!window.confirm("¿Confirmar registro de compra?")) return;

    const compraPayload = {
      id_proveedor: Number(proveedor),          
      id_almacen: Number(almacen),              
      id_usuario: ID_USUARIO_ACTUAL,    
      tipo_comprobante: tipoComprobante,
      numero_comprobante: generarNumeroComprobante(),
      subtotal: Number(subtotalBruto.toFixed(2)),          
      igv: Number(igv.toFixed(2)),                        
      total: Number(totalAPagar.toFixed(2)),              
      estado: 'PENDIENTE',
      metodo_pago: metodoPago,
      observaciones: observaciones,
      detalles: productosEnCompra.map(p => ({
        id_producto: Number(p.id_producto),     
        cantidad: Number(p.cantidad),           
        precio_unitario: Number(p.precio_unitario.toFixed(2)), 
        subtotal: Number(p.subtotal.toFixed(2))            
      }))
    };

    try {
      await api.post('/compras', compraPayload);
      setShowNotification(true);
      setProductosEnCompra([]); setProveedor(''); setAlmacen('');
      setTimeout(() => { setShowNotification(false); navigate('/compras'); }, 1500);
    } catch (error: any) {
      alert(`Error: ${error.response?.data?.message || "Desconocido"}`);
    }
  };

  const subtotalBruto = productosEnCompra.reduce((sum, p) => sum + p.subtotal, 0);
  const igv = subtotalBruto * 0.18;
  const totalAPagar = subtotalBruto + igv;

  return (
    <div className="bg-slate-50/50 min-h-screen font-sans pb-32 text-slate-600">
      
      {/* --- NOTIFICACIÓN FLOTANTE --- */}
      {showNotification && (
        <div className="fixed top-6 right-6 bg-emerald-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-[150] animate-bounce-in ring-4 ring-emerald-100">
          <IoIosCheckmarkCircle className="w-6 h-6" />
          <div>
            <p className="font-bold">¡Operación Exitosa!</p>
            <p className="text-xs text-emerald-100">La compra se ha registrado correctamente.</p>
          </div>
        </div>
      )}

      {/* --- HEADER SUPERIOR --- */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                  <div className="bg-indigo-600 text-white p-2.5 rounded-lg shadow-lg shadow-indigo-200">
                      <FaTruckLoading className="text-xl" />
                  </div>
                  <div>
                      <h1 className="text-xl font-bold text-slate-800">Nueva Compra</h1>
                      <p className="text-xs text-slate-500">Gestión de abastecimiento</p>
                  </div>
              </div>
              
              <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button onClick={() => setShowCancelModal(true)} 
                      className="px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
                      Cancelar
                  </button>
                  <button onClick={registrarCompra} disabled={productosEnCompra.length === 0}
                      className="flex-1 sm:flex-none px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                      <IoMdCheckmark className="text-lg"/> Guardar Compra
                  </button>
              </div>
          </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        
        {/* --- GRID PRINCIPAL --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* COLUMNA IZQUIERDA: DATOS GENERALES (2/3 de ancho) */}
            <div className="lg:col-span-2 space-y-6">
                
                {/* 1. TARJETA DE PROVEEDOR Y ALMACÉN */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-5 flex items-center gap-2">
                        <IoIosDocument className="text-indigo-500"/> Información General
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Selector Proveedor */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 ml-1">Proveedor <span className="text-rose-500">*</span></label>
                            <select value={proveedor} onChange={(e) => setProveedor(e.target.value ? Number(e.target.value) : '')}
                                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none">
                                <option value="">-- Seleccionar Proveedor --</option>
                                {proveedores.map(prov => (
                                    <option key={prov.id} value={prov.id}>{getNombreProveedor(prov)}</option>
                                ))}
                            </select>
                        </div>

                        {/* Selector Almacén */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 ml-1">Almacén de Destino <span className="text-rose-500">*</span></label>
                            <select value={almacen} onChange={(e) => setAlmacen(e.target.value ? Number(e.target.value) : '')}
                                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none">
                                <option value="">-- Seleccionar Almacén --</option>
                                {almacenes.map((alm: any) => (
                                    <option key={alm.id} value={alm.id}>{alm.nombre}</option>
                                ))}
                            </select>
                        </div>

                        {/* Widget de Capacidad (Aparece si hay almacén) */}
                        {infoAlmacenSeleccionado && (
                            <div className="md:col-span-2 bg-slate-50 rounded-lg p-4 border border-slate-200 mt-2">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-bold text-slate-500 flex items-center gap-2">
                                        <FaWarehouse className={infoAlmacenSeleccionado.colorTexto}/> Capacidad del Almacén
                                    </span>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${infoAlmacenSeleccionado.colorFondo} ${infoAlmacenSeleccionado.colorTexto}`}>
                                        {infoAlmacenSeleccionado.percentage}% Ocupado
                                    </span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden mb-1">
                                    <div className={`h-full rounded-full transition-all duration-700 ease-out ${infoAlmacenSeleccionado.colorBarra}`} 
                                        style={{ width: `${Math.min(infoAlmacenSeleccionado.percentage, 100)}%` }}>
                                    </div>
                                </div>
                                <p className="text-[10px] text-right text-slate-400">
                                    Disponible: {(infoAlmacenSeleccionado.capacidadM3 - infoAlmacenSeleccionado.occupiedM3_Total).toFixed(2)} m³
                                </p>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 ml-1">Tipo & N° Comprobante</label>
                            <div className="flex gap-2">
                                <select value={tipoComprobante} onChange={(e) => setTipoComprobante(e.target.value)}
                                    className="w-2/3 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:ring-1 focus:ring-indigo-500 outline-none">
                                    <option value="ORDEN_COMPRA">Orden de Compra</option>
                                    <option value="FACTURA">Factura</option>
                                    <option value="BOLETA">Boleta</option>
                                </select>
                                <div className="w-1/3 px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-500 flex items-center justify-center font-mono">
                                    {generarNumeroComprobante()}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 ml-1">Método de Pago</label>
                            <select value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)}
                                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:ring-1 focus:ring-indigo-500 outline-none">
                                <option value="Contado">Contado</option>
                                <option value="Crédito">Crédito a 30 días</option>
                                <option value="Transferencia">Transferencia Bancaria</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* 2. LISTADO DE PRODUCTOS (Tabla Principal) */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white">
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
                            <IoIosList className="text-lg text-indigo-500"/> Items en la Orden
                        </h3>
                        <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-full border border-indigo-100">
                            {productosEnCompra.length} Productos
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Descripción</th>
                                    <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Precio</th>
                                    <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Cant.</th>
                                    <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Subtotal</th>
                                    <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {productosEnCompra.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-slate-400">
                                            <FaBoxOpen className="w-12 h-12 mx-auto mb-3 opacity-20"/>
                                            <p className="text-sm">No has agregado productos aún.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    productosEnCompra.map(item => (
                                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 p-0.5 shrink-0 overflow-hidden">
                                                        {item.imagen ? 
                                                            <img src={`${API_URL}${item.imagen}`} className="w-full h-full object-cover rounded-md"/> : 
                                                            <IoMdImage className="w-full h-full text-slate-300"/>}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-slate-800">{item.nombre}</div>
                                                        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                                                            {item.sku}
                                                            <button onClick={() => openBarcodeModal(item)} className="text-indigo-400 hover:text-indigo-600 transition-colors" title="Ver código de barras">
                                                                <IoMdBarcode />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3 text-right text-sm text-slate-600 font-mono">S/ {item.precio_unitario.toFixed(2)}</td>
                                            <td className="px-5 py-3">
                                                <div className="flex items-center justify-center">
                                                    <button onClick={() => actualizarCantidad(item.id, item.cantidad - 1)} className="w-7 h-7 flex items-center justify-center rounded-l-md bg-slate-100 hover:bg-slate-200 text-slate-500">-</button>
                                                    <div className="w-10 h-7 flex items-center justify-center border-y border-slate-200 bg-white text-sm font-bold text-slate-700">{item.cantidad}</div>
                                                    <button onClick={() => actualizarCantidad(item.id, item.cantidad + 1)} className="w-7 h-7 flex items-center justify-center rounded-r-md bg-slate-100 hover:bg-slate-200 text-slate-500">+</button>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3 text-right text-sm font-bold text-slate-800 font-mono">S/ {item.subtotal.toFixed(2)}</td>
                                            <td className="px-5 py-3 text-center">
                                                <button onClick={() => eliminarProducto(item.id)} className="text-slate-400 hover:text-rose-500 p-2 transition-colors">
                                                    <IoMdTrash className="text-lg"/>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* COLUMNA DERECHA: ACCIONES Y TOTALES (1/3 de ancho) */}
            <div className="space-y-6">
                
                {/* 1. AGREGAR PRODUCTO */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Agregar Item</h3>
                    
                    <button onClick={() => setIsProductModalOpen(true)} disabled={!proveedor}
                        className="w-full py-4 border-2 border-dashed border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-600 rounded-xl flex flex-col items-center justify-center gap-1 font-bold transition-all mb-4 group disabled:opacity-50 disabled:cursor-not-allowed">
                        {productoActual ? (
                            <>
                                <IoMdCheckmark className="text-2xl text-emerald-500"/>
                                <span className="text-slate-800 text-sm">{productoActual.nombre}</span>
                            </>
                        ) : (
                            <>
                                <IoIosSearch className="text-2xl group-hover:scale-110 transition-transform"/>
                                <span className="text-sm">{proveedor ? "Buscar en Catálogo" : "Seleccione Proveedor Primero"}</span>
                            </>
                        )}
                    </button>

                    <div className="flex gap-3 mb-4">
                        <div className="w-1/2">
                            <label className="text-xs font-bold text-slate-400 block mb-1">Precio</label>
                            <div className="w-full p-2.5 bg-slate-100 rounded-lg text-slate-500 font-mono text-center text-sm">
                                {productoActual ? `S/ ${productoActual.precio_compra}` : '-'}
                            </div>
                        </div>
                        <div className="w-1/2">
                            <label className="text-xs font-bold text-slate-400 block mb-1">Cantidad</label>
                            <input type="number" min="1" value={cantidad} onChange={(e) => setCantidad(Number(e.target.value))} disabled={!productoActual}
                                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 font-bold text-center text-sm focus:ring-2 focus:ring-indigo-500 outline-none"/>
                        </div>
                    </div>

                    <button onClick={añadirProductoAlCarrito} disabled={!productoActual || cantidad <= 0}
                        className="w-full py-3 bg-slate-800 text-white rounded-lg font-bold hover:bg-slate-900 shadow-lg shadow-slate-200 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:shadow-none">
                        <IoMdAdd/> Añadir a la lista
                    </button>
                </div>

                {/* 2. TOTALES */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Resumen Financiero</h3>
                    
                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-sm text-slate-500">
                            <span>Subtotal</span>
                            <span className="font-mono text-slate-700">S/ {subtotalBruto.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-slate-500">
                            <span>IGV (18%)</span>
                            <span className="font-mono text-slate-700">S/ {igv.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                        <div className="text-center">
                            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-1">Total a Pagar</span>
                            <span className="text-3xl font-extrabold text-slate-800 block">S/ {totalAPagar.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="mt-4">
                         <label className="text-xs font-bold text-slate-400 block mb-1">Observaciones</label>
                         <textarea 
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                            rows={3}
                            placeholder="Comentarios adicionales..."
                            value={observaciones}
                            onChange={(e) => setObservaciones(e.target.value)}
                         ></textarea>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* --- MODAL DE BÚSQUEDA (Estilo Galería) --- */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsProductModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-5xl max-h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fadeInUp">
             {/* Header Modal */}
             <div className="p-5 border-b border-slate-100 bg-white z-10 flex gap-4 items-center">
                <div className="relative flex-1">
                   <IoIosSearch className="absolute left-3 top-3 text-slate-400"/>
                   <input type="text" placeholder="Buscar por nombre o SKU..." autoFocus
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={filtroProductoModal} onChange={(e) => setFiltroProductoModal(e.target.value)}
                   />
                </div>
                <button onClick={() => setIsProductModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                  <IoMdCloseCircle className="text-2xl"/>
                </button>
             </div>

             {/* Grid Productos */}
             <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
                {loadingData ? (
                   <div className="flex justify-center items-center h-40"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>
                ) : (
                   <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {productosDisponibles.filter(p => (p.nombre.toLowerCase().includes(filtroProductoModal.toLowerCase()) || p.codigo.toLowerCase().includes(filtroProductoModal.toLowerCase()))).map(prod => (
                         <div key={prod.id} onClick={() => handleSelectProductFromModal(prod)}
                            className="bg-white rounded-xl border border-slate-200 p-3 hover:border-indigo-500 hover:shadow-md cursor-pointer transition-all group relative">
                            {productosEnCompra.some(x => x.id_producto === prod.productoId) && (
                                <div className="absolute top-2 right-2 bg-emerald-500 text-white rounded-full p-1 z-10 shadow-sm"><IoMdCheckmark/></div>
                            )}
                            <div className="aspect-square bg-slate-100 rounded-lg mb-3 overflow-hidden flex items-center justify-center">
                               {prod.imagen ? <img src={`${API_URL}${prod.imagen}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform"/> : <IoMdImage className="text-3xl text-slate-300"/>}
                            </div>
                            <h4 className="font-bold text-slate-700 text-sm line-clamp-2 leading-tight mb-1">{prod.nombre}</h4>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-xs text-slate-400">{prod.codigo}</span>
                                <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">S/ {prod.precio_compra}</span>
                            </div>
                         </div>
                      ))}
                   </div>
                )}
             </div>
          </div>
        </div>
      )}

      {/* --- MODAL BARCODE --- */}
      {barcodeModalOpen && currentBarcodeData && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setBarcodeModalOpen(false)}></div>
           <div className="relative bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 animate-zoomIn text-center">
              <h3 className="text-lg font-bold text-slate-800 mb-1">{currentBarcodeData.nombre}</h3>
              <p className="text-sm text-slate-500 mb-6 font-mono tracking-wider">{currentBarcodeData.codigoBarras}</p>
              <div className="border border-slate-100 rounded-xl p-4 mb-6 bg-white shadow-inner flex justify-center">
                 {/* Integración TEC-IT Preservada */}
                 <img src={`https://barcode.tec-it.com/barcode.ashx?data=${currentBarcodeData.codigoBarras}&code=Code128&translate-esc=on`} alt="barcode" className="max-w-full h-auto"/>
              </div>
              <div className="flex gap-3">
                 <button onClick={copyBarcode} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-lg transition-colors flex items-center justify-center gap-2"><IoMdCopy/> Copiar</button>
                 <button onClick={printBarcode} className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg shadow-indigo-200 transition-colors flex items-center justify-center gap-2"><IoMdPrint/> Imprimir</button>
              </div>
           </div>
        </div>
      )}

      {/* --- MODAL CANCELAR --- */}
      {showCancelModal && (
        <div className="fixed inset-0 z-[130] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
           <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center animate-zoomIn">
              <div className="w-16 h-16 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl"><IoIosWarning/></div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">¿Cancelar esta compra?</h3>
              <p className="text-slate-500 text-sm mb-6">Si sales ahora, perderás todos los productos agregados a la lista.</p>
              <div className="flex gap-3">
                 <button onClick={() => setShowCancelModal(false)} className="flex-1 py-3 border border-slate-200 font-bold text-slate-600 rounded-xl hover:bg-slate-50">Continuar editando</button>
                 <button onClick={() => navigate('/compras')} className="flex-1 py-3 bg-rose-500 text-white font-bold rounded-xl hover:bg-rose-600 shadow-lg shadow-rose-200">Sí, Salir</button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
}