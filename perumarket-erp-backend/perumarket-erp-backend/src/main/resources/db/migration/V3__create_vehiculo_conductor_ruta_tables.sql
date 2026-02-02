-- =============================================
-- Crear tablas: vehiculo, conductor, ruta
-- Modificar tabla envio con nuevas columnas y FKs
-- =============================================

-- 1. Tabla vehiculo
CREATE TABLE IF NOT EXISTS vehiculo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    placa VARCHAR(20) NOT NULL UNIQUE,
    marca VARCHAR(50),
    modelo VARCHAR(50),
    capacidad_kg DECIMAL(10,2),
    estado ENUM('DISPONIBLE','EN_RUTA','MANTENIMIENTO','INACTIVO') DEFAULT 'DISPONIBLE',
    fecha_creacion DATETIME,
    fecha_actualizacion DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Tabla conductor
CREATE TABLE IF NOT EXISTS conductor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_persona BIGINT NOT NULL,
    licencia VARCHAR(20) NOT NULL,
    categoria_licencia VARCHAR(10),
    estado ENUM('ACTIVO','INACTIVO') DEFAULT 'ACTIVO',
    fecha_creacion DATETIME,
    fecha_actualizacion DATETIME,
    CONSTRAINT fk_conductor_persona FOREIGN KEY (id_persona) REFERENCES persona(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Tabla ruta
CREATE TABLE IF NOT EXISTS ruta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    origen VARCHAR(150),
    destino VARCHAR(150),
    distancia_km DECIMAL(10,2),
    tiempo_estimado_horas DECIMAL(5,2),
    costo_base DECIMAL(10,2),
    fecha_creacion DATETIME,
    fecha_actualizacion DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Agregar columnas a tabla envio
ALTER TABLE envio ADD COLUMN IF NOT EXISTS id_vehiculo INT NULL;
ALTER TABLE envio ADD COLUMN IF NOT EXISTS id_conductor INT NULL;
ALTER TABLE envio ADD COLUMN IF NOT EXISTS id_ruta INT NULL;
ALTER TABLE envio ADD COLUMN IF NOT EXISTS direccion_envio VARCHAR(200);
ALTER TABLE envio ADD COLUMN IF NOT EXISTS fecha_envio DATE;
ALTER TABLE envio ADD COLUMN IF NOT EXISTS fecha_entrega DATE;
ALTER TABLE envio ADD COLUMN IF NOT EXISTS costo_transporte DECIMAL(10,2);
ALTER TABLE envio ADD COLUMN IF NOT EXISTS observaciones TEXT;
ALTER TABLE envio ADD COLUMN IF NOT EXISTS fecha_creacion DATETIME;
ALTER TABLE envio ADD COLUMN IF NOT EXISTS fecha_actualizacion DATETIME;

-- 5. Foreign keys de envio a vehiculo, conductor, ruta
ALTER TABLE envio ADD CONSTRAINT fk_envio_vehiculo FOREIGN KEY (id_vehiculo) REFERENCES vehiculo(id);
ALTER TABLE envio ADD CONSTRAINT fk_envio_conductor FOREIGN KEY (id_conductor) REFERENCES conductor(id);
ALTER TABLE envio ADD CONSTRAINT fk_envio_ruta FOREIGN KEY (id_ruta) REFERENCES ruta(id);
