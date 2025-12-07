package com.perumarket.erp.service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import com.perumarket.erp.models.dto.DetalleVentaDTO;
import com.perumarket.erp.models.dto.DetalleVentaResponseDTO;
import com.perumarket.erp.models.dto.VentaDTO;
import com.perumarket.erp.models.dto.VentaResponseDTO;
import com.perumarket.erp.models.entity.DetalleVenta;
import com.perumarket.erp.models.entity.Inventario;
import com.perumarket.erp.models.entity.Producto;
import com.perumarket.erp.models.entity.Usuario;
import com.perumarket.erp.models.entity.Venta;
import com.perumarket.erp.repository.InventarioRepository;
import com.perumarket.erp.repository.ProductoRepository;
import com.perumarket.erp.repository.UsuarioRepository;
import com.perumarket.erp.repository.VentaRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VentaService {

    private final VentaRepository ventaRepository;
    private final InventarioRepository inventarioRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProductoRepository productoRepository;

    @Transactional
    public Venta procesarVenta(VentaDTO dto) {
        Usuario usuario = usuarioRepository.findUsuarioById(dto.getIdUsuario().longValue())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + dto.getIdUsuario()));

        Venta venta = new Venta();
        venta.setUsuario(usuario);
        venta.setIdCliente(dto.getIdCliente());
        venta.setIdAlmacen(dto.getIdAlmacen());
        venta.setSubtotal(dto.getSubtotal());
        venta.setDescuentoTotal(dto.getDescuentoTotal() != null ? dto.getDescuentoTotal() : 0.0);
        venta.setIgv(dto.getIgv());
        venta.setTotal(dto.getTotal());
        venta.setEstado(Venta.EstadoVenta.PENDIENTE);
        venta.setFecha(LocalDateTime.now());

        List<DetalleVenta> detalles = new ArrayList<>();

        if (dto.getDetalles() != null) {
            for (DetalleVentaDTO det : dto.getDetalles()) {
                Optional<Inventario> invOpt = inventarioRepository.findByProductoIdAndAlmacenId(
                        det.getIdProducto(), dto.getIdAlmacen());
                if (invOpt.isEmpty()) {
                    throw new RuntimeException("Inventario no encontrado para producto ID: " + det.getIdProducto());
                }

                Inventario inventario = invOpt.get();
                if (inventario.getStockActual() < det.getCantidad()) {
                    throw new RuntimeException(
                            "Stock insuficiente para producto: " + inventario.getProducto().getNombre() +
                                    " | Stock actual: " + inventario.getStockActual() +
                                    ", Cantidad solicitada: " + det.getCantidad());
                }

                inventario.setStockActual(inventario.getStockActual() - det.getCantidad());
                inventarioRepository.save(inventario);

                DetalleVenta detalleVenta = new DetalleVenta();
                detalleVenta.setIdProducto(det.getIdProducto());
                detalleVenta.setCantidad(det.getCantidad());
                detalleVenta.setPrecioUnitario(det.getPrecioUnitario());
                detalleVenta.setSubtotal(det.getSubtotal());
                detalleVenta.setVenta(venta);
                detalles.add(detalleVenta);
            }
        }

        venta.setDetalles(detalles);
        return ventaRepository.save(venta);
    }

    @Transactional(readOnly = true)
    public VentaResponseDTO obtenerVentaConDetallesConImagen(Integer ventaId) {
        Venta venta = ventaRepository.findById(ventaId)
                .orElseThrow(() -> new RuntimeException("Venta no encontrada ID: " + ventaId));

        // Traemos todos los IDs de productos para optimizar consultas
        List<Integer> productoIds = venta.getDetalles().stream()
                .map(DetalleVenta::getIdProducto)
                .toList();

        Map<Integer, Producto> productosMap = productoRepository.findAllById(productoIds).stream()
                .collect(Collectors.toMap(Producto::getId, p -> p));

        // Construimos los DetalleVentaResponseDTO con nombre e imagen
        List<DetalleVentaResponseDTO> detallesDTO = venta.getDetalles().stream()
                .map(det -> {
                    DetalleVentaResponseDTO dto = new DetalleVentaResponseDTO(det);
                    Producto producto = productosMap.get(det.getIdProducto());
                    if (producto != null) {
                        dto.setNombreProducto(producto.getNombre());
                        dto.setImagen(producto.getImagen());
                    }
                    return dto;
                }).toList();

        VentaResponseDTO ventaDTO = new VentaResponseDTO();
        ventaDTO.setId(venta.getId());
        ventaDTO.setSubtotal(venta.getSubtotal());
        ventaDTO.setDescuentoTotal(venta.getDescuentoTotal());
        ventaDTO.setIgv(venta.getIgv());
        ventaDTO.setTotal(venta.getTotal());
        ventaDTO.setIdCliente(venta.getIdCliente());
        ventaDTO.setIdAlmacen(venta.getIdAlmacen());
        ventaDTO.setEstado(venta.getEstado().name());
        ventaDTO.setDetalles(detallesDTO);

        return ventaDTO;
    }

    @Transactional(readOnly = true)
    public List<VentaResponseDTO> listarVentasConImagen() {
        return ventaRepository.findAll().stream()
                .map(v -> obtenerVentaConDetallesConImagen(v.getId()))
                .toList();
    }
}
