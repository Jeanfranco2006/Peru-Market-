package com.perumarket.erp.repository;

import com.perumarket.erp.models.entity.ProveedorProducto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProveedorProductoRepository extends JpaRepository<ProveedorProducto, Integer> {
    
    // Busca el proveedor principal de un producto
    @Query("SELECT pp FROM ProveedorProducto pp JOIN FETCH pp.proveedor WHERE pp.producto.id = :productoId AND pp.esPrincipal = true")
    Optional<ProveedorProducto> findByProductoIdAndEsPrincipalTrue(Integer productoId);
    
    // --- ESTE ES EL MÉTODO QUE FALTABA PARA QUE FUNCIONE EL MODAL ---
    @Query("SELECT pp FROM ProveedorProducto pp JOIN FETCH pp.producto WHERE pp.proveedor.id = :proveedorId")
    List<ProveedorProducto> findByProveedorId(Integer proveedorId);
    // ---------------------------------------------------------------

    List<ProveedorProducto> findByProductoId(Integer productoId);
    
    void deleteByProductoId(Integer idProducto);

    @Query("SELECT pp FROM ProveedorProducto pp JOIN FETCH pp.producto p JOIN FETCH pp.proveedor pr WHERE p.estado = com.perumarket.erp.models.entity.Producto.EstadoProducto.CATALOGO")
    List<ProveedorProducto> findAllCatalogoWithProveedores();
}