// UsuarioRepository.java
package com.perumarket.erp.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.perumarket.erp.models.entity.Usuario;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
    // Método corregido - debe coincidir con lo que usa UsuarioService
    Optional<Usuario> findByUsername(String username);
    
    Optional<Usuario> findByUsernameAndEstado(String username, String estado);
    
    @Query("SELECT u FROM Usuario u JOIN FETCH u.persona JOIN FETCH u.rol WHERE u.username = :username AND u.estado = 'ACTIVO'")
    Optional<Usuario> findActiveUserWithDetails(@Param("username") String username);

     // MÉTODOS NUEVOS A AGREGAR
    boolean existsByUsername(String username);
    
    @Query("SELECT COUNT(u) FROM Usuario u WHERE u.rol.id = :rolId")
    Long countByRolId(@Param("rolId") Long rolId);
    Optional<Usuario> findUsuarioById(@Param("id") Long id);

}