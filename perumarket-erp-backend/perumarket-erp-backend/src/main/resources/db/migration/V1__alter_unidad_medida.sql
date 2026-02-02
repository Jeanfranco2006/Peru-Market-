-- Cambiar columna unidad_medida de ENUM a VARCHAR para soportar mas unidades
ALTER TABLE producto MODIFY COLUMN unidad_medida VARCHAR(20) DEFAULT 'UNIDAD';
