package com.perumarket.erp.models.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class AlmacenDTO {
    private Integer id;
    private String nombre;
    private String codigo;
    private String direccion;
    private BigDecimal capacidadM3;
    private String responsable;
    private String estado; // Se envía como String (ACTIVO/INACTIVO)
}