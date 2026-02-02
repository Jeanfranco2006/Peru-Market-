package com.perumarket.erp.models.dto;

import lombok.Data;

@Data
public class DetalleVentaDTO {
    private Integer idProducto;
    private Integer cantidad;
    private Double precioUnitario;
    private Double subtotal;
}
