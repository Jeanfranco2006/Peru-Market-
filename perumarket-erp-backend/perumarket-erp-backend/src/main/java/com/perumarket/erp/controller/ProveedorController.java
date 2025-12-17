package com.perumarket.erp.controller;

import com.perumarket.erp.models.dto.ProductoProveedorResponse;
import com.perumarket.erp.models.dto.ProveedorDTO;
import com.perumarket.erp.models.entity.Proveedor;
import com.perumarket.erp.service.ProveedorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/proveedores")
public class ProveedorController {

    @Autowired
    private ProveedorService proveedorService;

    // ================================================================
    // MÉTODOS AUXILIARES (Conversión DTO <-> Entidad)
    // ================================================================

    private Proveedor convertToEntity(ProveedorDTO dto) {
        Proveedor entity = new Proveedor();
        entity.setId(dto.getId());
        entity.setRuc(dto.getRuc());
        entity.setRazonSocial(dto.getRazonSocial());
        entity.setContacto(dto.getContacto());
        entity.setTelefono(dto.getTelefono());
        entity.setCorreo(dto.getCorreo());
        entity.setDireccion(dto.getDireccion());
        try {
            entity.setEstado(Proveedor.EstadoProveedor.valueOf(dto.getEstado().toUpperCase()));
        } catch (Exception e) {
            entity.setEstado(Proveedor.EstadoProveedor.ACTIVO);
        }
        return entity;
    }

    private ProveedorDTO convertToDto(Proveedor entity) {
        ProveedorDTO dto = new ProveedorDTO();
        dto.setId(entity.getId());
        dto.setRuc(entity.getRuc());
        dto.setRazonSocial(entity.getRazonSocial());
        dto.setContacto(entity.getContacto());
        dto.setTelefono(entity.getTelefono());
        dto.setCorreo(entity.getCorreo());
        dto.setDireccion(entity.getDireccion());
        dto.setEstado(entity.getEstado().name());
        return dto;
    }

    // ================================================================
    // ENDPOINTS CRUD GENERAL DE PROVEEDORES
    // ================================================================

    @GetMapping
    public ResponseEntity<List<ProveedorDTO>> getAllProveedores() {
        List<Proveedor> proveedores = proveedorService.findAll();
        List<ProveedorDTO> dtos = proveedores.stream().map(this::convertToDto).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PostMapping
    public ResponseEntity<?> createProveedor(@RequestBody ProveedorDTO proveedorDTO) {
        try {
            Proveedor proveedor = convertToEntity(proveedorDTO);
            Proveedor savedProveedor = proveedorService.save(proveedor);
            return new ResponseEntity<>(convertToDto(savedProveedor), HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al crear proveedor: Posible RUC duplicado.", HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProveedor(@PathVariable Integer id, @RequestBody ProveedorDTO proveedorDTO) {
        return proveedorService.findById(id).map(existingProveedor -> {
            try {
                existingProveedor.setRuc(proveedorDTO.getRuc());
                existingProveedor.setRazonSocial(proveedorDTO.getRazonSocial());
                existingProveedor.setContacto(proveedorDTO.getContacto());
                existingProveedor.setTelefono(proveedorDTO.getTelefono());
                existingProveedor.setCorreo(proveedorDTO.getCorreo());
                existingProveedor.setDireccion(proveedorDTO.getDireccion());
                existingProveedor.setEstado(Proveedor.EstadoProveedor.valueOf(proveedorDTO.getEstado().toUpperCase()));
                Proveedor updatedProveedor = proveedorService.save(existingProveedor);
                return ResponseEntity.ok(convertToDto(updatedProveedor));
            } catch (Exception e) {
                return new ResponseEntity<>("Error al actualizar proveedor.", HttpStatus.BAD_REQUEST);
            }
        }).orElseGet(() -> new ResponseEntity<>("Proveedor no encontrado", HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProveedor(@PathVariable Integer id) {
        if (proveedorService.findById(id).isPresent()) {
            proveedorService.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<ProveedorDTO>> searchProveedores(@RequestParam(required = false) String q) {
        List<Proveedor> proveedores = proveedorService.searchByRucOrRazonSocial(q);
        List<ProveedorDTO> dtos = proveedores.stream().map(this::convertToDto).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // =======================================================================
    // NUEVOS ENDPOINTS: GESTIÓN DE PRODUCTOS DEL PROVEEDOR
    // (Estos son los que te daban error 404/CORS)
    // =======================================================================

    // 1. Listar productos de un proveedor específico
    @GetMapping("/{id}/productos")
    public ResponseEntity<List<ProductoProveedorResponse>> getProductosProveedor(@PathVariable Integer id) {
        return ResponseEntity.ok(proveedorService.listarProductosDeProveedor(id));
    }

    // 2. Registrar un nuevo producto vinculado al proveedor (con imagen opcional)
    @PostMapping("/{id}/productos")
    public ResponseEntity<?> registrarProductoProveedor(
            @PathVariable Integer id,
            @RequestParam("nombre") String nombre,
            @RequestParam("sku") String sku,
            @RequestParam("precio_compra") BigDecimal precioCompra,
            @RequestParam("peso_kg") BigDecimal pesoKg,
            @RequestParam(value = "imagen", required = false) MultipartFile imagen
    ) {
        try {
            proveedorService.registrarProductoDesdeProveedor(id, nombre, sku, precioCompra, pesoKg, imagen);
            
            // Retornamos un JSON (Map) para que React reciba un objeto válido
            Map<String, String> response = new HashMap<>();
            response.put("mensaje", "Producto registrado exitosamente");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al registrar producto: " + e.getMessage());
        }
    }

    // 3. Eliminar (Desvincular) un producto del catálogo del proveedor
    @DeleteMapping("/productos/{idRelacion}")
    public ResponseEntity<?> eliminarProductoDeProveedor(@PathVariable Integer idRelacion) {
        try {
            proveedorService.desvincularProducto(idRelacion);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}