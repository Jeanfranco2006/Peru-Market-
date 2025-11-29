package com.perumarket.erp.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.perumarket.erp.models.dto.ClienteDTO;
import com.perumarket.erp.models.dto.PersonaDTO;
import com.perumarket.erp.models.entity.Cliente;
import com.perumarket.erp.models.entity.Persona;
import com.perumarket.erp.repository.ClienteRepository;
import com.perumarket.erp.repository.PersonaRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ClienteService {

    private final ClienteRepository clienteRepository;
    private final PersonaRepository personaRepository;

    // ---------------------------------------------------------
    // LISTAR TODO
    // ---------------------------------------------------------
    public List<ClienteDTO> findAll() {
        return clienteRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // ---------------------------------------------------------
    // BUSCAR POR ID
    // ---------------------------------------------------------
    public Optional<ClienteDTO> findById(Long id) {
        return clienteRepository.findById(id)
                .map(this::convertToDTO);
    }

    // ---------------------------------------------------------
    // FILTROS BÁSICOS (opcional)
    // ---------------------------------------------------------
    public List<ClienteDTO> findByFilters(String texto, String dni, Cliente.TipoCliente tipo) {
        return clienteRepository.findByFilters(
                (texto != null && !texto.isEmpty()) ? texto : null,
                (dni != null && !dni.isEmpty()) ? dni : null,
                tipo
        ).stream()
        .map(this::convertToDTO)
        .collect(Collectors.toList());
    }

    // ---------------------------------------------------------
    // CREAR / ACTUALIZAR CLIENTE
    // ---------------------------------------------------------
    @Transactional
    public ClienteDTO save(ClienteDTO clienteDTO) {

        // Buscar o crear persona
        Persona persona = personaRepository.findByNumeroDocumento(
                clienteDTO.getPersona().getNumeroDocumento()
        ).orElse(new Persona());

        // Actualizar datos persona
        updatePersonaFromDTO(persona, clienteDTO.getPersona());
        persona = personaRepository.save(persona);

        // Cliente
        Cliente cliente = new Cliente();

        if (clienteDTO.getClienteid() != null) {
            cliente = clienteRepository.findById(clienteDTO.getClienteid())
                    .orElse(new Cliente());
        }

        cliente.setPersona(persona);
        cliente.setTipo(clienteDTO.getTipo());


        cliente = clienteRepository.save(cliente);

        return convertToDTO(cliente);
    }

    // ---------------------------------------------------------
    // ELIMINAR
    // ---------------------------------------------------------
    @Transactional
    public void deleteById(Long id) {
        clienteRepository.deleteById(id);
    }

    // ---------------------------------------------------------
    // ACTUALIZAR PERSONA
    // ---------------------------------------------------------
    private void updatePersonaFromDTO(Persona persona, PersonaDTO dto) {
        persona.setTipoDocumento(dto.getTipoDocumento());
        persona.setNumeroDocumento(dto.getNumeroDocumento());
        persona.setNombres(dto.getNombres());
        persona.setApellidoPaterno(dto.getApellidoPaterno());
        persona.setApellidoMaterno(dto.getApellidoMaterno());
        persona.setCorreo(dto.getCorreo());
        persona.setTelefono(dto.getTelefono());
        persona.setFechaNacimiento(dto.getFechaNacimiento());
        persona.setDireccion(dto.getDireccion());
    }

    // ---------------------------------------------------------
    // CONVERTIR ENTITY A DTO
    // ---------------------------------------------------------
    private ClienteDTO convertToDTO(Cliente cliente) {
        ClienteDTO dto = new ClienteDTO();

        dto.setClienteid(cliente.getId());
        dto.setTipo(cliente.getTipo());
        dto.setFechaCreacion(cliente.getFechaCreacion());
        dto.setFechaActualizacion(cliente.getFechaActualizacion());

        PersonaDTO personaDTO = new PersonaDTO();
        personaDTO.setId(cliente.getPersona().getId());
        personaDTO.setTipoDocumento(cliente.getPersona().getTipoDocumento());
        personaDTO.setNumeroDocumento(cliente.getPersona().getNumeroDocumento());
        personaDTO.setNombres(cliente.getPersona().getNombres());
        personaDTO.setApellidoPaterno(cliente.getPersona().getApellidoPaterno());
        personaDTO.setApellidoMaterno(cliente.getPersona().getApellidoMaterno());
        personaDTO.setCorreo(cliente.getPersona().getCorreo());
        personaDTO.setTelefono(cliente.getPersona().getTelefono());
        personaDTO.setFechaNacimiento(cliente.getPersona().getFechaNacimiento());
        personaDTO.setDireccion(cliente.getPersona().getDireccion());

        dto.setPersona(personaDTO);

        return dto;
    }
}
