package com.perumarket.erp.models.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class DetalleCompraDTO {
    @JsonProperty("id_producto")
    private Integer idProducto;

    private Integer cantidad;

    @JsonProperty("precio_unitario")
    private BigDecimal precioUnitario;

    private BigDecimal subtotal;
}