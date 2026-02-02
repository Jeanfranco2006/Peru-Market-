package com.perumarket.erp.controller;

import com.perumarket.erp.models.entity.Conductor;
import com.perumarket.erp.repository.ConductorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/conductores")
@RequiredArgsConstructor
public class ConductorController {

    private final ConductorRepository conductorRepository;

    @GetMapping
    public ResponseEntity<List<Conductor>> getAll() {
        return ResponseEntity.ok(conductorRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Conductor> getById(@PathVariable Integer id) {
        return conductorRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Conductor> create(@RequestBody Conductor conductor) {
        Conductor saved = conductorRepository.save(conductor);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Conductor> update(@PathVariable Integer id, @RequestBody Conductor conductor) {
        return conductorRepository.findById(id)
                .map(existing -> {
                    if (conductor.getNombres() != null) {
                        existing.setNombres(conductor.getNombres());
                    }
                    if (conductor.getApellidoPaterno() != null) {
                        existing.setApellidoPaterno(conductor.getApellidoPaterno());
                    }
                    if (conductor.getApellidoMaterno() != null) {
                        existing.setApellidoMaterno(conductor.getApellidoMaterno());
                    }
                    if (conductor.getTelefono() != null) {
                        existing.setTelefono(conductor.getTelefono());
                    }
                    if (conductor.getNumeroDocumento() != null) {
                        existing.setNumeroDocumento(conductor.getNumeroDocumento());
                    }
                    if (conductor.getLicencia() != null) {
                        existing.setLicencia(conductor.getLicencia());
                    }
                    if (conductor.getCategoriaLicencia() != null) {
                        existing.setCategoriaLicencia(conductor.getCategoriaLicencia());
                    }
                    if (conductor.getEstado() != null) {
                        existing.setEstado(conductor.getEstado());
                    }
                    return ResponseEntity.ok(conductorRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        return conductorRepository.findById(id)
                .map(existing -> {
                    conductorRepository.deleteById(id);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
