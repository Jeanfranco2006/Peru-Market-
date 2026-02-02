package com.perumarket.erp.repository;

import com.perumarket.erp.models.entity.Compra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CompraRepository extends JpaRepository<Compra, Integer> {
    // Aquí puedes agregar métodos personalizados si necesitas
}