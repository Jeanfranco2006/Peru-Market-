package com.perumarket.erp.models.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductoRequest {

    // --- Información del Producto ---
    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    private String descripcion;
    
    @NotBlank(message = "El SKU es obligatorio")
    private String sku;

    @NotNull(message = "El precio de venta es obligatorio")
    @DecimalMin(value = "0.01", message = "El precio de venta debe ser positivo")
    private BigDecimal precioVenta;

    private BigDecimal precioCompra;

    @NotNull(message = "La categoría es obligatoria")
    private Integer categoriaId; 

    private String unidadMedida; // Mapea al Enum UnidadMedida

    private BigDecimal pesoKg;

    private String imagen; // URL o ruta del archivo

    private Boolean requiereCodigoBarras = true;
    
    // --- Información de Stock Inicial / Inventario (Requerido al crear) ---
    @NotNull(message = "El almacén inicial es obligatorio")
    private Integer almacenId;

    @NotNull(message = "El stock inicial es obligatorio")
    @DecimalMin(value = "0", message = "El stock inicial no puede ser negativo")
    private Integer stockInicial; 

    @NotNull(message = "El stock mínimo es obligatorio")
    @DecimalMin(value = "0", message = "El stock mínimo no puede ser negativo")
    private Integer stockMinimo;

    private Integer stockMaximo; 
    
    private String ubicacion;
    
    // --- Información del Proveedor (Proveedor Producto) ---
    @NotNull(message = "El proveedor es obligatorio")
    private Integer proveedorId;
    
    // --- Información del Código de Barras Inicial ---
    @NotBlank(message = "El código de barras es obligatorio")
    private String codigoBarras;
}