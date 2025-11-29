package com.perumarket.erp.repository;

import com.perumarket.erp.models.entity.Inventario;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InventarioRepository extends JpaRepository<Inventario, Integer> {
    // Método para encontrar el inventario de un producto en un almacén específico
    boolean existsByProductoIdAndAlmacenId(Integer productoId, Integer almacenId);

    // Método necesario para obtener el stock de un producto para el listado
    List<Inventario> findByProductoId(Integer productoId);

    Optional<Inventario> findByProductoIdAndAlmacenId(Integer productoId, Integer almacenId);

}