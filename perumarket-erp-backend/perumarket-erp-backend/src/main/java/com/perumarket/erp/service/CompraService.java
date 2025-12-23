package com.perumarket.erp.service;

import com.perumarket.erp.models.dto.CompraDTO;
import com.perumarket.erp.models.dto.DetalleCompraDTO;
import com.perumarket.erp.models.dto.ProductoPendienteDTO;
import com.perumarket.erp.models.entity.*;
import com.perumarket.erp.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CompraService {

    @Autowired
    private CompraRepository compraRepository;
    @Autowired
    private ProveedorRepository proveedorRepository;
    @Autowired
    private AlmacenRepository almacenRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private ProductoRepository productoRepository;
    @Autowired
    private DetalleCompraRepository detalleCompraRepository;
    @Autowired
    private InventarioRepository inventarioRepository;

    public List<ProductoPendienteDTO> obtenerPendientesPorAlmacen(Long almacenId) {
        return detalleCompraRepository.findProductosPendientesPorAlmacen(almacenId);
    }

    // 1. REGISTRAR
    @Transactional
    public Compra registrarCompra(CompraDTO dto) {
        Compra compra = new Compra();

        Proveedor prov = proveedorRepository.findById(dto.getIdProveedor())
                .orElseThrow(() -> new RuntimeException("Proveedor no encontrado"));
        Almacen alm = almacenRepository.findById(dto.getIdAlmacen())
                .orElseThrow(() -> new RuntimeException("Almacén no encontrado"));
        Usuario user = usuarioRepository.findById(Long.valueOf(dto.getIdUsuario()))
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        compra.setProveedor(prov);
        compra.setAlmacen(alm);
        compra.setUsuario(user);
        compra.setTipoComprobante(dto.getTipoComprobante());
        compra.setNumeroComprobante(dto.getNumeroComprobante());
        compra.setSubtotal(dto.getSubtotal());
        compra.setIgv(dto.getIgv());
        compra.setTotal(dto.getTotal());
        
        // --- CORRECCIÓN DEL ERROR AQUÍ ---
        // Convertimos el String del DTO al Enum de la Entidad
        try {
            if (dto.getEstado() != null) {
                compra.setEstado(Compra.Estado.valueOf(dto.getEstado()));
            } else {
                compra.setEstado(Compra.Estado.PENDIENTE); // Valor por defecto
            }
        } catch (IllegalArgumentException e) {
            // Si envían un estado que no existe (ej: "EN_PROCESO"), forzamos PENDIENTE
            compra.setEstado(Compra.Estado.PENDIENTE);
        }
        // ---------------------------------

        compra.setMetodoPago(dto.getMetodoPago());
        compra.setObservaciones(dto.getObservaciones());

        compra = compraRepository.save(compra);

        for (DetalleCompraDTO dDto : dto.getDetalles()) {
            DetalleCompra detalle = new DetalleCompra();
            Producto prod = productoRepository.findById(dDto.getIdProducto())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

            // Actualizar Inventario (Stock por Almacén)
            Optional<Inventario> invOpt = inventarioRepository.findByProductoIdAndAlmacenId(dDto.getIdProducto(), dto.getIdAlmacen());
            Inventario inventario = invOpt.orElseGet(() -> {
                Inventario nuevo = new Inventario();
                nuevo.setProducto(prod);
                nuevo.setAlmacen(alm);
                nuevo.setStockActual(0);
                nuevo.setStockMinimo(10);
                nuevo.setStockMaximo(1000);
                return nuevo;
            });

            inventario.setStockActual(inventario.getStockActual() + dDto.getCantidad());
            inventarioRepository.save(inventario);

            // Actualizar Producto (Stock Global)
            int stockGlobal = prod.getStock() != null ? prod.getStock() : 0;
            prod.setStock(stockGlobal + dDto.getCantidad());
            prod.setPrecioCompra(dDto.getPrecioUnitario());
            productoRepository.save(prod);

            detalle.setProducto(prod);
            detalle.setCantidad(dDto.getCantidad());
            detalle.setPrecioUnitario(dDto.getPrecioUnitario());
            detalle.setSubtotal(dDto.getSubtotal());
            detalle.setCompra(compra);
            
            detalleCompraRepository.save(detalle); 
        }

        return compra;
    }

    // 2. LISTAR TODAS
    public List<Compra> listarTodas() {
        return compraRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
    }

    // 3. OBTENER POR ID
    public Compra obtenerCompraPorId(Integer id) {
        return compraRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Compra no encontrada"));
    }

    // 4. ACTUALIZAR ESTADO
    public Compra actualizarEstado(Integer id, String nuevoEstado) {
        Compra compra = compraRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Compra no encontrada"));
        
        try {
            compra.setEstado(Compra.Estado.valueOf(nuevoEstado));
            return compraRepository.save(compra);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Estado inválido proporcionado: " + nuevoEstado);
        }
    }
}