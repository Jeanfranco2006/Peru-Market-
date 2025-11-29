package com.perumarket.erp.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.NOT_FOUND) // Asigna el código HTTP 404
public class ResourceNotFoundException extends RuntimeException {

    private static final long serialVersionUID = 1L;
    private String resourceName;
    private String fieldName;
    private String fieldValue;

    /**
     * Constructor para ResourceNotFoundException.
     * @param resourceName Nombre del recurso (Ej: "Almacen", "Producto").
     * @param fieldName Nombre del campo por el que se buscó (Ej: "id", "codigo").
     * @param fieldValue Valor del campo que no se encontró (Ej: "10", "ALM-005").
     */
    public ResourceNotFoundException(String resourceName, String fieldName, String fieldValue) {
        super(String.format("%s no encontrado con %s : '%s'", resourceName, fieldName, fieldValue));
        this.resourceName = resourceName;
        this.fieldName = fieldName;
        this.fieldValue = fieldValue;
    }

    public String getResourceName() {
        return resourceName;
    }

    public String getFieldName() {
        return fieldName;
    }

    public String getFieldValue() {
        return fieldValue;
    }
}