package com.perumarket.erp.controller;

import com.perumarket.erp.models.dto.CompraDTO;
import com.perumarket.erp.models.entity.Compra;
import com.perumarket.erp.service.CompraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/compras") // Aseguramos la ruta estándar /api
@CrossOrigin(origins = "http://localhost:5173") // Permite la conexión con tu Frontend React
public class CompraController {

    @Autowired
    private CompraService compraService;

    // 1. CREAR COMPRA (POST)
    // MEJORA: Devuelve un Map simple en lugar de la Entidad para evitar Error 500 por recursión
    @PostMapping
    public ResponseEntity<?> crearCompra(@RequestBody CompraDTO compraDTO) {
        try {
            Compra nuevaCompra = compraService.registrarCompra(compraDTO);
            
            // Construimos una respuesta simple y segura
            Map<String, Object> respuesta = new HashMap<>();
            respuesta.put("mensaje", "Compra registrada correctamente");
            respuesta.put("id", nuevaCompra.getId());
            respuesta.put("status", "success");

            return ResponseEntity.ok(respuesta);
            
        } catch (Exception e) {
            e.printStackTrace(); // Imprime el error real en la consola de Java para depurar
            return ResponseEntity.badRequest().body("Error al procesar la compra: " + e.getMessage());
        }
    }

    // 2. LISTAR TODAS (GET)
    @GetMapping
    public ResponseEntity<List<Compra>> listarCompras() {
        return ResponseEntity.ok(compraService.listarTodas());
    }

    // 3. OBTENER POR ID (GET)
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerCompra(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(compraService.obtenerCompraPorId(id));
        } catch (Exception e) {
            return ResponseEntity.status(404).body("Error: " + e.getMessage());
        }
    }
}