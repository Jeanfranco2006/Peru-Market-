package com.perumarket.erp.controller;

import java.util.List;
import java.util.Map;

import com.perumarket.erp.models.dto.EnvioDTO;
import com.perumarket.erp.models.dto.EnvioResponseDTO;
import com.perumarket.erp.models.entity.Envio;
import com.perumarket.erp.service.EnvioService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/envios")
@RequiredArgsConstructor
public class EnvioController {

    private final EnvioService envioService;

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody EnvioDTO dto) {
        try {
            Envio envio = envioService.crearEnvio(dto);
            EnvioResponseDTO response = envioService.obtenerPorId(envio.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public List<EnvioResponseDTO> listar() {
        return envioService.listarEnvios();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(envioService.obtenerPorId(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Integer id, @RequestBody EnvioDTO dto) {
        try {
            Envio envio = envioService.actualizarEnvio(id, dto);
            return ResponseEntity.ok(envioService.obtenerPorId(envio.getId()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<?> actualizarEstado(@PathVariable Integer id, @RequestBody Map<String, String> body) {
        try {
            String nuevoEstado = body.get("estado");
            if (nuevoEstado == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Campo 'estado' es requerido"));
            }
            Envio envio = envioService.actualizarEstado(id, nuevoEstado);
            return ResponseEntity.ok(envioService.obtenerPorId(envio.getId()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Integer id) {
        try {
            envioService.eliminarEnvio(id);
            return ResponseEntity.ok(Map.of("mensaje", "Envio eliminado correctamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
