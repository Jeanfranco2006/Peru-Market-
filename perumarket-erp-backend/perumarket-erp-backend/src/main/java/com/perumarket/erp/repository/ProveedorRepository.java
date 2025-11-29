package com.perumarket.erp.repository;

import com.perumarket.erp.models.entity.Proveedor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProveedorRepository extends JpaRepository<Proveedor, Integer> {
    
    // Query para la búsqueda por RUC o Razón Social
    List<Proveedor> findByRucContainingOrRazonSocialContainingIgnoreCase(String ruc, String razonSocial);
}