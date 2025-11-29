package com.perumarket.erp.repository;

import com.perumarket.erp.models.entity.ProveedorProducto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional; // Importar Optional
import java.util.List; // Opcional, pero útil

@Repository
public interface ProveedorProductoRepository extends JpaRepository<ProveedorProducto, Integer> {
    
    // Método que asegura que la entidad Proveedor se carga inmediatamente (EAGER)
    @Query("SELECT pp FROM ProveedorProducto pp JOIN FETCH pp.proveedor WHERE pp.producto.id = :productoId AND pp.esPrincipal = true")
    Optional<ProveedorProducto> findByProductoIdAndEsPrincipalTrue(Integer productoId);
    
    // Opcional: Si esperas que pueda haber más de un registro por producto, aunque solo uno deba ser principal.
    List<ProveedorProducto> findByProductoId(Integer productoId);
}