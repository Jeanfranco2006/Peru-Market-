package com.perumarket.erp.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/productos")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductoImageController {
    
    @PostMapping("/upload-image")
    public ResponseEntity<?> uploadImage(@RequestParam("image") MultipartFile file,
                                         @RequestParam("fileName") String fileName) {
        try {
            System.out.println("=== INICIANDO SUBIDA DE IMAGEN ===");
            
            String projectRoot = System.getProperty("user.dir");
            System.out.println("📁 Directorio actual: " + projectRoot);
            
            // ✅ DETECCIÓN AUTOMÁTICA DE RUTA
            Path uploadPath = findUploadPath(projectRoot);
            
            System.out.println("🎯 Ruta de destino: " + uploadPath.toAbsolutePath());
            System.out.println("📄 Archivo: " + fileName + ", Tamaño: " + file.getSize() + " bytes");
            
            // VALIDACIONES
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("El archivo está vacío");
            }
            
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest().body("Solo se permiten archivos de imagen (JPEG, PNG, GIF, etc.)");
            }
            
            if (file.getSize() > 10 * 1024 * 1024) {
                return ResponseEntity.badRequest().body("El archivo es demasiado grande. Máximo 10MB permitido.");
            }
            
            // CREAR DIRECTORIO SI NO EXISTE
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
                System.out.println("✅ Directorio creado: " + uploadPath.toAbsolutePath());
            }
            
            // SANITIZAR NOMBRE DEL ARCHIVO
            String safeFileName = fileName.replaceAll("[^a-zA-Z0-9._-]", "_");
            
            // GUARDAR ARCHIVO
            Path filePath = uploadPath.resolve(safeFileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            // VERIFICAR QUE SE GUARDÓ CORRECTAMENTE
            if (!Files.exists(filePath)) {
                throw new IOException("No se pudo guardar el archivo en: " + filePath);
            }
            
            long fileSize = Files.size(filePath);
            System.out.println("✅ Archivo guardado: " + filePath.toAbsolutePath() + " (" + fileSize + " bytes)");
            
            // RESPUESTA PARA EL FRONTEND
            String imagePath = "/api/img/products/" + safeFileName;
            Map<String, String> response = new HashMap<>();
            response.put("imagePath", imagePath);
            response.put("message", "Imagen subida exitosamente");
            response.put("fileName", safeFileName);
            response.put("fileSize", String.valueOf(fileSize));
            
            System.out.println("🌐 URL accesible: http://localhost:8080" + imagePath);
            System.out.println("=== SUBIDA COMPLETADA ===");
            
            return ResponseEntity.ok(response);
            
        } catch (IOException e) {
            System.err.println("❌ Error al guardar imagen: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al guardar la imagen: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("❌ Error inesperado: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error inesperado: " + e.getMessage());
        }
    }
    
    /**
     * ✅ MÉTODO PORTABLE - Detecta automáticamente la ruta correcta
     */
    private Path findUploadPath(String projectRoot) {
        // Lista de posibles rutas (ordenadas por prioridad)
        Path[] possiblePaths = {
            // 1. Estructura actual (tu caso específico)
            Paths.get(projectRoot, "src/main/resources/static/img/products"),
            // 2. Estructura típica de Spring Boot
            Paths.get(projectRoot, "target/classes/static/img/products"),
            // 3. Estructura con carpeta duplicada
            Paths.get(projectRoot, "perumarket-erp-backend", "src/main/resources/static/img/products"),
            // 4. Estructura alternativa
            Paths.get(projectRoot, "static/img/products"),
            // 5. Directorio temporal del sistema
            Paths.get(System.getProperty("java.io.tmpdir"), "perumarket", "img", "products")
        };
        
        // Buscar la primera ruta válida
        for (Path path : possiblePaths) {
            try {
                if (Files.exists(path) || Files.exists(path.getParent())) {
                    System.out.println("✅ Ruta seleccionada: " + path);
                    return path;
                }
            } catch (Exception e) {
                // Continuar con la siguiente ruta si hay error
                System.out.println("⚠️  Ruta no accesible: " + path);
            }
        }
        
        // Si ninguna funciona, usar la primera opción por defecto
        System.out.println("ℹ️  Usando ruta por defecto: " + possiblePaths[0]);
        return possiblePaths[0];
    }
}