package com.perumarket.erp.models.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class EnvioDTO {
    private Integer idVenta;
    private Integer idPedido;
    private Integer idVehiculo;
    private Integer idConductor;
    private Integer idRuta;
    private String direccionEnvio;
    private LocalDate fechaEnvio;
    private BigDecimal costoTransporte;
    private String observaciones;
}
