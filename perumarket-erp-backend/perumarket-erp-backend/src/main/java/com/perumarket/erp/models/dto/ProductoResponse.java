package com.perumarket.erp.models.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductoResponse {
    private Integer id;
    private String nombre;
    private String descripcion;
    private String sku;
    private BigDecimal precioVenta;
    private BigDecimal precioCompra;
    private String unidadMedida;
    private BigDecimal pesoKg;
    private String imagen;
    private String estado;
    
    // De Categoría
    private Integer categoriaId;
    private String categoriaNombre;
    
    // De Inventario (Stock principal)
    private Integer stockActual;
    private Integer stockMinimo;
    private Integer stockMaximo;
    private String ubicacionPrincipal;
    private String almacenNombre; // Nombre del almacén principal
    
    // De Proveedor (Asumiendo que obtenemos el proveedor principal, simplificado)
    private String proveedorRazonSocial;
    
    // Simulación de Barcode (Debería ser un campo en Producto/CodigoBarras)
    private String codigoBarrasPrincipal; 
}