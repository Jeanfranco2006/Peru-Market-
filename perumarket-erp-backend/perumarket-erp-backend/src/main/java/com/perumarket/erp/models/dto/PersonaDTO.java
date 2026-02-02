package com.perumarket.erp.models.dto;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class PersonaDTO {
    @JsonProperty("id")  // ← OPCIONAL: Si tu frontend usa "id" no "personaid"
    private Long id;

    private String tipoDocumento;
    private String numeroDocumento;
    private String nombres;
    private String apellidoPaterno;
    private String apellidoMaterno;
    private String correo;
    private String telefono;
    private LocalDate fechaNacimiento;
    private String direccion;
}