package com.perumarket.erp.models.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class CatalogoProductoDTO {
    private Integer productoId;
    private String nombre;
    private String sku;
    private BigDecimal precioCompra;
    private BigDecimal pesoKg;
    private String imagen;
    private String unidadMedida;
    private Integer proveedorId;
    private String proveedorNombre;
}
