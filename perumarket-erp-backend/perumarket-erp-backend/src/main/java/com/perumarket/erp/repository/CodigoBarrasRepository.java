package com.perumarket.erp.repository;

import com.perumarket.erp.models.entity.CodigoBarras;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CodigoBarrasRepository extends JpaRepository<CodigoBarras, Integer> {
    Optional<CodigoBarras> findByCodigo(String codigo);
    Optional<CodigoBarras> findByProductoIdAndEsPrincipalTrue(Integer productoId);
}