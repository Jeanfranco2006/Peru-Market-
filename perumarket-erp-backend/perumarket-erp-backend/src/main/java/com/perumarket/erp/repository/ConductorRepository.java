package com.perumarket.erp.repository;

import com.perumarket.erp.models.entity.Conductor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConductorRepository extends JpaRepository<Conductor, Integer> {
    List<Conductor> findByEstado(String estado);
}
