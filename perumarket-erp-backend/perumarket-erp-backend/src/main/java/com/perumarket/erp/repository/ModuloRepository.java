// ModuloRepository.java - COMPLETO
package com.perumarket.erp.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.perumarket.erp.models.entity.Modulo;

@Repository
public interface ModuloRepository extends JpaRepository<Modulo, Long> {
    
    // Método para buscar módulos por rol (si lo necesitas)
    @Query(value = "SELECT m.* FROM modulo m " +
                   "INNER JOIN role_module_permissions rmp ON m.id = rmp.id_modulo " +
                   "WHERE rmp.id_rol = :roleId " +
                   "AND rmp.has_access = true " +
                   "ORDER BY m.nombre", 
           nativeQuery = true)
    List<Modulo> findModulesByRole(@Param("roleId") Long roleId);
    
    // Método para obtener todos los módulos ordenados
    List<Modulo> findAllByOrderByIdDesc();
    
    // Método para verificar si existe un módulo por nombre
    boolean existsByNombre(String nombre);
    
    // Método para buscar módulo por nombre
    Optional<Modulo> findByNombre(String nombre);
}