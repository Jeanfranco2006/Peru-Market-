package com.perumarket.erp.models.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "codigo_barras")
public class CodigoBarras {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "codigo", nullable = false, length = 50, unique = true)
    private String codigo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_producto", nullable = false)
    private Producto producto;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_proveedor")
    private Proveedor proveedor; // Puede ser null

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_codigo", columnDefinition = "ENUM('EAN13','EAN8','UPC','CODE128','CODE39','QR','INTERNO') DEFAULT 'EAN13'")
    private TipoCodigo tipoCodigo = TipoCodigo.EAN13;

    @Column(name = "descripcion", length = 200)
    private String descripcion;

    @Column(name = "es_principal")
    private Boolean esPrincipal = false;

    @Column(name = "unidades_por_codigo")
    private Integer unidadesPorCodigo = 1;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", columnDefinition = "ENUM('ACTIVO','INACTIVO') DEFAULT 'ACTIVO'")
    private Estado estado = Estado.ACTIVO;

    @Column(name = "fecha_creacion", updatable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;

    public enum TipoCodigo {
        EAN13, EAN8, UPC, CODE128, CODE39, QR, INTERNO
    }
    public enum Estado {
        ACTIVO, INACTIVO
    }

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