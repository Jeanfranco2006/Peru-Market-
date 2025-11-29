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
  const [uploadedImageFile, setUploadedImageFile] = useState<File | null>(null);

  // Lista de unidades de medida (coincide con el Enum UnidadMedida en Java)
  const unidadesMedida = ['UNIDAD', 'CAJA', 'PAQUETE', 'KG', 'LITRO'];

  // Nombres para la vista previa
  const selectedAlmacenName = almacenes.find(a => a.id === formData.almacenId)?.nombre || 'Por seleccionar';
  const selectedProveedorName = proveedores.find(p => p.id === formData.proveedorId)?.nombre || 'Por seleccionar';

  // URL del código de barras generado
  const [barcodeImageUrl, setBarcodeImageUrl] = useState<string>('');

  // --- Funciones de Carga de Opciones ---
  const fetchOptions = useCallback(async () => {
    setLoadingOptions(true);
    try {
      const [catRes, almRes, provRes] = await Promise.all([
        fetch(`${API_BASE}/categorias`),
        fetch(`${API_BASE}/almacenes`),
        fetch(`${API_BASE}/proveedores`)
      ]);

      const catData = catRes.ok ? await catRes.json() : [];
      const almData = almRes.ok ? await almRes.json() : [];
      const provRawData = provRes.ok ? await provRes.json() : [];

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

  // --- Generar SKU automáticamente basado en el nombre ---
  const generateSKU = (productName: string): string => {
    if (!productName.trim()) return '';
    
    // Limpiar y formatear el nombre
    const cleanName = productName
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remover acentos
      .toUpperCase()
      .replace(/[^A-Z0-9\s]/g, "") // Remover caracteres especiales
      .trim();
    
    // Tomar las primeras 3-4 letras de cada palabra (máximo 3 palabras)
    const words = cleanName.split(/\s+/).slice(0, 3);
    const skuParts = words.map(word => word.substring(0, 4));
    
    // Unir con guiones y agregar timestamp para unicidad
    const baseSKU = skuParts.join('-');
    const timestamp = Date.now().toString().slice(-4);
    
    return `${baseSKU}-${timestamp}`;
  };

  // --- Actualizar SKU cuando cambie el nombre ---
  useEffect(() => {
    if (formData.nombre && !formData.sku) {
      const newSKU = generateSKU(formData.nombre);
      setFormData(prev => ({ ...prev, sku: newSKU }));
    }
  }, [formData.nombre]);

  // --- Actualizar imagen del código de barras cuando cambie el código ---
  useEffect(() => {
    if (formData.codigoBarras && formData.codigoBarras.length >= 12) {
      const barcodeUrl = `https://barcode.tec-it.com/barcode.ashx?data=${encodeURIComponent(formData.codigoBarras)}&code=EAN13&translate-esc=on&dpi=96`;
      setBarcodeImageUrl(barcodeUrl);
    } else {
      setBarcodeImageUrl('');
    }
  }, [formData.codigoBarras]);

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

  // --- Función para guardar la imagen en la carpeta pública ---
// --- Función para guardar la imagen en la carpeta pública ---
const saveImageToPublicFolder = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('image', file);
    
    // Generar un nombre único para la imagen
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const fileName = `producto_${timestamp}_${randomString}.${fileExtension}`;
    formData.append('fileName', fileName);

    console.log('Enviando imagen al backend:', fileName);

    fetch(`${API_BASE}/productos/upload-image`, {
      method: 'POST',
      body: formData,
    })
    .then(async response => {
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Imagen subida exitosamente:', data);
      // El backend devuelve la ruta relativa, por ejemplo: "/img/productos/producto_123456_abc123.jpg"
      resolve(data.imagePath);
    })
    .catch(error => {
      console.error('Error al guardar imagen:', error);
      reject(error);
    });
  });
};
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) {
      alert('Archivo inválido o muy grande (máx 5MB).');
      return;
    }

    // Guardar el archivo para enviarlo después con el formulario
    setUploadedImageFile(file);

    // Mostrar preview inmediatamente
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Generador de código de barras Code-128 (formato numérico simple para scanners)
  const generateBarcode = () => {
    // Generar código numérico de 12 dígitos (compatible con EAN-13)
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const baseCode = timestamp + random;
    
    setFormData(prev => ({ ...prev, codigoBarras: baseCode }));
  };

  const copyBarcode = () => {
    if (formData.codigoBarras) {
      navigator.clipboard.writeText(formData.codigoBarras);
      alert('Código de barras copiado al portapapeles');
    }
  };

  const printBarcode = () => {
    if (barcodeImageUrl) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Imprimir Código de Barras</title>
              <style>
                body { 
                  margin: 0; 
                  padding: 20px; 
                  font-family: Arial, sans-serif; 
                  text-align: center;
                }
                .barcode-container { 
                  margin: 20px auto; 
                  max-width: 400px;
                }
                .barcode-info {
                  margin-top: 10px;
                  font-size: 14px;
                  color: #333;
                }
                @media print {
                  body { padding: 0; }
                  .no-print { display: none; }
                }
              </style>
            </head>
            <body>
              <div class="barcode-container">
                <img src="${barcodeImageUrl}" alt="Código de Barras" style="max-width: 100%; height: auto;" />
                <div class="barcode-info">
                  <strong>${formData.nombre || 'Producto'}</strong><br/>
                  Código: ${formData.codigoBarras}<br/>
                  SKU: ${formData.sku || 'N/A'}
                </div>
              </div>
              <div class="no-print" style="margin-top: 20px;">
                <button onclick="window.print()">Imprimir</button>
                <button onclick="window.close()">Cerrar</button>
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
  };

  const handleCancel = () => {
    window.history.back();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setValidationErrors({});

    try {
      // Primero subir la imagen si existe
      let imagenPath = '';
      if (uploadedImageFile) {
        try {
          imagenPath = await saveImageToPublicFolder(uploadedImageFile);
        } catch (error) {
          console.error('Error al subir imagen:', error);
          setNotificationMessage("Error al subir la imagen. El producto se guardará sin imagen.");
          setNotificationType('error');
          setShowNotification(true);
        }
      }

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
        imagen: imagenPath || '', // Usar la ruta de la imagen guardada
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
                      onClick={() => { 
                        setImagePreview(null); 
                        setUploadedImageFile(null);
                        setFormData(prev => ({ ...prev, imagen: '' })); 
                      }}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SKU *
                    <button
                      type="button"
                      onClick={() => {
                        const newSKU = generateSKU(formData.nombre);
                        setFormData(prev => ({ ...prev, sku: newSKU }));
                      }}
                      className="ml-2 text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded transition-colors"
                    >
                      Regenerar
                    </button>
                  </label>
                  <input
                    type="text"
                    name="sku"
                    required
                    value={formData.sku}
                    onChange={handleChange}
                    className={`w-full border rounded-lg px-3 py-2 focus:ring-2 ${validationErrors.sku ? 'border-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                  />
                  {renderError('sku')}
                  <p className="text-xs text-gray-500 mt-1">SKU generado automáticamente desde el nombre</p>
                </div>
                {/* Proveedor (Dropdown) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor *</label>
                  <select
                    name="proveedorId"
                    required
                    value={formData.proveedorId || ''}
                    onChange={handleChange}
                    className={`w-full border rounded-lg px-3 py-2 text-black focus:ring-2 ${validationErrors.proveedorId ? 'border-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                  >
                    <option value="">Seleccionar proveedor</option>
                    {proveedores.map(prov => (
                      <option
                        key={prov.id}
                        value={prov.id}
                        className="text-black"
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
                  <p className="text-xs text-gray-500 mt-1">Ingrese el código de barras EAN-13 (12-13 dígitos)</p>
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
                    {/* Imagen del código de barras generado por TEC-IT */}
                    {barcodeImageUrl && (
                      <div className="mb-4">
                        <img 
                          src={barcodeImageUrl} 
                          alt="Código de Barras EAN-13" 
                          className="mx-auto max-w-full h-auto border border-gray-300 rounded"
                          style={{ maxHeight: '100px' }}
                        />
                      </div>
                    )}
                    <div className="text-sm text-gray-600 font-mono tracking-widest mb-2">
                      {formData.codigoBarras}
                    </div>
                    <p className="text-xs text-gray-500 mb-4">Código de barras EAN-13 generado</p>
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
                      onClick={printBarcode}
                      className="flex-1 bg-gray-600 text-white py-2 px-3 rounded text-sm hover:bg-gray-700 transition-colors"
                    >
                      Imprimir
                    </button>
                  </div>
                  <div className="mt-3 text-xs text-gray-500 text-center">
                    <p>Generado con <a href="https://www.tec-it.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">TEC-IT Barcode Generator</a></p>
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