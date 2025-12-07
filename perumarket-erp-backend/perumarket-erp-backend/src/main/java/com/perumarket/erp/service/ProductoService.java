package com.perumarket.erp.service;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.perumarket.erp.exception.DataIntegrityViolationException;
import com.perumarket.erp.exception.ResourceNotFoundException;
import com.perumarket.erp.models.dto.MovimientoInventarioDTO;
import com.perumarket.erp.models.dto.ProductoRequest;
import com.perumarket.erp.models.dto.ProductoResponse;
import com.perumarket.erp.models.entity.Almacen;
import com.perumarket.erp.models.entity.CategoriaProducto;
import com.perumarket.erp.models.entity.CodigoBarras;
import com.perumarket.erp.models.entity.Inventario;
import com.perumarket.erp.models.entity.MovimientoInventario;
import com.perumarket.erp.models.entity.MovimientoInventario.TipoMovimiento;
import com.perumarket.erp.models.entity.Producto;
import com.perumarket.erp.models.entity.Producto.EstadoProducto;
import com.perumarket.erp.models.entity.Producto.UnidadMedida;
import com.perumarket.erp.models.entity.Proveedor;
import com.perumarket.erp.models.entity.ProveedorProducto;
import com.perumarket.erp.repository.AlmacenRepository;
import com.perumarket.erp.repository.CategoriaProductoRepository;
import com.perumarket.erp.repository.CodigoBarrasRepository;
import com.perumarket.erp.repository.DetalleVentaRepository; // <--- 1. IMPORTANTE: IMPORT AGREGADO
import com.perumarket.erp.repository.InventarioRepository;
import com.perumarket.erp.repository.MovimientoInventarioRepository;
import com.perumarket.erp.repository.ProductoRepository;
import com.perumarket.erp.repository.ProveedorProductoRepository;
import com.perumarket.erp.repository.ProveedorRepository;

@Service
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final CategoriaProductoRepository categoriaProductoRepository;
    private final InventarioRepository inventarioRepository;
    private final ProveedorRepository proveedorRepository;
    private final AlmacenRepository almacenRepository;
    private final ProveedorProductoRepository proveedorProductoRepository;
    private final CodigoBarrasRepository codigoBarrasRepository;
    private final MovimientoInventarioRepository movimientoInventarioRepository;
    private final DetalleVentaRepository detalleVentaRepository; // <--- 2. NUEVO CAMPO

    public ProductoService(ProductoRepository productoRepository,
            CategoriaProductoRepository categoriaProductoRepository,
            InventarioRepository inventarioRepository,
            ProveedorRepository proveedorRepository,
            AlmacenRepository almacenRepository,
            ProveedorProductoRepository proveedorProductoRepository,
            CodigoBarrasRepository codigoBarrasRepository,
            MovimientoInventarioRepository movimientoInventarioRepository,
            DetalleVentaRepository detalleVentaRepository) { // <--- 3. AGREGADO AL CONSTRUCTOR
        this.productoRepository = productoRepository;
        this.categoriaProductoRepository = categoriaProductoRepository;
        this.inventarioRepository = inventarioRepository;
        this.proveedorRepository = proveedorRepository;
        this.almacenRepository = almacenRepository;
        this.proveedorProductoRepository = proveedorProductoRepository;
        this.codigoBarrasRepository = codigoBarrasRepository;
        this.movimientoInventarioRepository = movimientoInventarioRepository;
        this.detalleVentaRepository = detalleVentaRepository; // <--- 4. ASIGNACIÓN
    }

    /**
     * Crea un nuevo producto, su stock inicial, la relación con el proveedor y el
     * código de barras principal.
     */
    @Transactional
public Producto crearProductoYStockInicial(ProductoRequest request, MultipartFile imagen)  {

    // 1. Validaciones
    if (productoRepository.findBySku(request.getSku()).isPresent()) {
        throw new DataIntegrityViolationException("El SKU '" + request.getSku() + "' ya está en uso.");
    }
    if (codigoBarrasRepository.findByCodigo(request.getCodigoBarras()).isPresent()) {
        throw new DataIntegrityViolationException(
                "El código de barras '" + request.getCodigoBarras() + "' ya está registrado.");
    }

    CategoriaProducto categoria = categoriaProductoRepository.findById(request.getCategoriaId())
            .orElseThrow(() -> new ResourceNotFoundException("Categoría", "id", request.getCategoriaId().toString()));

    Almacen almacen = almacenRepository.findById(request.getAlmacenId())
            .orElseThrow(() -> new ResourceNotFoundException("Almacén", "id", request.getAlmacenId().toString()));

    Proveedor proveedor = proveedorRepository.findById(request.getProveedorId())
            .orElseThrow(() -> new ResourceNotFoundException("Proveedor", "id", request.getProveedorId().toString()));


    // 2. Crear el producto
    Producto nuevoProducto = new Producto();
    nuevoProducto.setNombre(request.getNombre());
    nuevoProducto.setDescripcion(request.getDescripcion());
    nuevoProducto.setSku(request.getSku());
    nuevoProducto.setPrecioVenta(request.getPrecioVenta());
    nuevoProducto.setPrecioCompra(
            request.getPrecioCompra() != null ? request.getPrecioCompra() : BigDecimal.ZERO
    );
    nuevoProducto.setCategoria(categoria);
    nuevoProducto.setPesoKg(request.getPesoKg());
    nuevoProducto.setRequiereCodigoBarras(
            request.getRequiereCodigoBarras() != null ? request.getRequiereCodigoBarras() : true
    );

    // Unidad de medida
    try {
        nuevoProducto.setUnidadMedida(UnidadMedida.valueOf(request.getUnidadMedida().toUpperCase()));
    } catch (IllegalArgumentException e) {
        throw new DataIntegrityViolationException("Unidad de medida no válida: " + request.getUnidadMedida());
    }


    // === GUARDAR IMAGEN ===
   // === GUARDAR IMAGEN ===
if (imagen != null && !imagen.isEmpty()) {
    try {
        String nombreArchivo = "producto_" + System.currentTimeMillis() + "_" + imagen.getOriginalFilename();
        Path carpeta = Paths.get("uploads/productos");
        if (!Files.exists(carpeta)) Files.createDirectories(carpeta);

        Path rutaFinal = carpeta.resolve(nombreArchivo);
        Files.copy(imagen.getInputStream(), rutaFinal, StandardCopyOption.REPLACE_EXISTING);

        nuevoProducto.setImagen("/uploads/productos/" + nombreArchivo);

    } catch (IOException e) {
        throw new RuntimeException("Error al guardar la imagen: " + e.getMessage(), e);
    }
}



    // Guardar el producto ya CON IMAGEN
    Producto productoGuardado = productoRepository.save(nuevoProducto);


    // 3. Relación proveedor-producto
    ProveedorProducto pp = new ProveedorProducto();
    pp.setProducto(productoGuardado);
    pp.setProveedor(proveedor);
    pp.setPrecioCompra(request.getPrecioCompra());
    pp.setEsPrincipal(true);
    proveedorProductoRepository.save(pp);


    // 4. Crear código de barras
    CodigoBarras cb = new CodigoBarras();
    cb.setCodigo(request.getCodigoBarras());
    cb.setProducto(productoGuardado);
    cb.setProveedor(proveedor);
    cb.setEsPrincipal(true);
    codigoBarrasRepository.save(cb);


    // 5. Crear inventario
    Inventario nuevoInventario = new Inventario();
    nuevoInventario.setProducto(productoGuardado);
    nuevoInventario.setAlmacen(almacen);
    nuevoInventario.setStockActual(request.getStockInicial());
    nuevoInventario.setStockMinimo(request.getStockMinimo());
    nuevoInventario.setStockMaximo(request.getStockMaximo());
    nuevoInventario.setUbicacion(request.getUbicacion());

    Inventario inventarioGuardado = inventarioRepository.save(nuevoInventario);


    // 6. Crear movimiento
    if (request.getStockInicial() > 0) {
        MovimientoInventario mov = new MovimientoInventario();
        mov.setInventario(inventarioGuardado);
        mov.setProducto(productoGuardado);
        mov.setAlmacen(almacen);
        mov.setTipoMovimiento(TipoMovimiento.ENTRADA);
        mov.setCantidad(request.getStockInicial());
        mov.setStockAnterior(0);
        mov.setStockNuevo(request.getStockInicial());
        mov.setMotivo("Stock inicial en la creación del producto.");
        mov.setIdUsuario(1);

        movimientoInventarioRepository.save(mov);
    }

    return productoGuardado;
}


    // --- Lógica para Listar Productos (Necesario para Inventory.tsx) ---

    /**
     * Obtiene todos los productos combinando la información de su stock principal.
     */
    @Transactional(readOnly = true)
    public List<ProductoResponse> obtenerTodosProductosConStock() {
        List<Producto> productos = productoRepository.findAll();

        return productos.stream().map(producto -> {
            // Buscamos el inventario principal para este producto (asumimos el primero o el
            // único)
            Optional<Inventario> inventarioOpt = inventarioRepository.findByProductoId(producto.getId()).stream()
                    .findFirst();
            Inventario inventario = inventarioOpt.orElse(null);

            // Buscamos el proveedor principal
            Optional<ProveedorProducto> ppOpt = proveedorProductoRepository
                    .findByProductoIdAndEsPrincipalTrue(producto.getId());
            Proveedor proveedor = ppOpt.flatMap(p -> Optional.of(p.getProveedor())).orElse(null);

            // Buscamos el código de barras principal
            Optional<CodigoBarras> cbOpt = codigoBarrasRepository.findByProductoIdAndEsPrincipalTrue(producto.getId());
            CodigoBarras codigoBarras = cbOpt.orElse(null);

            return mapToResponseDTO(producto, inventario, proveedor, codigoBarras);
        }).collect(Collectors.toList());
    }

    @Transactional
    public ProductoResponse actualizarStock(Integer productoId, Integer nuevoStock) {
        Inventario inventario = inventarioRepository.findByProductoId(productoId).stream().findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Inventario", "productoId", productoId.toString()));

        MovimientoInventario mov = new MovimientoInventario();
        mov.setInventario(inventario);
        mov.setProducto(inventario.getProducto());
        mov.setAlmacen(inventario.getAlmacen());
        mov.setTipoMovimiento(MovimientoInventario.TipoMovimiento.ENTRADA); // o AJUSTE
        mov.setCantidad(nuevoStock - inventario.getStockActual());
        mov.setStockAnterior(inventario.getStockActual());
        mov.setStockNuevo(nuevoStock);
        mov.setMotivo("Actualización de stock desde frontend.");
        mov.setIdUsuario(1); // Simulación
        movimientoInventarioRepository.save(mov);

        inventario.setStockActual(nuevoStock);
        inventarioRepository.save(inventario);

        return obtenerProductoPorId(productoId);
    }

    /**
     * Mapeo de Entidad Producto y sus relaciones a DTO de Respuesta.
     */
    private ProductoResponse mapToResponseDTO(Producto producto, Inventario inventario, Proveedor proveedor,
            CodigoBarras codigoBarras) {
        ProductoResponse dto = new ProductoResponse();

        // Mapeo Producto
        dto.setId(producto.getId());
        dto.setNombre(producto.getNombre());
        dto.setDescripcion(producto.getDescripcion());
        dto.setSku(producto.getSku());
        dto.setPrecioVenta(producto.getPrecioVenta());
        dto.setPrecioCompra(producto.getPrecioCompra());
        dto.setUnidadMedida(producto.getUnidadMedida().name());
        dto.setPesoKg(producto.getPesoKg());
        dto.setImagen(producto.getImagen());
        dto.setEstado(producto.getEstado().name());

        // Mapeo Categoría
        if (producto.getCategoria() != null) {
            dto.setCategoriaNombre(producto.getCategoria().getNombre());
        }

        // Mapeo Inventario / Stock
        if (inventario != null) {
            dto.setStockActual(inventario.getStockActual());
            dto.setStockMinimo(inventario.getStockMinimo());
            dto.setStockMaximo(inventario.getStockMaximo());
            dto.setUbicacionPrincipal(inventario.getUbicacion());
            if (inventario.getAlmacen() != null) {
                dto.setAlmacenNombre(inventario.getAlmacen().getNombre());
            }
        } else {
            dto.setStockActual(0);
            dto.setStockMinimo(0);
            dto.setStockMaximo(0);
            dto.setAlmacenNombre("N/A");
            dto.setUbicacionPrincipal("N/A");
        }

        // Mapeo Proveedor
        if (proveedor != null) {
            dto.setProveedorRazonSocial(proveedor.getRazonSocial());
        } else {
            dto.setProveedorRazonSocial("Desconocido");
        }

        // Mapeo Código de Barras
        if (codigoBarras != null) {
            dto.setCodigoBarrasPrincipal(codigoBarras.getCodigo());
        } else {
            dto.setCodigoBarrasPrincipal(producto.getSku());
        }
/*ojo con esto */
        //System.out.println("DEBUG: IMAGEN=" + producto.getImagen());

        return dto;
    }

    /**
     * Obtiene un producto por ID y lo mapea a DTO de respuesta.
     */
    @Transactional(readOnly = true)
    public ProductoResponse obtenerProductoPorId(Integer id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto", "id", id.toString()));

        // Obtener datos relacionados para el DTO
        Optional<Inventario> inventarioOpt = inventarioRepository.findByProductoId(producto.getId()).stream()
                .findFirst();
        Inventario inventario = inventarioOpt.orElse(null);
        Optional<ProveedorProducto> ppOpt = proveedorProductoRepository
                .findByProductoIdAndEsPrincipalTrue(producto.getId());
        Proveedor proveedor = ppOpt.flatMap(p -> Optional.of(p.getProveedor())).orElse(null);
        Optional<CodigoBarras> cbOpt = codigoBarrasRepository.findByProductoIdAndEsPrincipalTrue(producto.getId());
        CodigoBarras codigoBarras = cbOpt.orElse(null);

        return mapToResponseDTO(producto, inventario, proveedor, codigoBarras);
    }

    /**
     * Actualiza la información principal del producto.
     */
    @Transactional
    public ProductoResponse actualizarProducto(Integer id, ProductoRequest request) {
        Producto productoExistente = productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto", "id", id.toString()));

        // Validar SKU (si cambió y ya existe)
        if (!productoExistente.getSku().equals(request.getSku())
                && productoRepository.findBySku(request.getSku()).isPresent()) {
            throw new DataIntegrityViolationException("El SKU '" + request.getSku() + "' ya está en uso.");
        }

        // 1. Cargar y actualizar Producto
        CategoriaProducto categoria = categoriaProductoRepository.findById(request.getCategoriaId())
                .orElseThrow(
                        () -> new ResourceNotFoundException("Categoría", "id", request.getCategoriaId().toString()));

        productoExistente.setNombre(request.getNombre());
        productoExistente.setDescripcion(request.getDescripcion());
        productoExistente.setSku(request.getSku());
        productoExistente.setPrecioVenta(request.getPrecioVenta());
        productoExistente
                .setPrecioCompra(request.getPrecioCompra() != null ? request.getPrecioCompra() : BigDecimal.ZERO);
        productoExistente.setCategoria(categoria);
        productoExistente.setPesoKg(request.getPesoKg());
        productoExistente.setImagen(request.getImagen());
        productoExistente.setRequiereCodigoBarras(
                request.getRequiereCodigoBarras() != null ? request.getRequiereCodigoBarras() : true);

        try {
            productoExistente.setUnidadMedida(UnidadMedida.valueOf(request.getUnidadMedida().toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new DataIntegrityViolationException("Unidad de medida no válida: " + request.getUnidadMedida());
        }

        Producto productoActualizado = productoRepository.save(productoExistente);

        // 2. Opcional: Actualizar Inventario Principal (Si el DTO incluye datos de
        // stock, se debe actualizar aquí)
        // Ya que tu request incluye stockMinimo/Maximo, se actualizaría el registro
        // principal:
        inventarioRepository.findByProductoId(productoActualizado.getId()).stream().findFirst().ifPresent(inv -> {
            inv.setStockMinimo(request.getStockMinimo());
            inv.setStockMaximo(request.getStockMaximo());
            inv.setUbicacion(request.getUbicacion());
            // No se toca StockActual, eso solo se hace con movimientos
            inventarioRepository.save(inv);
        });

        // Retorna el DTO de respuesta con la información actualizada (debes
        // refactorizar para obtener todos los datos relacionados)
        return obtenerProductoPorId(productoActualizado.getId());
    }

    /**
     * Desactiva un producto (cambia el estado a INACTIVO).
     */
    @Transactional
    public void desactivarProducto(Integer id) {
        Producto productoExistente = productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto", "id", id.toString()));

        if (productoExistente.getEstado() == Producto.EstadoProducto.INACTIVO) {
            return; // Ya está inactivo, no hacemos nada
        }

        productoExistente.setEstado(Producto.EstadoProducto.INACTIVO);
        productoRepository.save(productoExistente);

        // Opcional: Generar un movimiento de inventario si el stock se considera
        // "perdido" o si deseas un registro
        // Para una desactivación simple, solo cambiamos el estado de la entidad
        // Producto.
    }
    // =======================================================================
    // 4. CAMBIO DE ESTADO (PATCH)
    // =======================================================================

    /**
     * Obtiene el historial de movimientos de inventario para un producto
     * específico.
     */
    @Transactional(readOnly = true)
    public List<MovimientoInventarioDTO> obtenerHistorialMovimientos(Integer productoId) {
        // Utilizamos el repositorio confirmado: MovimientoInventarioRepository
        List<MovimientoInventario> movimientos = movimientoInventarioRepository.findByProductoId(productoId);

        return movimientos.stream()
                .map(mov -> {
                    MovimientoInventarioDTO dto = new MovimientoInventarioDTO();
                    dto.setId(mov.getId());
                    dto.setTipoMovimiento(mov.getTipoMovimiento());
                    dto.setCantidad(mov.getCantidad());
                    dto.setStockAnterior(mov.getStockAnterior());
                    dto.setStockNuevo(mov.getStockNuevo());
                    dto.setMotivo(mov.getMotivo());
                    dto.setFechaMovimiento(mov.getFechaCreacion());
                    dto.setIdUsuario(mov.getIdUsuario());

                    if (mov.getAlmacen() != null) {
                        dto.setNombreAlmacen(mov.getAlmacen().getNombre());
                    }
                    return dto;
                })
                // Ordenar por fecha de creación descendente (más reciente primero)
                .sorted((m1, m2) -> m2.getFechaMovimiento().compareTo(m1.getFechaMovimiento()))
                .collect(Collectors.toList());
    }
/*traer productos a modulo ventas con img*/
    @Transactional(readOnly = true)
    public List<ProductoResponse> obtenerProductosParaVenta() {
        List<Producto> productos = productoRepository.findByEstado(EstadoProducto.ACTIVO);

        return productos.stream().map(producto -> {
            // Inventario principal
            Optional<Inventario> inventarioOpt = inventarioRepository.findByProductoId(producto.getId()).stream()
                    .findFirst();
            Inventario inventario = inventarioOpt.orElse(null);

            // Proveedor principal
            Optional<ProveedorProducto> ppOpt = proveedorProductoRepository
                    .findByProductoIdAndEsPrincipalTrue(producto.getId());
            Proveedor proveedor = ppOpt.flatMap(p -> Optional.of(p.getProveedor())).orElse(null);

            // Código de barras principal
            Optional<CodigoBarras> cbOpt = codigoBarrasRepository.findByProductoIdAndEsPrincipalTrue(producto.getId());
            CodigoBarras codigoBarras = cbOpt.orElse(null);

            return mapToResponseDTO(producto, inventario, proveedor, codigoBarras);
        }).collect(Collectors.toList());
    }

    /**
     * Cambia el estado (ACTIVO/INACTIVO) de un producto por su ID.
     */
    @Transactional
    public ProductoResponse cambiarEstadoProducto(Integer id, EstadoProducto nuevoEstado) {
        Producto productoExistente = productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto", "id", id.toString()));

        // No hace nada si el estado ya es el deseado, pero devuelve el DTO actualizado
        if (productoExistente.getEstado() == nuevoEstado) {
            return obtenerProductoPorId(id);
        }

        productoExistente.setEstado(nuevoEstado);
        Producto productoActualizado = productoRepository.save(productoExistente);

        // Devolvemos el DTO con el nuevo estado
        return obtenerProductoPorId(productoActualizado.getId());
    }

    // =======================================================================
    // 5. ELIMINACIÓN FÍSICA TOTAL (HARD DELETE)
    // =======================================================================
    @Transactional
    public void eliminarProductoPermanente(Integer id) {
        // 1. Verificar si existe
        if (!productoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Producto", "id", id.toString());
        }

        // 2. Borrar en orden jerárquico (Hijos -> Padre)

        // A. VENTAS (El error que te salía): Borramos el historial de ventas de este
        // producto
        // IMPORTANTE: Requiere que hayas agregado "void deleteByProductoId(Integer
        // id);" en DetalleVentaRepository
        detalleVentaRepository.deleteByProductoId(id);

        // B. Movimientos (Historial) - Suele ser el candado más fuerte
        movimientoInventarioRepository.deleteByProductoId(id);

        // C. Inventario (Stock actual)
        inventarioRepository.deleteByProductoId(id);

        // D. Códigos de Barras
        codigoBarrasRepository.deleteByProductoId(id);

        // E. Relación con Proveedores
        proveedorProductoRepository.deleteByProductoId(id);

        // F. FINALMENTE: El Producto
        productoRepository.deleteById(id);
    }

}