package com.perumarket.erp.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.perumarket.erp.models.dto.ClienteDTO;
import com.perumarket.erp.models.entity.Cliente.TipoCliente;
import com.perumarket.erp.service.ClienteService;

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


    // BÚSQUEDA POR FILTROS (texto, dni, tipo)

    @GetMapping("/search")
    public ResponseEntity<List<ClienteDTO>> buscarPorFiltros(
            @RequestParam(required = false) String texto,
            @RequestParam(required = false) String dni,
            @RequestParam(required = false) TipoCliente tipo
    ) {
        List<ClienteDTO> resultado = clienteService.findByFilters(texto, dni, tipo);
        return ResponseEntity.ok(resultado);
    }


    // CREAR O ACTUALIZAR CLIENTE

    @PostMapping
    public ResponseEntity<ClienteDTO> guardar(@RequestBody ClienteDTO clienteDTO) {
        ClienteDTO guardado = clienteService.save(clienteDTO);
        return ResponseEntity.ok(guardado);
    }


    // ELIMINAR POR ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        clienteService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
