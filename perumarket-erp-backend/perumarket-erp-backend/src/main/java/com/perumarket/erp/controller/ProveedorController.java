package com.perumarket.erp.controller;

import com.perumarket.erp.models.dto.ProveedorDTO;
import com.perumarket.erp.models.entity.Proveedor;
import com.perumarket.erp.service.ProveedorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/proveedores") // Mapeo solo a /proveedores, el /api viene del context-path
public class ProveedorController {

    @Autowired
    private ProveedorService proveedorService;

    // --- Mapeo de DTO a Entidad y viceversa ---

    private Proveedor convertToEntity(ProveedorDTO dto) {
        Proveedor entity = new Proveedor();
        entity.setId(dto.getId()); 
        entity.setRuc(dto.getRuc());
        entity.setRazonSocial(dto.getRazonSocial()); // Usamos el getter/setter de la Entidad
        entity.setContacto(dto.getContacto());
        entity.setTelefono(dto.getTelefono());
        entity.setCorreo(dto.getCorreo());
        entity.setDireccion(dto.getDireccion());
        // Manejo seguro del estado
        try {
            entity.setEstado(Proveedor.EstadoProveedor.valueOf(dto.getEstado().toUpperCase()));
        } catch (IllegalArgumentException e) {
            entity.setEstado(Proveedor.EstadoProveedor.ACTIVO); // Default si falla
        }
        return entity;
    }

    private ProveedorDTO convertToDto(Proveedor entity) {
        ProveedorDTO dto = new ProveedorDTO();
        dto.setId(entity.getId());
        dto.setRuc(entity.getRuc());
        dto.setRazonSocial(entity.getRazonSocial()); // Usamos el getter/setter del DTO
        dto.setContacto(entity.getContacto());
        dto.setTelefono(entity.getTelefono());
        dto.setCorreo(entity.getCorreo());
        dto.setDireccion(entity.getDireccion());
        dto.setEstado(entity.getEstado().name());
        return dto;
    }

    // --- Endpoints CRUD ---

    // GET /api/proveedores
    @GetMapping
    public ResponseEntity<List<ProveedorDTO>> getAllProveedores() {
        List<Proveedor> proveedores = proveedorService.findAll();
        List<ProveedorDTO> dtos = proveedores.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // POST /api/proveedores
    @PostMapping
    public ResponseEntity<?> createProveedor(@RequestBody ProveedorDTO proveedorDTO) {
        try {
            Proveedor proveedor = convertToEntity(proveedorDTO);
            Proveedor savedProveedor = proveedorService.save(proveedor);
            return new ResponseEntity<>(convertToDto(savedProveedor), HttpStatus.CREATED);
        } catch (Exception e) {
            // Error más común: RUC duplicado.
            return new ResponseEntity<>("Error al crear proveedor: RUC duplicado o datos inválidos.", HttpStatus.BAD_REQUEST);
        }
    }

    // PUT /api/proveedores/{id}
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProveedor(@PathVariable Integer id, @RequestBody ProveedorDTO proveedorDTO) {
        return proveedorService.findById(id).map(existingProveedor -> {
            try {
                // Actualizar campos
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
                return new ResponseEntity<>("Error al actualizar proveedor: RUC duplicado o datos inválidos.", HttpStatus.BAD_REQUEST);
            }
        }).orElseGet(() -> new ResponseEntity<>("Proveedor no encontrado", HttpStatus.NOT_FOUND));
    }

    // DELETE /api/proveedores/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProveedor(@PathVariable Integer id) {
        if (proveedorService.findById(id).isPresent()) {
            proveedorService.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // GET /api/proveedores/buscar?q={query}
    @GetMapping("/buscar")
    public ResponseEntity<List<ProveedorDTO>> searchProveedores(@RequestParam(required = false) String q) {
        List<Proveedor> proveedores = proveedorService.searchByRucOrRazonSocial(q);
        List<ProveedorDTO> dtos = proveedores.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
    
}