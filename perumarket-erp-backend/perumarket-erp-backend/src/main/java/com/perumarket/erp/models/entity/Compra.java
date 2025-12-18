package com.perumarket.erp.models.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties; // <--- IMPORTANTE
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Table(name = "compra")
@JsonIgnoreProperties(  {"hibernateLazyInitializer", "handler"})
public class Compra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // --- AQUÍ ESTÁ EL FIX DEL ERROR 500 ---
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_proveedor")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) // <--- AGREGA ESTO
    private Proveedor proveedor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_almacen")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) // <--- AGREGA ESTO
    private Almacen almacen;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) // <--- AGREGA ESTO
    private Usuario usuario;

    // ... (El resto de campos como fecha, montos, etc. déjalos igual) ...
    
    @Column(name = "fecha")
    private LocalDateTime fechaCompra;
    private BigDecimal total;
    private String estado;
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
    // Aquí NO pongas JsonIgnore, porque sí queremos ver los productos en la lista
    private List<DetalleCompra> detalles = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        this.fechaCompra = LocalDateTime.now();
        this.fechaCreacion = LocalDateTime.now();
        this.fechaActualizacion = LocalDateTime.now();
        if(this.usaCodigoBarras == null) this.usaCodigoBarras = false;
    }
    @PreUpdate
    public void preUpdate() { this.fechaActualizacion = LocalDateTime.now(); }
}