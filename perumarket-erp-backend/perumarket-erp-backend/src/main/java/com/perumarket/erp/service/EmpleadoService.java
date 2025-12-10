package com.perumarket.erp.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.perumarket.erp.models.dto.DepartamentoDTO;
import com.perumarket.erp.models.dto.EmpleadoDTO;
import com.perumarket.erp.models.dto.PersonaDTO;
import com.perumarket.erp.models.entity.Departamento;
import com.perumarket.erp.models.entity.Empleado;
import com.perumarket.erp.models.entity.Persona;
import com.perumarket.erp.repository.DepartamentoRepository;
import com.perumarket.erp.repository.EmpleadoRepository;
import com.perumarket.erp.repository.PersonaRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmpleadoService {

    @Autowired
    private final EmpleadoRepository empleadoRepository;
    private final PersonaRepository personaRepository;
    private final DepartamentoRepository departamentoRepository;


    // ============================================================
    // LISTAR
    // ============================================================
    public List<EmpleadoDTO> findAll() {
        return empleadoRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<EmpleadoDTO> findById(Long id) {
        return empleadoRepository.findById(id)
                .map(this::convertToDTO);
    }

    public boolean existsByNumeroDocumento(String dni) {
    return empleadoRepository.existsByPersona_NumeroDocumento(dni);
}

    public List<EmpleadoDTO> findByFilters(String texto, String dni, String estado) {
        Empleado.EstadoEmpleado estadoEnum = null;

        if (estado != null && !estado.isEmpty()) {
            try {
                estadoEnum = Empleado.EstadoEmpleado.valueOf(estado.toUpperCase());
            } catch (IllegalArgumentException e) {
                // Se ignora si envían estado incorrecto
            }
        }

        return empleadoRepository.findByFilters(
                texto != null && !texto.isEmpty() ? texto : null,
                dni != null && !dni.isEmpty() ? dni : null,
                estadoEnum
        ).stream()
        .map(this::convertToDTO)
        .collect(Collectors.toList());
    }


    // ============================================================
    // GUARDAR / ACTUALIZAR (CON VALIDACIONES)
    // ============================================================
    @Transactional
    public EmpleadoDTO save(EmpleadoDTO empleadoDTO) {

        PersonaDTO personaDTO = empleadoDTO.getPersona();
        String dni = personaDTO.getNumeroDocumento();

        // ------------------------------------------------------------
        // VALIDACIÓN DNI DUPLICADO
        // ------------------------------------------------------------
        if (empleadoDTO.getEmpleadoId() == null) {
            // CREAR — DNI no debe existir
            if (personaRepository.existsByNumeroDocumento(dni)) {
                throw new IllegalArgumentException("El DNI " + dni + " ya está registrado en otra persona.");
            }
        } else {
            // EDITAR — DNI no debe existir en otra persona
            Long personaId = personaDTO.getId();
            if (personaRepository.existsByNumeroDocumentoAndIdNot(dni, personaId)) {
                throw new IllegalArgumentException("El DNI " + dni + " pertenece a otra persona.");
            }
        }

        // ------------------------------------------------------------
        // Buscar o crear persona
        // ------------------------------------------------------------
        Persona persona = (personaDTO.getId() != null)
                ? personaRepository.findById(personaDTO.getId()).orElse(new Persona())
                : personaRepository.findByNumeroDocumento(dni).orElse(new Persona());

        updatePersonaFromDTO(persona, personaDTO);
        persona = personaRepository.save(persona);

        // ------------------------------------------------------------
        // Buscar departamento
        // ------------------------------------------------------------
        Departamento departamento = null;
        if (empleadoDTO.getDepartamento() != null && empleadoDTO.getDepartamento().getId() != null) {
            departamento = departamentoRepository.findById(empleadoDTO.getDepartamento().getId())
                    .orElse(null);
        }

        // ------------------------------------------------------------
        // Crear o actualizar empleado
        // ------------------------------------------------------------
        Empleado empleado = (empleadoDTO.getEmpleadoId() != null)
                ? empleadoRepository.findById(empleadoDTO.getEmpleadoId()).orElse(new Empleado())
                : new Empleado();

        empleado.setPersona(persona);
        empleado.setDepartamento(departamento);
        empleado.setPuesto(empleadoDTO.getPuesto());
        empleado.setSueldo(empleadoDTO.getSueldo());
        empleado.setFechaContratacion(empleadoDTO.getFechaContratacion());
        empleado.setFoto(empleadoDTO.getFoto());
        empleado.setCv(empleadoDTO.getCv());

        if (empleadoDTO.getEstado() != null) {
            empleado.setEstado(Empleado.EstadoEmpleado.valueOf(empleadoDTO.getEstado().toUpperCase()));
        }

        empleado = empleadoRepository.save(empleado);
        return convertToDTO(empleado);
    }


    // ============================================================
    // ELIMINAR
    // ============================================================
    @Transactional
    public void deleteById(Long id) {
        empleadoRepository.deleteById(id);
    }

    @Transactional
public void deleteCompleto(Long empleadoId) {
    Empleado empleado = empleadoRepository.findById(empleadoId)
            .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));

    Long personaId = empleado.getPersona().getId();

    // Eliminar empleado primero
    empleadoRepository.deleteById(empleadoId);

    // Luego eliminar persona asociada
    personaRepository.deleteById(personaId);
}



    // ============================================================
    // MÉTODOS AUXILIARES
    // ============================================================
    private void updatePersonaFromDTO(Persona persona, PersonaDTO personaDTO) {
        persona.setTipoDocumento(personaDTO.getTipoDocumento());
        persona.setNumeroDocumento(personaDTO.getNumeroDocumento());
        persona.setNombres(personaDTO.getNombres());
        persona.setApellidoPaterno(personaDTO.getApellidoPaterno());
        persona.setApellidoMaterno(personaDTO.getApellidoMaterno());
        persona.setCorreo(personaDTO.getCorreo());
        persona.setTelefono(personaDTO.getTelefono());
        persona.setFechaNacimiento(personaDTO.getFechaNacimiento());
        persona.setDireccion(personaDTO.getDireccion());
    }

    private EmpleadoDTO convertToDTO(Empleado empleado) {
        EmpleadoDTO dto = new EmpleadoDTO();
        dto.setEmpleadoId(empleado.getId());

        PersonaDTO personaDTO = new PersonaDTO();
        personaDTO.setId(empleado.getPersona().getId());
        personaDTO.setTipoDocumento(empleado.getPersona().getTipoDocumento());
        personaDTO.setNumeroDocumento(empleado.getPersona().getNumeroDocumento());
        personaDTO.setNombres(empleado.getPersona().getNombres());
        personaDTO.setApellidoPaterno(empleado.getPersona().getApellidoPaterno());
        personaDTO.setApellidoMaterno(empleado.getPersona().getApellidoMaterno());
        personaDTO.setCorreo(empleado.getPersona().getCorreo());
        personaDTO.setTelefono(empleado.getPersona().getTelefono());
        personaDTO.setFechaNacimiento(empleado.getPersona().getFechaNacimiento());
        personaDTO.setDireccion(empleado.getPersona().getDireccion());

        dto.setPersona(personaDTO);

        if (empleado.getDepartamento() != null) {
            DepartamentoDTO departamentoDTO = new DepartamentoDTO();
            departamentoDTO.setId(empleado.getDepartamento().getId());
            departamentoDTO.setNombre(empleado.getDepartamento().getNombre());
            departamentoDTO.setDescripcion(empleado.getDepartamento().getDescripcion());
            dto.setDepartamento(departamentoDTO);
        }

        dto.setPuesto(empleado.getPuesto());
        dto.setSueldo(empleado.getSueldo());
        dto.setFechaContratacion(empleado.getFechaContratacion());
        dto.setEstado(empleado.getEstado().name());
        dto.setFoto(empleado.getFoto());
        dto.setCv(empleado.getCv());

        return dto;
    }
}
