package com.perumarket.erp.repository;

import com.perumarket.erp.models.entity.Almacen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AlmacenRepository extends JpaRepository<Almacen, Integer> {
    
    // Método para buscar por código único
    Optional<Almacen> findByCodigo(String codigo);
    
    // Método para buscar por nombre (opcional, pero útil)
    Optional<Almacen> findByNombre(String nombre);
}