-- =============================================
-- Migrar conductor: datos directos en vez de referencia a persona
-- =============================================

-- 1. Agregar columnas de datos personales directamente
ALTER TABLE conductor ADD COLUMN nombres VARCHAR(100) NULL;
ALTER TABLE conductor ADD COLUMN apellido_paterno VARCHAR(100) NULL;
ALTER TABLE conductor ADD COLUMN apellido_materno VARCHAR(100) NULL;
ALTER TABLE conductor ADD COLUMN telefono VARCHAR(20) NULL;
ALTER TABLE conductor ADD COLUMN numero_documento VARCHAR(20) NULL;

-- 2. Copiar datos existentes desde persona
UPDATE conductor c
INNER JOIN persona p ON c.id_persona = p.id
SET c.nombres = p.nombres,
    c.apellido_paterno = p.apellido_paterno,
    c.apellido_materno = p.apellido_materno,
    c.telefono = p.telefono,
    c.numero_documento = p.numero_documento;

-- 3. Quitar FK y columna de persona
ALTER TABLE conductor DROP FOREIGN KEY fk_conductor_persona;
ALTER TABLE conductor DROP COLUMN id_persona;

-- 4. Cambiar estado de ENUM a VARCHAR para consistencia
ALTER TABLE conductor MODIFY COLUMN estado VARCHAR(20) DEFAULT 'ACTIVO';
