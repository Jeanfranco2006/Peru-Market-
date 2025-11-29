// ReniecService.java
package com.perumarket.erp.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class ReniecService {

    @Value("${reniec.api.token}")
    private String reniecToken;

    private final RestTemplate restTemplate;

    public ReniecService() {
        this.restTemplate = new RestTemplate();
    }

    public Map<String, String> consultarDni(String dni) {
        System.out.println("🔍 Iniciando consulta RENIEC para DNI: " + dni);
        
        // Validar DNI
        if (!dni.matches("\\d{8}")) {
            throw new RuntimeException("DNI debe tener 8 dígitos numéricos");
        }

        try {
            // Configurar headers
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + reniecToken);
            headers.set("Accept", "application/json");
            headers.set("User-Agent", "MiAplicacion/1.0");

            HttpEntity<String> entity = new HttpEntity<>(headers);

            // URL de la API
            String url = "https://api.apis.net.pe/v1/dni?numero=" + dni;
            System.out.println("🌐 URL de consulta: " + url);

            // Realizar la consulta
            ResponseEntity<Map> response = restTemplate.exchange(
                url, HttpMethod.GET, entity, Map.class);

            System.out.println("📡 Respuesta HTTP: " + response.getStatusCode());

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> data = response.getBody();
                System.out.println("📊 Datos recibidos: " + data);
                
                return procesarRespuestaReniec(data);
            } else {
                throw new RuntimeException("Error en la respuesta: " + response.getStatusCode());
            }

        } catch (Exception e) {
            System.err.println("❌ Error en consulta RENIEC: " + e.getMessage());
            e.printStackTrace();
            
            // Manejar errores específicos
            String errorMessage = e.getMessage();
            if (errorMessage.contains("401")) {
                throw new RuntimeException("Token inválido o expirado");
            } else if (errorMessage.contains("404")) {
                throw new RuntimeException("No se encontró persona con ese DNI");
            } else if (errorMessage.contains("429")) {
                throw new RuntimeException("Límite de consultas excedido. Intente más tarde.");
            } else if (errorMessage.contains("Connection") || errorMessage.contains("Timeout")) {
                throw new RuntimeException("Error de conexión con RENIEC");
            } else {
                throw new RuntimeException("Error al consultar RENIEC: " + e.getMessage());
            }
        }
    }

    private Map<String, String> procesarRespuestaReniec(Map<String, Object> data) {
        Map<String, String> resultado = new HashMap<>();
        
        // La API de apis.net.pe devuelve los datos en estos campos
        resultado.put("nombres", obtenerValorSeguro(data, "nombres"));
        resultado.put("apellidoPaterno", obtenerValorSeguro(data, "apellidoPaterno"));
        resultado.put("apellidoMaterno", obtenerValorSeguro(data, "apellidoMaterno"));
        resultado.put("direccion", obtenerValorSeguro(data, "direccion", ""));
        
        System.out.println("✅ Datos procesados correctamente: " + resultado);
        return resultado;
    }

    private String obtenerValorSeguro(Map<String, Object> data, String clave) {
        return data.get(clave) != null ? data.get(clave).toString().trim() : "";
    }
    
    private String obtenerValorSeguro(Map<String, Object> data, String clave, String valorPorDefecto) {
        return data.get(clave) != null ? data.get(clave).toString().trim() : valorPorDefecto;
    }

    // Método para verificar conexión
    public String verificarConexion() {
        try {
            // Probar con un DNI conocido
            Map<String, String> resultado = consultarDni("12345678");
            return "✅ CONEXIÓN EXITOSA - Token válido";
        } catch (Exception e) {
            return "❌ ERROR: " + e.getMessage();
        }
    }
}