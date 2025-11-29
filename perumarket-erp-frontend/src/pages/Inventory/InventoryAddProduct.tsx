import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect, useCallback } from 'react';
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

const API_BASE = 'http://localhost:8080/api';

// --- Interfaces de Datos ---
interface Option {
  id: number;
  nombre: string;
}

interface ProductoFormData {
  nombre: string;
  descripcion: string;
  sku: string;
  precioVenta: number;
  precioCompra: number;
  categoriaId: number | null;
  unidadMedida: string;
  pesoKg: number;
  almacenId: number | null;
  stockInicial: number;
  stockMinimo: number;
  stockMaximo: number;
  ubicacion: string;
  proveedorId: number | null;
  codigoBarras: string;
  imagen: string;
}

export default function InventoryAddProduct() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Estados de Datos ---
  const [formData, setFormData] = useState<ProductoFormData>({
    nombre: '', descripcion: '', sku: '', precioVenta: 0.0, precioCompra: 0.0,
    categoriaId: null, unidadMedida: 'UNIDAD', pesoKg: 0.0,
    almacenId: null, stockInicial: 0, stockMinimo: 10, stockMaximo: 1000, ubicacion: '',
    proveedorId: null, codigoBarras: '', imagen: ''
  });

  // --- Estados de Opciones y Carga ---
  const [categorias, setCategorias] = useState<Option[]>([]);
  const [almacenes, setAlmacenes] = useState<Option[]>([]);
  const [proveedores, setProveedores] = useState<Option[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  // --- Estados de UI y Notificación ---
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState<'success' | 'error'>('success');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Lista de unidades de medida (coincide con el Enum UnidadMedida en Java)
  const unidadesMedida = ['UNIDAD', 'CAJA', 'PAQUETE', 'KG', 'LITRO'];

  // Nombres para la vista previa
  const selectedAlmacenName = almacenes.find(a => a.id === formData.almacenId)?.nombre || 'Por seleccionar';
  const selectedProveedorName = proveedores.find(p => p.id === formData.proveedorId)?.nombre || 'Por seleccionar';

  // --- Funciones de Carga de Opciones (CORREGIDA LA LÓGICA ASÍNCRONA) ---
  const fetchOptions = useCallback(async () => {
    setLoadingOptions(true);
    try {
      const [catRes, almRes, provRes] = await Promise.all([
        fetch(`${API_BASE}/categorias`),
        fetch(`${API_BASE}/almacenes`),
        fetch(`${API_BASE}/proveedores`)
      ]);

      // 1. Resolver los cuerpos JSON
      const catData = catRes.ok ? await catRes.json() : [];
      const almData = almRes.ok ? await almRes.json() : [];
      const provRawData = provRes.ok ? await provRes.json() : [];

      // 2. MAPEO CORRECTO DE PROVEEDORES (razonSocial -> nombre)
      const provData = provRawData.map((p: any) => ({
        id: p.id,
        nombre: p.razonSocial
      }));

      setCategorias(catData);
      setAlmacenes(almData);
      setProveedores(provData);

    } catch (error) {
      console.error('Error al cargar opciones:', error);
      setNotificationMessage('Error al cargar opciones iniciales. Revise la consola y el backend.');
      setNotificationType('error');
      setShowNotification(true);
    } finally {
      setLoadingOptions(false);
    }
  }, []);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  // --- Handlers de Formulario ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    let newValue: string | number | null = value;

    if (e.target.type === 'number' || name.endsWith('Id') || name.startsWith('stock')) {
      newValue = name.endsWith('Id') ? parseInt(value) || null : parseFloat(value) || 0;
      if (newValue === 0 && name.endsWith('Id')) newValue = null;
    }

    setFormData(prev => ({
      ...prev,
      [name]: newValue,
    } as ProductoFormData));

    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) {
      alert('Archivo inválido o muy grande (máx 5MB).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
      setFormData(prev => ({ ...prev, imagen: 'URL_TEMPORAL_DEL_PRODUCTO' }));
    };
    reader.readAsDataURL(file);
  };

  const generateBarcode = () => {
    const base = Math.floor(100000000000 + Math.random() * 900000000000).toString();
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(base[i]) * (i % 2 === 0 ? 1 : 3);
    }
    const checksum = (10 - (sum % 10)) % 10;
    const newBarcode = base + checksum;
    setFormData(prev => ({ ...prev, codigoBarras: newBarcode }));
  };

  const copyBarcode = () => {
    if (formData.codigoBarras) {
      navigator.clipboard.writeText(formData.codigoBarras);
      alert('Código de barras copiado al portapapeles');
    }
  };

  const handleCancel = () => {
    window.history.back();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setValidationErrors({});

    try {
      const requestData: any = {
        ...formData,
        categoriaId: formData.categoriaId || undefined,
        almacenId: formData.almacenId || undefined,
        proveedorId: formData.proveedorId || undefined,
        unidadMedida: formData.unidadMedida.toUpperCase(),
        stockInicial: formData.stockInicial || 0,
        stockMinimo: formData.stockMinimo || 0,
        precioCompra: formData.precioCompra || 0.0,
        precioVenta: formData.precioVenta || 0.0,
        pesoKg: formData.pesoKg || 0.0,
      };

      const response = await fetch(`${API_BASE}/productos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorBody = await response.json();

        if (response.status === 400 && errorBody.errors) {
          setValidationErrors(errorBody.errors);
          setNotificationMessage("Error de validación. Revise los campos marcados.");
        } else {
          setNotificationMessage(errorBody.message || `Error al guardar: Código de estado ${response.status}`);
        }

        setNotificationType('error');
        setShowNotification(true);
        return;
      }

      setNotificationMessage('¡Producto guardado exitosamente!');
      setNotificationType('success');
      setShowNotification(true);

      setTimeout(() => {
        navigate('/inventario');
      }, 1500);

    } catch (error) {
      console.error('Error de red:', error);
      setNotificationMessage("Error de conexión con el servidor.");
      setNotificationType('error');
      setShowNotification(true);
    }
  };


  const renderError = (fieldName: keyof ProductoFormData) => (
    validationErrors[fieldName] ? (
      <p className="text-red-500 text-xs mt-1">{validationErrors[fieldName]}</p>
    ) : null
  );

  if (loadingOptions) return <div className="p-6 text-center text-gray-500">Cargando datos de soporte...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Notificaciones */}
      {showNotification && (
        <div className={`fixed top-4 right-4 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-fade-in ${notificationType === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          {notificationType === 'success' ? <IoIosCheckmarkCircle className="w-5 h-5" /> : <IoIosWarning className="w-5 h-5" />}
          <span>{notificationMessage}</span>
        </div>
      )}

      {/* Modal de Cancelación */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-yellow-100 p-2 rounded-full">
                  <IoIosWarning className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Cancelar Creación</h3>
                  <p className="text-sm text-gray-600">¿Estás seguro de que quieres cancelar? Se perderán todos los datos no guardados.</p>
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Continuar Editando
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <IoIosWarning className="w-4 h-4" />
                  Sí, Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Link to="/inventario">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <IoMdArrowBack className="w-5 h-5" />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Agregar Producto</h1>
            <p className="text-gray-600">Complete la información del nuevo producto</p>
          </div>
        </div>
      </div>

      <form id="product-form" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Columna lateral de Previsualización */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <IoIosCube className="w-5 h-5" />
                Vista Previa
              </h3>
              {/* Lógica de Imagen/Preview */}
              <div className="text-center mb-4">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Vista previa"
                      className="w-32 h-32 rounded-lg mx-auto mb-3 object-cover border-2 border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => { setImagePreview(null); setFormData(prev => ({ ...prev, imagen: '' })); }}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors transform translate-x-1/2 -translate-y-1/2"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="w-32 h-32 bg-blue-50 rounded-lg mx-auto mb-3 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300">
                    <IoIosCube className="h-8 w-8 text-blue-400" />
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {imagePreview ? 'Imagen seleccionada' : 'Sin imagen'}
                </p>
              </div>

              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 transition-colors mb-4"
                onClick={() => fileInputRef.current?.click()}
              >
                <IoIosCloudUpload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-2">Haz click para subir</p>
                <p className="text-xs text-gray-500">PNG, JPG hasta 5MB</p>
                <input
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  id="imagen-upload"
                  type="file"
                  onChange={handleImageUpload}
                />
              </div>

              {/* Información del producto - Valores del Estado */}
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-900">{formData.nombre || 'Nuevo Producto'}</h4>
                  <p className="text-sm text-gray-600">Información básica</p>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-gray-900">S/{formData.precioVenta.toFixed(2)}</span>
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">NUEVO</span>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>Stock Inicial: **{formData.stockInicial}** {formData.unidadMedida.toLowerCase()}</div>
                  <div>SKU: **{formData.sku || 'Por asignar'}**</div>
                  <div>Proveedor: **{selectedProveedorName}**</div>
                  <div>Almacén: **{selectedAlmacenName}**</div>
                  <div>Ubicación: **{formData.ubicacion || 'Por asignar'}**</div>
                </div>
              </div>
            </div>
          </div>

          {/* Columna de Formulario Principal */}
          <div className="lg:col-span-3 space-y-6">
            {/* SECCIÓN: Información Básica */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Información General</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Producto *</label>
                  <input
                    type="text"
                    name="nombre"
                    required
                    value={formData.nombre}
                    onChange={handleChange}
                    className={`w-full border rounded-lg px-3 py-2 focus:ring-2 ${validationErrors.nombre ? 'border-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                  />
                  {renderError('nombre')}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoría *</label>
                  <select
                    name="categoriaId"
                    required
                    value={formData.categoriaId || ''}
                    onChange={handleChange}
                    className={`w-full border rounded-lg px-3 py-2 focus:ring-2 ${validationErrors.categoriaId ? 'border-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                  >
                    <option value="">Seleccionar categoría</option>
                    {categorias.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                    ))}
                  </select>
                  {renderError('categoriaId')}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
                  <input
                    type="text"
                    name="sku"
                    required
                    value={formData.sku}
                    onChange={handleChange}
                    className={`w-full border rounded-lg px-3 py-2 focus:ring-2 ${validationErrors.sku ? 'border-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                  />
                  {renderError('sku')}
                </div>
                {/* Proveedor (Dropdown) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor *</label>
                  <select
                    name="proveedorId"
                    required
                    value={formData.proveedorId || ''}
                    onChange={handleChange}
                    // AGREGAR CLASE text-gray-900 AQUÍ TAMBIÉN:
                    className={`w-full border rounded-lg px-3 py-2 text-black focus:ring-2 ${validationErrors.proveedorId ? 'border-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}                  >
                    <option value="">Seleccionar proveedor</option>
                    {proveedores.map(prov => (
                      // CLASE FUERTE EN EL OPTION
                      <option
                        key={prov.id}
                        value={prov.id}
                        className="text-black " // <-- Asegura que el texto y fondo sean visibles
                      >
                        {prov.nombre}
                      </option>
                    ))}
                  </select>
                  {renderError('proveedorId')}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <textarea
                    name="descripcion"
                    rows={3}
                    value={formData.descripcion}
                    onChange={handleChange}
                    placeholder="Describe las características del producto..."
                    className={`w-full border rounded-lg px-3 py-2 focus:ring-2 ${validationErrors.descripcion ? 'border-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                  ></textarea>
                  {renderError('descripcion')}
                </div>
              </div>
            </div>

            {/* SECCIÓN: Código de Barras */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <IoIosBarcode className="w-5 h-5" />
                Código de Barras
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Código de Barras *</label>
                  <input
                    type="text"
                    name="codigoBarras"
                    required
                    value={formData.codigoBarras}
                    onChange={handleChange}
                    placeholder="Ej: 1234567890123"
                    className={`w-full border rounded-lg px-3 py-2 focus:ring-2 ${validationErrors.codigoBarras ? 'border-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                  />
                  {renderError('codigoBarras')}
                  <p className="text-xs text-gray-500 mt-1">Ingrese el código de barras EAN-13 (será el principal)</p>
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={generateBarcode}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                  >
                    Generar Automático
                  </button>
                </div>
              </div>

              {formData.codigoBarras && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-center">
                    <div className="flex justify-center items-center space-x-1 mb-2">
                      {/* Representación visual simple del código de barras */}
                      {Array.from({ length: 13 }).map((_, index) => (
                        <div key={index} className={`h-8 w-1 bg-black border border-gray-300`} />
                      ))}
                    </div>
                    <div className="text-sm text-gray-600 font-mono tracking-widest">
                      {formData.codigoBarras}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Vista previa del código de barras</p>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      type="button"
                      onClick={copyBarcode}
                      className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors"
                    >
                      Copiar Código
                    </button>
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="flex-1 bg-gray-600 text-white py-2 px-3 rounded text-sm hover:bg-gray-700 transition-colors"
                    >
                      Imprimir
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* SECCIÓN: Precios y Stock */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <IoIosCash className="w-5 h-5" />
                Precios y Stock
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Precio Venta (S/) *</label>
                  <input
                    type="number" step="0.01" name="precioVenta"
                    value={formData.precioVenta}
                    onChange={handleChange}
                    required
                    className={`w-full border rounded-lg px-3 py-2 focus:ring-2 ${validationErrors.precioVenta ? 'border-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                  />
                  {renderError('precioVenta')}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Precio Compra (S/)</label>
                  <input
                    type="number" step="0.01" name="precioCompra"
                    value={formData.precioCompra}
                    onChange={handleChange}
                    className={`w-full border rounded-lg px-3 py-2 focus:ring-2 ${validationErrors.precioCompra ? 'border-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                  />
                  {renderError('precioCompra')}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock Inicial *</label>
                  <input
                    type="number" name="stockInicial"
                    value={formData.stockInicial}
                    onChange={handleChange}
                    required
                    className={`w-full border rounded-lg px-3 py-2 focus:ring-2 ${validationErrors.stockInicial ? 'border-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                  />
                  {renderError('stockInicial')}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock Mínimo *</label>
                  <input
                    type="number" name="stockMinimo"
                    value={formData.stockMinimo}
                    onChange={handleChange}
                    required
                    className={`w-full border rounded-lg px-3 py-2 focus:ring-2 ${validationErrors.stockMinimo ? 'border-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                  />
                  {renderError('stockMinimo')}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock Máximo</label>
                  <input
                    type="number" name="stockMaximo"
                    value={formData.stockMaximo}
                    onChange={handleChange}
                    className={`w-full border rounded-lg px-3 py-2 focus:ring-2 ${validationErrors.stockMaximo ? 'border-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                  />
                  {renderError('stockMaximo')}
                </div>
              </div>
            </div>

            {/* SECCIÓN: Especificaciones e Inventario */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <IoIosCube className="w-5 h-5" />
                Almacenamiento y Medidas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unidad de Medida</label>
                  <select
                    name="unidadMedida"
                    value={formData.unidadMedida}
                    onChange={handleChange}
                    className={`w-full border rounded-lg px-3 py-2 focus:ring-2 ${validationErrors.unidadMedida ? 'border-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                  >
                    {unidadesMedida.map(u => (
                      <option key={u} value={u}>{u.charAt(0) + u.slice(1).toLowerCase()}</option>
                    ))}
                  </select>
                  {renderError('unidadMedida')}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Peso (kg)</label>
                  <input
                    type="number" step="0.001" name="pesoKg"
                    value={formData.pesoKg}
                    onChange={handleChange}
                    className={`w-full border rounded-lg px-3 py-2 focus:ring-2 ${validationErrors.pesoKg ? 'border-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                  />
                  {renderError('pesoKg')}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Almacén *</label>
                  <select
                    name="almacenId"
                    value={formData.almacenId || ''}
                    onChange={handleChange}
                    required
                    className={`w-full border rounded-lg px-3 py-2 focus:ring-2 ${validationErrors.almacenId ? 'border-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                  >
                    <option value="">Seleccionar almacén</option>
                    {almacenes.map(alm => (
                      <option key={alm.id} value={alm.id}>{alm.nombre}</option>
                    ))}
                  </select>
                  {renderError('almacenId')}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
                  <input
                    type="text" name="ubicacion"
                    value={formData.ubicacion}
                    onChange={handleChange}
                    placeholder="Ej: A-12-B-04"
                    className={`w-full border rounded-lg px-3 py-2 focus:ring-2 ${validationErrors.ubicacion ? 'border-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                  />
                  {renderError('ubicacion')}
                </div>
              </div>
            </div>

            <div className="flex justify-end items-center pt-6">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCancelModal(true)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 transform active:scale-[0.98]"
                >
                  <IoIosSave className="w-5 h-5" />
                  Guardar Producto
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}