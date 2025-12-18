package com.perumarket.erp.service;

import com.perumarket.erp.models.dto.CompraDTO;
import com.perumarket.erp.models.dto.DetalleCompraDTO;
import com.perumarket.erp.models.entity.*;
import com.perumarket.erp.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

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
        compra.setEstado(dto.getEstado());
        compra.setMetodoPago(dto.getMetodoPago());
        compra.setObservaciones(dto.getObservaciones());

        for (DetalleCompraDTO dDto : dto.getDetalles()) {
            DetalleCompra detalle = new DetalleCompra();
            Producto prod = productoRepository.findById(dDto.getIdProducto())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

            detalle.setProducto(prod);
            detalle.setCantidad(dDto.getCantidad());
            detalle.setPrecioUnitario(dDto.getPrecioUnitario());
            detalle.setSubtotal(dDto.getSubtotal());
            detalle.setCompra(compra);
            compra.getDetalles().add(detalle);
        }

        return compraRepository.save(compra);
    }

    // 2. LISTAR TODAS (Ordenadas por ID descendente para ver las nuevas primero)
    public List<Compra> listarTodas() {
        return compraRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
    }

    // 3. BUSCAR POR ID
    public Compra obtenerCompraPorId(Integer id) {
        return compraRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Compra no encontrada"));
    }
}