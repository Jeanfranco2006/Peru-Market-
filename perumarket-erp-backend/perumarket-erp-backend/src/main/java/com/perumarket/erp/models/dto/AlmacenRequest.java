package com.perumarket.erp.models.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class AlmacenRequest {

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @NotBlank(message = "El código es obligatorio")
    private String codigo;

    @NotBlank(message = "La dirección es obligatoria")
    private String direccion;

    // Permite que sea null si no se ingresa, pero si se ingresa debe ser positivo.
    @NotNull(message = "La capacidad es obligatoria")
    private BigDecimal capacidadM3;

    private String responsable;

    // Opcional: para forzar el estado en la creación (aunque por defecto es ACTIVO)
    @Pattern(regexp = "ACTIVO|INACTIVO", message = "El estado debe ser ACTIVO o INACTIVO")
    private String estado;
}