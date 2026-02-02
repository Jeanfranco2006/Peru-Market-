package com.perumarket.erp.controller;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping; // <-- NECESARIO PARA LISTAR
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart; // NECESARIO PARA LISTAR
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.perumarket.erp.models.dto.CatalogoProductoDTO;
import com.perumarket.erp.models.dto.MovimientoInventarioDTO;
import com.perumarket.erp.models.dto.ProductoRequest;
import com.perumarket.erp.models.dto.ProductoResponse;
import com.perumarket.erp.models.entity.Producto;
import com.perumarket.erp.models.entity.Producto.EstadoProducto;
import com.perumarket.erp.service.ProductoService;

import jakarta.validation.Valid;

@RestController
// El path de acceso debe ser el complemento del context-path: /api + /productos
// Asumiendo que tu context-path es /api, esto está bien, pero lo definiremos
// completo para mayor claridad
@RequestMapping("/productos") // <-- CAMBIO A /api/productos para coincidir con el frontend
public class ProductoController {

    private final ProductoService productoService;

    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }

    // 1. ENDPOINT PARA LISTAR PRODUCTOS (GET) - SOLUCIÓN AL ERROR 405
    @GetMapping
    public ResponseEntity<List<ProductoResponse>> obtenerTodosProductos() {
        // Llama al servicio que combina la información de Producto, Inventario,
        // Proveedor, etc.
        List<ProductoResponse> productos = productoService.obtenerTodosProductosConStock();
        return ResponseEntity.ok(productos); // Devuelve HTTP 200 OK
    }

    // 2. ENDPOINT PARA CREAR PRODUCTOS (POST)
@PostMapping(consumes = "multipart/form-data")
public ResponseEntity<?> crearProducto(
        @Valid @RequestPart("data") ProductoRequest request,
        @RequestPart(value = "imagen", required = false) MultipartFile imagen
) {
    try {
        Producto productoCreado = productoService.crearProductoYStockInicial(request, imagen);
        return new ResponseEntity<>(productoCreado, HttpStatus.CREATED);

    } catch (RuntimeException e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", e.getMessage()));
    }
}

  /*   @PostMapping
    public ResponseEntity<Producto> crearProducto(@Valid @RequestBody ProductoRequest request) {
        Producto productoCreado = productoService.crearProductoYStockInicial(request);
        return new ResponseEntity<>(productoCreado, HttpStatus.CREATED);
    } */

    // ENDPOINT PARA OBTENER CATALOGO DE PRODUCTOS DE PROVEEDORES
    @GetMapping("/catalogo")
    public ResponseEntity<List<CatalogoProductoDTO>> obtenerCatalogo() {
        List<CatalogoProductoDTO> catalogo = productoService.obtenerProductosCatalogo();
        return ResponseEntity.ok(catalogo);
    }

    // 3. 🆕 ENDPOINT PARA OBTENER UN PRODUCTO POR ID (GET /productos/{id})
    // Necesario para precargar el formulario de edición
    @GetMapping("/{id}")
    public ResponseEntity<ProductoResponse> obtenerProductoPorId(@PathVariable Integer id) {
        ProductoResponse producto = productoService.obtenerProductoPorId(id);
        return ResponseEntity.ok(producto);
    }

    // 4. 🆕 ENDPOINT PARA ACTUALIZAR UN PRODUCTO (PUT /productos/{id})
    // CAMBIO 1: Actualizar el endpoint PUT para aceptar MultipartFile
@PutMapping(value = "/{id}", consumes = "multipart/form-data")
public ResponseEntity<ProductoResponse> actualizarProducto(
        @PathVariable Integer id,
        @Valid @RequestPart("data") ProductoRequest request,
        @RequestPart(value = "imagen", required = false) MultipartFile imagen) {
    
    ProductoResponse productoActualizado = productoService.actualizarProducto(id, request, imagen);
    return ResponseEntity.ok(productoActualizado);
}

    // 5. 🆕 ENDPOINT PARA DESACTIVAR UN PRODUCTO (DELETE /productos/{id})
    // Se usa DELETE para la acción, pero es una "eliminación lógica"
    /*@DeleteMapping("/{id}")
    public ResponseEntity<Void> desactivarProducto(@PathVariable Integer id) {
        productoService.desactivarProducto(id);
        return ResponseEntity.noContent().build(); // 204 No Content: éxito sin contenido de respuesta
    }*/

    // MÉTODO NECESARIO PARA ACTIVAR/DESACTIVAR
    @PatchMapping("/{id}/estado")
    public ResponseEntity<ProductoResponse> updateEstadoProducto(@PathVariable Integer id, @RequestBody String estado) {
        try {
            // El cuerpo del Request body DEBE ser el String "ACTIVO" o "INACTIVO"
            EstadoProducto nuevoEstado = EstadoProducto.valueOf(estado.toUpperCase());

            // Llama al método del servicio para cambiar el estado
            ProductoResponse productoActualizado = productoService.cambiarEstadoProducto(id, nuevoEstado);

            return ResponseEntity.ok(productoActualizado);
        } catch (IllegalArgumentException e) {
            // Error si el string del estado es inválido
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}/movimientos")
    public ResponseEntity<List<MovimientoInventarioDTO>> getHistorialMovimientos(@PathVariable Integer id) {
        // Asegúrate de que el método en el servicio está implementado
        List<MovimientoInventarioDTO> historial = productoService.obtenerHistorialMovimientos(id);
        return ResponseEntity.ok(historial);
    }
    
    // 5. ENDPOINT PARA ELIMINAR UN PRODUCTO PERMANENTEMENTE (DELETE /productos/{id})
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarProducto(@PathVariable Integer id) {
        try {
            productoService.eliminarProductoPermanente(id);
            // Retornamos un mensaje JSON de éxito
            return ResponseEntity.ok().body("{\"message\": \"Producto y todos sus datos eliminados correctamente.\"}");
        } catch (Exception e) {
            // Manejo de errores (por ejemplo, si el producto ya fue vendido y está en 'DetalleVenta')
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"message\": \"No se pudo eliminar: " + e.getMessage() + "\"}");
        }
    }
    
// 6. ENDPOINT PARA ACTUALIZAR STOCK DE UN PRODUCTO
@PutMapping("/{id}/stock")
public ResponseEntity<ProductoResponse> actualizarStockProducto(
        @PathVariable Integer id,
        @RequestBody Map<String, Integer> body) { // JSON esperado: { "stock": 50 }
    
    Integer nuevoStock = body.get("stock");
    if (nuevoStock == null || nuevoStock < 0) {
        return ResponseEntity.badRequest().build();
    }

    ProductoResponse productoActualizado = productoService.actualizarStock(id, nuevoStock);
    return ResponseEntity.ok(productoActualizado);
}
// ENDPOINT PARA GENERAR CÓDIGO DE BARRAS
@PatchMapping("/{id}/barcode")
public ResponseEntity<?> generarCodigoBarras(
        @PathVariable Integer id,
        @RequestBody Map<String, String> body) {
    try {
        String codigo = body.get("codigoBarras");
        if (codigo == null || codigo.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "El código de barras es requerido"));
        }
        ProductoResponse productoActualizado = productoService.generarCodigoBarras(id, codigo);
        return ResponseEntity.ok(productoActualizado);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", e.getMessage()));
    }
}

@GetMapping("/unidades-medida")
public ResponseEntity<List<Map<String, String>>> obtenerUnidadesMedida() {
    List<Map<String, String>> unidades = Arrays.stream(Producto.UnidadMedida.values())
            .map(u -> Map.of("valor", u.name(), "etiqueta", obtenerEtiquetaUnidad(u)))
            .toList();
    return ResponseEntity.ok(unidades);
}

private String obtenerEtiquetaUnidad(Producto.UnidadMedida unidad) {
    return switch (unidad) {
        case UNIDAD -> "Unidad (und)";
        case CAJA -> "Caja";
        case PAQUETE -> "Paquete";
        case DOCENA -> "Docena (12 und)";
        case KG -> "Kilogramo (kg)";
        case GRAMO -> "Gramo (g)";
        case LITRO -> "Litro (L)";
        case MILILITRO -> "Mililitro (mL)";
        case METRO -> "Metro (m)";
        case GALON -> "Galón (gal)";
        case SACO -> "Saco";
        case BOLSA -> "Bolsa";
        case LIBRA -> "Libra (lb)";
        case ROLLO -> "Rollo";
        case PAR -> "Par";
    };
}

@GetMapping("/venta")
public ResponseEntity<List<ProductoResponse>> obtenerProductosParaVenta(
        @RequestParam(required = false) Integer almacenId) {
    List<ProductoResponse> productos = productoService.obtenerProductosParaVenta(almacenId);
    return ResponseEntity.ok(productos);
}


}