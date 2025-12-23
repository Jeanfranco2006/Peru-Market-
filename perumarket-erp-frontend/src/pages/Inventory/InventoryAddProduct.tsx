import { Link } from 'react-router-dom';
import { useCallback, useEffect, useState, useRef } from 'react';
import {
  IoMdArrowBack,
  IoIosCloudUpload,
  IoIosCash,
  IoIosCube,
  IoIosBarcode,
  IoIosCheckmarkCircle,
  IoIosWarning,
  IoIosSave,
  IoMdSearch,
  IoMdLocate,
  IoIosList
} from 'react-icons/io';

import { useProductForm } from '../../hooks/inventario/useProductForm';
import { useProductOptions } from '../../hooks/inventario/useProductOptions';
import type { ProductoFormData } from '../../types/inventario/product';

interface ProductoPendiente {
  id_producto: number;
  nombre: string;
  peso_kg: number;
  precio_compra: number;
  cantidad_comprada: number;
  id_proveedor: number;
  nombre_proveedor: string;
  imagen?: string;
  sku_sugerido?: string;
}

export default function InventoryAddProduct() {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [notification, setNotification] = useState<{show: boolean; message: string; type: 'success' | 'error'}>({ show: false, message: '', type: 'success' });
  const [productosPendientes, setProductosPendientes] = useState<ProductoPendiente[]>([]);
  const [loadingProductos, setLoadingProductos] = useState(false);
  
  const [displayProveedor, setDisplayProveedor] = useState<string>('-');

  const {
    formData,
    setFormData,
    handleChange,
    handleSubmit,
    handleImageUpload,
    clearImage,
    fileInputRef,
    imagePreview,
    validationErrors,
    barcodeImageUrl,
    generateBarcode,
    generateSKU,
  } = useProductForm();

  const handleLoadError = useCallback((message: string) => {
    setNotification({ show: true, message, type: 'error' });
  }, []);

  const { categorias, almacenes, proveedores, loadingOptions } = useProductOptions(handleLoadError);

  // --- EFECTOS ---

  // 1. Forzar Unidad a KG
  useEffect(() => {
    if (formData.unidadMedida !== 'KG') {
      setFormData(prev => ({ ...prev, unidadMedida: 'KG' }));
    }
  }, [formData.unidadMedida, setFormData]);

  // 2. Cargar productos agrupados (COMPLETADOS)
  useEffect(() => {
    if (formData.almacenId) {
      setLoadingProductos(true);
      
      // Llamamos al mismo endpoint, pero el Backend ahora filtra por 'COMPLETADA'
      fetch(`http://localhost:8080/api/compras/pendientes/${formData.almacenId}`) 
        .then(res => {
          if (!res.ok) throw new Error("Error de conexión");
          return res.json();
        })
        .then((data: any[]) => {
          const adaptados = data.map(item => ({
            id_producto: item.idProducto,
            nombre: item.nombreProducto,
            peso_kg: item.pesoKg,
            precio_compra: item.precioCompra,
            cantidad_comprada: item.cantidadComprada,
            id_proveedor: item.idProveedor,
            nombre_proveedor: item.nombreProveedor,
            imagen: item.imagen,
            sku_sugerido: item.skuSugerido
          }));
          
          setProductosPendientes(adaptados);
        })
        .catch(err => {
          console.error(err);
          setProductosPendientes([]); 
        })
        .finally(() => {
          setLoadingProductos(false);
        });
    } else {
      setProductosPendientes([]);
    }
  }, [formData.almacenId]);

  // --- HANDLERS ---
  const handleProductSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const prodId = Number(e.target.value);
    const seleccionado = productosPendientes.find(p => p.id_producto === prodId);

    if (seleccionado) {
      setFormData(prev => ({
        ...prev,
        nombre: seleccionado.nombre,
        precioCompra: seleccionado.precio_compra,
        pesoKg: seleccionado.peso_kg,
        stockInicial: seleccionado.cantidad_comprada,
        proveedorId: seleccionado.id_proveedor,
        sku: generateSKU(seleccionado.nombre)
      }));
      setDisplayProveedor(seleccionado.nombre_proveedor);
    } else {
      setDisplayProveedor('-');
    }
  };

  const handleCancel = () => window.history.back();
  
  const almacenesSeguros = almacenes || [];
  const categoriasSeguras = categorias || [];

  const renderError = (f: keyof ProductoFormData) => 
    validationErrors && validationErrors[f] ? <p className="text-red-500 text-xs mt-1 font-medium">{validationErrors[f]}</p> : null;

  if (loadingOptions) {
    return <div className="flex h-screen items-center justify-center text-indigo-600 animate-pulse font-bold">Cargando sistema...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-600">
      
      {/* Notificaciones */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-xl flex items-center gap-3 text-white animate-fade-in ${notification.type === 'success' ? 'bg-indigo-600' : 'bg-red-500'}`}>
          {notification.type === 'success' ? <IoIosCheckmarkCircle className="w-6 h-6" /> : <IoIosWarning className="w-6 h-6" />}
          <span className="font-medium">{notification.message}</span>
          <button onClick={() => setNotification({ ...notification, show: false })} className="ml-2 opacity-80 hover:opacity-100">✕</button>
        </div>
      )}

      {/* Modal Cancelar */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-2">¿Cancelar recepción?</h3>
            <p className="text-sm text-slate-500 mb-6">Los datos no guardados se perderán.</p>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowCancelModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors">Volver</button>
              <button type="button" onClick={handleCancel} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors">Sí, cancelar</button>
            </div>
          </div>
        </div>
      )}

      <form id="product-form" onSubmit={handleSubmit}>
        
        {/* HEADER */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <Link to="/inventario" className="p-2 hover:bg-gray-100 rounded-full text-slate-400 transition-colors">
              <IoMdArrowBack className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Recepción de Producto</h1>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Ingreso de mercadería comprada</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button type="button" onClick={() => setShowCancelModal(true)} className="px-5 py-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">Cancelar</button>
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-md shadow-indigo-200 transition-all flex items-center gap-2">
              <IoIosSave className="w-4 h-4" /> Guardar en Inventario
            </button>
          </div>
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div className="max-w-[1600px] mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* === COLUMNA IZQUIERDA (8/12) === */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. SELECCIÓN */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="border-l-4 border-indigo-500 p-6">
                <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                  <IoIosList className="w-5 h-5 text-indigo-500" /> 1. Selección de Mercadería
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Almacén */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Almacén de Destino <span className="text-red-500">*</span></label>
                    <select 
                      name="almacenId" 
                      required 
                      value={formData.almacenId || ''} 
                      onChange={handleChange} 
                      className="w-full bg-slate-50 border border-gray-200 rounded-lg px-4 py-3 text-slate-700 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Seleccionar Almacén</option>
                      {almacenesSeguros.map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}
                    </select>
                  </div>

                  {/* Producto Agrupado */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Seleccione Producto <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select 
                        onChange={handleProductSelect} 
                        disabled={!formData.almacenId || loadingProductos}
                        defaultValue=""
                        className="w-full bg-slate-50 border border-gray-200 rounded-lg pl-4 pr-10 py-3 text-slate-700 focus:bg-white focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 appearance-none cursor-pointer"
                      >
                        <option value="" disabled>
                          {loadingProductos ? 'Buscando compras completadas...' : formData.almacenId ? '-- Seleccione producto --' : '-- Seleccione almacén primero --'}
                        </option>
                        {productosPendientes.map((p, idx) => (
                          <option key={`${p.id_producto}-${idx}`} value={p.id_producto}>
                             {p.nombre} (Cant: {p.cantidad_comprada}, Prov: {p.nombre_proveedor})
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-3.5 pointer-events-none text-gray-400">
                          <IoMdSearch className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  {/* Info Proveedores */}
                  <div className="md:col-span-2 bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase block mb-1">Proveedor(es) Referencial(es)</span>
                    <span className="text-sm font-semibold text-indigo-900 block truncate" title={displayProveedor}>
                      {displayProveedor}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. CLASIFICACIÓN */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6 flex items-center gap-2 border-b border-gray-100 pb-3">
                <IoIosCube className="w-5 h-5 text-indigo-500" /> 2. Clasificación y Ubicación
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Categoría <span className="text-red-500">*</span></label>
                  <select name="categoriaId" required value={formData.categoriaId || ''} onChange={handleChange} className="w-full bg-slate-50 border border-gray-200 rounded-lg px-4 py-3 text-slate-700 focus:ring-2 focus:ring-indigo-500">
                    <option value="">Seleccionar...</option>
                    {categoriasSeguras.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                  </select>
                  {renderError('categoriaId')}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">SKU (Auto)</label>
                  <input type="text" name="sku" required value={formData.sku} className="w-full bg-gray-100 border border-gray-200 rounded-lg px-4 py-3 text-slate-500 font-mono cursor-not-allowed" readOnly />
                </div>

                {/* --- CAMPOS RESTAURADOS --- */}
                <div className="md:col-span-2 grid grid-cols-2 gap-4">
                   <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Stock Mínimo</label>
                      <input type="number" name="stockMinimo" value={formData.stockMinimo} onChange={handleChange} className="w-full bg-slate-50 border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500" placeholder="10" />
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Stock Máximo</label>
                      <input type="number" name="stockMaximo" value={formData.stockMaximo} onChange={handleChange} className="w-full bg-slate-50 border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500" placeholder="1000" />
                   </div>
                </div>

                <div className="md:col-span-2">
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Ubicación Física</label>
                   <div className="relative">
                     <IoMdLocate className="absolute left-3 top-3.5 text-gray-400" />
                     <input type="text" name="ubicacion" value={formData.ubicacion} onChange={handleChange} className="w-full bg-slate-50 border border-gray-200 rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-indigo-500" placeholder="Ej: Pasillo A, Estante 3" />
                   </div>
                </div>

                 <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Descripción</label>
                  <textarea name="descripcion" rows={2} value={formData.descripcion} onChange={handleChange} className="w-full bg-slate-50 border border-gray-200 rounded-lg px-4 py-3 text-slate-700 focus:ring-2 focus:ring-indigo-500" placeholder="Detalles adicionales..."></textarea>
                </div>
              </div>
            </div>

            {/* 3. RESUMEN */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 opacity-90">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Resumen de Recepción</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                 <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <span className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Stock Total</span>
                    <strong className="text-indigo-600 font-bold text-lg">{formData.stockInicial || 0}</strong>
                 </div>
                 <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <span className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Peso (Kg)</span>
                    <strong className="text-slate-700 font-bold">{formData.pesoKg ? Number(formData.pesoKg).toFixed(3) : '0.00'}</strong>
                 </div>
                 <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <span className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Costo Unit.</span>
                    <strong className="text-slate-700 font-bold">S/ {formData.precioCompra ? Number(formData.precioCompra).toFixed(2) : '0.00'}</strong>
                 </div>
                 <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <span className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Unidad</span>
                    <strong className="text-slate-700 font-bold">KG</strong>
                 </div>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA (4/12) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Precio Venta */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
               <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-6 flex items-center gap-2">
                 <IoIosCash className="w-4 h-4" /> Precio Venta
               </h3>
               <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-100 text-center">
                  <label className="block text-xs font-bold text-indigo-800 uppercase mb-2">Público (S/) <span className="text-red-500">*</span></label>
                  <input type="number" step="0.01" name="precioVenta" required value={formData.precioVenta} onChange={handleChange} className="w-full bg-white border border-indigo-200 rounded-xl px-4 py-3 text-center font-black text-slate-800 text-2xl focus:ring-4 focus:ring-indigo-100 outline-none" placeholder="0.00" />
                  {renderError('precioVenta')}
               </div>
            </div>

            {/* Imagen */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Imagen</h3>
              <div className="border-2 border-dashed border-indigo-100 hover:border-indigo-300 rounded-xl p-6 text-center cursor-pointer transition-all bg-white hover:bg-indigo-50" onClick={() => fileInputRef.current?.click()}>
                {imagePreview ? (
                   <div className="relative">
                      <img src={imagePreview} alt="Preview" className="w-full h-48 object-contain rounded-md" />
                      <button type="button" onClick={(e) => { e.stopPropagation(); clearImage(); }} className="mt-2 text-xs text-red-500 hover:underline">Eliminar imagen</button>
                   </div>
                ) : (
                  <div className="py-4">
                    <IoIosCloudUpload className="w-10 h-10 text-indigo-200 mx-auto mb-2" />
                    <span className="text-indigo-600 text-sm font-bold">Subir Foto</span>
                  </div>
                )}
                <input ref={fileInputRef} accept="image/*" className="hidden" type="file" onChange={handleImageUpload} />
              </div>
            </div>

             {/* CODIGO BARRAS (BLOQUEADO) */}
             <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Código Barras</label>
                <div className="flex gap-2">
                   <input type="text" name="codigoBarras" value={formData.codigoBarras} readOnly className="w-full bg-gray-100 border border-gray-200 rounded-lg px-3 py-3 text-sm font-mono text-gray-500 cursor-not-allowed text-center tracking-widest" placeholder="Generar" />
                </div>
                
                <button type="button" onClick={generateBarcode} className="mt-3 text-[10px] text-indigo-500 hover:text-indigo-700 underline w-full text-center">Generar código</button>
                
                {formData.codigoBarras && barcodeImageUrl && (
                   <div className="mt-4 text-center border-t border-gray-50 pt-3">
                      <img src={barcodeImageUrl} alt="Barcode" className="h-12 w-auto mx-auto" />
                   </div>
                )}
             </div>
          </div>
        </div>
      </form>
    </div>
  );
}