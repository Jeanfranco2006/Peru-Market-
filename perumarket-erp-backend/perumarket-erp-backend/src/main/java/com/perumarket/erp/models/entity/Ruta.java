package com.perumarket.erp.models.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "ruta")
public class Ruta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;

    @Column(name = "origen", length = 150)
    private String origen;

    @Column(name = "destino", length = 150)
    private String destino;

    @Column(name = "distancia_km", precision = 10, scale = 2)
    private BigDecimal distanciaKm;

    @Column(name = "tiempo_estimado_horas", precision = 5, scale = 2)
    private BigDecimal tiempoEstimadoHoras;

    @Column(name = "costo_base", precision = 10, scale = 2)
    private BigDecimal costoBase;

    @Column(name = "fecha_creacion", updatable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;

    // --- Gestión de Fechas Automática ---
    @PrePersist
    protected void onCreate() {
        this.fechaCreacion = LocalDateTime.now();
        this.fechaActualizacion = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.fechaActualizacion = LocalDateTime.now();
    }
}
