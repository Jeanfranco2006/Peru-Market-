package com.perumarket.erp.models.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "envio")
public class Envio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "id_pedido")
    private Integer idPedido;

    @Column(name = "id_venta")
    private Integer idVenta;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_vehiculo")
    private Vehiculo vehiculo;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_conductor")
    private Conductor conductor;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_ruta")
    private Ruta ruta;

    @Column(name = "direccion_envio", length = 200)
    private String direccionEnvio;

    @Column(name = "fecha_envio")
    private LocalDate fechaEnvio;

    @Column(name = "fecha_entrega")
    private LocalDate fechaEntrega;

    @Column(name = "costo_transporte", precision = 10, scale = 2)
    private BigDecimal costoTransporte;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", columnDefinition = "ENUM('PENDIENTE','EN_RUTA','ENTREGADO','CANCELADO') DEFAULT 'PENDIENTE'")
    private EstadoEnvio estado;

    @Column(name = "observaciones", columnDefinition = "TEXT")
    private String observaciones;

    @Column(name = "fecha_creacion", updatable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;

    // Enum para el estado
    public enum EstadoEnvio {
        PENDIENTE,
        EN_RUTA,
        ENTREGADO,
        CANCELADO
    }

    // --- Gestión de Fechas Automática ---
    @PrePersist
    protected void onCreate() {
        this.fechaCreacion = LocalDateTime.now();
        this.fechaActualizacion = LocalDateTime.now();
        if (this.estado == null) {
            this.estado = EstadoEnvio.PENDIENTE;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.fechaActualizacion = LocalDateTime.now();
    }
}
