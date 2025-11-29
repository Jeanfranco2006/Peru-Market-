package com.perumarket.erp.models.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.Data;

@Data
public class EmpleadoDTO {
    private Long empleadoId;
    private PersonaDTO persona;
    private DepartamentoDTO departamento;
    private String puesto;
    private BigDecimal sueldo;
    private LocalDate fechaContratacion;
    private String estado;
    private String foto;
    private String cv;
}