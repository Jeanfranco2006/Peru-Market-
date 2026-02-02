package com.perumarket.erp.service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import com.perumarket.erp.models.dto.EnvioDTO;
import com.perumarket.erp.models.dto.EnvioResponseDTO;
import com.perumarket.erp.models.entity.*;
import com.perumarket.erp.repository.*;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EnvioService {

    private final EnvioRepository envioRepository;
    private final VentaRepository ventaRepository;
    private final VehiculoRepository vehiculoRepository;
    private final ConductorRepository conductorRepository;
    private final RutaRepository rutaRepository;
    private final ClienteRepository clienteRepository;

    @Transactional
    public Envio crearEnvio(EnvioDTO dto) {
        Envio envio = new Envio();
        envio.setIdVenta(dto.getIdVenta());
        envio.setIdPedido(dto.getIdPedido());
        envio.setDireccionEnvio(dto.getDireccionEnvio());
        envio.setFechaEnvio(dto.getFechaEnvio() != null ? dto.getFechaEnvio() : LocalDate.now());
        envio.setCostoTransporte(dto.getCostoTransporte());
        envio.setObservaciones(dto.getObservaciones());
        envio.setEstado(Envio.EstadoEnvio.PENDIENTE);

        if (dto.getIdVehiculo() != null) {
            Vehiculo vehiculo = vehiculoRepository.findById(dto.getIdVehiculo())
                    .orElseThrow(() -> new RuntimeException("Vehiculo no encontrado ID: " + dto.getIdVehiculo()));
            envio.setVehiculo(vehiculo);
        }
        if (dto.getIdConductor() != null) {
            Conductor conductor = conductorRepository.findById(dto.getIdConductor())
                    .orElseThrow(() -> new RuntimeException("Conductor no encontrado ID: " + dto.getIdConductor()));
            envio.setConductor(conductor);
        }
        if (dto.getIdRuta() != null) {
            Ruta ruta = rutaRepository.findById(dto.getIdRuta())
                    .orElseThrow(() -> new RuntimeException("Ruta no encontrada ID: " + dto.getIdRuta()));
            envio.setRuta(ruta);
        }

        // Si hay venta asociada, asegurar que esté en PENDIENTE
        if (dto.getIdVenta() != null) {
            Venta venta = ventaRepository.findById(dto.getIdVenta())
                    .orElseThrow(() -> new RuntimeException("Venta no encontrada ID: " + dto.getIdVenta()));
            if (venta.getEstado() != Venta.EstadoVenta.PENDIENTE) {
                venta.setEstado(Venta.EstadoVenta.PENDIENTE);
                ventaRepository.save(venta);
            }
        }

        return envioRepository.save(envio);
    }

    @Transactional(readOnly = true)
    public List<EnvioResponseDTO> listarEnvios() {
        return envioRepository.findAllByOrderByIdDesc().stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EnvioResponseDTO obtenerPorId(Integer id) {
        Envio envio = envioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Envio no encontrado ID: " + id));
        return mapToResponseDTO(envio);
    }

    @Transactional
    public Envio actualizarEstado(Integer id, String nuevoEstado) {
        Envio envio = envioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Envio no encontrado ID: " + id));

        Envio.EstadoEnvio estadoNuevo;
        try {
            estadoNuevo = Envio.EstadoEnvio.valueOf(nuevoEstado);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Estado invalido: " + nuevoEstado);
        }

        envio.setEstado(estadoNuevo);

        // Si se marca como ENTREGADO, poner fecha de entrega y completar la venta
        if (estadoNuevo == Envio.EstadoEnvio.ENTREGADO) {
            envio.setFechaEntrega(LocalDate.now());

            // Completar la venta asociada
            if (envio.getIdVenta() != null) {
                ventaRepository.findById(envio.getIdVenta()).ifPresent(venta -> {
                    venta.setEstado(Venta.EstadoVenta.COMPLETADA);
                    ventaRepository.save(venta);
                });
            }
        }

        // Si se marca como EN_RUTA, cambiar vehiculo a EN_RUTA
        if (estadoNuevo == Envio.EstadoEnvio.EN_RUTA && envio.getVehiculo() != null) {
            envio.getVehiculo().setEstado(Vehiculo.EstadoVehiculo.EN_RUTA);
            vehiculoRepository.save(envio.getVehiculo());
        }

        // Si se marca como ENTREGADO o CANCELADO, liberar vehiculo
        if ((estadoNuevo == Envio.EstadoEnvio.ENTREGADO || estadoNuevo == Envio.EstadoEnvio.CANCELADO)
                && envio.getVehiculo() != null) {
            envio.getVehiculo().setEstado(Vehiculo.EstadoVehiculo.DISPONIBLE);
            vehiculoRepository.save(envio.getVehiculo());
        }

        // Si se cancela el envio, anular la venta
        if (estadoNuevo == Envio.EstadoEnvio.CANCELADO && envio.getIdVenta() != null) {
            ventaRepository.findById(envio.getIdVenta()).ifPresent(venta -> {
                venta.setEstado(Venta.EstadoVenta.ANULADA);
                ventaRepository.save(venta);
            });
        }

        return envioRepository.save(envio);
    }

    @Transactional
    public Envio actualizarEnvio(Integer id, EnvioDTO dto) {
        Envio envio = envioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Envio no encontrado ID: " + id));

        if (dto.getDireccionEnvio() != null) envio.setDireccionEnvio(dto.getDireccionEnvio());
        if (dto.getFechaEnvio() != null) envio.setFechaEnvio(dto.getFechaEnvio());
        if (dto.getCostoTransporte() != null) envio.setCostoTransporte(dto.getCostoTransporte());
        if (dto.getObservaciones() != null) envio.setObservaciones(dto.getObservaciones());

        if (dto.getIdVehiculo() != null) {
            vehiculoRepository.findById(dto.getIdVehiculo()).ifPresent(envio::setVehiculo);
        }
        if (dto.getIdConductor() != null) {
            conductorRepository.findById(dto.getIdConductor()).ifPresent(envio::setConductor);
        }
        if (dto.getIdRuta() != null) {
            rutaRepository.findById(dto.getIdRuta()).ifPresent(envio::setRuta);
        }

        return envioRepository.save(envio);
    }

    @Transactional
    public void eliminarEnvio(Integer id) {
        Envio envio = envioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Envio no encontrado ID: " + id));
        envioRepository.delete(envio);
    }

    private EnvioResponseDTO mapToResponseDTO(Envio envio) {
        EnvioResponseDTO dto = new EnvioResponseDTO();
        dto.setId(envio.getId());
        dto.setIdVenta(envio.getIdVenta());
        dto.setIdPedido(envio.getIdPedido());
        dto.setEstado(envio.getEstado().name());
        dto.setDireccionEnvio(envio.getDireccionEnvio());
        dto.setFechaEnvio(envio.getFechaEnvio());
        dto.setFechaEntrega(envio.getFechaEntrega());
        dto.setCostoTransporte(envio.getCostoTransporte());
        dto.setObservaciones(envio.getObservaciones());
        dto.setFechaCreacion(envio.getFechaCreacion());

        // Vehiculo
        if (envio.getVehiculo() != null) {
            dto.setPlacaVehiculo(envio.getVehiculo().getPlaca());
            dto.setMarcaVehiculo(envio.getVehiculo().getMarca() + " " + envio.getVehiculo().getModelo());
        }

        // Conductor
        if (envio.getConductor() != null) {
            Conductor cond = envio.getConductor();
            dto.setNombreConductor(cond.getNombres() + " " + cond.getApellidoPaterno());
            dto.setLicenciaConductor(cond.getLicencia());
        }

        // Ruta
        if (envio.getRuta() != null) {
            dto.setNombreRuta(envio.getRuta().getNombre());
            dto.setOrigenRuta(envio.getRuta().getOrigen());
            dto.setDestinoRuta(envio.getRuta().getDestino());
        }

        // Venta
        if (envio.getIdVenta() != null) {
            ventaRepository.findById(envio.getIdVenta()).ifPresent(venta -> {
                dto.setTotalVenta(venta.getTotal());
                dto.setEstadoVenta(venta.getEstado().name());

                // Nombre del cliente
                if (venta.getIdCliente() != null) {
                    clienteRepository.findById(venta.getIdCliente().longValue()).ifPresent(cliente -> {
                        if (cliente.getPersona() != null) {
                            Persona pc = cliente.getPersona();
                            dto.setNombreCliente(pc.getNombres() + " " + pc.getApellidoPaterno());
                        }
                    });
                }
            });
        }

        return dto;
    }
}
