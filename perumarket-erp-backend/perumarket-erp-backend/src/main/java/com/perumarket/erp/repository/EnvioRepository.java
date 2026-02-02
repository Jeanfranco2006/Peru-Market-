package com.perumarket.erp.repository;

import com.perumarket.erp.models.entity.Envio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnvioRepository extends JpaRepository<Envio, Integer> {
    List<Envio> findByEstado(Envio.EstadoEnvio estado);
    Optional<Envio> findByIdVenta(Integer idVenta);
    List<Envio> findAllByOrderByIdDesc();
}
