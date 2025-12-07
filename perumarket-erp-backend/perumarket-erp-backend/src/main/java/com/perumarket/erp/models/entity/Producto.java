package com.perumarket.erp.models.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "producto")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "nombre", nullable = false, length = 150)
    private String nombre;

    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "sku", length = 50, unique = true)
    private String sku;

    @Column(name = "precio_venta", nullable = false, precision = 10, scale = 2)
    private BigDecimal precioVenta;

    @Column(name = "precio_compra", precision = 10, scale = 2)
    private BigDecimal precioCompra;
    
    // NOTA: El stock global 'stock' de la tabla DB no lo usaremos directamente en la Entidad, 
    // ya que la fuente de verdad es la tabla INVENTARIO. Spring lo ignorará por defecto si no lo mapeamos, lo cual es bueno.
    
    @Enumerated(EnumType.STRING)
    @Column(name = "unidad_medida", columnDefinition = "ENUM('UNIDAD','CAJA','PAQUETE','KG','LITRO') DEFAULT 'UNIDAD'")
    private UnidadMedida unidadMedida;

    @Column(name = "peso_kg", precision = 10, scale = 3)
    private BigDecimal pesoKg;

    
    @Column(name = "imagen", length = 255)
    private String imagen; // Ruta o URL de la imagen

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoria_id")
    private CategoriaProducto categoria;

    @Column(name = "requiere_codigo_barras")
    private Boolean requiereCodigoBarras = true;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", columnDefinition = "ENUM('ACTIVO','INACTIVO') DEFAULT 'ACTIVO'")
    private EstadoProducto estado;

    @Column(name = "fecha_creacion", updatable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;

    // ENUMS
    public enum EstadoProducto {
        ACTIVO,
        INACTIVO
    }
    
    public enum UnidadMedida {
        UNIDAD, CAJA, PAQUETE, KG, LITRO
    }

    @PrePersist
    protected void onCreate() {
        this.fechaCreacion = LocalDateTime.now();
        this.fechaActualizacion = LocalDateTime.now();
        if (this.estado == null) {
            this.estado = EstadoProducto.ACTIVO;
        }
        if (this.unidadMedida == null) {
            this.unidadMedida = UnidadMedida.UNIDAD;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.fechaActualizacion = LocalDateTime.now();
    }
}