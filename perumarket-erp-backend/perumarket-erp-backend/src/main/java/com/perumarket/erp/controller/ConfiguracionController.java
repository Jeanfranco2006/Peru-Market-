package com.perumarket.erp.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.perumarket.erp.models.dto.ChangePasswordRequest;
import com.perumarket.erp.models.dto.UpdateProfileRequest;
import com.perumarket.erp.models.dto.UsuarioDTO;
import com.perumarket.erp.service.ConfiguracionService;

@RestController
@RequestMapping("/configuracion")
@CrossOrigin(origins = {"http://localhost:5173", "http://192.168.18.13:5173"})
public class ConfiguracionController {

    @Autowired
    private ConfiguracionService configuracionService;

    @GetMapping("/perfil/{userId}")
    public ResponseEntity<?> getProfile(@PathVariable Long userId) {
        try {
            UsuarioDTO perfil = configuracionService.getProfile(userId);
            return ResponseEntity.ok(perfil);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error interno del servidor");
        }
    }

    @PutMapping("/perfil/{userId}")
    public ResponseEntity<?> updateProfile(@PathVariable Long userId, @RequestBody UpdateProfileRequest request) {
        try {
            UsuarioDTO perfil = configuracionService.updateProfile(userId, request);
            return ResponseEntity.ok(perfil);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error interno del servidor");
        }
    }

    @PutMapping("/password/{userId}")
    public ResponseEntity<?> changePassword(@PathVariable Long userId, @RequestBody ChangePasswordRequest request) {
        try {
            configuracionService.changePassword(userId, request);
            return ResponseEntity.ok(Map.of("success", true, "message", "Contraseña actualizada correctamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("success", false, "message", "Error interno del servidor"));
        }
    }

    @GetMapping("/sistema")
    public ResponseEntity<?> getSystemInfo() {
        try {
            Map<String, Object> info = configuracionService.getSystemInfo();
            return ResponseEntity.ok(info);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error obteniendo información del sistema");
        }
    }
}
