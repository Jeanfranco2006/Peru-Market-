package com.perumarket.erp.repository;

import com.perumarket.erp.models.dto.ProductoPendienteDTO;
import com.perumarket.erp.models.entity.DetalleCompra;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface DetalleCompraRepository extends JpaRepository<DetalleCompra, Long> {
    @Query(value = "SELECT " +
            "MAX(p.id) AS idProducto, " +
            "p.nombre AS nombreProducto, " +
            "MAX(p.peso_kg) AS pesoKg, " +
            "MAX(p.imagen) AS imagen, " +
            "MAX(p.sku) AS skuSugerido, " +
            "SUM(dc.cantidad) AS cantidadComprada, " +
            "MAX(dc.precio_unitario) AS precioCompra, " +
            "MAX(pr.id) AS idProveedor, " +
            "GROUP_CONCAT(DISTINCT pr.razon_social SEPARATOR ', ') AS nombreProveedor " + 
            "FROM detalle_compra dc " +
            "JOIN compra c ON dc.id_compra = c.id " +
            "JOIN producto p ON dc.id_producto = p.id " +
            "JOIN proveedor pr ON c.id_proveedor = pr.id " +
            "WHERE c.id_almacen = :almacenId " +
            // --- AQUÍ ESTÁ EL CAMBIO CLAVE ---
            "AND c.estado = 'COMPLETADA' " + // Antes decía 'PENDIENTE'
            // ---------------------------------
            "GROUP BY p.nombre", 
            nativeQuery = true)
    List<ProductoPendienteDTO> findProductosPendientesPorAlmacen(@Param("almacenId") Long almacenId);
}
