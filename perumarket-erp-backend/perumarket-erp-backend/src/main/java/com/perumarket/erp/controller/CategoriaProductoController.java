package com.perumarket.erp.controller;

import com.perumarket.erp.models.dto.CategoriaProductoDTO;
import com.perumarket.erp.service.CategoriaProductoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/categorias")
public class CategoriaProductoController {

    private final CategoriaProductoService categoriaProductoService;

    public CategoriaProductoController(CategoriaProductoService categoriaProductoService) {
        this.categoriaProductoService = categoriaProductoService;
    }

    @GetMapping
    public ResponseEntity<List<CategoriaProductoDTO>> obtenerTodasCategorias() {
        return ResponseEntity.ok(categoriaProductoService.obtenerTodasCategorias());
    }
}