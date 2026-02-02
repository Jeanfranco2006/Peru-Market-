package com.perumarket.erp.models.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "vehiculo")
public class Vehiculo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "placa", nullable = false, length = 20, unique = true)
    private String placa;

    @Column(name = "marca", length = 50)
    private String marca;

    @Column(name = "modelo", length = 50)
    private String modelo;

    @Column(name = "capacidad_kg", precision = 10, scale = 2)
    private BigDecimal capacidadKg;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", columnDefinition = "ENUM('DISPONIBLE','EN_RUTA','MANTENIMIENTO','INACTIVO') DEFAULT 'DISPONIBLE'")
    private EstadoVehiculo estado;

    @Column(name = "fecha_creacion", updatable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;

    // Enum para el estado
    public enum EstadoVehiculo {
        DISPONIBLE,
        EN_RUTA,
        MANTENIMIENTO,
        INACTIVO
    }

    // --- Gestión de Fechas Automática ---
    @PrePersist
    protected void onCreate() {
        this.fechaCreacion = LocalDateTime.now();
        this.fechaActualizacion = LocalDateTime.now();
        if (this.estado == null) {
            this.estado = EstadoVehiculo.DISPONIBLE;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.fechaActualizacion = LocalDateTime.now();
    }
}
