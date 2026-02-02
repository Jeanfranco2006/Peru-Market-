package com.perumarket.erp.controller;

import java.util.List;
import java.util.Map;

import com.perumarket.erp.models.dto.VentaDTO;
import com.perumarket.erp.models.dto.VentaResponseDTO;
import com.perumarket.erp.models.entity.Venta;
import com.perumarket.erp.service.VentaService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/ventas")
@RequiredArgsConstructor
public class VentaController {

    private final VentaService ventaService;

    // Registrar una nueva venta
    @PostMapping
    public ResponseEntity<?> registrar(@RequestBody VentaDTO ventaDTO) {
        try {
            Venta venta = ventaService.procesarVenta(ventaDTO);
            VentaResponseDTO response = ventaService.obtenerVentaConDetallesConImagen(venta.getId());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // Listar todas las ventas
    @GetMapping
    public List<VentaResponseDTO> listar() {
        return ventaService.listarVentasConImagen();
    }

    // Obtener una venta específica por ID
    @GetMapping("/{id}")
    public VentaResponseDTO obtenerPorId(@PathVariable Integer id) {
        return ventaService.obtenerVentaConDetallesConImagen(id);
    }

    // Cambiar estado de una venta
    @PatchMapping("/{id}/estado")
    public ResponseEntity<?> actualizarEstado(@PathVariable Integer id, @RequestBody java.util.Map<String, String> body) {
        try {
            String nuevoEstado = body.get("estado");
            if (nuevoEstado == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Campo 'estado' es requerido"));
            }
            Venta venta = ventaService.actualizarEstadoVenta(id, nuevoEstado);
            VentaResponseDTO response = ventaService.obtenerVentaConDetallesConImagen(venta.getId());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
