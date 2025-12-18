package com.perumarket.erp.models.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class CompraDTO {
    // Estos campos coinciden con el JSON de tu React
    @JsonProperty("id_proveedor")
    private Integer idProveedor;

    @JsonProperty("id_almacen")
    private Integer idAlmacen;

    @JsonProperty("id_usuario")
    private long idUsuario;

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

    // Lista de productos
    private List<DetalleCompraDTO> detalles;
}