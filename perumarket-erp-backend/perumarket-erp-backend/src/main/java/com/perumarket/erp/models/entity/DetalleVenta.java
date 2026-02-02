package com.perumarket.erp.models.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "detalle_venta")
public class DetalleVenta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_venta", nullable = false)
    @ToString.Exclude
    private Venta venta;

    // RELACIÓN SOLO LECTURA AL PRODUCTO
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_producto", insertable = false, updatable = false)
    @ToString.Exclude
    private Producto producto;

    // ID REAL QUE SE GUARDA EN LA TABLA
    @Column(name = "id_producto")
    private Integer idProducto;

    @Column(name = "id_codigo_barras")
    private String idCodigoBarras;

    private Integer cantidad;

    @Column(name = "precio_unitario")
    private Double precioUnitario;

    private Double descuento;

    private Double subtotal;

    @Column(name = "registrado_con_escaner")
    private Boolean registradoConEscaner;

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;

    @PrePersist
    public void onCreate() {
        fechaCreacion = LocalDateTime.now();
        fechaActualizacion = LocalDateTime.now();

        if (registradoConEscaner == null) registradoConEscaner = false;
        if (descuento == null) descuento = 0.0;
    }

    @PreUpdate
    public void onUpdate() {
        fechaActualizacion = LocalDateTime.now();
    }
}
