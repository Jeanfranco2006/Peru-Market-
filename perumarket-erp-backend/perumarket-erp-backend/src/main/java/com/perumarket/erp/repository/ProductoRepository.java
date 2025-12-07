package com.perumarket.erp.repository;

import com.perumarket.erp.models.entity.Producto;
import com.perumarket.erp.models.entity.Producto.EstadoProducto;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Integer> {
    
    Optional<Producto> findBySku(String sku);
        List<Producto> findByEstado(EstadoProducto estado);
}