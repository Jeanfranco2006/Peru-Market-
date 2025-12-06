import { Link } from 'react-router-dom';
import { useCallback, useEffect } from 'react'; // IMPORTANTE: useEffect añadido
import {
  IoMdArrowBack,
  IoIosCloudUpload,
  IoIosCash,
  IoIosCube,
  IoIosBarcode,
  IoIosCheckmarkCircle,
  IoIosWarning,
  IoIosSave
} from 'react-icons/io';

import { useProductForm } from '../../hooks/inventario/useProductForm';
import { useProductOptions } from '../../hooks/inventario/useProductOptions';
import type { ProductoFormData } from '../../types/inventario/product';

export default function InventoryAddProduct() {
  // 1. Hook del Formulario
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
    notification,
    setNotification,
    showCancelModal,
    setShowCancelModal,
  } = useProductForm();

  // 2. CORRECCIÓN DEL PARPADEO:
  // Memorizamos la función de error con useCallback para que no se recree en cada render
  const handleLoadError = useCallback((message: string) => {
    setNotification({ show: true, message, type: 'error' });
  }, [setNotification]);

  // 3. Hook de Opciones (Pasamos la función memorizada)
  const { categorias, almacenes, proveedores, loadingOptions } = useProductOptions(handleLoadError);

  // --- EFECTO: Forzar Unidad a KG ---
  useEffect(() => {
    setFormData(prev => {
      if (prev.unidadMedida === 'KG') return prev;
      return { ...prev, unidadMedida: 'KG' };
    });
  }, [setFormData]);

  // --- Constantes UI ---
  const selectedAlmacenName = almacenes.find(a => a.id === formData.almacenId)?.nombre || 'Por seleccionar';
  const selectedProveedorName = proveedores.find(p => p.id === formData.proveedorId)?.nombre || 'Por seleccionar';

  // --- Helpers UI ---
  const handleCancel = () => window.history.back();
  const copyBarcode = () => {
    if (formData.codigoBarras) {
      navigator.clipboard.writeText(formData.codigoBarras);
      alert('Código de barras copiado al portapapeles');
    }
  };
  const printBarcode = () => {
    if (barcodeImageUrl) {
      const w = window.open('', '_blank');
      if (w) {
        w.document.write(`<html><head><title>Imprimir Código</title><style>body{text-align:center;font-family:sans-serif}.c{margin:20px auto;max-width:400px}img{max-width:100%}@media print{.np{display:none}}</style></head><body><div class="c"><img src="${barcodeImageUrl}"/><br/><strong>${formData.nombre || 'Producto'}</strong><br/>${formData.codigoBarras}</div><div class="np"><button onclick="window.print()">Imprimir</button></div></body></html>`);
        w.document.close();
      }
    }
  };

  const renderError = (f: keyof ProductoFormData) => validationErrors[f] ? <p className="text-red-500 text-xs mt-1">{validationErrors[f]}</p> : null;

  if (loadingOptions) return <div className="p-6 text-center text-gray-500">Cargando datos de soporte...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {notification.show && (
        <div className={`fixed top-4 right-4 left-4 sm:left-auto text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-fade-in ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          {notification.type === 'success' ? <IoIosCheckmarkCircle className="w-5 h-5 shrink-0" /> : <IoIosWarning className="w-5 h-5 shrink-0" />}
          <span className="text-sm sm:text-base">{notification.message}</span>
        </div>
      )}

      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-md w-full m-auto">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-yellow-100 p-2 rounded-full shrink-0"><IoIosWarning className="w-6 h-6 text-yellow-600" /></div>
                <div><h3 className="text-lg font-semibold text-gray-900">Cancelar Creación</h3><p className="text-sm text-gray-600">¿Seguro? Se perderán los datos.</p></div>
              </div>
              <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end">
                <button onClick={() => setShowCancelModal(false)} className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Continuar</button>
                <button onClick={handleCancel} className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"><IoIosWarning className="w-4 h-4" />Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <Link to="/inventario"><button className="p-2 hover:bg-gray-100 rounded-lg"><IoMdArrowBack className="w-6 h-6 text-gray-700" /></button></Link>
          <div><h1 className="text-xl sm:text-2xl font-bold text-gray-900">Agregar Producto</h1><p className="text-sm text-gray-600">Complete la información</p></div>
        </div>
      </div>

      <form id="product-form" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6 order-1">
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><IoIosCube className="w-5 h-5" />Vista Previa</h3>
              <div className="text-center mb-4">
                {imagePreview ? (
                  <div className="relative inline-block">
                    <img src={imagePreview} alt="Vista previa" className="w-32 h-32 rounded-lg mx-auto mb-3 object-cover border-2 border-gray-300" />
                    <button type="button" onClick={clearImage} className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transform translate-x-1/2 -translate-y-1/2 shadow-sm"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                  </div>
                ) : (
                  <div className="w-32 h-32 bg-blue-50 rounded-lg mx-auto mb-3 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300"><IoIosCube className="h-8 w-8 text-blue-400" /></div>
                )}
                <p className="text-xs text-gray-500 mt-1">{imagePreview ? 'Imagen seleccionada' : 'Sin imagen'}</p>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 mb-4 active:bg-gray-50" onClick={() => fileInputRef.current?.click()}>
                <IoIosCloudUpload className="w-8 h-8 mx-auto text-gray-400 mb-2" /><p className="text-sm text-gray-600 mb-2">Toque para subir imagen</p><p className="text-xs text-gray-500">PNG, JPG hasta 5MB</p>
                <input ref={fileInputRef} accept="image/*" className="hidden" type="file" onChange={handleImageUpload} />
              </div>
              <div className="space-y-3 bg-gray-50 p-3 rounded-lg">
                <div><h4 className="font-semibold text-gray-900 truncate">{formData.nombre || 'Nuevo Producto'}</h4><p className="text-xs text-gray-500">Resumen rápido</p></div>
                <div className="flex justify-between items-center"><span className="text-xl font-bold text-gray-900">S/{formData.precioVenta.toFixed(2)}</span><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">NUEVO</span></div>
                <div className="text-xs text-gray-600 space-y-1 pt-2 border-t border-gray-200">
                  <div className="flex justify-between"><span>Stock:</span> <span className="font-medium">{formData.stockInicial}</span></div>
                  <div className="flex justify-between"><span>SKU:</span> <span className="font-medium truncate max-w-[120px]">{formData.sku || '-'}</span></div>
                  <div className="flex justify-between"><span>Almacén:</span> <span className="font-medium truncate max-w-[120px]">{selectedAlmacenName}</span></div>
                  <div className="flex justify-between"><span>Prov:</span> <span className="font-medium truncate max-w-[120px]">{selectedProveedorName}</span></div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6 order-2">
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Información General</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Producto *</label>
                  <input type="text" name="nombre" required value={formData.nombre} onChange={handleChange} className={`w-full border rounded-lg px-3 py-2 focus:ring-2 ${validationErrors.nombre ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'}`} />
                  {renderError('nombre')}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoría *</label>
                  <select name="categoriaId" required value={formData.categoriaId || ''} onChange={handleChange} className={`w-full border rounded-lg px-3 py-2 focus:ring-2 ${validationErrors.categoriaId ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'}`}>
                    <option value="">Seleccionar categoría</option>{categorias.map(cat => <option key={cat.id} value={cat.id}>{cat.nombre}</option>)}
                  </select>
                  {renderError('categoriaId')}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 flex justify-between items-center">
                    SKU *
                    <button 
                      type="button" 
                      onClick={() => setFormData((prev: ProductoFormData) => ({ ...prev, sku: generateSKU(formData.nombre) }))} 
                      className="text-xs text-blue-600 hover:text-blue-800 underline"
                    >
                      Regenerar
                    </button>
                  </label>
                  <input type="text" name="sku" required value={formData.sku} onChange={handleChange} className={`w-full border rounded-lg px-3 py-2 focus:ring-2 ${validationErrors.sku ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'}`} />
                  {renderError('sku')}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor *</label>
                  <select name="proveedorId" required value={formData.proveedorId || ''} onChange={handleChange} className={`w-full border rounded-lg px-3 py-2 text-black focus:ring-2 ${validationErrors.proveedorId ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'}`}>
                    <option value="">Seleccionar proveedor</option>{proveedores.map(prov => <option key={prov.id} value={prov.id} className="text-black">{prov.nombre}</option>)}
                  </select>
                  {renderError('proveedorId')}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <textarea name="descripcion" rows={3} value={formData.descripcion} onChange={handleChange} placeholder="Describe las características..." className={`w-full border rounded-lg px-3 py-2 focus:ring-2 ${validationErrors.descripcion ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'}`}></textarea>
                  {renderError('descripcion')}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><IoIosBarcode className="w-5 h-5" />Código de Barras</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Código *</label>
                  <input type="text" name="codigoBarras" required value={formData.codigoBarras} onChange={handleChange} placeholder="Ej: 1234567890123" className={`w-full border rounded-lg px-3 py-2 focus:ring-2 ${validationErrors.codigoBarras ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'}`} />
                  {renderError('codigoBarras')}
                </div>
                <div className="flex items-end"><button type="button" onClick={generateBarcode} className="w-full md:w-auto bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm h-[42px]">Generar Automático</button></div>
              </div>
              {formData.codigoBarras && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-center">
                    {barcodeImageUrl && <div className="mb-4 overflow-hidden"><img src={barcodeImageUrl} alt="Código de Barras" className="mx-auto max-w-full h-auto border border-gray-300 rounded" style={{ maxHeight: '80px' }} /></div>}
                    <div className="text-sm text-gray-600 font-mono tracking-widest break-all">{formData.codigoBarras}</div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 mt-3">
                    <button type="button" onClick={copyBarcode} className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors">Copiar Código</button>
                    <button type="button" onClick={printBarcode} className="flex-1 bg-gray-600 text-white py-2 px-3 rounded text-sm hover:bg-gray-700 transition-colors">Imprimir</button>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><IoIosCash className="w-5 h-5" />Precios y Stock</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Precio Venta *</label><div className="relative"><span className="absolute left-3 top-2 text-gray-500">S/</span><input type="number" step="0.01" name="precioVenta" value={formData.precioVenta} onChange={handleChange} required className={`w-full border rounded-lg pl-8 pr-3 py-2 focus:ring-2 ${validationErrors.precioVenta ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'}`} /></div>{renderError('precioVenta')}</div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Precio Compra</label><div className="relative"><span className="absolute left-3 top-2 text-gray-500">S/</span><input type="number" step="0.01" name="precioCompra" value={formData.precioCompra} onChange={handleChange} className={`w-full border rounded-lg pl-8 pr-3 py-2 focus:ring-2 ${validationErrors.precioCompra ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'}`} /></div>{renderError('precioCompra')}</div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Stock Inicial *</label><input type="number" name="stockInicial" value={formData.stockInicial} onChange={handleChange} required className={`w-full border rounded-lg px-3 py-2 focus:ring-2 ${validationErrors.stockInicial ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'}`} />{renderError('stockInicial')}</div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Mínimo / Máximo</label><div className="flex gap-2"><input type="number" name="stockMinimo" placeholder="Min" value={formData.stockMinimo} onChange={handleChange} required className="w-1/2 border rounded-lg px-2 py-2 focus:ring-2 border-gray-300 focus:border-blue-500" /><input type="number" name="stockMaximo" placeholder="Max" value={formData.stockMaximo} onChange={handleChange} className="w-1/2 border rounded-lg px-2 py-2 focus:ring-2 border-gray-300 focus:border-blue-500" /></div></div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><IoIosCube className="w-5 h-5" />Almacenamiento</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                
                {/* --- SECCIÓN MODIFICADA: UNIDAD FIJA (KG) --- */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unidad</label>
                  <input 
                    type="text" 
                    name="unidadMedida" 
                    value="KG" 
                    readOnly 
                    className="w-full border rounded-lg px-3 py-2 bg-gray-100 text-gray-500 cursor-not-allowed focus:ring-0 border-gray-300" 
                  />
                </div>
                {/* ------------------------------------------- */}

                <div><label className="block text-sm font-medium text-gray-700 mb-1">Peso (kg)</label><input type="number" step="0.001" name="pesoKg" value={formData.pesoKg} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 focus:ring-2 border-gray-300 focus:border-blue-500" /></div>
                <div className="sm:col-span-2 lg:col-span-1"><label className="block text-sm font-medium text-gray-700 mb-1">Almacén *</label><select name="almacenId" value={formData.almacenId || ''} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2 focus:ring-2 border-gray-300 focus:border-blue-500"><option value="">Seleccionar almacén</option>{almacenes.map(alm => <option key={alm.id} value={alm.id}>{alm.nombre}</option>)}</select></div>
                <div className="sm:col-span-2 lg:col-span-3"><label className="block text-sm font-medium text-gray-700 mb-1">Ubicación Física</label><input type="text" name="ubicacion" value={formData.ubicacion} onChange={handleChange} placeholder="Ej: Pasillo A, Estante 3" className="w-full border rounded-lg px-3 py-2 focus:ring-2 border-gray-300 focus:border-blue-500" /></div>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end items-center gap-3 pt-6 pb-4">
              <button type="button" onClick={() => setShowCancelModal(true)} className="w-full sm:w-auto px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium">Cancelar</button>
              <button type="submit" className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 active:bg-blue-800 transition-all font-medium shadow-sm"><IoIosSave className="w-5 h-5" />Guardar Producto</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}