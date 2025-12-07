package com.perumarket.erp.controller;

import java.util.List;

import com.perumarket.erp.models.dto.VentaDTO;
import com.perumarket.erp.models.dto.VentaResponseDTO;
import com.perumarket.erp.models.entity.Venta;
import com.perumarket.erp.service.VentaService;

import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/ventas")
@RequiredArgsConstructor
public class VentaController {

    private final VentaService ventaService;

    // Registrar una nueva venta
    @PostMapping
    public VentaResponseDTO registrar(@RequestBody VentaDTO ventaDTO) {
        Venta venta = ventaService.procesarVenta(ventaDTO);
        // Retornamos la venta ya mapeada con imágenes y nombre de productos
        return ventaService.obtenerVentaConDetallesConImagen(venta.getId());
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
}
