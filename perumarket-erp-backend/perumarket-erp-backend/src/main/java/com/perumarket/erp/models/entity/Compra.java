package com.perumarket.erp.models.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Table(name = "compra")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Compra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_proveedor")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Proveedor proveedor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_almacen")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Almacen almacen;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Usuario usuario;

    @Column(name = "fecha")
    private LocalDateTime fechaCompra;

    private BigDecimal total;

    // --- CAMBIO PRINCIPAL: USAR ENUM EN LUGAR DE STRING ---
    @Enumerated(EnumType.STRING)
    @Column(name = "estado")
    private Estado estado; 

    // Definición del Enum requerida por CompraService
    public enum Estado {
        PENDIENTE,
        COMPLETADA,
        ANULADA
    }
    // ------------------------------------------------------

    private String tipoComprobante;
    private String numeroComprobante;
    private BigDecimal subtotal;
    private BigDecimal igv;
    private String metodoPago;
    private String observaciones;

    @Column(name = "usa_codigo_barras")
    private Boolean usaCodigoBarras;

    @Column(name = "ruta_documento")
    private String rutaDocumento;

    @Column(name = "fecha_creacion", updatable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;

    @OneToMany(mappedBy = "compra", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetalleCompra> detalles = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        this.fechaCompra = LocalDateTime.now();
        this.fechaCreacion = LocalDateTime.now();
        this.fechaActualizacion = LocalDateTime.now();
        if(this.usaCodigoBarras == null) this.usaCodigoBarras = false;
        // Asignar estado por defecto si viene nulo
        if(this.estado == null) this.estado = Estado.PENDIENTE;
    }

    @PreUpdate
    public void preUpdate() { 
        this.fechaActualizacion = LocalDateTime.now(); 
    }
}