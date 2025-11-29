package com.perumarket.erp.controller;

import com.perumarket.erp.models.dto.AlmacenDTO;
import com.perumarket.erp.models.dto.AlmacenRequest;
import com.perumarket.erp.service.AlmacenService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/almacenes") // Ruta completa: /api/almacenes
public class AlmacenController {

    private final AlmacenService almacenService;

    public AlmacenController(AlmacenService almacenService) {
        this.almacenService = almacenService;
    }

    @PostMapping
    public ResponseEntity<AlmacenDTO> crearAlmacen(@Valid @RequestBody AlmacenRequest almacenRequest) {
        AlmacenDTO nuevoAlmacen = almacenService.crearAlmacen(almacenRequest);
        return new ResponseEntity<>(nuevoAlmacen, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<AlmacenDTO>> obtenerTodosAlmacenes() {
        List<AlmacenDTO> almacenes = almacenService.obtenerTodosAlmacenes();
        return ResponseEntity.ok(almacenes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AlmacenDTO> obtenerAlmacenPorId(@PathVariable(name = "id") Integer id) {
        AlmacenDTO almacen = almacenService.obtenerAlmacenPorId(id);
        return ResponseEntity.ok(almacen);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AlmacenDTO> actualizarAlmacen(@PathVariable(name = "id") Integer id, 
                                                       @Valid @RequestBody AlmacenRequest almacenRequest) {
        AlmacenDTO almacenActualizado = almacenService.actualizarAlmacen(id, almacenRequest);
        return ResponseEntity.ok(almacenActualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminarAlmacen(@PathVariable(name = "id") Integer id) {
        almacenService.eliminarAlmacen(id);
        return new ResponseEntity<>("Almacén eliminado exitosamente.", HttpStatus.OK);
    }
}