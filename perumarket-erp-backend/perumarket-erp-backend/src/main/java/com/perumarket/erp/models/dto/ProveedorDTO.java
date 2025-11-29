package com.perumarket.erp.models.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data; 

@Data 
public class ProveedorDTO {

    private Integer id;
    private String ruc;

    @JsonProperty("razon_social")
    private String razonSocial; 
    
    private String contacto;
    private String telefono;
    private String correo;
    private String direccion;
    private String estado; 
}