package com.perumarket.erp.service;

import com.perumarket.erp.models.dto.ProductoProveedorResponse;
import com.perumarket.erp.models.entity.*;
import com.perumarket.erp.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ProveedorService {

    @Autowired
    private ProveedorRepository proveedorRepository;
    @Autowired
    private ProductoRepository productoRepository;
    @Autowired
    private ProveedorProductoRepository proveedorProductoRepository;
    @Autowired
    private CategoriaProductoRepository categoriaProductoRepository;

    // --- MÉTODOS ESTÁNDAR PROVEEDOR ---
    public List<Proveedor> findAll() { return proveedorRepository.findAll(); }
    public Optional<Proveedor> findById(Integer id) { return proveedorRepository.findById(id); }
    public Proveedor save(Proveedor proveedor) { return proveedorRepository.save(proveedor); }
    public void deleteById(Integer id) { proveedorRepository.deleteById(id); }
    public List<Proveedor> searchByRucOrRazonSocial(String query) {
        if (query == null || query.trim().isEmpty()) return proveedorRepository.findAll();
        return proveedorRepository.findByRucContainingOrRazonSocialContainingIgnoreCase(query, query);
    }

    // --- MÉTODOS GESTIÓN PRODUCTOS-PROVEEDOR ---

    @Transactional(readOnly = true)
    public List<ProductoProveedorResponse> listarProductosDeProveedor(Integer proveedorId) {
        List<ProveedorProducto> relaciones = proveedorProductoRepository.findByProveedorId(proveedorId);
        
        List<ProductoProveedorResponse> respuesta = new ArrayList<>();
        for (ProveedorProducto pp : relaciones) {
            Producto p = pp.getProducto();
            ProductoProveedorResponse dto = new ProductoProveedorResponse();
            dto.setId(pp.getId());
            dto.setProductoId(p.getId());
            dto.setNombre(p.getNombre());
            dto.setCodigo(p.getSku());
            dto.setImagen(p.getImagen());
            dto.setPrecio_compra(pp.getPrecioCompra());
            dto.setPeso_kg(p.getPesoKg());
            respuesta.add(dto);
        }
        return respuesta;
    }

    @Transactional
    public void registrarProductoDesdeProveedor(Integer proveedorId, 
                                                String nombre, 
                                                String sku, 
                                                BigDecimal precioCompra, 
                                                BigDecimal pesoKg, 
                                                MultipartFile imagen) {
        
        Proveedor proveedor = proveedorRepository.findById(proveedorId)
                .orElseThrow(() -> new RuntimeException("Proveedor no encontrado"));

        // 1. Crear Producto
        Producto producto = new Producto();
        producto.setNombre(nombre);
        producto.setSku(sku);
        
        // --- LÓGICA CRÍTICA ---
        // Estado CATALOGO: No aparece en ventas.
        // Precio Venta 0: Porque no se vende aún.
        producto.setEstado(Producto.EstadoProducto.CATALOGO); 
        producto.setPrecioVenta(BigDecimal.ZERO); 
        
        producto.setPrecioCompra(precioCompra);
        producto.setPesoKg(pesoKg);
        producto.setUnidadMedida(Producto.UnidadMedida.UNIDAD);
        producto.setRequiereCodigoBarras(true);
        
        // Asignar primera categoría disponible (fix temporal)
        CategoriaProducto catDefault = categoriaProductoRepository.findAll().stream()
                .findFirst().orElseThrow(() -> new RuntimeException("No hay categorías creadas en el sistema"));
        producto.setCategoria(catDefault);

        // Guardar Imagen
        if (imagen != null && !imagen.isEmpty()) {
            try {
                String nombreArchivo = "prod_" + System.currentTimeMillis() + "_" + imagen.getOriginalFilename();
                Path carpeta = Paths.get("uploads/productos");
                if (!Files.exists(carpeta)) Files.createDirectories(carpeta);
                Path rutaFinal = carpeta.resolve(nombreArchivo);
                Files.copy(imagen.getInputStream(), rutaFinal, StandardCopyOption.REPLACE_EXISTING);
                
                // Ruta para que el frontend la lea
                producto.setImagen("/api/uploads/productos/" + nombreArchivo); 
            } catch (IOException e) {
                throw new RuntimeException("Error al subir imagen", e);
            }
        }
        
        // Guardamos Producto
        producto = productoRepository.save(producto);

        // 2. Crear Vinculación
        ProveedorProducto pp = new ProveedorProducto();
        pp.setProveedor(proveedor);
        pp.setProducto(producto);
        pp.setPrecioCompra(precioCompra);
        pp.setEsPrincipal(true);
        
        proveedorProductoRepository.save(pp);

        // 3. NO CREAMOS INVENTARIO (Así no ensucia el almacén)
    }

    @Transactional
    public void desvincularProducto(Integer idRelacion) {
        proveedorProductoRepository.deleteById(idRelacion);
    }
}