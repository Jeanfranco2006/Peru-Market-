package com.perumarket.erp.models.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "venta")
public class Venta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "id_venta", referencedColumnName = "id")
    private List<DetalleVenta> detalles;


    @Column(name = "id_cliente")
    private Integer idCliente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @Column(name = "id_almacen")
    private Integer idAlmacen;

    private LocalDateTime fecha;

    private Double subtotal;

    @Column(name = "descuento_total")
    private Double descuentoTotal;

    private Double igv;

    private Double total;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", columnDefinition = "ENUM('PENDIENTE','COMPLETADA','ANULADA') DEFAULT 'PENDIENTE'")
    private EstadoVenta estado;

    public enum EstadoVenta {
        PENDIENTE,
        COMPLETADA,
        ANULADA
    }

    @Column(name = "usa_codigo_barras")
    private Boolean usaCodigoBarras;

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;

    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDateTime.now();
        fechaActualizacion = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        fechaActualizacion = LocalDateTime.now();
    }

}
