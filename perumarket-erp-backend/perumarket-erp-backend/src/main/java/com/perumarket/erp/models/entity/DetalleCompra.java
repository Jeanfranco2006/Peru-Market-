package com.perumarket.erp.models.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties; // Agrega esto por seguridad
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "detalle_compra")
public class DetalleCompra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // ESTO EVITA QUE LA MEMORIA EXPLOTE (StackOverflow)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_compra")
    @JsonIgnore  
    private Compra compra;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_producto")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) // Recomendado agregar esto aquí también
    private Producto producto;

    private Integer cantidad;
    private BigDecimal precioUnitario;
    private BigDecimal subtotal;
    
    @Column(name = "id_codigo_barras")
    private Integer idCodigoBarras;
    @Column(name = "registrado_con_escaner")
    private Boolean registradoConEscaner;
    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;
    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;
    
    @PrePersist
    public void prePersist() { this.fechaCreacion = LocalDateTime.now(); this.fechaActualizacion = LocalDateTime.now(); }
    @PreUpdate
    public void preUpdate() { this.fechaActualizacion = LocalDateTime.now(); }
}