package com.perumarket.erp.models.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class EnvioResponseDTO {
    private Integer id;
    private Integer idVenta;
    private Integer idPedido;
    private String estado;
    private String direccionEnvio;
    private LocalDate fechaEnvio;
    private LocalDate fechaEntrega;
    private BigDecimal costoTransporte;
    private String observaciones;
    private LocalDateTime fechaCreacion;

    // Datos enriquecidos
    private String placaVehiculo;
    private String marcaVehiculo;
    private String nombreConductor;
    private String licenciaConductor;
    private String nombreRuta;
    private String origenRuta;
    private String destinoRuta;

    // Datos de la venta
    private Double totalVenta;
    private String nombreCliente;
    private String estadoVenta;
}
