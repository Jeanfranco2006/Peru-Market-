import React, { useState, useEffect } from 'react';
import {
    FaBoxOpen, FaTimes, FaPlus, FaTrash,
    FaImage, FaWeightHanging, FaTag, FaCloudUploadAlt
} from 'react-icons/fa';
import type { ProveedorData } from '../../../types/proveedor/proveedorType';
import { api } from '../../../services/api';
import { useThemeClasses } from '../../../hooks/useThemeClasses';

interface ProductoProveedorDTO {
    id: number;
    productoId: number;
    nombre: string;
    codigo: string;
    precio_compra: number;
    peso_kg: number;
    descuento: number;
    imagen?: string;
    unidadMedida?: string;
}

const UNIDADES_MEDIDA = [
    { valor: 'UNIDAD', etiqueta: 'Unidad (und)' },
    { valor: 'CAJA', etiqueta: 'Caja' },
    { valor: 'PAQUETE', etiqueta: 'Paquete' },
    { valor: 'DOCENA', etiqueta: 'Docena (12 und)' },
    { valor: 'KG', etiqueta: 'Kilogramo (kg)' },
    { valor: 'GRAMO', etiqueta: 'Gramo (g)' },
    { valor: 'LITRO', etiqueta: 'Litro (L)' },
    { valor: 'MILILITRO', etiqueta: 'Mililitro (mL)' },
    { valor: 'METRO', etiqueta: 'Metro (m)' },
    { valor: 'GALON', etiqueta: 'Galón (gal)' },
    { valor: 'SACO', etiqueta: 'Saco' },
    { valor: 'BOLSA', etiqueta: 'Bolsa' },
    { valor: 'LIBRA', etiqueta: 'Libra (lb)' },
    { valor: 'ROLLO', etiqueta: 'Rollo' },
    { valor: 'PAR', etiqueta: 'Par' },
];

interface Props {
    isOpen: boolean;
    onClose: () => void;
    proveedor: ProveedorData | undefined;
}

export default function ProveedorProductosModal({ isOpen, onClose, proveedor }: Props) {
    const API_URL = 'http://localhost:8080';
    const { isDark, heading, textTertiary } = useThemeClasses();

    const [productos, setProductos] = useState<ProductoProveedorDTO[]>([]);
    const [loading, setLoading] = useState(false);

    const [nombreInput, setNombreInput] = useState('');
    const [precioInput, setPrecioInput] = useState('');
    const [pesoInput, setPesoInput] = useState('');
    const [unidadInput, setUnidadInput] = useState('UNIDAD');

    const [imagenFile, setImagenFile] = useState<File | null>(null);
    const [imagenPreview, setImagenPreview] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && proveedor) {
            cargarProductosProveedor();
            limpiarFormulario();
        }
    }, [isOpen, proveedor]);

    const limpiarFormulario = () => {
        setNombreInput('');
        setPrecioInput('');
        setPesoInput('');
        setUnidadInput('UNIDAD');
        setImagenFile(null);
        setImagenPreview(null);
    };

    const cargarProductosProveedor = async () => {
        if (!proveedor) return;
        setLoading(true);
        try {
            const res = await api.get(`/proveedores/${proveedor.id}/productos`);
            setProductos(res.data);
        } catch (error) {
            console.error("Error cargando productos:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImagenFile(file);
            setImagenPreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveImage = () => {
        setImagenFile(null);
        setImagenPreview(null);
    };

    const handleVincular = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nombreInput.trim()) { alert("El nombre es obligatorio"); return; }
        if (!precioInput || isNaN(parseFloat(precioInput))) { alert("Precio invalido"); return; }
        if (!pesoInput || isNaN(parseFloat(pesoInput))) { alert("Peso invalido"); return; }

        try {
            const formData = new FormData();
            formData.append('nombre', nombreInput.trim());
            const skuAuto = `PROV-${Date.now().toString().slice(-6)}`;
            formData.append('sku', skuAuto);
            formData.append('precio_compra', precioInput);
            formData.append('peso_kg', pesoInput);
            formData.append('unidad_medida', unidadInput);
            if (imagenFile) {
                formData.append('imagen', imagenFile);
            }

            await api.post(
                `/proveedores/${proveedor?.id}/productos`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );

            alert("Producto registrado correctamente");
            cargarProductosProveedor();
            limpiarFormulario();
        } catch (error) {
            console.error("Error de red:", error);
            alert('Error de conexion con el servidor.');
        }
    };

    const handleDesvincular = async (idRelacion: number) => {
        if (!window.confirm("Eliminar este producto del catalogo del proveedor?")) return;
        try {
            await api.delete(`/proveedores/productos/${idRelacion}`);
            setProductos(productos.filter(p => p.id !== idRelacion));
        } catch (error) {
            console.error("Error al eliminar producto:", error);
            alert("Error al eliminar el producto");
        }
    };

    if (!isOpen || !proveedor) return null;

    const inputFieldClass = `w-full px-3 sm:px-4 py-2.5 ${isDark ? 'bg-gray-700 border-gray-600 text-gray-100 focus:ring-2 focus:ring-indigo-500' : 'bg-white border-slate-300 text-slate-800 focus:ring-2 focus:ring-indigo-500'} border rounded-lg text-sm font-medium transition-all`;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-[9999] p-2 sm:p-4 animate-fadeInUp">
            <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-100'} rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] flex flex-col overflow-hidden border`}>

                {/* HEADER */}
                <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-100'} p-4 sm:p-5 border-b flex justify-between items-center z-10 shrink-0`}>
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className={`${isDark ? 'bg-indigo-900/30 text-indigo-400 border-indigo-700' : 'bg-indigo-50 text-indigo-600 border-indigo-100'} p-2 sm:p-2.5 rounded-lg border shrink-0`}>
                            <FaBoxOpen className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <div className="min-w-0">
                            <h2 className={`text-base sm:text-lg font-bold ${heading} tracking-tight truncate`}>Catalogo de Proveedor</h2>
                            <div className={`flex items-center gap-2 text-xs font-medium ${textTertiary} truncate`}>
                                <span className={`hidden sm:inline ${isDark ? 'bg-gray-700 text-gray-400' : 'bg-slate-100 text-slate-600'} px-2 py-0.5 rounded font-bold uppercase`}>{proveedor.ruc}</span>
                                <span className="truncate max-w-[150px] sm:max-w-xs">
                                    {/* @ts-ignore */}
                                    {proveedor.razonSocial || proveedor.razon_social}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className={`${isDark ? 'text-gray-500 hover:text-gray-300 hover:bg-gray-700' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'} p-2 rounded-full transition-colors shrink-0`}>
                        <FaTimes className="w-5 h-5" />
                    </button>
                </div>

                {/* BODY */}
                <div className={`flex-1 overflow-y-auto p-4 sm:p-6 ${isDark ? 'bg-gray-900/50' : 'bg-slate-50/50'}`}>

                    {/* FORMULARIO */}
                    <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'} p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border mb-6 relative z-20`}>
                        <h3 className={`text-xs font-bold ${isDark ? 'text-gray-400' : 'text-slate-500'} uppercase tracking-wider mb-4 flex items-center gap-2`}>
                            <FaPlus className="text-indigo-500" /> Registrar Nuevo Producto
                        </h3>

                        <form onSubmit={handleVincular} className="space-y-4">
                            <div className="grid grid-cols-2 md:grid-cols-12 gap-3 sm:gap-4 items-start">

                                <div className="col-span-2 md:col-span-12">
                                    <label className={`block text-xs font-bold ${isDark ? 'text-gray-400' : 'text-slate-500'} mb-1 ml-1`}>Nombre del Producto *</label>
                                    <div className="relative">
                                        <FaTag className={`absolute top-3.5 left-3.5 ${isDark ? 'text-gray-500' : 'text-slate-400'} text-xs`} />
                                        <input
                                            type="text"
                                            placeholder="Ej: Laptop HP Pavilion 15"
                                            className={`${inputFieldClass} pl-9`}
                                            value={nombreInput}
                                            onChange={(e) => setNombreInput(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="col-span-1 md:col-span-4">
                                    <label className={`block text-xs font-bold ${isDark ? 'text-gray-400' : 'text-slate-500'} mb-1 ml-1`}>Costo (S/) *</label>
                                    <input
                                        type="number"
                                        className={inputFieldClass}
                                        placeholder="0.00"
                                        step="0.01"
                                        value={precioInput}
                                        onChange={(e) => setPrecioInput(e.target.value)}
                                    />
                                </div>

                                <div className="col-span-1 md:col-span-4">
                                    <label className={`block text-xs font-bold ${isDark ? 'text-gray-400' : 'text-slate-500'} mb-1 ml-1`}>Unidad de Medida *</label>
                                    <select
                                        className={inputFieldClass}
                                        value={unidadInput}
                                        onChange={(e) => setUnidadInput(e.target.value)}
                                    >
                                        {UNIDADES_MEDIDA.map(u => (
                                            <option key={u.valor} value={u.valor}>{u.etiqueta}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-span-2 md:col-span-4">
                                    <label className={`block text-xs font-bold ${isDark ? 'text-gray-400' : 'text-slate-500'} mb-1 ml-1`}>
                                        {['KG', 'GRAMO', 'LIBRA'].includes(unidadInput) ? 'Peso neto *' :
                                         ['LITRO', 'MILILITRO', 'GALON'].includes(unidadInput) ? 'Volumen (L) *' :
                                         'Peso por und (Kg) *'}
                                    </label>
                                    <input
                                        type="number"
                                        className={inputFieldClass}
                                        placeholder="0.00"
                                        step="0.01"
                                        value={pesoInput}
                                        onChange={(e) => setPesoInput(e.target.value)}
                                    />
                                </div>

                                <div className="col-span-2 md:col-span-12">
                                    <label className={`block text-xs font-bold ${isDark ? 'text-gray-400' : 'text-slate-500'} mb-1 ml-1`}>Imagen (Opcional)</label>

                                    {!imagenPreview ? (
                                        <label className={`flex flex-col items-center justify-center w-full h-28 sm:h-32 border-2 ${isDark ? 'border-gray-600 bg-gray-700 hover:bg-gray-600' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'} border-dashed rounded-xl cursor-pointer transition-colors group`}>
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <FaCloudUploadAlt className={`w-8 h-8 ${isDark ? 'text-gray-500 group-hover:text-indigo-400' : 'text-slate-400 group-hover:text-indigo-500'} mb-2 transition-colors`} />
                                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-slate-500'} font-medium text-center px-2`}>
                                                    <span className="hidden sm:inline">Click para subir imagen</span>
                                                    <span className="sm:hidden">Toca para subir foto</span>
                                                </p>
                                            </div>
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                        </label>
                                    ) : (
                                        <div className={`relative w-full h-40 sm:h-48 rounded-xl border ${isDark ? 'border-gray-600 bg-gray-700' : 'border-slate-200 bg-slate-50'} flex items-center justify-center overflow-hidden group`}>
                                            <img src={imagenPreview} alt="Previsualizacion" className="h-full object-contain" />
                                            <button
                                                type="button"
                                                onClick={handleRemoveImage}
                                                className="absolute top-2 right-2 bg-white/90 text-red-500 p-2 rounded-full shadow-md hover:bg-red-50 transition-all z-10"
                                                title="Quitar imagen"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    disabled={!nombreInput || !precioInput || !pesoInput}
                                    className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-3 sm:py-2.5 rounded-lg font-bold text-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-200 flex items-center justify-center gap-2 active:scale-95"
                                >
                                    <FaPlus /> Guardar Producto
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* LISTA DE PRODUCTOS */}
                    <div className="space-y-3">
                        <h3 className={`text-xs font-bold ${isDark ? 'text-gray-500' : 'text-slate-400'} uppercase tracking-wider ml-1 mb-2`}>Productos Registrados ({productos.length})</h3>

                        {loading ? (
                            <p className={`text-center ${textTertiary}`}>Cargando productos...</p>
                        ) : (
                            productos.map((prod) => (
                                <div key={prod.id} className={`${isDark ? 'bg-gray-800 border-gray-700 hover:border-indigo-600' : 'bg-white border-slate-200 hover:border-indigo-200'} p-3 rounded-xl border flex items-center justify-between gap-3 transition-all`}>
                                    <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
                                        <div className={`h-12 w-12 sm:h-16 sm:w-16 shrink-0 rounded-lg ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-slate-100 border-slate-200'} border overflow-hidden flex items-center justify-center relative`}>
                                            {prod.imagen ? (
                                                <img
                                                    src={`${API_URL}${prod.imagen}`}
                                                    alt={prod.nombre}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = 'none';
                                                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                                    }}
                                                />
                                            ) : (
                                                <FaImage className={`${isDark ? 'text-gray-500' : 'text-slate-300'} w-5 h-5 sm:w-6 sm:h-6`} />
                                            )}
                                            <FaImage className={`${isDark ? 'text-gray-500' : 'text-slate-300'} w-5 h-5 sm:w-6 sm:h-6 absolute hidden`} />
                                        </div>

                                        <div className="min-w-0">
                                            <h4 className={`font-bold ${isDark ? 'text-gray-200' : 'text-slate-800'} text-sm truncate`}>{prod.nombre}</h4>
                                            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1 text-xs">
                                                <span className={`font-mono ${isDark ? 'text-gray-400 bg-gray-700 border-gray-600' : 'text-slate-500 bg-slate-100 border-slate-200'} px-1.5 py-0.5 rounded border hidden xs:inline-block`}>
                                                    {prod.codigo}
                                                </span>
                                                <span className={`${isDark ? 'text-emerald-400 bg-emerald-900/30 border-emerald-700' : 'text-emerald-700 bg-emerald-50 border-emerald-100'} font-bold px-2 py-0.5 rounded border`}>
                                                    S/ {prod.precio_compra.toFixed(2)}
                                                </span>
                                                <span className={`${isDark ? 'text-blue-400 bg-blue-900/30 border-blue-700' : 'text-blue-700 bg-blue-50 border-blue-100'} font-bold px-2 py-0.5 rounded border flex items-center gap-1`}>
                                                    <FaWeightHanging className="w-2.5 h-2.5" />
                                                    {prod.peso_kg} kg
                                                </span>
                                                {prod.unidadMedida && (
                                                    <span className={`${isDark ? 'text-purple-400 bg-purple-900/30 border-purple-700' : 'text-purple-700 bg-purple-50 border-purple-100'} font-bold px-2 py-0.5 rounded border`}>
                                                        {prod.unidadMedida}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleDesvincular(prod.id)}
                                        className={`p-2 ${isDark ? 'text-gray-500 hover:text-red-400 hover:bg-red-900/30' : 'text-slate-300 hover:text-red-500 hover:bg-red-50'} rounded-lg transition-colors shrink-0`}
                                    >
                                        <FaTrash className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </button>
                                </div>
                            ))
                        )}

                        {!loading && productos.length === 0 && (
                            <div className={`text-center py-8 ${isDark ? 'text-gray-500 border-gray-700 bg-gray-800' : 'text-slate-400 border-slate-200 bg-slate-50'} border-2 border-dashed rounded-xl`}>
                                <p className="text-sm">No hay productos registrados.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
