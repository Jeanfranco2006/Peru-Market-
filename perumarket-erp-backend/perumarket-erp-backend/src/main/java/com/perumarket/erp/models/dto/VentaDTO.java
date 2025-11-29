package com.perumarket.erp.models.dto;

import java.util.List;

import lombok.Data;

@Data
public class VentaDTO {
        private Integer idCliente;
    private Long idUsuario;
    private Integer idAlmacen;
    private Double subtotal;
    private Double descuentoTotal;
    private Double igv;
    private Double total;

    private List<DetalleVentaDTO> detalles;
}
