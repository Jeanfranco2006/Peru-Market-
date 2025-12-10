package com.perumarket.erp.service;

import java.util.Optional;

import com.perumarket.erp.models.entity.Persona;
import com.perumarket.erp.repository.PersonaRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PersonaService {

    @Autowired
    private PersonaRepository personaRepo;

    public void validarDocumentoUnico(String numeroDocumento, Long personaId) {
        Optional<Persona> existente = personaRepo.findByNumeroDocumento(numeroDocumento);

        if (existente.isPresent()) {

            // Si estamos editando, permitimos el mismo ID
            if (personaId != null && existente.get().getId().equals(personaId)) {
                return;
            }

            throw new RuntimeException("El número de documento ya está registrado en el sistema (cliente o empleado).");
        }
    }
}
