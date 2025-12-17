package com.perumarket.erp.models.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductoProveedorResponse {
   private Integer id;         // ID de la relación (proveedor_producto)
    private Integer productoId; // ID real del producto
    private String nombre;
    private String codigo;      // SKU
    private BigDecimal precio_compra;
    private BigDecimal peso_kg;
    private BigDecimal descuento;
    private String imagen;
}