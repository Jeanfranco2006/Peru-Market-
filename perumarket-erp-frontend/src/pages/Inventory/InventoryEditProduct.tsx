import React, { useState, useRef, useEffect } from "react";
import type { ChangeEvent, DragEvent, FormEvent } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import {
    IoMdArrowRoundBack, IoIosSave, IoIosCube, IoIosClock, IoIosCash,
    IoIosArchive, IoIosBarcode, IoIosCloudUpload, IoIosCheckmarkCircle,
    IoIosWarning, IoIosImage
} from "react-icons/io";

// Definición del endpoint de categorías
const API_BASE = 'http://localhost:8080/api';
const API_CATEGORIAS = '/categorias';

// --- INTERFACES DE TIPADO ---
interface CategoriaOption { id: number; nombre: string; }
interface Movimiento {
    id: number; tipoMovimiento: 'ENTRADA' | 'SALIDA' | string; cantidad: number;
    stockAnterior: number; stockNuevo: number; motivo: string;
    nombreAlmacen: string; fechaMovimiento: string; idUsuario: number;
}
interface ProductState {
    id: number | null; nombre: string; descripcion: string; sku: string;
    precioVenta: number; precioCompra: number; unidadMedida: string;
    pesoKg: number; imagen: string; estado: string;
    stockActual: number; stockMinimo: number; stockMaximo: number;
    ubicacionPrincipal: string; codigoBarrasPrincipal: string;
    categoriaNombre: string; almacenNombre: string; proveedorRazonSocial: string;
    fechaActualizacion: string | null;
    categoriaId: string | null; almacenId: number; proveedorId: number; requiereCodigoBarras: boolean;
}
const initialProductState: ProductState = {
    id: null, nombre: '', descripcion: '', sku: '',
    precioVenta: 0.00, precioCompra: 0.00, unidadMedida: 'UNIDAD',
    pesoKg: 0.000, imagen: '', estado: 'ACTIVO',
    stockActual: 0, stockMinimo: 10, stockMaximo: 1000,
    ubicacionPrincipal: '', codigoBarrasPrincipal: '',
    categoriaNombre: '', almacenNombre: '', proveedorRazonSocial: '',
    fechaActualizacion: null,
    categoriaId: "", // INICIALIZADO COMO VACIO PARA EL SELECT
    almacenId: 1, proveedorId: 1, requiereCodigoBarras: true,
};

const initialOptions = { categorias: [] as CategoriaOption[], }

// Componente para mostrar la imagen del producto
const ProductImage = ({ imagen, nombre, className = "" }: { imagen: string, nombre: string, className?: string }) => {
    const [imageError, setImageError] = useState(false);

    // Si no hay imagen o hay error, mostrar placeholder
    if (!imagen || imageError) {
        return (
            <div className={`bg-blue-50 rounded-lg flex flex-col items-center justify-center text-blue-400 ${className}`}>
                <IoIosImage className="w-8 h-8 mb-2" />
                <span className="text-xs text-blue-600">Sin imagen</span>
            </div>
        );
    }

    // Construir la URL completa de la imagen INCLUYENDO /api
    const getImageUrl = (imagePath: string) => {
        // --- CORRECCIÓN 1: Soporte para Base64 (Vista previa) ---
        if (imagePath.startsWith('data:')) {
            return imagePath;
        }
        // --------------------------------------------------------
        if (imagePath.startsWith('http')) {
            return imagePath;
        }
        // Si la ruta ya incluye /api, usarla directamente
        if (imagePath.startsWith('/api/')) {
            return `http://localhost:8080${imagePath}`;
        }
        // Si no incluye /api, agregarlo
        const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
        return `http://localhost:8080/api${cleanPath}`;
    };

    return (
        <img
            src={getImageUrl(imagen)}
            alt={nombre}
            className={`object-cover rounded-lg ${className}`}
            onError={() => setImageError(true)}
            onLoad={() => setImageError(false)}
        />
    );
};

const InventoryEditProduct: React.FC = () => {
    const { id } = useParams();
    const productId = Number(id);
    const navigate = useNavigate();

    const [product, setProduct] = useState<ProductState>(initialProductState);
    const [options, setOptions] = useState(initialOptions);
    const [historial, setHistorial] = useState<Movimiento[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [uploadedImageFile, setUploadedImageFile] = useState<File | null>(null);
    const [barcodeImageUrl, setBarcodeImageUrl] = useState<string>('');

    const [showNotification, setShowNotification] = useState(false);
    const [showDeactivateModal, setShowDeactivateModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- Función para guardar la imagen en el backend ---
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
                    resolve(data.imagePath);
                })
                .catch(error => {
                    console.error('Error al guardar imagen:', error);
                    reject(error);
                });
        });
    };

    // Función para cargar el historial de movimientos
    const fetchHistorial = async (pId: number) => {
        try {
            const historyResponse = await api.get(`/productos/${pId}/movimientos`);
            setHistorial(historyResponse.data);
        } catch (err: any) {
            console.error("Error al cargar el historial:", err);
        }
    };

    // --- LÓGICA DE CARGA INICIAL (GET) ---
    useEffect(() => {
        if (isNaN(productId) || productId === 0) {
            setError('ID de producto no válido.');
            setLoading(false);
            return;
        }

        const fetchDependenciesAndProduct = async () => {
            try {
                // 1. CARGA REAL DE CATEGORÍAS
                const categoriasResponse = await api.get(API_CATEGORIAS);
                const categoriaData: CategoriaOption[] = categoriasResponse.data;
                setOptions(prev => ({ ...prev, categorias: categoriaData }));

                // 2. Obtener Producto por ID
                const productResponse = await api.get(`/productos/${productId}`);
                const data = productResponse.data;

                // --- CORRECCIÓN 2: Detección Robusta de Categoría ---
                let categoriaIdDetectado = "";
                if (data.categoriaId) {
                    categoriaIdDetectado = String(data.categoriaId);
                } else if (data.categoria && data.categoria.id) {
                    categoriaIdDetectado = String(data.categoria.id);
                } else if (data.categoriaNombre) {
                    // Intento de rescate por nombre
                    const found = categoriaData.find(c => c.nombre === data.categoriaNombre);
                    if (found) categoriaIdDetectado = String(found.id);
                }
                // ---------------------------------------------------

                setProduct(prev => ({
                    ...prev, ...data,
                    id: data.id,
                    precioVenta: parseFloat(data.precioVenta || 0),
                    precioCompra: parseFloat(data.precioCompra || 0),
                    pesoKg: parseFloat(data.pesoKg || 0),
                    stockMinimo: data.stockMinimo || 0,
                    stockMaximo: data.stockMaximo || 0,
                    stockActual: data.stockActual || 0,
                    imagen: data.imagen || '',
                    almacenId: 1, proveedorId: 1,

                    // Asignamos el ID corregido
                    categoriaId: categoriaIdDetectado,
                }));

                // Configurar preview de imagen
                if (data.imagen) {
                    const imageUrl = data.imagen.startsWith('/api/')
                        ? `http://localhost:8080${data.imagen}`
                        : `http://localhost:8080/api${data.imagen.startsWith('/') ? '' : '/'}${data.imagen}`;
                    setImagePreview(imageUrl);
                } else {
                    setImagePreview(null);
                }

                // Configurar código de barras
                if (data.codigoBarrasPrincipal) {
                    const barcodeUrl = `https://barcode.tec-it.com/barcode.ashx?data=${encodeURIComponent(data.codigoBarrasPrincipal)}&code=EAN13&translate-esc=on&dpi=96`;
                    setBarcodeImageUrl(barcodeUrl);
                }

                fetchHistorial(productId);

            } catch (err: any) {
                console.error("Error al cargar datos:", err.response?.data || err);
                const message = err.response?.data?.message || 'Error al conectar con la API para cargar el producto.';
                setError(message);
            } finally {
                setLoading(false);
            }
        };
        fetchDependenciesAndProduct();
    }, [productId]);

    // Manejador de cambios en el formulario
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        const isCheckbox = (e.target as HTMLInputElement).type === 'checkbox';
        const checked = isCheckbox ? (e.target as HTMLInputElement).checked : undefined;

        const isCategoryId = name === 'categoriaId';

        let parsedValue: any;

        if (isCategoryId) {
            parsedValue = value;
        } else if ((name.includes('precio') || name.includes('peso') || name.includes('stock')) && value !== '') {
            parsedValue = parseFloat(value);
        } else if (name.includes('Id')) {
            parsedValue = parseInt(value);
        } else {
            parsedValue = value;
        }

        setProduct(prev => ({
            ...prev,
            [name]: isCheckbox ? checked : parsedValue,
        }));
    };

    // --- LÓGICA DE EDICIÓN (BOTÓN GUARDAR) ---
    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        // Validación ajustada para string vacío
        if (!product.categoriaId) {
            alert("Por favor, selecciona una categoría.");
            return;
        }

        const categoriaIdToSend = Number(product.categoriaId);

        try {
            // Primero subir la imagen si existe
            let imagenPath = product.imagen;
            if (uploadedImageFile) {
                try {
                    imagenPath = await saveImageToPublicFolder(uploadedImageFile);
                } catch (error) {
                    console.error('Error al subir imagen:', error);
                    alert("Error al subir la imagen. El producto se guardará con la imagen anterior.");
                }
            }

            const productRequestData = {
                nombre: product.nombre,
                descripcion: product.descripcion,
                sku: product.sku,
                precioVenta: product.precioVenta,
                precioCompra: product.precioCompra,
                unidadMedida: product.unidadMedida,
                pesoKg: product.pesoKg,
                imagen: imagenPath,
                requiereCodigoBarras: product.requiereCodigoBarras,
                categoriaId: categoriaIdToSend,
                almacenId: product.almacenId,
                proveedorId: product.proveedorId,
                stockInicial: product.stockActual,
                stockMinimo: product.stockMinimo,
                stockMaximo: product.stockMaximo,
                ubicacion: product.ubicacionPrincipal,
                codigoBarras: product.codigoBarrasPrincipal,
            };

            await api.put(`/productos/${productId}`, productRequestData);

            const productResponse = await api.get(`/productos/${productId}`);
            setProduct(prev => ({ ...prev, ...productResponse.data }));
            fetchHistorial(productId);

            setShowNotification(true);
            setTimeout(() => {
                setShowNotification(false);
                navigate('/inventario');
            }, 1500);

        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Error desconocido al guardar. Revise el backend.';
            console.error('Error al guardar:', err.response?.data || err);
            alert(`Error al guardar: ${errorMessage}`);
        }
    };

    // --- LÓGICA DE ACTIVAR / DESACTIVAR (TOGGLE) ---
    const handleToggleProductState = async (newState: 'ACTIVO' | 'INACTIVO') => {
        try {
            const response = await api.patch(`/productos/${productId}/estado`, newState, {
                headers: { 'Content-Type': 'text/plain' }
            });

            setShowDeactivateModal(false);
            alert(`Producto ${newState === 'ACTIVO' ? 'activado' : 'desactivado'} exitosamente.`);

            setProduct(prev => ({ ...prev, ...response.data }));
            fetchHistorial(productId);

            if (newState === 'INACTIVO') {
                navigate('/inventario');
            }

        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Error al cambiar el estado.';
            console.error('Error al cambiar estado:', err.response?.data || err);
            alert(`Error: ${errorMessage}`);
            setShowDeactivateModal(false);
        }
    };

    const handleOpenToggleModal = () => {
        setShowDeactivateModal(true);
    };

    const handleCancel = () => { navigate('/inventario'); };

    // FUNCIONES AUXILIARES DE IMAGEN Y DRAG/DROP
    const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Por favor, selecciona un archivo de imagen válido');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert('La imagen no debe superar los 5MB');
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

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        const input = fileInputRef.current;

        if (file && input) {
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            input.files = dataTransfer.files;

            const changeEvent = new Event('change', { bubbles: true });
            input.dispatchEvent(changeEvent);
        }
    };

    const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    // Función para imprimir código de barras
    const printBarcode = () => {
        if (barcodeImageUrl) {
            const printWindow = window.open('', '_blank');
            if (printWindow) {
                printWindow.document.write(`
                    <html>
                        <head>
                            <title>Imprimir Código de Barras - ${product.nombre}</title>
                            <style>
                                body { 
                                    margin: 0; 
                                    padding: 20px; 
                                    font-family: Arial, sans-serif; 
                                    text-align: center;
                                    background: white;
                                }
                                .barcode-container { 
                                    margin: 20px auto; 
                                    max-width: 400px;
                                    border: 1px solid #ddd;
                                    padding: 20px;
                                    border-radius: 8px;
                                }
                                .barcode-info {
                                    margin-top: 15px;
                                    font-size: 14px;
                                    color: #333;
                                    line-height: 1.4;
                                }
                                .product-name {
                                    font-weight: bold;
                                    font-size: 16px;
                                    margin-bottom: 5px;
                                }
                                @media print {
                                    body { padding: 0; }
                                    .no-print { display: none; }
                                    .barcode-container { 
                                        border: none;
                                        padding: 10px;
                                    }
                                }
                            </style>
                        </head>
                        <body>
                            <div class="barcode-container">
                                <img src="${barcodeImageUrl}" alt="Código de Barras EAN-13" style="max-width: 100%; height: auto;" />
                                <div class="barcode-info">
                                    <div class="product-name">${product.nombre}</div>
                                    <div><strong>Código:</strong> ${product.codigoBarrasPrincipal}</div>
                                    <div><strong>SKU:</strong> ${product.sku}</div>
                                    <div><strong>Formato:</strong> EAN-13</div>
                                </div>
                            </div>
                            <div class="no-print" style="margin-top: 20px;">
                                <button onclick="window.print()" style="padding: 10px 20px; margin: 5px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Imprimir</button>
                                <button onclick="window.close()" style="padding: 10px 20px; margin: 5px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">Cerrar</button>
                            </div>
                        </body>
                    </html>
                `);
                printWindow.document.close();
            }
        }
    };

    // Texto y colores dinámicos del botón
    const actionText = product.estado === 'ACTIVO' ? 'Desactivar Producto' : 'Activar Producto';
    const actionButtonColor = product.estado === 'ACTIVO' ? 'bg-red-600' : 'bg-green-600';
    const actionState = product.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';

    // --- Manejo de Carga y Error ---
    if (loading) {
        return <div className="min-h-screen bg-gray-50 p-6 text-center text-gray-700">Cargando producto...</div>;
    }

    if (error) {
        return <div className="min-h-screen bg-gray-50 p-6 text-center text-red-600">Error al cargar: {error}</div>;
    }

    // --- RENDERIZADO DEL COMPONENTE ---
    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6">

            {/* Notificación de éxito */}
            {showNotification && (
                <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-fade-in">
                    <IoIosCheckmarkCircle className="w-5 h-5" />
                    <span>¡Producto actualizado exitosamente!</span>
                </div>
            )}

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
                                    <h3 className="text-lg font-semibold text-gray-900">Cancelar Edición</h3>
                                    <p className="text-sm text-gray-600">¿Estás seguro de que quieres cancelar? Se perderán todos los cambios no guardados.</p>
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

            {/* Modal de Desactivar / Activar */}
            {showDeactivateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full">
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`p-2 rounded-full ${actionState === 'INACTIVO' ? 'bg-red-100' : 'bg-green-100'}`}>
                                    <IoIosWarning className={`w-6 h-6 ${actionState === 'INACTIVO' ? 'text-red-600' : 'text-green-600'}`} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{actionText}</h3>
                                    <p className="text-sm text-gray-600">
                                        ¿Estás seguro de que quieres {actionState === 'INACTIVO' ? 'desactivar' : 'activar'} este producto?
                                    </p>
                                </div>
                            </div>

                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                                <p className="text-sm text-yellow-800">
                                    <strong>Nota:</strong> Al {actionState === 'INACTIVO' ? 'desactivar, no estará disponible para ventas.' : 'activar, estará disponible para ventas y pedidos.'}
                                </p>
                            </div>

                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => setShowDeactivateModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={() => handleToggleProductState(actionState)}
                                    className={`px-4 py-2 text-white rounded-lg hover:opacity-90 transition-colors flex items-center gap-2 ${actionButtonColor}`}
                                >
                                    <IoIosWarning className="w-4 h-4" />
                                    Sí, {actionState === 'INACTIVO' ? 'Desactivar' : 'Activar'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <Link to="/inventario" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <IoMdArrowRoundBack className="h-5 w-5 text-gray-700" />
                    </Link>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Editar Producto #{product.id}</h1>
                        <p className="text-sm sm:text-base text-gray-600">Modifique la información del producto</p>
                    </div>
                </div>
            </div>

            <form id="edit-product-form" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Columna Lateral (Vista Previa y Historial) */}
                    <div className="lg:col-span-1 space-y-6 sm:order-last lg:order-first">
                        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><IoIosCube className="h-5 w-5" />Vista Previa</h3>

                            {/* CONTENIDO DE IMAGEN Y PREVIEW */}
                            <div className="text-center mb-4">
                                {imagePreview ? (
                                    <div className="relative">
                                        <ProductImage
                                            // --- CORRECCIÓN 3: Usar imagePreview ---
                                            imagen={imagePreview || ''}
                                            nombre={product.nombre}
                                            className="w-32 h-32 rounded-lg mx-auto mb-3 object-cover border-2 border-gray-300"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setImagePreview(null);
                                                setUploadedImageFile(null);
                                                setProduct(prev => ({ ...prev, imagen: '' }));
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
                                    {imagePreview ? 'Imagen actual' : 'Sin imagen'}
                                </p>
                            </div>
                            <div
                                className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 transition-colors mb-4"
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <IoIosCloudUpload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                                <p className="text-sm text-gray-600 mb-2">Arrastra o haz click para cambiar</p>
                                <p className="text-xs text-gray-500">PNG, JPG hasta 5MB</p>
                                <input
                                    ref={fileInputRef}
                                    accept="image/*"
                                    className="hidden"
                                    id="imagen-upload"
                                    type="file"
                                    onChange={handleImageUpload}
                                />
                                <label
                                    htmlFor="imagen-upload"
                                    className="mt-2 bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-200 cursor-pointer inline-block"
                                >
                                    Cambiar imagen
                                </label>
                            </div>
                            {/* Información del Producto */}
                            <div className="space-y-3">
                                <div>
                                    <h4 className="font-semibold text-gray-900">{product.nombre}</h4>
                                    <p className="text-sm text-gray-600">{product.categoriaNombre}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-2xl font-bold text-gray-900">S/{product.precioVenta.toFixed(2)}</span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.estado === 'ACTIVO' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{product.estado}</span>
                                </div>
                                <div className="text-sm text-gray-600 space-y-1">
                                    <div>Stock: {product.stockActual} unidades</div>
                                    <div>SKU: {product.sku}</div>
                                    <div>Proveedor: {product.proveedorRazonSocial || 'N/A'}</div>
                                    <div>Almacén: {product.almacenNombre || 'N/A'}</div>
                                    <div>Ubicación: {product.ubicacionPrincipal || 'N/A'}</div>
                                </div>
                            </div>
                        </div>

                        {/* Bloque de Historial de Cambios */}
                        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <IoIosClock className="h-5 w-5" />
                                Historial de Cambios
                            </h3>
                            <div className="space-y-3 max-h-40 overflow-y-auto">
                                {historial.length > 0 ? (
                                    historial.map((mov) => (
                                        <div key={mov.id} className={`border-l-4 ${mov.tipoMovimiento === 'ENTRADA' ? 'border-green-500' : 'border-red-500'} pl-3 py-1`}>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-medium text-sm">
                                                        {mov.tipoMovimiento === 'ENTRADA' ? 'Ingreso de Stock' : mov.tipoMovimiento === 'SALIDA' ? 'Salida de Stock' : mov.tipoMovimiento}
                                                    </p>
                                                    <p className="text-xs text-gray-600">
                                                        {mov.cantidad} unid. ({mov.stockAnterior} → {mov.stockNuevo})
                                                    </p>
                                                </div>
                                                <span className="text-xs text-gray-500 whitespace-nowrap">
                                                    {new Date(mov.fechaMovimiento).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">Motivo: {mov.motivo}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500">Última actualización: {product.fechaActualizacion ? new Date(product.fechaActualizacion).toLocaleString() : 'N/A'}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Columna Principal del Formulario */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-6">
                            <h3 className="text-lg font-semibold mb-4">Información del Producto</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                {/* Nombre del Producto */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Producto</label>
                                    <input className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" type="text" value={product.nombre || ''} onChange={handleChange} name="nombre" />
                                </div>
                                {/* Categoría ID */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                                    <select
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                                        name="categoriaId"
                                        // --- CORRECCIÓN 4: Value seguro ---
                                        value={product.categoriaId || ""}
                                        onChange={handleChange}
                                    >
                                        <option value="" disabled>Seleccionar categoría</option>
                                        {options.categorias.map(cat => (
                                            <option key={cat.id} value={String(cat.id)}>{cat.nombre}</option>
                                        ))}
                                    </select>
                                </div>
                                {/* SKU */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                                    <input
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 cursor-default text-gray-700 mb-1"
                                        type="text"
                                        value={product.sku || ''}
                                        readOnly
                                        name="sku"
                                    />
                                </div>
                                {/* Código de Barras (SOLO LECTURA) */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Código de Barras</label>
                                    <div className="flex gap-2">
                                        <input
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 cursor-default"
                                            type="text"
                                            value={product.codigoBarrasPrincipal}
                                            readOnly
                                            name="codigoBarrasPrincipal"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Vista Previa del Código de Barras */}
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2"><IoIosBarcode className="w-4 h-4" />Vista Previa del Código de Barras</h4>
                                <div className="bg-white p-4 rounded border">
                                    {/* Imagen del código de barras generado por TEC-IT */}
                                    {barcodeImageUrl ? (
                                        <div className="mb-3">
                                            <img
                                                src={barcodeImageUrl}
                                                alt="Código de Barras EAN-13"
                                                className="mx-auto max-w-full h-auto border border-gray-300 rounded"
                                                style={{ maxHeight: '80px' }}
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex justify-center items-center space-x-1 mb-2">
                                            {/* Representación de barras simplificada como fallback */}
                                            {Array.from({ length: 13 }).map((_, index) => (
                                                <div
                                                    key={index}
                                                    className={`h-12 w-1 ${index % 2 === 0 ? 'bg-black' : 'bg-white'} border border-gray-300`}
                                                />
                                            ))}
                                        </div>
                                    )}
                                    <div className="text-center font-mono text-sm tracking-widest bg-white py-2">
                                        {product.codigoBarrasPrincipal}
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-3">
                                    <button
                                        type="button"
                                        onClick={() => navigator.clipboard.writeText(product.codigoBarrasPrincipal)}
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
                            </div>

                            {/* 🚀 CAMPO DE DESCRIPCIÓN */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción del Producto</label>
                                <textarea
                                    name="descripcion"
                                    value={product.descripcion || ''}
                                    onChange={handleChange as any}
                                    rows={3}
                                    placeholder="Ingrese detalles, especificaciones o notas sobre el producto."
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            {/* FIN CAMPO DESCRIPCIÓN */}

                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><IoIosCash className="h-5 w-5" />Precios y Stock</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                {/* Precio Venta */}
                                <div><label className="block text-sm font-medium text-gray-700 mb-1">Precio Venta (S/)</label><input className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" type="number" value={product.precioVenta} onChange={handleChange} step={0.01} name="precioVenta" /></div>
                                {/* Precio Compra */}
                                <div><label className="block text-sm font-medium text-gray-700 mb-1">Precio Compra (S/)</label><input className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" type="number" value={product.precioCompra} onChange={handleChange} step={0.01} name="precioCompra" /></div>
                                {/* Stock Mínimo */}
                                <div><label className="block text-sm font-medium text-gray-700 mb-1">Stock Mínimo</label><input className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" type="number" value={product.stockMinimo} onChange={handleChange} name="stockMinimo" /></div>
                                {/* Stock Máximo */}
                                <div><label className="block text-sm font-medium text-gray-700 mb-1">Stock Máximo</label><input className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" type="number" value={product.stockMaximo} onChange={handleChange} name="stockMaximo" /></div>
                            </div>

                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><IoIosArchive className="h-5 w-5" />Especificaciones</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {/* Unidad de Medida */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Unidad de Medida</label>
                                    <select
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                                        name="unidadMedida"
                                        value={product.unidadMedida ?? ''}
                                        onChange={handleChange}
                                    >
                                        <option value="UNIDAD">Unidad</option><option value="CAJA">Caja</option><option value="PAQUETE">Paquete</option><option value="KG">Kg (Kilogramo)</option><option value="LITRO">Litro</option>
                                    </select>
                                </div>
                                {/* Peso (kg) */}
                                <div><label className="block text-sm font-medium text-gray-700 mb-1">Peso (kg)</label><input className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" type="number" step={0.001} value={product.pesoKg} onChange={handleChange} name="pesoKg" /></div>
                                {/* Ubicación */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación Principal</label><input className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" type="text" value={product.ubicacionPrincipal} onChange={handleChange} name="ubicacionPrincipal" />
                                </div>
                            </div>
                        </div>

                        {/* Botones de Acción Final */}
                        <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end gap-3 mt-6">
                            <button
                                type="button"
                                onClick={handleOpenToggleModal}
                                className={`w-full sm:w-auto font-medium flex items-center justify-center gap-2 px-4 py-2 border rounded-lg transition-colors 
                                    ${product.estado === 'ACTIVO'
                                        ? 'text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50'
                                        : 'text-green-600 hover:text-green-700 border-green-200 hover:bg-green-50'}`}
                            >
                                <IoIosWarning className="w-4 h-4" />
                                {actionText}
                            </button>
                            <div className="flex gap-3 w-full sm:w-auto justify-end">
                                <button type="button" onClick={() => setShowCancelModal(true)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancelar</button>
                                <button type="submit" className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700"><IoIosSave className="h-5 w-5" />Guardar Cambios</button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default InventoryEditProduct;