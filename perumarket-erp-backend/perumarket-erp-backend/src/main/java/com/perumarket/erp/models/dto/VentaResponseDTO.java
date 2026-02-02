package com.perumarket.erp.models.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.Data;

@Data
public class VentaResponseDTO {
    private Integer id;
    private Double subtotal;
    private Double descuentoTotal;
    private Double igv;
    private Double total;
    private Integer idCliente;
    private Integer idAlmacen;
    private String estado;
    private LocalDateTime fecha;
    private LocalDateTime fechaCreacion;
    private String nombreUsuario;
    private String nombreCliente;
    private String nombreAlmacen;
    private List<DetalleVentaResponseDTO> detalles;
}
