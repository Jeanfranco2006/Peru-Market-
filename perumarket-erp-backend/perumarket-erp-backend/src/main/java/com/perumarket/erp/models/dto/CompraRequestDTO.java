package com.perumarket.erp.models.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class CompraRequestDTO {
    @JsonProperty("id_proveedor")
    private Long idProveedor;

    @JsonProperty("id_almacen")
    private Long idAlmacen;

    @JsonProperty("id_usuario")
    private Long idUsuario;

    @JsonProperty("tipo_comprobante")
    private String tipoComprobante;

    @JsonProperty("numero_comprobante")
    private String numeroComprobante;

    private BigDecimal subtotal;
    private BigDecimal igv;
    private BigDecimal total;
    private String estado;

    @JsonProperty("metodo_pago")
    private String metodoPago;
    
    private String observaciones;

    private List<DetalleCompraDTO> detalles;
}