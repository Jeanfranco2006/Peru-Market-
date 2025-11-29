import { useState, useMemo, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
    IoIosCube, IoIosStats, IoIosPulse, IoMdArrowDropdown, IoIosSearch,
    IoMdHome, IoMdAdd, IoMdCheckmarkCircle, IoIosCart, IoMdClipboard,
    IoIosPin, IoIosBuild, IoIosPeople, IoMdCreate, IoMdRefresh, IoMdTrash,
    IoIosArchive, IoIosBarcode, IoIosImage
} from 'react-icons/io';

const API_BASE = 'http://localhost:8080/api';
const API_PRODUCTOS = `${API_BASE}/productos`;

// Interfaz adaptada al DTO de respuesta del backend (ProductoResponse)
interface Product {
    id: number;
    nombre: string;
    descripcion: string;
    categoriaNombre: string;
    estado: 'ACTIVO' | 'INACTIVO' | string;
    precioVenta: number;
    sku: string;
    codigoBarrasPrincipal: string;
    stockActual: number;
    stockMinimo: number;
    stockMaximo: number;
    imagen: string; // AGREGADO: Campo para la imagen
    
    // Propiedades simuladas/calculadas:
    purchases: number; 
    sales: number; 
    orders: number; 
    pesoKg: number;
    unidadMedida: string;
    ubicacionPrincipal: string;
    almacenNombre: string;
    proveedorRazonSocial: string;
    precioCompra: number;
}

// Función para determinar el estado de stock
const getStockStatus = (stock: number, minStock: number): 'Disponible' | 'Stock Bajo' | 'Sin Stock' => {
    if (stock <= 0) return 'Sin Stock';
    if (stock <= minStock) return 'Stock Bajo';
    return 'Disponible';
};

// Componente mejorado de visualización de código de barras con TEC-IT
const BarcodeDisplay = ({ barcode, sku, name }: { barcode: string, sku: string, name: string }) => {
    const [barcodeImageUrl, setBarcodeImageUrl] = useState<string>('');

    useEffect(() => {
        if (barcode && barcode.length >= 12) {
            const url = `https://barcode.tec-it.com/barcode.ashx?data=${encodeURIComponent(barcode)}&code=EAN13&translate-esc=on&dpi=96`;
            setBarcodeImageUrl(url);
        } else {
            setBarcodeImageUrl('');
        }
    }, [barcode]);

    const printBarcode = () => {
        if (barcodeImageUrl) {
            const printWindow = window.open('', '_blank');
            if (printWindow) {
                printWindow.document.write(`
                    <html>
                        <head>
                            <title>Imprimir Código de Barras - ${name}</title>
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
                                    <div class="product-name">${name}</div>
                                    <div><strong>Código:</strong> ${barcode}</div>
                                    <div><strong>SKU:</strong> ${sku}</div>
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

    return (
        <div className="bg-white p-4 rounded-lg border border-gray-300">
            <div className="text-center mb-3">
                <div className="flex items-center justify-center gap-2 text-gray-700">
                    <IoIosBarcode className="w-5 h-5" />
                    <span className="font-semibold">Código de Barras</span>
                </div>
            </div>

            <div className="bg-white p-4 border-2 border-gray-400 rounded">
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
                    {barcode}
                </div>

                <div className="text-center text-xs text-gray-600 mt-2 space-y-1">
                    <div><strong>SKU:</strong> {sku}</div>
                    <div><strong>Producto:</strong> {name}</div>
                    <div><strong>Formato:</strong> EAN-13 (Principal)</div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 mt-3">
                <button
                    className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                    onClick={() => {
                        navigator.clipboard.writeText(barcode);
                        alert('Código copiado al portapapeles');
                    }}
                >
                    <span>Copiar Código</span>
                </button>
                <button
                    className="flex-1 bg-gray-600 text-white py-2 px-3 rounded text-sm hover:bg-gray-700 transition-colors flex items-center justify-center gap-1"
                    onClick={printBarcode}
                >
                    <span>Imprimir</span>
                </button>
            </div>

            {barcodeImageUrl && (
                <div className="mt-3 text-xs text-gray-500 text-center">
                    <p>
                        Generado con{' '}
                        <a 
                            href="https://www.tec-it.com" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-blue-600 hover:underline"
                        >
                            TEC-IT Barcode Generator
                        </a>
                    </p>
                </div>
            )}
        </div>
    );
};

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
export default function Inventory() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [products, setProducts] = useState<Product[]>([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [showBarcodeModal, setShowBarcodeModal] = useState(false);

    // --- Carga de Productos desde la API ---
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(API_PRODUCTOS);
            if (!response.ok) {
                throw new Error('Error al cargar la lista de productos.');
            }
            const data: any[] = await response.json();
            
            // Mapeamos los datos del DTO (ProductoResponse)
            const mappedProducts: Product[] = data.map(p => ({
                id: p.id,
                nombre: p.nombre,
                descripcion: p.descripcion,
                categoriaNombre: p.categoriaNombre,
                estado: p.estado,
                precioVenta: parseFloat(p.precioVenta),
                sku: p.sku,
                codigoBarrasPrincipal: p.codigoBarrasPrincipal,
                stockActual: p.stockActual,
                stockMinimo: p.stockMinimo,
                stockMaximo: p.stockMaximo,
                imagen: p.imagen || '', // AGREGADO: Campo de imagen
                pesoKg: parseFloat(p.pesoKg),
                unidadMedida: p.unidadMedida,
                ubicacionPrincipal: p.ubicacionPrincipal,
                almacenNombre: p.almacenNombre,
                proveedorRazonSocial: p.proveedorRazonSocial,
                precioCompra: parseFloat(p.precioCompra),
                
                // Valores Simulados
                purchases: p.id * 2, 
                sales: p.id * 5,
                orders: p.id * 1,
            }));
            
            setProducts(mappedProducts);
        } catch (err: any) {
            console.error('Error fetching data:', err);
            setError(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }, []);
    
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // --- Cálculos y Filtros ---
    const categories = useMemo(() => {
        const uniqueCategories = Array.from(new Set(products.map(p => p.categoriaNombre)));
        return ['all', ...uniqueCategories];
    }, [products]);

    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesSearch = product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.codigoBarrasPrincipal.includes(searchTerm);

            const matchesCategory = filterCategory === 'all' || product.categoriaNombre === filterCategory;

            return matchesSearch && matchesCategory;
        });
    }, [searchTerm, filterCategory, products]);

    const totalValue = products.reduce((sum, p) => sum + p.stockActual * p.precioVenta, 0);
    const lowStockCount = products.filter(p => p.stockActual > 0 && p.stockActual <= p.stockMinimo).length;
    const outOfStockCount = products.filter(p => p.stockActual <= 0).length;

    const handleShowBarcode = (product: Product) => {
        setSelectedProduct(product);
        setShowBarcodeModal(true);
    };

    if (loading) return <div className="p-6 text-center text-gray-500">Cargando inventario...</div>;
    if (error) return <div className="p-6 text-center text-red-600 border border-red-300 bg-red-50 rounded-lg">Error: {error}</div>;

    return (
        <div className="p-4 sm:p-6">
            <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">INVENTARIO</h1>

            {/* Modal de Código de Barras */}
            {showBarcodeModal && selectedProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
                            <h3 className="text-lg font-semibold">Código de Barras - {selectedProduct.nombre}</h3>
                            <button
                                onClick={() => setShowBarcodeModal(false)}
                                className="text-gray-500 hover:text-gray-700 text-xl"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="p-6">
                            <BarcodeDisplay 
                                barcode={selectedProduct.codigoBarrasPrincipal} 
                                sku={selectedProduct.sku} 
                                name={selectedProduct.nombre}
                            />
                            <div className="mt-4 text-sm text-gray-600 space-y-2">
                                <p><strong>Producto:</strong> {selectedProduct.nombre}</p>
                                <p><strong>SKU:</strong> {selectedProduct.sku}</p>
                                <p><strong>Categoría:</strong> {selectedProduct.categoriaNombre}</p>
                                <p><strong>Precio:</strong> S/{selectedProduct.precioVenta.toFixed(2)}</p>
                                <p><strong>Stock Actual:</strong> {selectedProduct.stockActual} {selectedProduct.unidadMedida}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 1. SECCIÓN DE ESTADÍSTICAS Y FILTROS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

                {/* Cards de Estadísticas */}
                <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
                    <div className="text-xl sm:text-2xl font-bold text-gray-900">{products.length}</div>
                    <div className="flex items-center gap-2 text-sm sm:text-base">
                        <IoIosCube className="w-5 h-5 text-purple-500" />
                        <span>Productos</span>
                    </div>
                </div>

                <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
                    <div className="text-xl sm:text-2xl font-bold text-gray-900">S/{totalValue.toFixed(2)}</div>
                    <div className="flex items-center gap-2 text-sm sm:text-base">
                        <IoIosStats className="w-5 h-5 text-blue-600" />
                        <span>Valor Total</span>
                    </div>
                </div>

                <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
                    <div className="text-xl sm:text-2xl font-bold text-gray-900">{lowStockCount}</div>
                    <div className="flex items-center gap-2 text-sm sm:text-base">
                        <IoIosPulse className="w-5 h-5 text-amber-300" />
                        <span>Stock Bajo</span>
                    </div>
                </div>

                <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
                    <div className="text-xl sm:text-2xl font-bold text-gray-900">{outOfStockCount}</div>
                    <div className="flex items-center gap-2 text-sm sm:text-base">
                        <IoMdArrowDropdown className="w-5 h-5 text-amber-500" />
                        <span>Sin Stock</span>
                    </div>
                </div>

                {/* Filtros y Acciones */}
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 col-span-2 md:col-span-4">
                    <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 justify-between items-start lg:items-center">
                        
                        {/* Búsqueda */}
                        <div className="flex-1 relative w-full lg:w-auto">
                            <IoIosSearch className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
                            <input
                                placeholder="Buscar Producto, SKU o Código de Barras..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Filtro de Categoría */}
                        <select
                            className="w-full sm:w-auto border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                        >
                            <option value="all">Filtrar por categoría</option>
                            {categories.filter(c => c !== 'all').map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>

                        {/* Botones de Acción */}
                        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                            <Link
                                to="/inventario/almacenes"
                                className="flex-1 px-4 py-2 rounded-lg bg-blue-400 text-white flex items-center justify-center gap-2 hover:bg-blue-600 active:bg-blue-700 transition-all duration-200 transform active:scale-[0.98] text-sm"
                            >
                                <IoMdHome className="w-5 h-5" />
                                <span>Almacenes</span>
                            </Link>

                            <Link
                                to="/inventario/nuevo"
                                className="flex-1 px-4 py-2 rounded-lg bg-emerald-500 text-white flex items-center justify-center gap-2 hover:bg-emerald-600 active:bg-emerald-700 transition-all duration-200 transform active:scale-[0.98] text-sm"
                            >
                                <IoMdAdd className="w-5 h-5" />
                                <span>Nuevo Producto</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. GRILLA DE PRODUCTOS */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => {
                    const margin = (product.precioVenta - product.precioCompra) / product.precioCompra;
                    const marginPercentage = isNaN(margin) || !isFinite(margin) ? 0 : margin * 100;
                    const statusText = getStockStatus(product.stockActual, product.stockMinimo);
                    
                    const statusColor = statusText === 'Disponible' ? 'bg-green-100 text-green-700' :
                        statusText === 'Stock Bajo' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700';

                    return (
                        <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                            
                            {/* Header del Producto CON IMAGEN */}
                            <div className="h-48 bg-gray-100 rounded-lg relative flex items-center justify-center overflow-hidden">
                                <div className="absolute top-2 left-2 z-10">
                                    <span className="text-xs font-medium text-gray-700 bg-white/90 px-2 py-1 rounded border">
                                        {product.categoriaNombre}
                                    </span>
                                </div>
                                <div className={`absolute top-2 right-2 z-10 flex items-center gap-1 ${statusColor} px-2 py-1 rounded-full text-xs font-medium`}>
                                    <IoMdCheckmarkCircle className="w-4 h-4" />
                                    {statusText}
                                </div>
                                
                                {/* Imagen del producto */}
                                <ProductImage 
                                    imagen={product.imagen} 
                                    nombre={product.nombre}
                                    className="w-full h-full"
                                />
                            </div>

                            {/* Información Básica */}
                            <div className="mt-4">
                                <h3 className="font-bold text-gray-900">{product.nombre}</h3>
                                <p className="text-sm text-gray-600 line-clamp-2">{product.descripcion}</p>
                            </div>

                            {/* Precios y SKUs */}
                            <div className="flex justify-between items-center mt-3">
                                <span className="text-xl sm:text-2xl font-bold text-gray-900">S/{product.precioVenta.toFixed(2)}</span>
                                <div className="text-right">
                                    <div className="text-sm text-gray-600">SKU: {product.sku}</div>
                                    <div className="text-xs text-gray-500 flex items-center gap-1 justify-end">
                                        <IoIosBarcode className="w-3 h-3" />
                                        {product.codigoBarrasPrincipal}
                                    </div>
                                </div>
                            </div>

                            {/* Botón Ver Código de Barras */}
                            <div className="bg-gray-50 p-3 rounded-lg mt-3 border border-gray-200">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                        <IoIosBarcode className="w-4 h-4" />
                                        Código de Barras
                                    </span>
                                    <button
                                        onClick={() => handleShowBarcode(product)}
                                        className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
                                    >
                                        Ver
                                    </button>
                                </div>
                                <div className="text-xs font-mono bg-white p-2 rounded border text-center mt-2">
                                    {product.codigoBarrasPrincipal}
                                </div>
                            </div>

                            {/* Métricas de Stock */}
                            <div className="grid grid-cols-3 gap-2 mt-4">
                                <div className="bg-blue-50 p-3 rounded text-center">
                                    <div className="text-lg sm:text-xl font-bold text-blue-700">{product.stockActual}</div>
                                    <div className="text-xs text-blue-600">Stock Actual</div>
                                </div>
                                <div className="bg-orange-50 p-3 rounded text-center">
                                    <div className="text-base sm:text-lg font-bold text-orange-700">{product.stockMinimo}</div>
                                    <div className="text-xs text-orange-600">Mínimo</div>
                                </div>
                                <div className="bg-green-50 p-3 rounded text-center">
                                    <div className="text-base sm:text-lg font-bold text-green-700">{product.stockMaximo}</div>
                                    <div className="text-xs text-green-600">Máximo</div>
                                </div>
                            </div>
                            
                            {/* Detalles de Ubicación y Margen */}
                            <div className="space-y-2 text-sm text-gray-600 mt-4">
                                
                                {/* Peso/Unidad */}
                                <div className="flex justify-between items-center border-b border-gray-100 pb-1">
                                    <span className="flex items-center gap-1">
                                        <IoIosArchive className="w-4 h-4" /> Peso/Unidad:
                                    </span>
                                    <span className="font-medium">{product.pesoKg.toFixed(3)} kg / {product.unidadMedida}</span>
                                </div>

                                {/* Ubicación */}
                                <div className="flex justify-between items-center">
                                    <span className="flex items-center gap-1">
                                        <IoIosPin className="w-4 h-4" /> Ubicación:
                                    </span>
                                    <span className="font-medium">{product.ubicacionPrincipal}</span>
                                </div>

                                {/* Almacén */}
                                <div className="flex justify-between items-center">
                                    <span className="flex items-center gap-1">
                                        <IoIosBuild className="w-4 h-4" /> Almacén:
                                    </span>
                                    <span className="font-medium text-blue-600">{product.almacenNombre}</span>
                                </div>

                                {/* Proveedor */}
                                <div className="flex justify-between items-center">
                                    <span className="flex items-center gap-1">
                                        <IoIosPeople className="w-4 h-4" /> Proveedor:
                                    </span>
                                    <span className="font-medium">{product.proveedorRazonSocial}</span>
                                </div>
                                
                                {/* Costo y Margen */}
                                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                                    <span className="text-gray-700 font-semibold">Costo: S/{product.precioCompra.toFixed(2)}</span>
                                    <span className="font-bold text-green-600">Margen: {marginPercentage.toFixed(1)}%</span>
                                </div>
                            </div>

                            {/* Métricas de Movimiento */}
                            <div className="grid grid-cols-3 gap-2 mt-4">
                                <div className="bg-purple-50 p-2 rounded text-center">
                                    <IoIosCart className="w-5 h-5 mx-auto text-purple-600 mb-1" />
                                    <div className="text-sm font-bold text-purple-700">{product.purchases}</div>
                                    <div className="text-xs text-purple-600">Compras</div>
                                </div>
                                <div className="bg-indigo-50 p-2 rounded text-center">
                                    <IoMdClipboard className="w-5 h-5 mx-auto text-indigo-600 mb-1" />
                                    <div className="text-sm font-bold text-indigo-700">{product.sales}</div>
                                    <div className="text-xs text-indigo-600">Ventas</div>
                                </div>
                                <div className="bg-teal-50 p-2 rounded text-center">
                                    <IoIosArchive className="w-5 h-5 mx-auto text-teal-600 mb-1" />
                                    <div className="text-sm font-bold text-teal-700">{product.orders}</div>
                                    <div className="text-xs text-teal-600">Pedidos</div>
                                </div>
                            </div>

                            {/* Botones de Acción */}
                            <div className="flex flex-col sm:flex-row gap-2 mt-4">
                                <Link
                                    to={`/inventario/editar/${product.id}`}
                                    className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 transform active:scale-[0.98] text-sm"
                                >
                                    <IoMdCreate className="w-5 h-5" />
                                    Editar
                                </Link>
                                <Link
                                    to={`/inventario/movimientos/${product.id}`}
                                    className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 active:bg-green-800 transition-all duration-200 transform active:scale-[0.98] text-sm"
                                >
                                    <IoMdRefresh className="w-5 h-5" />
                                    Movimientos
                                </Link>
                                <button
                                    className="flex-1 bg-red-600 text-white py-2 px-3 rounded-lg flex items-center justify-center gap-2 hover:bg-red-700 active:bg-red-800 transition-all duration-200 transform active:scale-[0.98] text-sm"
                                >
                                    <IoMdTrash className="w-5 h-5" />
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}