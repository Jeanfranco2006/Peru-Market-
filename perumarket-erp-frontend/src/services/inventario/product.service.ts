import type { ProductoFormData, Option } from '../../types/inventario/product.types';

const API_BASE = 'http://localhost:8080/api';

export const productService = {
  // Obtener todas las opciones necesarias (Categorías, Almacenes, Proveedores)
  fetchOptions: async (): Promise<{ categorias: Option[], almacenes: Option[], proveedores: Option[] }> => {
    const [catRes, almRes, provRes] = await Promise.all([
      fetch(`${API_BASE}/categorias`),
      fetch(`${API_BASE}/almacenes`),
      fetch(`${API_BASE}/proveedores`)
    ]);

    const catData = catRes.ok ? await catRes.json() : [];
    const almData = almRes.ok ? await almRes.json() : [];
    const provRawData = provRes.ok ? await provRes.json() : [];

    // Lógica de mapeo de proveedores preservada
    const provData = provRawData.map((p: any) => ({
      id: p.id,
      nombre: p.razonSocial || p.nombre || p.razon_social || p.name || "Sin Nombre"
    }));

    return { categorias: catData, almacenes: almData, proveedores: provData };
  },

  // Subir imagen
  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const fileName = `producto_${timestamp}_${randomString}.${fileExtension}`;
    formData.append('fileName', fileName);

    const response = await fetch(`${API_BASE}/productos/upload-image`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data.imagePath;
  },

  // Guardar producto
  createProduct: async (productData: ProductoFormData): Promise<void> => {
    // Preparar el objeto para el backend (limpieza de datos)
    const requestData = {
      ...productData,
      categoriaId: productData.categoriaId || undefined,
      almacenId: productData.almacenId || undefined,
      proveedorId: productData.proveedorId || undefined,
      unidadMedida: productData.unidadMedida.toUpperCase(),
      stockInicial: productData.stockInicial || 0,
      stockMinimo: productData.stockMinimo || 0,
      precioCompra: productData.precioCompra || 0.0,
      precioVenta: productData.precioVenta || 0.0,
      pesoKg: productData.pesoKg || 0.0,
      imagen: productData.imagen || '',
    };

    const response = await fetch(`${API_BASE}/productos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      // Lanzamos un error con la estructura que espera el hook
      throw { status: response.status, body: errorBody };
    }
  }
};