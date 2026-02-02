package com.perumarket.erp.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.perumarket.erp.exception.ResourceNotFoundException;
import com.perumarket.erp.models.dto.AlmacenDTO;
import com.perumarket.erp.models.dto.AlmacenRequest;
import com.perumarket.erp.models.entity.Almacen;
import com.perumarket.erp.models.entity.Almacen.EstadoAlmacen;
import com.perumarket.erp.repository.AlmacenRepository;
import com.perumarket.erp.repository.InventarioRepository;

@Service
public class AlmacenService {

    private final AlmacenRepository almacenRepository;
    private final InventarioRepository inventarioRepository;

    public AlmacenService(AlmacenRepository almacenRepository, InventarioRepository inventarioRepository) {
        this.almacenRepository = almacenRepository;
        this.inventarioRepository = inventarioRepository;
    }

    // --- Mapeo de Entidad a DTO ---
   private AlmacenDTO mapToDTO(Almacen almacen) {
        AlmacenDTO dto = new AlmacenDTO();
        dto.setId(almacen.getId());
        dto.setNombre(almacen.getNombre());
        dto.setCodigo(almacen.getCodigo());
        dto.setDireccion(almacen.getDireccion());
        dto.setCapacidadM3(almacen.getCapacidadM3());
        dto.setResponsable(almacen.getResponsable());
        dto.setEstado(almacen.getEstado().name());

        // --- CÁLCULO DE OCUPACIÓN REAL ---
        BigDecimal ocupacion = inventarioRepository.obtenerPesoTotalEnAlmacen(almacen.getId());
        
        dto.setOcupacionCalculada(ocupacion);

        return dto;
    }

    // --- Mapeo de Request a Entidad (para guardar/actualizar) ---
    private Almacen mapToEntity(AlmacenRequest request, Almacen almacen) {
        almacen.setNombre(request.getNombre());
        almacen.setCodigo(request.getCodigo());
        almacen.setDireccion(request.getDireccion());
        almacen.setCapacidadM3(request.getCapacidadM3());
        almacen.setResponsable(request.getResponsable());
        
        if (request.getEstado() != null) {
            almacen.setEstado(EstadoAlmacen.valueOf(request.getEstado()));
        }
        return almacen;
    }

    // --- CRUD Operations ---

    @Transactional
    public AlmacenDTO crearAlmacen(AlmacenRequest request) {
        // Validación de código único
        if (almacenRepository.findByCodigo(request.getCodigo()).isPresent()) {
            throw new DataIntegrityViolationException("El código '" + request.getCodigo() + "' ya está en uso.");
        }

        Almacen nuevoAlmacen = mapToEntity(request, new Almacen());
        
        // El @PrePersist se encarga de las fechas y el estado ACTIVO por defecto
        Almacen savedAlmacen = almacenRepository.save(nuevoAlmacen);
        return mapToDTO(savedAlmacen);
    }

    @Transactional(readOnly = true)
    public List<AlmacenDTO> obtenerTodosAlmacenes() {
        List<Almacen> almacenes = almacenRepository.findAll();
        // Nota: se pueden añadir aquí proyecciones de stock futuro si fuera necesario
        return almacenes.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AlmacenDTO obtenerAlmacenPorId(Integer id) {
        Almacen almacen = almacenRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Almacen", "id", id.toString()));
        return mapToDTO(almacen);
    }

    @Transactional
    public AlmacenDTO actualizarAlmacen(Integer id, AlmacenRequest request) {
        Almacen almacenExistente = almacenRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Almacen", "id", id.toString()));

        // Validación de código único (si cambia)
        if (!almacenExistente.getCodigo().equals(request.getCodigo())) {
            if (almacenRepository.findByCodigo(request.getCodigo()).isPresent()) {
                throw new DataIntegrityViolationException("El código '" + request.getCodigo() + "' ya está en uso por otro almacén.");
            }
        }

        Almacen updatedAlmacen = mapToEntity(request, almacenExistente);
        Almacen savedAlmacen = almacenRepository.save(updatedAlmacen);
        return mapToDTO(savedAlmacen);
    }

    @Transactional
    public void eliminarAlmacen(Integer id) {
        // En una aplicación real, se debe validar que el almacén no tenga inventario o movimientos asociados.
        if (!almacenRepository.existsById(id)) {
            throw new ResourceNotFoundException("Almacen", "id", id.toString());
        }
        almacenRepository.deleteById(id);
    }
}