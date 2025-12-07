import type { ProductoFormData, Option } from '../../types/inventario/product';
import { api } from '../api';

export const productService = {

  // Obtener categorías, almacenes y proveedores
  fetchOptions: async (): Promise<{ categorias: Option[], almacenes: Option[], proveedores: Option[] }> => {
    const [catRes, almRes, provRes] = await Promise.all([
      api.get('/categorias'),
      api.get('/almacenes'),
      api.get('/proveedores')
    ]);

    const catData = catRes.data || [];
    const almData = almRes.data || [];
    const provRawData = provRes.data || [];

    const provData = provRawData.map((p: any) => ({
      id: p.id,
      nombre: p.razonSocial || p.nombre || p.razon_social || p.name || "Sin Nombre"
    }));

    return { categorias: catData, almacenes: almData, proveedores: provData };
  },

  // Crear producto con imagen (multipart/form-data)
  createProduct: async (productData: ProductoFormData, file?: File): Promise<void> => {
    const formData = new FormData();

    // Convertimos el objeto a JSON y lo añadimos como Blob
    formData.append('data', new Blob([JSON.stringify({
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
    })], { type: 'application/json' }));

    // Si hay imagen, la añadimos con un nombre único
    if (file) {
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      const extension = file.name.split('.').pop() || 'jpg';
      const filename = `producto_${timestamp}_${randomString}.${extension}`;
      formData.append('imagen', file, filename);
    }

    try {
      await api.post('/productos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } catch (error: any) {
      throw {
        status: error.response?.status,
        body: error.response?.data,
      };
    }
  },
};
