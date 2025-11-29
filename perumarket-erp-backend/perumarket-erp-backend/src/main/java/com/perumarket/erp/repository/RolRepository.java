// RolRepository.java - COMPLETO
package com.perumarket.erp.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.perumarket.erp.models.entity.Rol;

@Repository
public interface RolRepository extends JpaRepository<Rol, Long> {
    
    // Verificar si existe rol por nombre
    boolean existsByNombre(String nombre);
    
    // Obtener todos los roles ordenados
    List<Rol> findAllByOrderByIdDesc();
    
    // Contar usuarios por rol
    @Query("SELECT COUNT(u) FROM Usuario u WHERE u.rol.id = :rolId")
    Long countUsuariosByRolId(@Param("rolId") Long rolId);
    
    // Buscar rol por nombre
    Optional<Rol> findByNombre(String nombre);
}