package com.perumarket.erp.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.perumarket.erp.models.dto.EmpleadoDTO;
import com.perumarket.erp.service.EmpleadoService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/empleados")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class EmpleadoController {

    private final EmpleadoService empleadoService;
    private final ObjectMapper objectMapper;

    @Value("${upload.path:./uploads}")
    private String uploadPath;

    @GetMapping
    public ResponseEntity<List<EmpleadoDTO>> getAllEmpleados() {
        return ResponseEntity.ok(empleadoService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmpleadoDTO> getEmpleadoById(@PathVariable Long id) {
        return empleadoService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/filtros")
    public ResponseEntity<List<EmpleadoDTO>> getEmpleadosByFilters(
            @RequestParam(required = false) String texto,
            @RequestParam(required = false) String dni,
            @RequestParam(required = false) String estado) {
        
        return ResponseEntity.ok(empleadoService.findByFilters(texto, dni, estado));
    }

    // POST con soporte para archivos
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<EmpleadoDTO> createEmpleadoWithFiles(
            @RequestPart("empleado") String empleadoJson,
            @RequestPart(value = "foto", required = false) MultipartFile foto,
            @RequestPart(value = "cv", required = false) MultipartFile cv) {
        
        try {
            EmpleadoDTO empleadoDTO = objectMapper.readValue(empleadoJson, EmpleadoDTO.class);
            
            // Procesar foto
            if (foto != null && !foto.isEmpty()) {
                String fotoFilename = saveFile(foto, "fotos");
                empleadoDTO.setFoto(fotoFilename);
            }
            
            // Procesar CV
            if (cv != null && !cv.isEmpty()) {
                String cvFilename = saveFile(cv, "cvs");
                empleadoDTO.setCv(cvFilename);
            }
            
            EmpleadoDTO savedEmpleado = empleadoService.save(empleadoDTO);
            return ResponseEntity.ok(savedEmpleado);
            
        } catch (IOException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // POST sin archivos (fallback para compatibilidad)
    @PostMapping(consumes = "application/json")
    public ResponseEntity<EmpleadoDTO> createEmpleado(@RequestBody EmpleadoDTO empleadoDTO) {
        return ResponseEntity.ok(empleadoService.save(empleadoDTO));
    }

    // PUT con soporte para archivos
    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public ResponseEntity<EmpleadoDTO> updateEmpleadoWithFiles(
            @PathVariable Long id,
            @RequestPart("empleado") String empleadoJson,
            @RequestPart(value = "foto", required = false) MultipartFile foto,
            @RequestPart(value = "cv", required = false) MultipartFile cv) {
        
        try {
            EmpleadoDTO empleadoDTO = objectMapper.readValue(empleadoJson, EmpleadoDTO.class);
            empleadoDTO.setEmpleadoId(id);
            
            // Si hay nueva foto
            if (foto != null && !foto.isEmpty()) {
                // Obtener empleado actual y eliminar foto anterior
                empleadoService.findById(id).ifPresent(emp -> {
                    if (emp.getFoto() != null && !emp.getFoto().isEmpty()) {
                        deleteFile(emp.getFoto(), "fotos");
                    }
                });
                String fotoFilename = saveFile(foto, "fotos");
                empleadoDTO.setFoto(fotoFilename);
            }
            
            // Si hay nuevo CV
            if (cv != null && !cv.isEmpty()) {
                empleadoService.findById(id).ifPresent(emp -> {
                    if (emp.getCv() != null && !emp.getCv().isEmpty()) {
                        deleteFile(emp.getCv(), "cvs");
                    }
                });
                String cvFilename = saveFile(cv, "cvs");
                empleadoDTO.setCv(cvFilename);
            }
            
            EmpleadoDTO updatedEmpleado = empleadoService.save(empleadoDTO);
            return ResponseEntity.ok(updatedEmpleado);
            
        } catch (IOException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // PUT sin archivos (fallback)
    @PutMapping(value = "/{id}", consumes = "application/json")
    public ResponseEntity<EmpleadoDTO> updateEmpleado(@PathVariable Long id, @RequestBody EmpleadoDTO empleadoDTO) {
        empleadoDTO.setEmpleadoId(id);
        return ResponseEntity.ok(empleadoService.save(empleadoDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmpleado(@PathVariable Long id) {
        // Eliminar archivos asociados antes de borrar el empleado
        empleadoService.findById(id).ifPresent(empleado -> {
            if (empleado.getFoto() != null && !empleado.getFoto().isEmpty()) {
                deleteFile(empleado.getFoto(), "fotos");
            }
            if (empleado.getCv() != null && !empleado.getCv().isEmpty()) {
                deleteFile(empleado.getCv(), "cvs");
            }
        });
        
        empleadoService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // ========== MÉTODOS AUXILIARES ==========

    private String saveFile(MultipartFile file, String subFolder) throws IOException {
        // Crear directorios si no existen
        Path uploadDir = Paths.get(uploadPath, subFolder);
        Files.createDirectories(uploadDir);
        
        // Generar nombre único
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null ? 
            originalFilename.substring(originalFilename.lastIndexOf(".")) : "";
        String filename = UUID.randomUUID().toString() + extension;
        
        // Guardar archivo
        Path filePath = uploadDir.resolve(filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        
        return filename;
    }

    private void deleteFile(String filename, String subFolder) {
        try {
            Path filePath = Paths.get(uploadPath, subFolder, filename);
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            System.err.println("Error eliminando archivo: " + e.getMessage());
        }
    }
}