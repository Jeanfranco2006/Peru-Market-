package com.perumarket.erp.controller;

import com.perumarket.erp.models.entity.Vehiculo;
import com.perumarket.erp.repository.VehiculoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vehiculos")
@RequiredArgsConstructor
public class VehiculoController {

    private final VehiculoRepository vehiculoRepository;

    @GetMapping
    public ResponseEntity<List<Vehiculo>> getAll() {
        return ResponseEntity.ok(vehiculoRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vehiculo> getById(@PathVariable Integer id) {
        return vehiculoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Vehiculo> create(@RequestBody Vehiculo vehiculo) {
        Vehiculo saved = vehiculoRepository.save(vehiculo);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Vehiculo> update(@PathVariable Integer id, @RequestBody Vehiculo vehiculo) {
        return vehiculoRepository.findById(id)
                .map(existing -> {
                    vehiculo.setId(id);
                    return ResponseEntity.ok(vehiculoRepository.save(vehiculo));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        return vehiculoRepository.findById(id)
                .map(existing -> {
                    vehiculoRepository.deleteById(id);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
