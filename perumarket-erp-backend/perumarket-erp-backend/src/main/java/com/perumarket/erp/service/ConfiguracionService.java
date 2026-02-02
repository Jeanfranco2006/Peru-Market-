package com.perumarket.erp.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.perumarket.erp.models.dto.ChangePasswordRequest;
import com.perumarket.erp.models.dto.UpdateProfileRequest;
import com.perumarket.erp.models.dto.UsuarioDTO;
import com.perumarket.erp.models.entity.Persona;
import com.perumarket.erp.models.entity.Usuario;
import com.perumarket.erp.repository.PersonaRepository;
import com.perumarket.erp.repository.UsuarioRepository;

@Service
public class ConfiguracionService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PersonaRepository personaRepository;

    public UsuarioDTO getProfile(Long userId) {
        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return convertToUsuarioDTO(usuario);
    }

    @Transactional
    public UsuarioDTO updateProfile(Long userId, UpdateProfileRequest request) {
        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Persona persona = usuario.getPersona();

        if (request.getNombres() != null && !request.getNombres().trim().isEmpty()) {
            persona.setNombres(request.getNombres().trim());
        }
        if (request.getApellidoPaterno() != null && !request.getApellidoPaterno().trim().isEmpty()) {
            persona.setApellidoPaterno(request.getApellidoPaterno().trim());
        }
        if (request.getApellidoMaterno() != null && !request.getApellidoMaterno().trim().isEmpty()) {
            persona.setApellidoMaterno(request.getApellidoMaterno().trim());
        }
        if (request.getCorreo() != null) {
            persona.setCorreo(request.getCorreo().trim());
        }
        if (request.getTelefono() != null) {
            persona.setTelefono(request.getTelefono().trim());
        }
        if (request.getDireccion() != null) {
            persona.setDireccion(request.getDireccion().trim());
        }

        personaRepository.save(persona);
        return convertToUsuarioDTO(usuario);
    }

    @Transactional
    public void changePassword(Long userId, ChangePasswordRequest request) {
        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Verificar contraseña actual
        if (!usuario.getPassword().equals(request.getCurrentPassword())) {
            throw new RuntimeException("La contraseña actual es incorrecta");
        }

        // Validar nueva contraseña
        if (request.getNewPassword() == null || request.getNewPassword().trim().length() < 4) {
            throw new RuntimeException("La nueva contraseña debe tener al menos 4 caracteres");
        }

        if (request.getCurrentPassword().equals(request.getNewPassword())) {
            throw new RuntimeException("La nueva contraseña debe ser diferente a la actual");
        }

        usuario.setPassword(request.getNewPassword());
        usuarioRepository.save(usuario);
    }

    public Map<String, Object> getSystemInfo() {
        Map<String, Object> info = new HashMap<>();
        info.put("version", "1.0.0");
        info.put("nombre", "PeruMarket ERP");
        info.put("totalUsuarios", usuarioRepository.count());

        long usuariosActivos = usuarioRepository.findAll().stream()
                .filter(u -> "ACTIVO".equals(u.getEstado()))
                .count();
        info.put("usuariosActivos", usuariosActivos);

        return info;
    }

    private UsuarioDTO convertToUsuarioDTO(Usuario usuario) {
        UsuarioDTO dto = new UsuarioDTO();
        dto.setId(usuario.getId());
        dto.setUsername(usuario.getUsername());
        dto.setEstado(usuario.getEstado());

        UsuarioDTO.PersonaDTO personaDTO = new UsuarioDTO.PersonaDTO();
        personaDTO.setId(usuario.getPersona().getId());
        personaDTO.setTipoDocumento(usuario.getPersona().getTipoDocumento());
        personaDTO.setNumeroDocumento(usuario.getPersona().getNumeroDocumento());
        personaDTO.setNombres(usuario.getPersona().getNombres());
        personaDTO.setApellidoPaterno(usuario.getPersona().getApellidoPaterno());
        personaDTO.setApellidoMaterno(usuario.getPersona().getApellidoMaterno());
        personaDTO.setCorreo(usuario.getPersona().getCorreo());
        personaDTO.setTelefono(usuario.getPersona().getTelefono());
        personaDTO.setFechaNacimiento(usuario.getPersona().getFechaNacimiento());
        personaDTO.setDireccion(usuario.getPersona().getDireccion());
        dto.setPersona(personaDTO);

        UsuarioDTO.RolDTO rolDTO = new UsuarioDTO.RolDTO();
        rolDTO.setId(usuario.getRol().getId());
        rolDTO.setNombre(usuario.getRol().getNombre());
        rolDTO.setDescripcion(usuario.getRol().getDescripcion());
        dto.setRol(rolDTO);

        return dto;
    }
}
