package com.perumarket.erp.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;
import java.util.Optional;

import com.perumarket.erp.models.dto.VentaDTO;
import com.perumarket.erp.models.dto.DetalleVentaDTO;
import com.perumarket.erp.models.entity.DetalleVenta;
import com.perumarket.erp.models.entity.Inventario;
import com.perumarket.erp.models.entity.Usuario;
import com.perumarket.erp.models.entity.Venta;
import com.perumarket.erp.repository.VentaRepository;
import com.perumarket.erp.repository.InventarioRepository;
import com.perumarket.erp.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VentaService {

    private final VentaRepository ventaRepository;
    private final InventarioRepository inventarioRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional
    public Venta procesarVenta(VentaDTO dto) {

        // --- Buscar usuario ---
        // Usar el objeto inyectado usuarioRepository (minúscula)
        Usuario usuario = usuarioRepository.findUsuarioById(dto.getIdUsuario().longValue())
                .orElseThrow(() -> new RuntimeException(
                        "Usuario no encontrado con ID: " + dto.getIdUsuario()));

        // --- Crear objeto Venta ---
        Venta venta = new Venta();
        venta.setUsuario(usuario); // <--- Asignamos objeto Usuario
        venta.setIdCliente(dto.getIdCliente());
        venta.setIdAlmacen(dto.getIdAlmacen());
        venta.setSubtotal(dto.getSubtotal());
        venta.setDescuentoTotal(dto.getDescuentoTotal() != null ? dto.getDescuentoTotal() : 0.0);
        venta.setIgv(dto.getIgv());
        venta.setTotal(dto.getTotal());
        venta.setEstado(Venta.EstadoVenta.PENDIENTE);
        venta.setFecha(LocalDateTime.now());

        // --- Lista de detalles ---
        List<DetalleVenta> detalles = new ArrayList<>();

        if (dto.getDetalles() != null) {
            for (DetalleVentaDTO det : dto.getDetalles()) {

                // Buscar inventario del producto en el almacén
                Optional<Inventario> invOpt = inventarioRepository.findByProductoIdAndAlmacenId(det.getIdProducto(),
                        dto.getIdAlmacen());
                if (invOpt.isEmpty()) {
                    throw new RuntimeException("Inventario no encontrado para producto ID: " + det.getIdProducto());
                }

                Inventario inventario = invOpt.get();

                // Validar stock disponible
                if (inventario.getStockActual() < det.getCantidad()) {
                    throw new RuntimeException(
                            "Stock insuficiente para producto: " + inventario.getProducto().getNombre() +
                                    " | Stock actual: " + inventario.getStockActual() +
                                    ", Cantidad solicitada: " + det.getCantidad());
                }

                // Restar stock y guardar inventario
                inventario.setStockActual(inventario.getStockActual() - det.getCantidad());
                inventarioRepository.save(inventario);

                // Crear detalle de venta
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

        // Guardar venta con detalles
        return ventaRepository.save(venta);
    }

    // Listar todas las ventas
    public List<Venta> listarVentas() {
        return ventaRepository.findAll();
    }
}
