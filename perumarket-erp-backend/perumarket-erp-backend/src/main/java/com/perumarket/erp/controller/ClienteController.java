package com.perumarket.erp.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.perumarket.erp.exception.DataIntegrityViolationException;
import com.perumarket.erp.models.dto.ClienteDTO;
import com.perumarket.erp.models.entity.Cliente.TipoCliente;
import com.perumarket.erp.service.ClienteService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/clientes")
@RequiredArgsConstructor
public class ClienteController {

    private final ClienteService clienteService;

    // LISTAR TODO
    @GetMapping
    public ResponseEntity<List<ClienteDTO>> listarTodos() {
        return ResponseEntity.ok(clienteService.findAll());
    }

    // BUSCAR POR ID
    @GetMapping("/{id}")
    public ResponseEntity<ClienteDTO> buscarPorId(@PathVariable Long id) {
        return clienteService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // VALIDAR DNI (NUEVO ENDPOINT)
@GetMapping("/check-dni")
public ResponseEntity<Map<String, Object>> checkDniExists(
        @RequestParam String dni,
        @RequestParam(required = false) Long excludeId) {
    
    try {
        // Validar formato básico
        if (dni == null || dni.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of(
                        "valid", false,
                        "message", "El número de documento es requerido"
                    ));
        }
        
        boolean exists = clienteService.checkDniExists(dni, excludeId);
        
        return ResponseEntity.ok(Map.of(
            "exists", exists,
            "valid", true,
            "message", exists ? 
                "El documento ya está registrado" : 
                "Documento disponible"
        ));
        
    } catch (Exception e) {
        return ResponseEntity.badRequest()
                .body(Map.of(
                    "valid", false,
                    "message", "Error al validar el documento: " + e.getMessage()
                ));
    }
}

    // BÚSQUEDA POR FILTROS
    @GetMapping("/search")
    public ResponseEntity<List<ClienteDTO>> buscarPorFiltros(
            @RequestParam(required = false) String texto,
            @RequestParam(required = false) String dni,
            @RequestParam(required = false) TipoCliente tipo
    ) {
        List<ClienteDTO> resultado = clienteService.findByFilters(texto, dni, tipo);
        return ResponseEntity.ok(resultado);
    }

    // CREAR CLIENTE
    @PostMapping
    public ResponseEntity<?> guardar(@Valid @RequestBody ClienteDTO clienteDTO) {
        try {
            ClienteDTO guardado = clienteService.save(clienteDTO);
            return ResponseEntity.ok(guardado);
        } catch (RuntimeException e) {
            // Capturar errores de validación (DNI duplicado)
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // ACTUALIZAR CLIENTE
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody ClienteDTO clienteDTO) {
        
        try {
            return clienteService.update(id, clienteDTO)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (RuntimeException e) {
            // Capturar errores de validación (DNI duplicado)
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    

    // ELIMINAR POR ID
  

@DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            // Intentamos borrar físicamente
            boolean eliminado = clienteService.deleteById(id);
            
            if (eliminado) {
                return ResponseEntity.noContent().build();
            } else {
                return ResponseEntity.notFound().build();
            }

        } catch (DataIntegrityViolationException e) {
            // Caso 1: Excepción estándar de Spring Data
            return ResponseEntity.status(409).body(Map.of(
                "message", "No se puede eliminar: El cliente tiene historial de ventas.",
                "error", "CONSTRAINT_VIOLATION"
            ));
        } catch (Exception e) {
            // Caso 2: Excepción genérica - Inspeccionamos el mensaje
            // Imprime el error real en la consola de Spring Boot para que lo veas
            e.printStackTrace(); 

            String msg = e.getMessage();
            if (msg != null && (msg.contains("Constraint") || msg.contains("constraint") || msg.contains("foreign key"))) {
                 return ResponseEntity.status(409).body(Map.of(
                    "message", "No se puede eliminar: El cliente tiene registros asociados.",
                    "error", "CONSTRAINT_VIOLATION"
                ));
            }

            // Si no es de base de datos, entonces sí devolvemos 500
            return ResponseEntity.internalServerError().body(Map.of(
                "message", "Error interno del servidor: " + e.getMessage()
            ));
        }
    }

    
/**
 * Retorna solo clientes con estado ACTIVO
 */
@GetMapping("/activos")
public ResponseEntity<List<ClienteDTO>> getClientesActivos() {
    try {
        List<ClienteDTO> clientes = clienteService.findAllActivos();
        return ResponseEntity.ok(clientes);
    } catch (Exception e) {
        return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .build();
    }
}
}