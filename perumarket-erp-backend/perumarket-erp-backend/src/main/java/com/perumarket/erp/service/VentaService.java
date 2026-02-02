package com.perumarket.erp.service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import com.perumarket.erp.models.dto.DetalleVentaDTO;
import com.perumarket.erp.models.dto.DetalleVentaResponseDTO;
import com.perumarket.erp.models.dto.VentaDTO;
import com.perumarket.erp.models.dto.VentaResponseDTO;
import com.perumarket.erp.models.entity.*;
import com.perumarket.erp.repository.*;

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
    private final MovimientoInventarioRepository movimientoInventarioRepository;
    private final AlmacenRepository almacenRepository;
    private final ClienteRepository clienteRepository;
    private final EnvioRepository envioRepository;

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
        // Si la venta tiene envio, queda PENDIENTE; sino, COMPLETADA
        if (dto.getConEnvio() != null && dto.getConEnvio()) {
            venta.setEstado(Venta.EstadoVenta.PENDIENTE);
        } else {
            venta.setEstado(Venta.EstadoVenta.COMPLETADA);
        }
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

                int stockAnterior = inventario.getStockActual();
                int stockNuevo = stockAnterior - det.getCantidad();
                inventario.setStockActual(stockNuevo);
                inventarioRepository.save(inventario);

                // Crear movimiento de inventario (SALIDA por venta)
                Producto producto = inventario.getProducto();
                Almacen almacen = almacenRepository.findById(dto.getIdAlmacen())
                        .orElse(null);
                if (almacen != null) {
                    MovimientoInventario movimiento = new MovimientoInventario();
                    movimiento.setInventario(inventario);
                    movimiento.setProducto(producto);
                    movimiento.setAlmacen(almacen);
                    movimiento.setTipoMovimiento(MovimientoInventario.TipoMovimiento.SALIDA);
                    movimiento.setCantidad(det.getCantidad());
                    movimiento.setStockAnterior(stockAnterior);
                    movimiento.setStockNuevo(stockNuevo);
                    movimiento.setMotivo("Salida por venta");
                    if (dto.getIdUsuario() != null) {
                        movimiento.setIdUsuario(dto.getIdUsuario().intValue());
                    }
                    movimientoInventarioRepository.save(movimiento);
                }

                // Actualizar stock global del producto
                int stockGlobalActual = producto.getStock() != null ? producto.getStock() : 0;
                int nuevoStockGlobal = Math.max(0, stockGlobalActual - det.getCantidad());
                producto.setStock(nuevoStockGlobal);
                productoRepository.save(producto);

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
        ventaRepository.save(venta);

        // Si tiene envio, crear envio automaticamente
        if (dto.getConEnvio() != null && dto.getConEnvio() && dto.getDireccionEnvio() != null) {
            Envio envio = new Envio();
            envio.setIdVenta(venta.getId());
            envio.setDireccionEnvio(dto.getDireccionEnvio());
            envio.setFechaEnvio(java.time.LocalDate.now());
            envio.setEstado(Envio.EstadoEnvio.PENDIENTE);
            envioRepository.save(envio);
        }

        return venta;
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
        ventaDTO.setFecha(venta.getFecha());
        ventaDTO.setFechaCreacion(venta.getFechaCreacion());
        ventaDTO.setDetalles(detallesDTO);

        // Nombre del usuario
        if (venta.getUsuario() != null && venta.getUsuario().getPersona() != null) {
            Persona personaUsuario = venta.getUsuario().getPersona();
            ventaDTO.setNombreUsuario(personaUsuario.getNombres() + " " + personaUsuario.getApellidoPaterno());
        }

        // Nombre del cliente
        if (venta.getIdCliente() != null) {
            clienteRepository.findById(venta.getIdCliente().longValue()).ifPresent(cliente -> {
                if (cliente.getPersona() != null) {
                    Persona personaCliente = cliente.getPersona();
                    ventaDTO.setNombreCliente(personaCliente.getNombres() + " " + personaCliente.getApellidoPaterno());
                }
            });
        }

        // Nombre del almacén
        if (venta.getIdAlmacen() != null) {
            almacenRepository.findById(venta.getIdAlmacen()).ifPresent(almacen -> {
                ventaDTO.setNombreAlmacen(almacen.getNombre());
            });
        }

        return ventaDTO;
    }

    @Transactional(readOnly = true)
    public List<VentaResponseDTO> listarVentasConImagen() {
        return ventaRepository.findAll().stream()
                .map(v -> obtenerVentaConDetallesConImagen(v.getId()))
                .toList();
    }

    @Transactional
    public Venta actualizarEstadoVenta(Integer id, String nuevoEstado) {
        Venta venta = ventaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Venta no encontrada ID: " + id));
        try {
            Venta.EstadoVenta estado = Venta.EstadoVenta.valueOf(nuevoEstado);
            venta.setEstado(estado);
            return ventaRepository.save(venta);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Estado invalido: " + nuevoEstado);
        }
    }
}
