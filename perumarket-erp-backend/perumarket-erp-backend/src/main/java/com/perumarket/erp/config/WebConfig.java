package com.perumarket.erp.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // ✅ CONFIGURACIÓN PORTABLE - Servir archivos estáticos
        registry.addResourceHandler("/img/products/**")
                .addResourceLocations(
                    "classpath:/static/img/products/",
                    "file:./src/main/resources/static/img/products/",
                    "file:./static/img/products/"
                );
        
        // Configuración adicional para otros recursos estáticos
        registry.addResourceHandler("/static/**")
                .addResourceLocations("classpath:/static/");
        
        // Para archivos subidos en tiempo de ejecución
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:./uploads/");
    }
}