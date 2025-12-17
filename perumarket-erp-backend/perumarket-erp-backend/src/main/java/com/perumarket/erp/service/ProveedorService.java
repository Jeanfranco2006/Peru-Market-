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
    private InventarioRepository inventarioRepository;
    @Autowired
    private AlmacenRepository almacenRepository;
    @Autowired
    private CategoriaProductoRepository categoriaProductoRepository;

    // --- MÉTODOS ESTÁNDAR ---
    public List<Proveedor> findAll() { return proveedorRepository.findAll(); }
    public Optional<Proveedor> findById(Integer id) { return proveedorRepository.findById(id); }
    public Proveedor save(Proveedor proveedor) { return proveedorRepository.save(proveedor); }
    public void deleteById(Integer id) { proveedorRepository.deleteById(id); }
    public List<Proveedor> searchByRucOrRazonSocial(String query) {
        if (query == null || query.trim().isEmpty()) return proveedorRepository.findAll();
        return proveedorRepository.findByRucContainingOrRazonSocialContainingIgnoreCase(query, query);
    }

    // --- MÉTODOS PARA EL MODAL DE PRODUCTOS ---

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
            
            // Leemos los datos de la tabla intermedia
            dto.setPrecio_compra(pp.getPrecioCompra());
            
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

        // 1. Crear Producto Base
        Producto producto = new Producto();
        producto.setNombre(nombre);
        producto.setSku(sku);
        producto.setPrecioVenta(precioCompra.multiply(new BigDecimal("1.30"))); // +30% margen
        producto.setPrecioCompra(precioCompra);
        producto.setPesoKg(pesoKg);
        producto.setEstado(Producto.EstadoProducto.ACTIVO);
        producto.setUnidadMedida(Producto.UnidadMedida.UNIDAD);
        producto.setRequiereCodigoBarras(true);
        
        // Asignar categoría por defecto
        CategoriaProducto catDefault = categoriaProductoRepository.findAll().stream()
                .findFirst().orElseThrow(() -> new RuntimeException("Crea al menos una categoría primero"));
        producto.setCategoria(catDefault);

        // Guardar imagen en disco y asignar ruta
        String rutaImagen = null;
        if (imagen != null && !imagen.isEmpty()) {
            try {
                String nombreArchivo = "prov_" + System.currentTimeMillis() + "_" + imagen.getOriginalFilename();
                Path carpeta = Paths.get("uploads/productos");
                if (!Files.exists(carpeta)) Files.createDirectories(carpeta);
                
                Path rutaFinal = carpeta.resolve(nombreArchivo);
                Files.copy(imagen.getInputStream(), rutaFinal, StandardCopyOption.REPLACE_EXISTING);
                
                rutaImagen = "/uploads/productos/" + nombreArchivo;
            } catch (IOException e) {
                throw new RuntimeException("Error guardando imagen", e);
            }
        }
        producto.setImagen(rutaImagen); // Respaldo
        producto = productoRepository.save(producto);

        // 2. Crear Relación ProveedorProducto
        ProveedorProducto pp = new ProveedorProducto();
        pp.setProveedor(proveedor);
        pp.setProducto(producto);
        pp.setPrecioCompra(precioCompra);
        pp.setEsPrincipal(true);
        proveedorProductoRepository.save(pp);

        // 3. Inicializar Inventario (Para evitar errores en otros módulos)
        Almacen almacen = almacenRepository.findById(1).orElse(null);
        if (almacen != null) {
            Inventario inv = new Inventario();
            inv.setProducto(producto);
            inv.setAlmacen(almacen);
            inv.setStockActual(0);
            inv.setStockMinimo(5);
            inv.setStockMaximo(1000);
            inv.setUbicacion("RECEPCION");
            inventarioRepository.save(inv);
        }
    }

    @Transactional
    public void desvincularProducto(Integer idRelacion) {
        proveedorProductoRepository.deleteById(idRelacion);
    }
}