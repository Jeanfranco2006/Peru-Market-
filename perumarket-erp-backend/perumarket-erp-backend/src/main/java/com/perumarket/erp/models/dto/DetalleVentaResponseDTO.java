package com.perumarket.erp.models.dto;

import com.perumarket.erp.models.entity.Producto;

import lombok.Data;

@Data
public class DetalleVentaResponseDTO {
    private Integer idProducto;

    private Integer cantidad;
    private Double precioUnitario;
    private Double subtotal;
    private String nombreProducto; // Opcional, para mostrar nombre
    private String imagen; // Imagen desde inventario/producto

    public DetalleVentaResponseDTO() {
    }

    public DetalleVentaResponseDTO(com.perumarket.erp.models.entity.DetalleVenta detalle) {
        this.idProducto = detalle.getIdProducto();
        this.cantidad = detalle.getCantidad();
        this.precioUnitario = detalle.getPrecioUnitario();
        this.subtotal = detalle.getSubtotal();
            // Esto asume que tu entidad DetalleVenta tiene un Producto relacionado
    Producto producto = detalle.getProducto();
    if (producto != null) {
        this.nombreProducto = producto.getNombre();
        this.imagen = producto.getImagen(); // URL o path relativo
    }
    }
}
