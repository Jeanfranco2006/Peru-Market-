package com.perumarket.erp.controller;

import com.perumarket.erp.models.entity.Ruta;
import com.perumarket.erp.repository.RutaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rutas")
@RequiredArgsConstructor
public class RutaController {

    private final RutaRepository rutaRepository;

    @GetMapping
    public ResponseEntity<List<Ruta>> getAll() {
        return ResponseEntity.ok(rutaRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ruta> getById(@PathVariable Integer id) {
        return rutaRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Ruta> create(@RequestBody Ruta ruta) {
        Ruta saved = rutaRepository.save(ruta);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Ruta> update(@PathVariable Integer id, @RequestBody Ruta ruta) {
        return rutaRepository.findById(id)
                .map(existing -> {
                    ruta.setId(id);
                    return ResponseEntity.ok(rutaRepository.save(ruta));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        return rutaRepository.findById(id)
                .map(existing -> {
                    rutaRepository.deleteById(id);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
