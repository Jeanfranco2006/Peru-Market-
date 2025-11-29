package com.perumarket.erp.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.CONFLICT) // Asigna el código HTTP 409
public class DataIntegrityViolationException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    /**
     * Constructor para DataIntegrityViolationException.
     * @param message Mensaje que describe la restricción violada (Ej: "El código 'ALM-001' ya está en uso.").
     */
    public DataIntegrityViolationException(String message) {
        super(message);
    }
}