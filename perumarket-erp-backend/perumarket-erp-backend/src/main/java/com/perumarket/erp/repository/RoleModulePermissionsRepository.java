// RoleModulePermissionsRepository.java - COMPLETO
package com.perumarket.erp.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.perumarket.erp.models.entity.RoleModulePermissions;

@Repository
public interface RoleModulePermissionsRepository extends JpaRepository<RoleModulePermissions, Long> {
    
    @Query("SELECT rmp FROM RoleModulePermissions rmp " +
           "JOIN FETCH rmp.modulo " +
           "WHERE rmp.rol.id = :rolId AND rmp.hasAccess = true")
    List<RoleModulePermissions> findAccessibleModulesByRolId(@Param("rolId") Long rolId);
    
    List<RoleModulePermissions> findByRolId(Long rolId);
    
    // Método para eliminar permisos por rol
    @Modifying
    @Query("DELETE FROM RoleModulePermissions rmp WHERE rmp.rol.id = :rolId")
    void deleteByRolId(@Param("rolId") Long rolId);
    
    // Método para eliminar permisos por módulo
    @Modifying
    @Query("DELETE FROM RoleModulePermissions rmp WHERE rmp.modulo.id = :moduloId")
    void deleteByModuloId(@Param("moduloId") Long moduloId);
    
    // Método para contar permisos por módulo
    @Query("SELECT COUNT(rmp) FROM RoleModulePermissions rmp WHERE rmp.modulo.id = :moduloId")
    long countByModuloId(@Param("moduloId") Long moduloId);

    // En RoleModulePermissionsRepository.java - agregar este método
@Query("SELECT COUNT(rmp) FROM RoleModulePermissions rmp WHERE rmp.rol.id = :rolId")
long countByRolId(@Param("rolId") Long rolId);
    
    // Método para encontrar permisos específicos
    @Query("SELECT rmp FROM RoleModulePermissions rmp WHERE rmp.rol.id = :rolId AND rmp.modulo.id = :moduloId")
    Optional<RoleModulePermissions> findByRolIdAndModuloId(@Param("rolId") Long rolId, @Param("moduloId") Long moduloId);
}