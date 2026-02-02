-- Agregar columna id_venta a tabla envio para relacionar envios con ventas
ALTER TABLE envio ADD COLUMN id_venta INT NULL AFTER id_pedido;
ALTER TABLE envio ADD CONSTRAINT fk_envio_venta FOREIGN KEY (id_venta) REFERENCES venta(id);

-- Hacer id_pedido nullable ya que ahora un envio puede estar ligado a venta directamente
ALTER TABLE envio MODIFY COLUMN id_pedido INT NULL;
