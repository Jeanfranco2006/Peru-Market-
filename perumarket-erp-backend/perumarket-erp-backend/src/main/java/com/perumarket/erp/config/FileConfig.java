package com.perumarket.erp.config;

import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class FileConfig implements WebMvcConfigurer {

    @Value("${upload.path:./uploads}")
    private String uploadPath;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Servir archivos desde /uploads/**
        String absolutePath = Paths.get(uploadPath).toAbsolutePath().toUri().toString();
        
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(absolutePath);
    }
}