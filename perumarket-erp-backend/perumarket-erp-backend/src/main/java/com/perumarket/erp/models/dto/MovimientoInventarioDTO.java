package com.perumarket.erp.models.dto;

import com.perumarket.erp.models.entity.MovimientoInventario.TipoMovimiento;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class MovimientoInventarioDTO {
    private Integer id;
    private TipoMovimiento tipoMovimiento;
    private Integer cantidad;
    private Integer stockAnterior;
    private Integer stockNuevo;
    private String motivo;
    private String nombreAlmacen;
    private LocalDateTime fechaMovimiento;
    private Integer idUsuario;
}