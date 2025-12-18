import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  IoMdArrowRoundBack, IoMdPrint, IoMdTime, IoMdCalendar, 
  IoIosBusiness, IoIosPerson, IoIosCall, IoIosMail, IoMdPin, 
  IoIosListBox, IoMdCart
} from "react-icons/io";
import { api } from '../../services/api';

// --- INTERFACES ---
interface Producto {
  id: number;
  nombre: string;
  sku: string;
  unidadMedida: string;
}

interface DetalleCompra {
  id: number;
  cantidad: number;
  precioUnitario: number; 
  subtotal: number;
  producto: Producto;
}

interface CompraDetail {
  id: number;
  numeroComprobante: string;
  tipoComprobante: string;
  fechaCompra: string;
  estado: string;
  metodoPago: string;
  observaciones: string;
  subtotal: number;
  igv: number;
  total: number;
  proveedor: { 
    razonSocial: string; 
    ruc: string; 
    telefono?: string;
    correo?: string;
    direccion?: string;
  };
  almacen: { 
    nombre: string; 
    direccion: string; 
  };
  usuario: {
    username: string;
  };
  detalles: DetalleCompra[];
}

export default function PurchaseHistory() {
  const { id } = useParams();
  const [compra, setCompra] = useState<CompraDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDetalle = async () => {
      try {
        const response = await api.get(`/compras/${id}`);
        setCompra(response.data);
      } catch (err) {
        console.error("Error al cargar detalle:", err);
        setError('No se pudo cargar la información de la compra.');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetalle();
  }, [id]);

  // --- HELPERS ---
  const getStatusStyles = (status: string) => {
    const s = status ? status.toUpperCase() : '';
    switch (s) {
      case 'COMPLETADO': case 'APROBADO': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'PENDIENTE': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'CANCELADO': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-PE', {
        day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(amount);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  if (error || !compra) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-500 gap-4">
        <h2 className="text-xl font-bold text-slate-700">Ups, algo salió mal</h2>
        <p>{error || 'Compra no encontrada'}</p>
        <Link to="/compras" className="text-indigo-600 hover:underline">Volver al listado</Link>
    </div>
  );

  return (
    <div className="bg-slate-100 min-h-screen pb-20 print:bg-white print:pb-0 font-sans text-slate-600">
      
      {/* --- HEADER DE NAVEGACIÓN (Oculto al imprimir) --- */}
      <div className="print:hidden sticky top-0 z-20 bg-slate-100/90 backdrop-blur border-b border-slate-200 mb-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
             <Link to="/compras" className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-medium">
                <IoMdArrowRoundBack className="text-xl" /> Volver al Historial
             </Link>
             <button 
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg shadow hover:bg-slate-900 transition-all font-bold text-sm"
             >
                <IoMdPrint className="text-lg"/> Imprimir Comprobante
             </button>
        </div>
      </div>

      {/* --- DOCUMENTO (Simulación de Hoja A4) --- */}
      <div className="max-w-5xl mx-auto bg-white shadow-2xl print:shadow-none print:border-none rounded-xl overflow-hidden border border-slate-200">
        
        {/* CABECERA DEL DOCUMENTO */}
        <div className="bg-slate-50 px-8 py-10 border-b border-slate-200 print:bg-white print:px-0">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                
                {/* Logo y Título */}
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-3xl shadow-lg shadow-indigo-200 print:hidden">
                        <IoMdCart />
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-800 uppercase tracking-tight">
                            {compra.tipoComprobante}
                        </h1>
                        <p className="text-indigo-600 font-mono font-bold text-lg">
                            #{compra.numeroComprobante}
                        </p>
                    </div>
                </div>

                {/* Estado y Fechas */}
                <div className="text-right">
                    <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold border mb-3 ${getStatusStyles(compra.estado)}`}>
                        {compra.estado}
                    </div>
                    <div className="text-sm text-slate-500 flex flex-col gap-1">
                        <span className="flex items-center justify-end gap-2">
                             <IoMdCalendar/> {formatDate(compra.fechaCompra)}
                        </span>
                        <span className="flex items-center justify-end gap-2 font-mono text-xs uppercase">
                             <IoMdTime/> Operador: {compra.usuario?.username}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        {/* CUERPO DEL DOCUMENTO */}
        <div className="p-8 print:px-0">
            
            {/* Grid de Información (Proveedor / Envío) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10 border-b border-slate-100 pb-10">
                
                {/* PROVEEDOR */}
                <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <IoIosBusiness className="text-lg"/> Datos del Proveedor
                    </h3>
                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 print:border-0 print:p-0 print:bg-white">
                        <p className="text-lg font-bold text-slate-800 mb-1">{compra.proveedor?.razonSocial}</p>
                        <p className="text-sm text-slate-500 font-mono mb-3">RUC: {compra.proveedor?.ruc}</p>
                        
                        <div className="space-y-1.5 text-sm text-slate-600">
                             {compra.proveedor?.direccion && (
                                <p className="flex items-start gap-2"><IoMdPin className="mt-1 text-slate-400"/> {compra.proveedor.direccion}</p>
                             )}
                             {compra.proveedor?.telefono && (
                                <p className="flex items-center gap-2"><IoIosCall className="text-slate-400"/> {compra.proveedor.telefono}</p>
                             )}
                             {compra.proveedor?.correo && (
                                <p className="flex items-center gap-2"><IoIosMail className="text-slate-400"/> {compra.proveedor.correo}</p>
                             )}
                        </div>
                    </div>
                </div>

                {/* DESTINO / ALMACEN */}
                <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <IoMdPin className="text-lg"/> Punto de Entrega
                    </h3>
                    <div className="space-y-4">
                        <div className="border-l-4 border-indigo-500 pl-4 py-1">
                            <p className="text-lg font-bold text-slate-800">{compra.almacen?.nombre}</p>
                            <p className="text-sm text-slate-500">{compra.almacen?.direccion || 'Dirección no especificada'}</p>
                        </div>
                        
                        <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                            <h4 className="text-xs font-bold text-amber-600 uppercase mb-1">Método de Pago</h4>
                            <p className="text-sm font-semibold text-amber-800">{compra.metodoPago}</p>
                        </div>

                        {compra.observaciones && (
                             <div className="text-sm text-slate-500 bg-slate-50 p-3 rounded border border-slate-100 italic">
                                "{compra.observaciones}"
                             </div>
                        )}
                    </div>
                </div>
            </div>

            {/* TABLA DE PRODUCTOS */}
            <div className="mb-8">
                 <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <IoIosListBox className="text-lg"/> Detalle de Ítems
                </h3>
                
                <div className="overflow-hidden rounded-lg border border-slate-200">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-100 text-slate-500 font-bold uppercase text-xs">
                            <tr>
                                <th className="px-5 py-3 text-center w-16">#</th>
                                <th className="px-5 py-3">Descripción</th>
                                <th className="px-5 py-3 text-center">Unidad</th>
                                <th className="px-5 py-3 text-right">Precio</th>
                                <th className="px-5 py-3 text-center">Cant.</th>
                                <th className="px-5 py-3 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {compra.detalles?.map((item, index) => (
                                <tr key={item.id} className="hover:bg-slate-50 print:hover:bg-white">
                                    <td className="px-5 py-4 text-center text-slate-400 font-mono text-xs">
                                        {(index + 1).toString().padStart(2, '0')}
                                    </td>
                                    <td className="px-5 py-4">
                                        <p className="font-bold text-slate-700">{item.producto?.nombre}</p>
                                        <p className="text-xs text-slate-400 font-mono">SKU: {item.producto?.sku}</p>
                                    </td>
                                    <td className="px-5 py-4 text-center text-slate-500 text-xs">
                                        <span className="bg-slate-100 px-2 py-1 rounded">{item.producto?.unidadMedida}</span>
                                    </td>
                                    <td className="px-5 py-4 text-right font-mono text-slate-600">
                                        {formatCurrency(item.precioUnitario)}
                                    </td>
                                    <td className="px-5 py-4 text-center font-bold text-slate-800">
                                        {item.cantidad}
                                    </td>
                                    <td className="px-5 py-4 text-right font-bold font-mono text-slate-800">
                                        {formatCurrency(item.subtotal)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* TOTALES */}
            <div className="flex flex-col items-end border-t border-slate-200 pt-6">
                <div className="w-full sm:w-80 space-y-3">
                    <div className="flex justify-between text-slate-500 text-sm">
                        <span>Subtotal Base</span>
                        <span className="font-mono">{formatCurrency(compra.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-slate-500 text-sm">
                        <span>Impuestos (IGV 18%)</span>
                        <span className="font-mono">{formatCurrency(compra.igv)}</span>
                    </div>
                    <div className="border-t border-slate-200 my-2"></div>
                    <div className="flex justify-between items-center">
                        <span className="text-base font-bold text-slate-800 uppercase">Total a Pagar</span>
                        <span className="text-2xl font-extrabold text-indigo-600 font-mono">
                            {formatCurrency(compra.total)}
                        </span>
                    </div>
                </div>
            </div>

            {/* FOOTER DEL DOCUMENTO */}
            <div className="mt-12 pt-6 border-t border-dashed border-slate-300 text-center">
                <p className="text-xs text-slate-400 mb-1">
                    Este documento es un comprobante de gestión interna y no reemplaza a la factura electrónica oficial SUNAT.
                </p>
                <p className="text-xs font-mono text-slate-300">
                    ID Transacción: {compra.id} | Generado el {new Date().toLocaleString()}
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}