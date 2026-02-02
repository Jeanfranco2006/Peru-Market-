package com.perumarket.erp.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.perumarket.erp.models.dto.ClienteDTO;
import com.perumarket.erp.models.dto.PersonaDTO;
import com.perumarket.erp.models.entity.Cliente;
import com.perumarket.erp.models.entity.Cliente.TipoCliente;
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
    // FILTROS BÁSICOS
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

   
/**
 * Obtener solo clientes ACTIVOS para módulo de ventas
 */
public List<ClienteDTO> findAllActivos() {
    return clienteRepository.findAllActivos()
            .stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
}

// VERIFICAR SI DNI YA EXISTE (MEJORADO)
// ---------------------------------------------------------
public boolean checkDniExists(String dni, Long excludeClienteId) {
    if (dni == null || dni.trim().isEmpty()) {
        return false;
    }
    
    dni = dni.trim();
    
    // Buscar persona por DNI
    Optional<Persona> personaOpt = personaRepository.findByNumeroDocumento(dni);
    
    if (!personaOpt.isPresent()) {
        return false;
    }
    
    Persona persona = personaOpt.get();
    
    // Buscar si esta persona ya es cliente
    Optional<Cliente> clienteOpt = clienteRepository.findByPersona(persona);
    
    if (!clienteOpt.isPresent()) {
        return false;
    }
    
    Cliente clienteExistente = clienteOpt.get();
    
    // Si estamos excluyendo un ID (para edición), verificar si es el mismo cliente
    if (excludeClienteId != null) {
        return !clienteExistente.getId().equals(excludeClienteId);
    }
    
    return true;
}

// ---------------------------------------------------------
    // DESACTIVAR CLIENTE (BORRADO LÓGICO)
    // ---------------------------------------------------------
    // ClienteService.java

@Transactional // <--- Importante para asegurar el commit
public boolean desactivarCliente(Long id) {
    return clienteRepository.findById(id).map(cliente -> {
        cliente.setEstado("INACTIVO"); 
        clienteRepository.save(cliente); // <--- Importante guardar
        return true;
    }).orElse(false);
}
    
    
// CREAR CLIENTE (COMPLETO CON VALIDACIONES)
// ---------------------------------------------------------
@Transactional
public ClienteDTO save(ClienteDTO clienteDTO) {
    // Validar que el DTO no sea nulo
    if (clienteDTO == null) {
        throw new IllegalArgumentException("Los datos del cliente no pueden ser nulos");
    }
    
    // Validar que persona no sea nula
    if (clienteDTO.getPersona() == null) {
        throw new IllegalArgumentException("Los datos de la persona son obligatorios");
    }
    
    PersonaDTO personaDTO = clienteDTO.getPersona();
    String numeroDocumento = personaDTO.getNumeroDocumento();
    
    // Validar número de documento no vacío
    if (numeroDocumento == null || numeroDocumento.trim().isEmpty()) {
        throw new IllegalArgumentException("El número de documento es obligatorio");
    }
    
    // Validar nombres no vacíos
    if (personaDTO.getNombres() == null || personaDTO.getNombres().trim().isEmpty()) {
        throw new IllegalArgumentException("El nombre es obligatorio");
    }
    
    // Validar apellido paterno no vacío
    if (personaDTO.getApellidoPaterno() == null || personaDTO.getApellidoPaterno().trim().isEmpty()) {
        throw new IllegalArgumentException("El apellido paterno es obligatorio");
    }
    
    // Validar tipo de documento
    String tipoDocumento = personaDTO.getTipoDocumento();
    if (tipoDocumento == null || tipoDocumento.trim().isEmpty()) {
        tipoDocumento = "DNI"; // Valor por defecto
        personaDTO.setTipoDocumento(tipoDocumento);
    }
    
    // Validaciones específicas por tipo de documento
    numeroDocumento = numeroDocumento.trim();
    if (tipoDocumento.equalsIgnoreCase("DNI")) {
        // Validar que DNI tenga 8 dígitos
        if (!numeroDocumento.matches("\\d{8}")) {
            throw new IllegalArgumentException("El DNI debe tener exactamente 8 dígitos numéricos");
        }
    } else if (tipoDocumento.equalsIgnoreCase("CE")) {
        // Validar que CE tenga 9 dígitos
        if (!numeroDocumento.matches("\\d{9}")) {
            throw new IllegalArgumentException("El Carnet de Extranjería (CE) debe tener 9 dígitos numéricos");
        }
    } else if (tipoDocumento.equalsIgnoreCase("PASAPORTE")) {
        // Validar formato básico de pasaporte (letras y números)
        if (!numeroDocumento.matches("^[A-Z0-9]{6,12}$")) {
            throw new IllegalArgumentException("El número de pasaporte debe contener solo letras mayúsculas y números (6-12 caracteres)");
        }
    }
    
    // Validar formato de correo si se proporciona
    if (personaDTO.getCorreo() != null && !personaDTO.getCorreo().trim().isEmpty()) {
        String correo = personaDTO.getCorreo().trim();
        if (!correo.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new IllegalArgumentException("El formato del correo electrónico no es válido");
        }
        personaDTO.setCorreo(correo);
    }
    
    // VALIDACIÓN CRÍTICA: Verificar si el DNI ya existe para otro cliente
    if (checkDniExists(numeroDocumento, null)) {
        throw new IllegalArgumentException("El número de documento " + numeroDocumento + " ya está registrado en el sistema. Una persona no puede registrarse dos veces como cliente.");
    }
    
    // Buscar persona por DNI (puede existir pero no ser cliente)
    Optional<Persona> personaExistenteOpt = personaRepository.findByNumeroDocumento(numeroDocumento);
    
    Persona persona;
    if (personaExistenteOpt.isPresent()) {
        // Persona existe en la tabla persona pero NO es cliente (validado arriba)
        persona = personaExistenteOpt.get();
        
        // Verificar que realmente no sea cliente (doble validación)
        Optional<Cliente> clienteExistenteOpt = clienteRepository.findByPersona(persona);
        if (clienteExistenteOpt.isPresent()) {
            // Esto no debería pasar si checkDniExists funciona correctamente
            throw new IllegalStateException("Inconsistencia en la base de datos: La persona ya es cliente");
        }
        
        // Actualizar datos de la persona existente
        updatePersonaFromDTO(persona, personaDTO);
    } else {
        // Crear nueva persona
        persona = new Persona();
        updatePersonaFromDTO(persona, personaDTO);
    }
    
    // Guardar persona (crear o actualizar)
    try {
        persona = personaRepository.save(persona);
    } catch (Exception e) {
        // Capturar errores de base de datos (ej: constraint violation)
        throw new RuntimeException("Error al guardar los datos de la persona: " + e.getMessage(), e);
    }
    
    // Crear nuevo cliente
    Cliente cliente = new Cliente();
    cliente.setPersona(persona);
    
    // Asignar tipo de cliente (con valor por defecto)
    TipoCliente tipo = clienteDTO.getTipo();
    if (tipo == null) {
        tipo = TipoCliente.NATURAL; // Valor por defecto
    }
    cliente.setTipo(tipo);
    
    try {
        cliente = clienteRepository.save(cliente);
    } catch (Exception e) {
        // Capturar errores de base de datos
        throw new RuntimeException("Error al guardar el cliente: " + e.getMessage(), e);
    }
    
    // Devolver DTO del cliente creado
    return convertToDTO(cliente);
}



    // ---------------------------------------------------------
    // ACTUALIZAR CLIENTE (CORREGIDO)
    // ---------------------------------------------------------
    @Transactional
    public Optional<ClienteDTO> update(Long id, ClienteDTO clienteDTO) {
        return clienteRepository.findById(id).map(clienteExistente -> {
            
            Persona personaExistente = clienteExistente.getPersona();
            String nuevoDni = clienteDTO.getPersona().getNumeroDocumento();
            String dniActual = personaExistente.getNumeroDocumento();
            
            // VALIDACIÓN: Si el DNI está cambiando, verificar que no exista para otro cliente
            if (!dniActual.equals(nuevoDni)) {
                if (checkDniExists(nuevoDni, id)) {
                    throw new RuntimeException("El número de documento " + nuevoDni + " ya está registrado en el sistema para otro cliente.");
                }
            }
            
            // Actualizar datos de la persona
            updatePersonaFromDTO(personaExistente, clienteDTO.getPersona());
            personaRepository.save(personaExistente);
            
            // Actualizar datos del cliente
            clienteExistente.setTipo(clienteDTO.getTipo() != null ? clienteDTO.getTipo() : TipoCliente.NATURAL);

            // ✅ AGREGAR ESTA LÍNEA PARA QUE EL ESTADO SE ACTUALICE
        if (clienteDTO.getEstado() != null) {
            clienteExistente.setEstado(clienteDTO.getEstado());
        }
            clienteRepository.save(clienteExistente);
            
            return convertToDTO(clienteExistente);
        });
    }

    // ---------------------------------------------------------
    // ELIMINAR CLIENTE
    // ---------------------------------------------------------
    // En ClienteService.java

// ELIMINAR FÍSICO (Solo funcionará si no tiene historial)

@Transactional
public boolean deleteById(Long id) {
    if (clienteRepository.existsById(id)) {
        // Esto debe lanzar excepción si hay ventas.
        // Si tienes try-catch AQUÍ, quítalo. Deja que explote hasta el controller.
        clienteRepository.deleteById(id); 
        return true;
    }
    return false;
}

    // ---------------------------------------------------------
    // ACTUALIZAR PERSONA DESDE DTO
    // ---------------------------------------------------------
    // ---------------------------------------------------------
// ACTUALIZAR PERSONA DESDE DTO (MEJORADO)
// ---------------------------------------------------------
private void updatePersonaFromDTO(Persona persona, PersonaDTO dto) {
    // Validar que DTO no sea nulo
    if (dto == null) {
        throw new IllegalArgumentException("Los datos de la persona no pueden ser nulos");
    }
    
    // Tipo documento con valor por defecto
    persona.setTipoDocumento(dto.getTipoDocumento() != null ? 
                            dto.getTipoDocumento().trim() : "DNI");
    
    // Número documento (obligatorio)
    String numeroDocumento = dto.getNumeroDocumento();
    if (numeroDocumento == null || numeroDocumento.trim().isEmpty()) {
        throw new IllegalArgumentException("El número de documento es obligatorio");
    }
    persona.setNumeroDocumento(numeroDocumento.trim());
    
    // Nombres (obligatorio)
    String nombres = dto.getNombres();
    if (nombres == null || nombres.trim().isEmpty()) {
        throw new IllegalArgumentException("El nombre es obligatorio");
    }
    persona.setNombres(nombres.trim());
    
    // Apellido paterno (obligatorio)
    String apellidoPaterno = dto.getApellidoPaterno();
    if (apellidoPaterno == null || apellidoPaterno.trim().isEmpty()) {
        throw new IllegalArgumentException("El apellido paterno es obligatorio");
    }
    persona.setApellidoPaterno(apellidoPaterno.trim());
    
    // Apellido materno (opcional)
    persona.setApellidoMaterno(dto.getApellidoMaterno() != null ? 
                              dto.getApellidoMaterno().trim() : "");
    
    // Correo (opcional, validar si existe)
    if (dto.getCorreo() != null && !dto.getCorreo().trim().isEmpty()) {
        String correo = dto.getCorreo().trim();
        persona.setCorreo(correo);
    } else {
        persona.setCorreo("");
    }
    
    // Teléfono (opcional)
    persona.setTelefono(dto.getTelefono() != null ? 
                       dto.getTelefono().trim() : "");
    
    // Fecha nacimiento (opcional)
    persona.setFechaNacimiento(dto.getFechaNacimiento());
    
    // Dirección (opcional)
    persona.setDireccion(dto.getDireccion() != null ? 
                        dto.getDireccion().trim() : "");
}

    // ---------------------------------------------------------
    // CONVERTIR ENTITY A DTO (CORREGIDO - usa getClienteid)
    // ---------------------------------------------------------
    private ClienteDTO convertToDTO(Cliente cliente) {
        ClienteDTO dto = new ClienteDTO();
        dto.setClienteid(cliente.getId()); // Importante: usa setClienteid
        dto.setTipo(cliente.getTipo());
        dto.setEstado(cliente.getEstado());
        dto.setFechaCreacion(cliente.getFechaCreacion());
        dto.setFechaActualizacion(cliente.getFechaActualizacion());

        Persona persona = cliente.getPersona();
        PersonaDTO personaDTO = new PersonaDTO();
        personaDTO.setId(persona.getId());
        personaDTO.setTipoDocumento(persona.getTipoDocumento());
        personaDTO.setNumeroDocumento(persona.getNumeroDocumento());
        personaDTO.setNombres(persona.getNombres());
        personaDTO.setApellidoPaterno(persona.getApellidoPaterno());
        personaDTO.setApellidoMaterno(persona.getApellidoMaterno());
        personaDTO.setCorreo(persona.getCorreo());
        personaDTO.setTelefono(persona.getTelefono());
        personaDTO.setFechaNacimiento(persona.getFechaNacimiento());
        personaDTO.setDireccion(persona.getDireccion());

        dto.setPersona(personaDTO);

        return dto;
    }
}