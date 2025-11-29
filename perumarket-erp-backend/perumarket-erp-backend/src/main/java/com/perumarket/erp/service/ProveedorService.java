package com.perumarket.erp.service;

import com.perumarket.erp.models.entity.Proveedor;
import com.perumarket.erp.repository.ProveedorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProveedorService {

    @Autowired
    private ProveedorRepository proveedorRepository;

    public List<Proveedor> findAll() {
        return proveedorRepository.findAll();
    }

    public Optional<Proveedor> findById(Integer id) {
        return proveedorRepository.findById(id);
    }

    public Proveedor save(Proveedor proveedor) {
        return proveedorRepository.save(proveedor);
    }

    public void deleteById(Integer id) {
        proveedorRepository.deleteById(id);
    }

    public List<Proveedor> searchByRucOrRazonSocial(String query) {
        if (query == null || query.trim().isEmpty()) {
            return proveedorRepository.findAll();
        }
        // Pasamos el mismo query dos veces para buscar en ambos campos
        return proveedorRepository.findByRucContainingOrRazonSocialContainingIgnoreCase(query, query);
    }
}