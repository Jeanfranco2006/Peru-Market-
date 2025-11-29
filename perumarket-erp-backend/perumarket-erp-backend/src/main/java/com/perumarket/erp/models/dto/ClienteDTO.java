package com.perumarket.erp.models.dto;

import java.time.LocalDateTime;

import com.perumarket.erp.models.entity.Cliente.TipoCliente;

import lombok.Data;

@Data
public class ClienteDTO {
    private Long clienteid;

    private PersonaDTO persona;

    private TipoCliente tipo;

    private LocalDateTime fechaCreacion;

    private LocalDateTime fechaActualizacion;
}
