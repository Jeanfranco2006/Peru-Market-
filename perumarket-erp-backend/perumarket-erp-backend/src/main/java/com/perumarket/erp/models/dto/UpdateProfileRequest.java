package com.perumarket.erp.models.dto;

import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String nombres;
    private String apellidoPaterno;
    private String apellidoMaterno;
    private String correo;
    private String telefono;
    private String direccion;
}
