package com.perumarket.erp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.perumarket.erp.models.entity.Cliente;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    // Buscar por tipo (NUEVO)
    List<Cliente> findByTipo(Cliente.TipoCliente tipo);

    // Buscar por nombre completo
    @Query("SELECT c FROM Cliente c WHERE " +
           "LOWER(CONCAT(c.persona.nombres, ' ', c.persona.apellidoPaterno, ' ', c.persona.apellidoMaterno)) " +
           "LIKE LOWER(CONCAT('%', :texto, '%'))")
    List<Cliente> findByNombreCompletoContaining(@Param("texto") String texto);

    // Buscar por DNI
    List<Cliente> findByPersonaNumeroDocumentoContaining(String numeroDocumento);

    // Filtros combinados (igual que empleados, pero con tipo)
    @Query("""
        SELECT c FROM Cliente c 
        WHERE 
            (LOWER(CONCAT(c.persona.nombres, ' ', c.persona.apellidoPaterno, ' ', c.persona.apellidoMaterno)) 
                LIKE LOWER(CONCAT('%', :texto, '%')) 
             OR :texto IS NULL)
        AND (c.persona.numeroDocumento LIKE CONCAT('%', :dni, '%') 
             OR :dni IS NULL)
        AND (c.tipo = :tipo OR :tipo IS NULL)
    """)
    List<Cliente> findByFilters(
            @Param("texto") String texto,
            @Param("dni") String dni,
            @Param("tipo") Cliente.TipoCliente tipo
    );
}
