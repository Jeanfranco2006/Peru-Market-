package com.perumarket.erp.service;

import com.perumarket.erp.models.entity.CategoriaProducto;
import com.perumarket.erp.repository.CategoriaProductoRepository;
import com.perumarket.erp.models.dto.CategoriaProductoDTO;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoriaProductoService {
    
    private final CategoriaProductoRepository categoriaProductoRepository;

    public CategoriaProductoService(CategoriaProductoRepository categoriaProductoRepository) {
        this.categoriaProductoRepository = categoriaProductoRepository;
    }

    private CategoriaProductoDTO mapToDTO(CategoriaProducto categoria) {
        CategoriaProductoDTO dto = new CategoriaProductoDTO();
        dto.setId(categoria.getId());
        dto.setNombre(categoria.getNombre());
        dto.setDescripcion(categoria.getDescripcion());
        return dto;
    }

    @Transactional(readOnly = true)
    public List<CategoriaProductoDTO> obtenerTodasCategorias() {
        return categoriaProductoRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
}