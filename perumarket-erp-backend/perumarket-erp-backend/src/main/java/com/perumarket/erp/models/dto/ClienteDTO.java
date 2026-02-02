package com.perumarket.erp.models.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.perumarket.erp.models.entity.Cliente.TipoCliente;

import lombok.Data;

@Data
public class ClienteDTO {

    // Gracias a esto, el Frontend recibe { "id": 1 } en lugar de { "clienteid": 1 }
    // Tu frontend usa "data.id", así que esto lo hace compatible.
    @JsonProperty("id") 
    private Long clienteid;

    private PersonaDTO persona;

    private TipoCliente tipo;

    // --- AGREGA ESTO URGENTE ---
    // Si no agregas esto, tu Frontend recibirá "estado": undefined
    // y los badges de ACTIVO/INACTIVO no saldrán.
    private String estado; 
    // ---------------------------

    private LocalDateTime fechaCreacion;

    private LocalDateTime fechaActualizacion;
}