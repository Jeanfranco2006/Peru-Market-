package com.perumarket.erp.models.dto;

import java.math.BigDecimal;

public interface ProductoPendienteDTO {
    Long getIdProducto();
    String getNombreProducto();
    BigDecimal getPesoKg();
    BigDecimal getPrecioCompra();
    Integer getCantidadComprada();
    Long getIdProveedor();
    String getNombreProveedor();
    String getSkuSugerido();
    String getImagen();
}
