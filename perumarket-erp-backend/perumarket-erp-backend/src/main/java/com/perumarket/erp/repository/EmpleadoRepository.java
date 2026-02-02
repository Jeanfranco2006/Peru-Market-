package com.perumarket.erp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.perumarket.erp.models.entity.Empleado;

@Repository
public interface EmpleadoRepository extends JpaRepository<Empleado, Long> {
    
    List<Empleado> findByEstado(Empleado.EstadoEmpleado estado);
    
    @Query("SELECT e FROM Empleado e WHERE " +
           "LOWER(CONCAT(e.persona.nombres, ' ', e.persona.apellidoPaterno, ' ', e.persona.apellidoMaterno)) LIKE LOWER(CONCAT('%', :texto, '%'))")
    List<Empleado> findByNombreCompletoContaining(@Param("texto") String texto);
    
    List<Empleado> findByPersonaNumeroDocumentoContaining(String numeroDocumento);
    
    @Query("SELECT e FROM Empleado e WHERE " +
           "(LOWER(CONCAT(e.persona.nombres, ' ', e.persona.apellidoPaterno, ' ', e.persona.apellidoMaterno)) LIKE LOWER(CONCAT('%', :texto, '%')) OR :texto IS NULL) " +
           "AND (e.persona.numeroDocumento LIKE CONCAT('%', :dni, '%') OR :dni IS NULL) " +
           "AND (e.estado = :estado OR :estado IS NULL)")
    List<Empleado> findByFilters(@Param("texto") String texto, 
                                @Param("dni") String dni, 
                                @Param("estado") Empleado.EstadoEmpleado estado);

boolean existsByPersona_NumeroDocumento(String numeroDocumento);


}