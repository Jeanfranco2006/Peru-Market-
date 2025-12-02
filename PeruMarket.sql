-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 02-12-2025 a las 06:20:16
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `perumarket_erp`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `almacen`
--

CREATE TABLE `almacen` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `codigo` varchar(20) DEFAULT NULL,
  `direccion` varchar(200) DEFAULT NULL,
  `capacidad_m3` decimal(10,2) DEFAULT NULL,
  `responsable` varchar(100) DEFAULT NULL,
  `estado` enum('ACTIVO','INACTIVO') DEFAULT 'ACTIVO',
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `almacen`
--

INSERT INTO `almacen` (`id`, `nombre`, `codigo`, `direccion`, `capacidad_m3`, `responsable`, `estado`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, 'ZZZ', 'u2322', 'Lima', 1500.00, 'jean', 'ACTIVO', '2025-11-29 04:55:08', '2025-11-29 04:55:08');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoria_producto`
--

CREATE TABLE `categoria_producto` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(200) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categoria_producto`
--

INSERT INTO `categoria_producto` (`id`, `nombre`, `descripcion`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, 'Electrónicos', 'Productos tecnológicos como laptops, celulares, teclados', '2025-11-29 04:55:55', '2025-11-29 04:55:55'),
(2, 'Ropa', 'Prendas de vestir para hombres y mujeres', '2025-11-29 04:55:55', '2025-11-29 04:55:55'),
(3, 'Accesorios', 'Accesorios varios como relojes, cadenas, pulseras', '2025-11-29 04:55:55', '2025-11-29 04:55:55'),
(4, 'Hogar', 'Productos para el hogar y decoración', '2025-11-29 04:55:55', '2025-11-29 04:55:55'),
(5, 'Juguetes', 'Juguetes para niños de todas las edades', '2025-11-29 04:55:55', '2025-11-29 04:55:55');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cliente`
--

CREATE TABLE `cliente` (
  `id` int(11) NOT NULL,
  `id_persona` int(11) NOT NULL,
  `tipo` enum('NATURAL','JURIDICA') DEFAULT 'NATURAL',
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cliente`
--

INSERT INTO `cliente` (`id`, `id_persona`, `tipo`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, 7, 'NATURAL', '2025-11-29 04:52:22', '2025-11-29 04:52:22'),
(2, 10, 'NATURAL', '2025-11-29 05:09:34', '2025-11-29 05:09:34');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `codigo_barras`
--

CREATE TABLE `codigo_barras` (
  `id` int(11) NOT NULL,
  `codigo` varchar(50) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `id_proveedor` int(11) DEFAULT NULL,
  `tipo_codigo` enum('EAN13','EAN8','UPC','CODE128','CODE39','QR','INTERNO') DEFAULT 'EAN13',
  `descripcion` varchar(200) DEFAULT NULL,
  `es_principal` tinyint(1) DEFAULT 0,
  `unidades_por_codigo` int(11) DEFAULT 1,
  `estado` enum('ACTIVO','INACTIVO') DEFAULT 'ACTIVO',
  `fecha_generacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `codigo_barras`
--

INSERT INTO `codigo_barras` (`id`, `codigo`, `id_producto`, `id_proveedor`, `tipo_codigo`, `descripcion`, `es_principal`, `unidades_por_codigo`, `estado`, `fecha_generacion`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, '3746801197729', 1, 1, 'EAN13', NULL, 1, 1, 'ACTIVO', '2025-11-29 04:57:17', '2025-11-29 04:57:17', '2025-11-29 04:57:17'),
(2, 'CODE128-939415109309-23', 2, 1, 'EAN13', NULL, 1, 1, 'ACTIVO', '2025-11-29 05:26:02', '2025-11-29 05:26:02', '2025-11-29 05:26:02'),
(3, '953136844547', 3, 4, 'EAN13', NULL, 1, 1, 'ACTIVO', '2025-11-29 05:48:53', '2025-11-29 05:48:53', '2025-11-29 05:48:53'),
(4, '956707782102', 4, 2, 'EAN13', NULL, 1, 1, 'ACTIVO', '2025-11-29 05:55:00', '2025-11-29 05:55:00', '2025-11-29 05:55:00'),
(5, '963022681666', 5, 2, 'EAN13', NULL, 1, 1, 'ACTIVO', '2025-11-29 06:05:19', '2025-11-29 06:05:19', '2025-11-29 06:05:19'),
(6, '964805919713', 6, 3, 'EAN13', NULL, 1, 1, 'ACTIVO', '2025-11-29 06:08:13', '2025-11-29 06:08:13', '2025-11-29 06:08:13'),
(7, '967250194920', 7, 2, 'EAN13', NULL, 1, 1, 'ACTIVO', '2025-11-29 06:12:14', '2025-11-29 06:12:14', '2025-11-29 06:12:14'),
(8, '971443546148', 8, 2, 'EAN13', NULL, 1, 1, 'ACTIVO', '2025-11-29 06:19:18', '2025-11-29 06:19:18', '2025-11-29 06:19:18'),
(9, '977467003738', 9, 1, 'EAN13', NULL, 1, 1, 'ACTIVO', '2025-11-29 06:29:19', '2025-11-29 06:29:19', '2025-11-29 06:29:19'),
(10, '980135363220', 10, 2, 'EAN13', NULL, 1, 1, 'ACTIVO', '2025-11-29 06:33:47', '2025-11-29 06:33:47', '2025-11-29 06:33:47'),
(11, '983856060391', 11, 3, 'EAN13', NULL, 1, 1, 'ACTIVO', '2025-11-29 06:40:03', '2025-11-29 06:40:03', '2025-11-29 06:40:03'),
(12, '985356270077', 12, 2, 'EAN13', NULL, 1, 1, 'ACTIVO', '2025-11-29 06:42:26', '2025-11-29 06:42:26', '2025-11-29 06:42:26'),
(13, '986862118719', 13, 3, 'EAN13', NULL, 1, 1, 'ACTIVO', '2025-11-29 06:44:56', '2025-11-29 06:44:56', '2025-11-29 06:44:56'),
(14, '989465359717', 14, 4, 'EAN13', NULL, 1, 1, 'ACTIVO', '2025-11-29 06:49:21', '2025-11-29 06:49:21', '2025-11-29 06:49:21'),
(15, '991591390174', 15, 3, 'EAN13', NULL, 1, 1, 'ACTIVO', '2025-11-29 06:52:50', '2025-11-29 06:52:50', '2025-11-29 06:52:50'),
(16, '994257129478', 16, 4, 'EAN13', NULL, 1, 1, 'ACTIVO', '2025-11-29 06:57:15', '2025-11-29 06:57:15', '2025-11-29 06:57:15'),
(17, '998828008843', 17, 2, 'EAN13', NULL, 1, 1, 'ACTIVO', '2025-11-29 07:04:53', '2025-11-29 07:04:53', '2025-11-29 07:04:53'),
(18, '669330294510', 18, 3, 'EAN13', NULL, 1, 1, 'ACTIVO', '2025-12-01 05:29:05', '2025-12-01 05:29:05', '2025-12-01 05:29:05'),
(19, '458013364574', 19, 1, 'EAN13', NULL, 1, 1, 'ACTIVO', '2025-12-02 03:24:49', '2025-12-02 03:24:49', '2025-12-02 03:24:49'),
(20, '491254778884', 20, 2, 'EAN13', NULL, 1, 1, 'ACTIVO', '2025-12-02 04:19:35', '2025-12-02 04:19:35', '2025-12-02 04:19:35');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `compra`
--

CREATE TABLE `compra` (
  `id` int(11) NOT NULL,
  `id_proveedor` int(11) NOT NULL,
  `id_almacen` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  `tipo_comprobante` enum('FACTURA','BOLETA','ORDEN_COMPRA') DEFAULT 'ORDEN_COMPRA',
  `numero_comprobante` varchar(50) DEFAULT NULL,
  `subtotal` decimal(10,2) DEFAULT NULL,
  `igv` decimal(10,2) DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL,
  `estado` enum('PENDIENTE','COMPLETADA','ANULADA') DEFAULT 'PENDIENTE',
  `usa_codigo_barras` tinyint(1) DEFAULT 0,
  `ruta_documento` varchar(255) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comprobante`
--

CREATE TABLE `comprobante` (
  `id` int(11) NOT NULL,
  `id_venta` int(11) NOT NULL,
  `tipo` enum('BOLETA','FACTURA','NOTA_CREDITO','NOTA_DEBITO') NOT NULL,
  `serie` varchar(10) NOT NULL,
  `numero` varchar(20) NOT NULL,
  `fecha_emision` timestamp NOT NULL DEFAULT current_timestamp(),
  `subtotal` decimal(10,2) DEFAULT NULL,
  `igv` decimal(10,2) DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL,
  `estado` enum('EMITIDO','ANULADO') DEFAULT 'EMITIDO',
  `ruta_pdf` varchar(255) DEFAULT NULL,
  `ruta_xml` varchar(255) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `conductor`
--

CREATE TABLE `conductor` (
  `id` int(11) NOT NULL,
  `id_persona` int(11) NOT NULL,
  `licencia` varchar(20) NOT NULL,
  `categoria_licencia` varchar(10) DEFAULT NULL,
  `estado` enum('ACTIVO','INACTIVO') DEFAULT 'ACTIVO',
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `departamento`
--

CREATE TABLE `departamento` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(150) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `departamento`
--

INSERT INTO `departamento` (`id`, `nombre`, `descripcion`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, 'Ventas', 'Departamento de ventas y atención al cliente', '2025-11-20 03:24:42', '2025-11-20 03:24:42'),
(2, 'Almacén', 'Departamento de gestión de inventario', '2025-11-20 03:24:42', '2025-11-20 03:24:42'),
(3, 'Administración', 'Departamento administrativo y financiero', '2025-11-20 03:24:42', '2025-11-20 03:24:42'),
(4, 'Logística', 'Departamento de envíos y distribución', '2025-11-20 03:24:42', '2025-11-20 03:24:42'),
(5, 'Area de Sistemas', 'dev/ front / back / analist / full stack', '2025-11-21 03:46:39', '2025-11-21 03:46:39');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_compra`
--

CREATE TABLE `detalle_compra` (
  `id` int(11) NOT NULL,
  `id_compra` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `id_codigo_barras` int(11) DEFAULT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_unitario` decimal(10,2) DEFAULT NULL,
  `subtotal` decimal(10,2) DEFAULT NULL,
  `registrado_con_escaner` tinyint(1) DEFAULT 0,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_devolucion`
--

CREATE TABLE `detalle_devolucion` (
  `id` int(11) NOT NULL,
  `id_devolucion` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_unitario` decimal(10,2) DEFAULT NULL,
  `subtotal` decimal(10,2) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_pago`
--

CREATE TABLE `detalle_pago` (
  `id` int(11) NOT NULL,
  `id_pago` int(11) NOT NULL,
  `id_metodo_pago` int(11) NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `referencia` varchar(100) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_venta`
--

CREATE TABLE `detalle_venta` (
  `id` int(11) NOT NULL,
  `id_venta` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `id_codigo_barras` int(11) DEFAULT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  `descuento` decimal(5,2) DEFAULT 0.00,
  `subtotal` decimal(10,2) DEFAULT NULL,
  `registrado_con_escaner` tinyint(1) DEFAULT 0,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalle_venta`
--

INSERT INTO `detalle_venta` (`id`, `id_venta`, `id_producto`, `id_codigo_barras`, `cantidad`, `precio_unitario`, `descuento`, `subtotal`, `registrado_con_escaner`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, 1, 1, NULL, 1, 15.00, 0.00, 15.00, 0, '2025-11-29 04:57:57', '2025-11-29 04:57:57'),
(2, 2, 2, NULL, 1, 15.00, 0.00, 15.00, 0, '2025-12-02 04:38:18', '2025-12-02 04:38:18'),
(3, 2, 3, NULL, 1, 15.00, 0.00, 15.00, 0, '2025-12-02 04:38:18', '2025-12-02 04:38:18'),
(4, 3, 3, NULL, 2, 15.00, 0.00, 30.00, 0, '2025-12-02 04:39:17', '2025-12-02 04:39:17'),
(5, 4, 3, NULL, 1, 15.00, 0.00, 15.00, 0, '2025-12-02 04:39:47', '2025-12-02 04:39:47'),
(6, 5, 2, NULL, 1, 15.00, 0.00, 15.00, 0, '2025-12-02 04:57:16', '2025-12-02 04:57:16'),
(7, 5, 3, NULL, 1, 15.00, 0.00, 15.00, 0, '2025-12-02 04:57:16', '2025-12-02 04:57:16'),
(8, 6, 5, NULL, 1, 15.00, 0.00, 15.00, 0, '2025-12-02 05:04:58', '2025-12-02 05:04:58'),
(9, 6, 6, NULL, 1, 15.00, 0.00, 15.00, 0, '2025-12-02 05:04:58', '2025-12-02 05:04:58'),
(10, 7, 5, NULL, 1, 15.00, 0.00, 15.00, 0, '2025-12-02 05:07:35', '2025-12-02 05:07:35'),
(11, 7, 6, NULL, 1, 15.00, 0.00, 15.00, 0, '2025-12-02 05:07:35', '2025-12-02 05:07:35'),
(12, 8, 2, NULL, 1, 15.00, 0.00, 15.00, 0, '2025-12-02 05:07:54', '2025-12-02 05:07:54');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `devolucion`
--

CREATE TABLE `devolucion` (
  `id` int(11) NOT NULL,
  `tipo` enum('VENTA','COMPRA') NOT NULL,
  `id_venta` int(11) DEFAULT NULL,
  `id_compra` int(11) DEFAULT NULL,
  `id_almacen` int(11) NOT NULL,
  `fecha_devolucion` timestamp NOT NULL DEFAULT current_timestamp(),
  `motivo` text NOT NULL,
  `estado` enum('SOLICITADA','APROBADA','RECHAZADA','PROCESADA') DEFAULT 'SOLICITADA',
  `total_devolucion` decimal(10,2) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empleado`
--

CREATE TABLE `empleado` (
  `id` int(11) NOT NULL,
  `id_persona` int(11) NOT NULL,
  `departamento_id` int(11) DEFAULT NULL,
  `puesto` varchar(100) DEFAULT NULL,
  `sueldo` decimal(10,2) DEFAULT NULL,
  `fecha_contratacion` date DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `cv` varchar(255) DEFAULT NULL,
  `estado` enum('ACTIVO','INACTIVO') DEFAULT 'ACTIVO',
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `empleado`
--

INSERT INTO `empleado` (`id`, `id_persona`, `departamento_id`, `puesto`, `sueldo`, `fecha_contratacion`, `foto`, `cv`, `estado`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(2, 9, 1, 'Cachinero', 155.00, '2025-11-22', 'blob:http://localhost:5173/1fc3d346-71b5-46b3-be6c-b3ba59227aa7', 'AyS_s14.docx.pdf', 'ACTIVO', '2025-11-22 04:22:34', '2025-11-22 04:22:34'),
(3, 7, 1, 'ss', 1500.00, '2025-11-29', 'blob:http://localhost:5173/876632ae-9d9b-4104-8b84-d8543c4cdf7b', '“Sistema de gestión de ventas de componentes de computadoras”.pdf', 'ACTIVO', '2025-11-29 05:11:49', '2025-11-29 05:11:49');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `envio`
--

CREATE TABLE `envio` (
  `id` int(11) NOT NULL,
  `id_pedido` int(11) NOT NULL,
  `id_vehiculo` int(11) DEFAULT NULL,
  `id_conductor` int(11) DEFAULT NULL,
  `id_ruta` int(11) DEFAULT NULL,
  `direccion_envio` varchar(200) DEFAULT NULL,
  `fecha_envio` date DEFAULT NULL,
  `fecha_entrega` date DEFAULT NULL,
  `costo_transporte` decimal(10,2) DEFAULT NULL,
  `estado` enum('PENDIENTE','EN_RUTA','ENTREGADO','CANCELADO') DEFAULT 'PENDIENTE',
  `observaciones` text DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historial_escaneo`
--

CREATE TABLE `historial_escaneo` (
  `id` int(11) NOT NULL,
  `id_codigo_barras` int(11) DEFAULT NULL,
  `codigo_escaneado` varchar(50) NOT NULL,
  `id_producto` int(11) DEFAULT NULL,
  `id_usuario` int(11) NOT NULL,
  `tipo_operacion` enum('ENTRADA','SALIDA','CONSULTA','GENERACION') NOT NULL,
  `id_compra` int(11) DEFAULT NULL,
  `id_venta` int(11) DEFAULT NULL,
  `cantidad` int(11) DEFAULT NULL,
  `exitoso` tinyint(1) DEFAULT 1,
  `mensaje` varchar(255) DEFAULT NULL,
  `fecha_escaneo` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inventario`
--

CREATE TABLE `inventario` (
  `id` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `id_almacen` int(11) NOT NULL,
  `stock_actual` int(11) DEFAULT 0,
  `stock_minimo` int(11) DEFAULT 0,
  `stock_maximo` int(11) DEFAULT NULL,
  `ubicacion` varchar(50) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `inventario`
--

INSERT INTO `inventario` (`id`, `id_producto`, `id_almacen`, `stock_actual`, `stock_minimo`, `stock_maximo`, `ubicacion`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, 1, 1, 9, 5, 15, 'B-04', '2025-11-29 04:57:17', '2025-11-29 04:57:57'),
(2, 2, 1, 9, 10, 1000, '15', '2025-11-29 05:26:02', '2025-12-02 05:07:54'),
(3, 3, 1, 0, 10, 99, 'B-04', '2025-11-29 05:48:53', '2025-12-02 04:57:16'),
(4, 4, 1, 20, 10, 1000, '15', '2025-11-29 05:55:00', '2025-11-29 05:55:00'),
(5, 5, 1, 23, 10, 999, 'B-04', '2025-11-29 06:05:19', '2025-12-02 05:07:35'),
(6, 6, 1, 148, 10, 1000, 'B-04', '2025-11-29 06:08:13', '2025-12-02 05:07:35'),
(7, 7, 1, 100, 10, 1000, 'B-04', '2025-11-29 06:12:14', '2025-11-29 06:12:14'),
(8, 8, 1, 20, 10, 1000, 'B-04', '2025-11-29 06:19:18', '2025-11-29 06:19:18'),
(9, 9, 1, 200, 10, 1000, 'B-04', '2025-11-29 06:29:19', '2025-11-29 06:29:19'),
(10, 10, 1, 100, 10, 1000, 'B-04', '2025-11-29 06:33:47', '2025-11-29 06:33:47'),
(11, 11, 1, 50, 10, 1000, 'B-04', '2025-11-29 06:40:03', '2025-11-29 06:40:03'),
(12, 12, 1, 50, 10, 1000, 'B-04', '2025-11-29 06:42:26', '2025-11-29 06:42:26'),
(13, 13, 1, 50, 10, 1000, '15', '2025-11-29 06:44:56', '2025-11-29 06:44:56'),
(14, 14, 1, 25, 10, 1000, 'B-04', '2025-11-29 06:49:21', '2025-11-29 06:49:21'),
(15, 15, 1, 100, 10, 1000, 'B-04', '2025-11-29 06:52:50', '2025-11-29 06:52:50'),
(16, 16, 1, 96, 10, 1000, 'B-04', '2025-11-29 06:57:15', '2025-11-29 06:57:15'),
(17, 17, 1, 122, 10, 1000, '15', '2025-11-29 07:04:53', '2025-11-29 07:04:53'),
(18, 18, 1, 100, 10, 1000, 'B-04', '2025-12-01 05:29:05', '2025-12-01 05:29:05'),
(19, 19, 1, 100, 15, 200, 'B-04', '2025-12-02 03:24:49', '2025-12-02 03:24:49'),
(20, 20, 1, 25, 10, 998, 'B-04', '2025-12-02 04:19:35', '2025-12-02 04:19:35');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `logs_sistema`
--

CREATE TABLE `logs_sistema` (
  `id` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `accion` text DEFAULT NULL,
  `modulo` varchar(100) DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `metodo_pago`
--

CREATE TABLE `metodo_pago` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `descripcion` varchar(150) DEFAULT NULL,
  `estado` enum('ACTIVO','INACTIVO') DEFAULT 'ACTIVO',
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `modulo`
--

CREATE TABLE `modulo` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `ruta` varchar(255) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `modulo`
--

INSERT INTO `modulo` (`id`, `nombre`, `descripcion`, `ruta`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, 'Dashboard', 'Panel principal del sistema', '/dashboard', '2025-11-20 03:24:13', '2025-11-25 00:03:36'),
(2, 'Accesos', 'Gestión de usuarios y permisos', '/accesos', '2025-11-20 03:24:13', '2025-11-20 03:24:13'),
(3, 'Ventas', 'Gestión de ventas y facturación', '/ventas', '2025-11-20 03:24:13', '2025-11-20 03:24:13'),
(4, 'Inventario', 'Control de stock y productos', '/inventario', '2025-11-20 03:24:13', '2025-11-20 03:24:13'),
(5, 'Compras', 'Gestión de compras y proveedores', '/compras', '2025-11-20 03:24:13', '2025-11-20 03:24:13'),
(6, 'Clientes', 'Gestión de clientes', '/clientes', '2025-11-20 03:24:13', '2025-11-20 03:24:13'),
(7, 'Reportes', 'Reportes y estadísticas', '/reportes', '2025-11-20 03:24:13', '2025-11-20 03:24:13'),
(8, 'Envios', 'Gestión de envíos y logística', '/envios', '2025-11-20 03:24:13', '2025-11-20 03:24:13'),
(9, 'Empleados', 'Gestión de empleados', '/empleados', '2025-11-20 03:24:13', '2025-11-20 03:24:13'),
(10, 'Proveedores', 'Gestión de proveedores', '/proveedores', '2025-11-20 03:24:13', '2025-11-20 03:24:13'),
(11, 'Pagina Web', 'Pagina', '/xd', '2025-11-21 02:36:12', '2025-11-21 02:36:12'),
(12, 'Detalle', 'ventas', '/detalle', '2025-11-22 04:13:59', '2025-11-22 04:13:59');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `movimiento_inventario`
--

CREATE TABLE `movimiento_inventario` (
  `id` int(11) NOT NULL,
  `id_inventario` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `id_almacen` int(11) NOT NULL,
  `id_codigo_barras` int(11) DEFAULT NULL,
  `tipo_movimiento` enum('ENTRADA','SALIDA','AJUSTE','DEVOLUCION') NOT NULL,
  `cantidad` int(11) NOT NULL,
  `stock_anterior` int(11) NOT NULL,
  `stock_nuevo` int(11) NOT NULL,
  `motivo` varchar(200) DEFAULT NULL,
  `metodo_registro` enum('ESCANER','MANUAL','AUTOMATICO') DEFAULT 'MANUAL',
  `id_usuario` int(11) DEFAULT NULL,
  `id_compra` int(11) DEFAULT NULL,
  `id_venta` int(11) DEFAULT NULL,
  `id_devolucion` int(11) DEFAULT NULL,
  `fecha_movimiento` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `movimiento_inventario`
--

INSERT INTO `movimiento_inventario` (`id`, `id_inventario`, `id_producto`, `id_almacen`, `id_codigo_barras`, `tipo_movimiento`, `cantidad`, `stock_anterior`, `stock_nuevo`, `motivo`, `metodo_registro`, `id_usuario`, `id_compra`, `id_venta`, `id_devolucion`, `fecha_movimiento`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, 1, 1, 1, NULL, 'ENTRADA', 10, 0, 10, 'Stock inicial en la creación del producto.', 'MANUAL', 1, NULL, NULL, NULL, '2025-11-29 04:57:17', '2025-11-29 04:57:17', '2025-11-29 04:57:17'),
(2, 2, 2, 1, NULL, 'ENTRADA', 12, 0, 12, 'Stock inicial en la creación del producto.', 'MANUAL', 1, NULL, NULL, NULL, '2025-11-29 05:26:02', '2025-11-29 05:26:02', '2025-11-29 05:26:02'),
(3, 3, 3, 1, NULL, 'ENTRADA', 5, 0, 5, 'Stock inicial en la creación del producto.', 'MANUAL', 1, NULL, NULL, NULL, '2025-11-29 05:48:53', '2025-11-29 05:48:53', '2025-11-29 05:48:53'),
(4, 4, 4, 1, NULL, 'ENTRADA', 20, 0, 20, 'Stock inicial en la creación del producto.', 'MANUAL', 1, NULL, NULL, NULL, '2025-11-29 05:55:00', '2025-11-29 05:55:00', '2025-11-29 05:55:00'),
(5, 5, 5, 1, NULL, 'ENTRADA', 25, 0, 25, 'Stock inicial en la creación del producto.', 'MANUAL', 1, NULL, NULL, NULL, '2025-11-29 06:05:19', '2025-11-29 06:05:19', '2025-11-29 06:05:19'),
(6, 6, 6, 1, NULL, 'ENTRADA', 150, 0, 150, 'Stock inicial en la creación del producto.', 'MANUAL', 1, NULL, NULL, NULL, '2025-11-29 06:08:13', '2025-11-29 06:08:13', '2025-11-29 06:08:13'),
(7, 7, 7, 1, NULL, 'ENTRADA', 100, 0, 100, 'Stock inicial en la creación del producto.', 'MANUAL', 1, NULL, NULL, NULL, '2025-11-29 06:12:14', '2025-11-29 06:12:14', '2025-11-29 06:12:14'),
(8, 8, 8, 1, NULL, 'ENTRADA', 20, 0, 20, 'Stock inicial en la creación del producto.', 'MANUAL', 1, NULL, NULL, NULL, '2025-11-29 06:19:18', '2025-11-29 06:19:18', '2025-11-29 06:19:18'),
(9, 9, 9, 1, NULL, 'ENTRADA', 200, 0, 200, 'Stock inicial en la creación del producto.', 'MANUAL', 1, NULL, NULL, NULL, '2025-11-29 06:29:19', '2025-11-29 06:29:19', '2025-11-29 06:29:19'),
(10, 10, 10, 1, NULL, 'ENTRADA', 100, 0, 100, 'Stock inicial en la creación del producto.', 'MANUAL', 1, NULL, NULL, NULL, '2025-11-29 06:33:47', '2025-11-29 06:33:47', '2025-11-29 06:33:47'),
(11, 11, 11, 1, NULL, 'ENTRADA', 50, 0, 50, 'Stock inicial en la creación del producto.', 'MANUAL', 1, NULL, NULL, NULL, '2025-11-29 06:40:03', '2025-11-29 06:40:03', '2025-11-29 06:40:03'),
(12, 12, 12, 1, NULL, 'ENTRADA', 50, 0, 50, 'Stock inicial en la creación del producto.', 'MANUAL', 1, NULL, NULL, NULL, '2025-11-29 06:42:26', '2025-11-29 06:42:26', '2025-11-29 06:42:26'),
(13, 13, 13, 1, NULL, 'ENTRADA', 50, 0, 50, 'Stock inicial en la creación del producto.', 'MANUAL', 1, NULL, NULL, NULL, '2025-11-29 06:44:56', '2025-11-29 06:44:56', '2025-11-29 06:44:56'),
(14, 14, 14, 1, NULL, 'ENTRADA', 25, 0, 25, 'Stock inicial en la creación del producto.', 'MANUAL', 1, NULL, NULL, NULL, '2025-11-29 06:49:21', '2025-11-29 06:49:21', '2025-11-29 06:49:21'),
(15, 15, 15, 1, NULL, 'ENTRADA', 100, 0, 100, 'Stock inicial en la creación del producto.', 'MANUAL', 1, NULL, NULL, NULL, '2025-11-29 06:52:50', '2025-11-29 06:52:50', '2025-11-29 06:52:50'),
(16, 16, 16, 1, NULL, 'ENTRADA', 96, 0, 96, 'Stock inicial en la creación del producto.', 'MANUAL', 1, NULL, NULL, NULL, '2025-11-29 06:57:15', '2025-11-29 06:57:15', '2025-11-29 06:57:15'),
(17, 17, 17, 1, NULL, 'ENTRADA', 122, 0, 122, 'Stock inicial en la creación del producto.', 'MANUAL', 1, NULL, NULL, NULL, '2025-11-29 07:04:53', '2025-11-29 07:04:53', '2025-11-29 07:04:53'),
(18, 18, 18, 1, NULL, 'ENTRADA', 100, 0, 100, 'Stock inicial en la creación del producto.', 'MANUAL', 1, NULL, NULL, NULL, '2025-12-01 05:29:05', '2025-12-01 05:29:05', '2025-12-01 05:29:05'),
(19, 19, 19, 1, NULL, 'ENTRADA', 100, 0, 100, 'Stock inicial en la creación del producto.', 'MANUAL', 1, NULL, NULL, NULL, '2025-12-02 03:24:49', '2025-12-02 03:24:49', '2025-12-02 03:24:49'),
(20, 20, 20, 1, NULL, 'ENTRADA', 25, 0, 25, 'Stock inicial en la creación del producto.', 'MANUAL', 1, NULL, NULL, NULL, '2025-12-02 04:19:35', '2025-12-02 04:19:35', '2025-12-02 04:19:35');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pago`
--

CREATE TABLE `pago` (
  `id` int(11) NOT NULL,
  `id_venta` int(11) DEFAULT NULL,
  `id_compra` int(11) DEFAULT NULL,
  `monto_total` decimal(10,2) NOT NULL,
  `estado` enum('PENDIENTE','PROCESANDO','COMPLETADO','FALLIDO','REEMBOLSADO') DEFAULT 'PENDIENTE',
  `fecha_pago` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedido`
--

CREATE TABLE `pedido` (
  `id` int(11) NOT NULL,
  `id_cliente` int(11) NOT NULL,
  `fecha_pedido` timestamp NOT NULL DEFAULT current_timestamp(),
  `estado` enum('PENDIENTE','EN_PROCESO','EN_CAMINO','ENTREGADO','CANCELADO') DEFAULT 'PENDIENTE',
  `total` decimal(10,2) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `persona`
--

CREATE TABLE `persona` (
  `id` int(11) NOT NULL,
  `tipo_documento` varchar(255) DEFAULT NULL,
  `numero_documento` varchar(255) DEFAULT NULL,
  `nombres` varchar(255) DEFAULT NULL,
  `apellido_paterno` varchar(255) DEFAULT NULL,
  `apellido_materno` varchar(255) DEFAULT NULL,
  `correo` varchar(255) DEFAULT NULL,
  `telefono` varchar(255) DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `persona`
--

INSERT INTO `persona` (`id`, `tipo_documento`, `numero_documento`, `nombres`, `apellido_paterno`, `apellido_materno`, `correo`, `telefono`, `fecha_nacimiento`, `direccion`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, 'DNI', '12345678', 'Jean', 'Perez', 'Gomez', 'jean@perumarket.com', '999888777', '1990-05-15', 'Av. Lima 123', '2025-11-20 03:24:26', '2025-11-20 03:24:26'),
(2, 'DNI', '87654321', 'Maria', 'Lopez', 'Sanchez', 'maria@perumarket.com', '999777666', '1992-08-20', 'Av. Arequipa 456', '2025-11-20 03:24:26', '2025-11-20 03:24:26'),
(3, 'DNI', '11223344', 'Carlos', 'Rodriguez', 'Mendoza', 'carlos@perumarket.com', '999666555', '1988-12-10', 'Av. Tacna 789', '2025-11-20 03:24:26', '2025-11-20 03:24:26'),
(4, 'DNI', '74883636', 'Tonny', 'Hinostroza', 'Palaco', 'tonny21@gmail.com', '946087678', '2006-01-05', 'Lima', '2025-11-21 02:15:20', '2025-11-21 02:15:20'),
(5, 'DNI', '73457623', 'Jefferson', 'Flores', 'Peñaloza', 'jeffer21@gmail.com', '987456654', '2002-07-21', 'Huaycan City', '2025-11-21 02:37:46', '2025-11-21 02:37:46'),
(6, 'DNI', '75260852', 'Jose Adrian', 'Toribio', 'Barron', 'jose@gmail.com', '946087678', '2005-05-27', 'Ate', '2025-11-21 03:19:03', '2025-11-21 03:19:03'),
(7, 'DNI', '74883111', 'sssasasas', 'aaaaaa', 'saaa', 'chamorrocg021@gmai.com', '946087675', NULL, 'Lima', '2025-11-21 03:44:46', '2025-12-02 03:30:47'),
(8, 'DNI', '7389574', 'Caleb Cladimir ', 'Veramendi ', 'Alejos', 'caleb021@gmail.com', '946087678', '2006-01-18', 'Lima ', '2025-11-22 04:12:22', '2025-11-26 16:03:52'),
(9, 'DNI', '74855874', 'Cristian', 'D', 'c', 'Cristian@gmail.com', '946087675', '2025-10-31', 'Lima', '2025-11-22 04:22:34', '2025-11-22 04:22:34'),
(10, 'DNI', '78956451', 'Nero', 'kk', 'kkk', 'nero@gmail.com', '987456654', '2025-11-01', 'Lima / Ate', '2025-11-29 05:09:34', '2025-11-29 05:09:34');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto`
--

CREATE TABLE `producto` (
  `id` int(11) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `sku` varchar(50) DEFAULT NULL,
  `precio_venta` decimal(10,2) NOT NULL,
  `precio_compra` decimal(10,2) DEFAULT NULL,
  `stock` int(11) DEFAULT 0,
  `stock_minimo` int(11) DEFAULT 10,
  `stock_maximo` int(11) DEFAULT 1000,
  `unidad_medida` enum('UNIDAD','CAJA','PAQUETE','KG','LITRO') DEFAULT 'UNIDAD',
  `peso_kg` decimal(10,3) DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `categoria_id` int(11) DEFAULT NULL,
  `requiere_codigo_barras` tinyint(1) DEFAULT 1,
  `estado` enum('ACTIVO','INACTIVO') DEFAULT 'ACTIVO',
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `producto`
--

INSERT INTO `producto` (`id`, `nombre`, `descripcion`, `sku`, `precio_venta`, `precio_compra`, `stock`, `stock_minimo`, `stock_maximo`, `unidad_medida`, `peso_kg`, `imagen`, `categoria_id`, `requiere_codigo_barras`, `estado`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, 'zzz', 'zzzz', 'zzz', 15.00, 20.00, 0, 10, 1000, 'KG', 115.000, '', 1, 1, 'ACTIVO', '2025-11-29 04:57:17', '2025-11-29 04:57:17'),
(2, 'aaa', 'aaa', 'aaa', 15.00, 150.00, 0, 10, 1000, 'KG', 15.000, '', 2, 1, 'ACTIVO', '2025-11-29 05:26:02', '2025-11-29 05:26:02'),
(3, 'tallarin', 'ddd', 'BULB-FA-001', 15.00, 25.00, 0, 10, 1000, 'KG', 15.000, '', 2, 1, 'ACTIVO', '2025-11-29 05:48:53', '2025-11-29 05:48:53'),
(4, 'Jeanfranco', 'dd', 'dadadad', 15.00, 25.00, 0, 10, 1000, 'KG', 15.000, 'URL_TEMPORAL_DEL_PRODUCTO', 1, 1, 'ACTIVO', '2025-11-29 05:55:00', '2025-11-29 05:55:00'),
(5, 'logo', 'ssss', 'LOGO-6620', 15.00, 25.00, 0, 10, 1000, 'KG', 15.000, '/img/productos/producto_1764396319230_zeobma.png', 1, 1, 'ACTIVO', '2025-11-29 06:05:19', '2025-11-29 06:05:19'),
(6, 'ssss', 'ss', 'S-5994', 15.00, 30.00, 0, 10, 1000, 'KG', 15.000, '/img/productos/producto_1764396493473_i9qlyj.png', 2, 1, 'ACTIVO', '2025-11-29 06:08:13', '2025-11-29 06:08:13'),
(7, 'jean', 'a', 'JEAN-1685', 15.00, 25.00, 0, 10, 1000, 'KG', 15.000, '/img/productos/producto_1764396734868_nhzblh.png', 2, 1, 'ACTIVO', '2025-11-29 06:12:14', '2025-11-29 06:12:14'),
(8, 'zzz', 'zz', 'Z-0436', 15.00, 25.00, 0, 10, 1000, 'KG', 15.000, '/img/productos/producto_1764397158419_ae2ns7.png', 2, 1, 'ACTIVO', '2025-11-29 06:19:18', '2025-11-29 06:19:18'),
(9, 'Jeanfranco', 'z', 'JEAN-3151', 15.00, 25.00, 0, 10, 1000, 'KG', 15.000, '/img/productos/producto_1764397759757_2kk9mf.png', 2, 1, 'ACTIVO', '2025-11-29 06:29:19', '2025-11-29 06:29:19'),
(10, 'sss', 'ss', 'SSS-1424', 15.00, 25.00, 0, 10, 1000, 'KG', 15.000, '/img/productos/producto_1764398027514_gx4w7d.png', 2, 1, 'ACTIVO', '2025-11-29 06:33:47', '2025-11-29 06:33:47'),
(11, 'Jeanfranco', 'sss', 'JEAN-1601', 25.00, 35.00, 0, 10, 1000, 'KG', 15.000, '/img/products/producto_1764398403519_vcumzl.jpg', 2, 1, 'ACTIVO', '2025-11-29 06:40:03', '2025-11-29 06:40:03'),
(12, 'zzzz', 'zz', 'Z-1939', 35.00, 40.00, 0, 10, 1000, 'KG', 50.000, '/img/products/producto_1764398546578_ds775q.jpg', 3, 1, 'ACTIVO', '2025-11-29 06:42:26', '2025-11-29 06:42:26'),
(13, 'zzz', 'zzz', 'Z-1782', 25.00, 30.00, 0, 10, 1000, 'KG', 50.000, '/img/products/producto_1764398696126_pgsh1e.jpeg', 3, 1, 'ACTIVO', '2025-11-29 06:44:56', '2025-11-29 06:44:56'),
(14, 'Jeanfranco', 'aaa', 'JEAN-2002', 15.00, 25.00, 0, 10, 1000, 'KG', 15.000, '/api/img/products/producto_1764398961417_v2v7ha.jpeg', 3, 1, 'ACTIVO', '2025-11-29 06:49:21', '2025-11-29 06:49:21'),
(15, 'FIBRE AIRS Professional', 'zzz', 'FIBR-AIRS-PROF-4565', 15.00, 25.00, 0, 10, 1000, 'KG', 5.000, '/api/img/products/producto_1764399170414_48kioj.png', 3, 1, 'ACTIVO', '2025-11-29 06:52:50', '2025-11-29 06:52:50'),
(16, 'Floraaaa', 'd', 'FLOR-1484', 15.00, 25.00, 0, 10, 1000, 'KG', 25.000, '/api/img/products/producto_1764399435578_wusxxs.png', 3, 1, 'ACTIVO', '2025-11-29 06:57:15', '2025-11-29 06:57:15'),
(17, 'Toribio', 'sss', 'TORI-5187', 25.00, 50.00, 0, 10, 1000, 'KG', 12.000, '/api/img/products/producto_1764399893425_a98c84.jpeg', 2, 1, 'ACTIVO', '2025-11-29 07:04:53', '2025-11-29 07:04:53'),
(18, 'FIBRE AIRS Professional', 'c', 'FIBR-AIRS-PROF-8504', 25.00, 35.00, 0, 10, 1000, 'KG', 25.000, '/api/img/products/producto_1764566945792_bkjokd.jpg', 3, 1, 'ACTIVO', '2025-12-01 05:29:05', '2025-12-01 05:29:05'),
(19, 'Fideos Anitassss', 'Cabello Angel 250gramos', 'FIDE-ANIT-7231', 4.50, 2.50, 0, 10, 1000, 'CAJA', 12.000, '/api/img/products/producto_1764645889386_iipouh.jpg', 5, 1, 'ACTIVO', '2025-12-02 03:24:49', '2025-12-02 03:27:01'),
(20, 'renatoxxxx', 'mujercita', 'R-5607', 1.00, 0.10, 0, 10, 1000, 'KG', 10.000, '/api/img/products/producto_1764649175567_s4upws.png', 5, 1, 'ACTIVO', '2025-12-02 04:19:35', '2025-12-02 04:19:35');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedor`
--

CREATE TABLE `proveedor` (
  `id` int(11) NOT NULL,
  `ruc` varchar(20) NOT NULL,
  `razon_social` varchar(150) NOT NULL,
  `contacto` varchar(100) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `correo` varchar(120) DEFAULT NULL,
  `direccion` varchar(150) DEFAULT NULL,
  `estado` enum('ACTIVO','INACTIVO') DEFAULT 'ACTIVO',
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `proveedor`
--

INSERT INTO `proveedor` (`id`, `ruc`, `razon_social`, `contacto`, `telefono`, `correo`, `direccion`, `estado`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, '20123456789', 'Distribuidora Los Andes S.A.C.', 'María López', '987654321', 'contacto@losandes.com', 'Av. Grau 123 - Lima', 'ACTIVO', '2025-11-29 04:56:39', '2025-11-29 04:56:39'),
(2, '20567891234', 'Tecnología Global EIRL', 'Juan Pérez', '945612378', 'ventas@tecnoglobal.pe', 'Calle Los Pinos 456 - Miraflores', 'ACTIVO', '2025-11-29 04:56:39', '2025-11-29 04:56:39'),
(3, '20654321987', 'Insumos Industriales Perú S.A.', 'Lucía Torres', '999888777', 'info@iiperu.com', 'Av. Industrial 980 - Ate', 'ACTIVO', '2025-11-29 04:56:39', '2025-12-01 05:34:45'),
(4, '20432198765', 'Comercial El Sol S.R.L.', 'Carlos Ramírez', '912345678', 'elsol@comercial.pe', 'Jr. México 345 - Breña', 'ACTIVO', '2025-11-29 04:56:39', '2025-11-29 04:56:39'),
(5, '20876543210', 'Importaciones Nova S.A.C.', 'Ana Castillo', '987123456', 'contacto@novaimport.com', 'Av. La Marina 1500 - San Miguel', 'ACTIVO', '2025-11-29 04:56:39', '2025-11-29 04:56:39');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedor_producto`
--

CREATE TABLE `proveedor_producto` (
  `id` int(11) NOT NULL,
  `id_proveedor` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `precio_compra` decimal(10,2) DEFAULT NULL,
  `tiempo_entrega_dias` int(11) DEFAULT NULL,
  `es_principal` tinyint(1) DEFAULT 0,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `proveedor_producto`
--

INSERT INTO `proveedor_producto` (`id`, `id_proveedor`, `id_producto`, `precio_compra`, `tiempo_entrega_dias`, `es_principal`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, 1, 1, 20.00, NULL, 1, '2025-11-29 04:57:17', '2025-11-29 04:57:17'),
(2, 1, 2, 150.00, NULL, 1, '2025-11-29 05:26:02', '2025-11-29 05:26:02'),
(3, 4, 3, 25.00, NULL, 1, '2025-11-29 05:48:53', '2025-11-29 05:48:53'),
(4, 2, 4, 25.00, NULL, 1, '2025-11-29 05:55:00', '2025-11-29 05:55:00'),
(5, 2, 5, 25.00, NULL, 1, '2025-11-29 06:05:19', '2025-11-29 06:05:19'),
(6, 3, 6, 30.00, NULL, 1, '2025-11-29 06:08:13', '2025-11-29 06:08:13'),
(7, 2, 7, 25.00, NULL, 1, '2025-11-29 06:12:14', '2025-11-29 06:12:14'),
(8, 2, 8, 25.00, NULL, 1, '2025-11-29 06:19:18', '2025-11-29 06:19:18'),
(9, 1, 9, 25.00, NULL, 1, '2025-11-29 06:29:19', '2025-11-29 06:29:19'),
(10, 2, 10, 25.00, NULL, 1, '2025-11-29 06:33:47', '2025-11-29 06:33:47'),
(11, 3, 11, 35.00, NULL, 1, '2025-11-29 06:40:03', '2025-11-29 06:40:03'),
(12, 2, 12, 40.00, NULL, 1, '2025-11-29 06:42:26', '2025-11-29 06:42:26'),
(13, 3, 13, 30.00, NULL, 1, '2025-11-29 06:44:56', '2025-11-29 06:44:56'),
(14, 4, 14, 25.00, NULL, 1, '2025-11-29 06:49:21', '2025-11-29 06:49:21'),
(15, 3, 15, 25.00, NULL, 1, '2025-11-29 06:52:50', '2025-11-29 06:52:50'),
(16, 4, 16, 25.00, NULL, 1, '2025-11-29 06:57:15', '2025-11-29 06:57:15'),
(17, 2, 17, 50.00, NULL, 1, '2025-11-29 07:04:53', '2025-11-29 07:04:53'),
(18, 3, 18, 35.00, NULL, 1, '2025-12-01 05:29:05', '2025-12-01 05:29:05'),
(19, 1, 19, 2.50, NULL, 1, '2025-12-02 03:24:49', '2025-12-02 03:24:49'),
(20, 2, 20, 0.10, NULL, 1, '2025-12-02 04:19:35', '2025-12-02 04:19:35');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol`
--

CREATE TABLE `rol` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `rol`
--

INSERT INTO `rol` (`id`, `nombre`, `descripcion`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, 'Administrador', 'Acceso total al sistema', '2025-11-20 03:24:13', '2025-11-20 03:24:13'),
(2, 'Vendedor', 'Acceso a módulos de ventas y clientes', '2025-11-20 03:24:13', '2025-11-20 03:24:13'),
(3, 'Almacenero', 'Acceso a gestión de inventario', '2025-11-20 03:24:13', '2025-11-20 03:24:13'),
(6, 'Cachinero', 's', '2025-11-21 02:25:00', '2025-11-21 02:25:00'),
(7, 'Marketing', 'xd', '2025-11-22 04:13:04', '2025-11-22 04:13:04');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `role_module_permissions`
--

CREATE TABLE `role_module_permissions` (
  `id` bigint(20) NOT NULL,
  `id_rol` int(11) NOT NULL,
  `id_modulo` int(11) NOT NULL,
  `has_access` tinyint(1) DEFAULT 0,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `role_module_permissions`
--

INSERT INTO `role_module_permissions` (`id`, `id_rol`, `id_modulo`, `has_access`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(35, 1, 1, 1, '2025-11-24 19:21:13', '2025-11-24 19:21:13'),
(36, 1, 2, 1, '2025-11-24 19:21:13', '2025-11-24 19:21:13'),
(37, 1, 3, 1, '2025-11-24 19:21:13', '2025-11-24 19:21:13'),
(38, 1, 4, 1, '2025-11-24 19:21:13', '2025-11-24 19:21:13'),
(39, 1, 5, 1, '2025-11-24 19:21:13', '2025-11-24 19:21:13'),
(40, 1, 6, 1, '2025-11-24 19:21:13', '2025-11-24 19:21:13'),
(41, 1, 7, 1, '2025-11-24 19:21:13', '2025-11-24 19:21:13'),
(42, 1, 8, 1, '2025-11-24 19:21:13', '2025-11-24 19:21:13'),
(43, 1, 9, 1, '2025-11-24 19:21:13', '2025-11-24 19:21:13'),
(44, 1, 10, 1, '2025-11-24 19:21:13', '2025-11-24 19:21:13'),
(45, 1, 11, 1, '2025-11-24 19:21:13', '2025-11-24 19:21:13'),
(46, 1, 12, 1, '2025-11-24 19:21:13', '2025-11-24 19:21:13'),
(47, 2, 3, 1, '2025-11-24 19:21:19', '2025-11-24 19:21:19'),
(48, 2, 4, 1, '2025-11-24 19:21:19', '2025-11-24 19:21:19'),
(49, 2, 5, 1, '2025-11-24 19:21:19', '2025-11-24 19:21:19'),
(50, 2, 6, 1, '2025-11-24 19:21:19', '2025-11-24 19:21:19'),
(51, 2, 12, 1, '2025-11-24 19:21:19', '2025-11-24 19:21:19'),
(52, 3, 1, 1, '2025-11-24 19:21:29', '2025-11-24 19:21:29'),
(53, 3, 8, 1, '2025-11-24 19:21:29', '2025-11-24 19:21:29'),
(54, 3, 10, 1, '2025-11-24 19:21:29', '2025-11-24 19:21:29'),
(55, 7, 1, 1, '2025-11-26 17:49:08', '2025-11-26 17:49:08'),
(56, 7, 5, 1, '2025-11-26 17:49:08', '2025-11-26 17:49:08'),
(58, 6, 1, 1, '2025-12-02 04:15:41', '2025-12-02 04:15:41'),
(59, 6, 2, 1, '2025-12-02 04:15:41', '2025-12-02 04:15:41'),
(60, 6, 5, 1, '2025-12-02 04:15:41', '2025-12-02 04:15:41');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ruta`
--

CREATE TABLE `ruta` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `origen` varchar(150) DEFAULT NULL,
  `destino` varchar(150) DEFAULT NULL,
  `distancia_km` decimal(10,2) DEFAULT NULL,
  `tiempo_estimado_horas` decimal(5,2) DEFAULT NULL,
  `costo_base` decimal(10,2) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id` int(11) NOT NULL,
  `id_persona` int(11) NOT NULL,
  `id_rol` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `estado` varchar(255) NOT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id`, `id_persona`, `id_rol`, `username`, `password`, `estado`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, 1, 1, 'jean', '74883675', 'ACTIVO', '2025-11-20 03:24:26', '2025-11-21 02:14:04'),
(2, 2, 2, 'maria', '12345678', 'ACTIVO', '2025-11-20 03:24:26', '2025-11-21 03:59:31'),
(4, 4, 1, 'tonny123', 'tonnykbro', 'INACTIVO', '2025-11-21 02:15:20', '2025-11-26 16:16:34'),
(5, 5, 1, 'jefferxd', 'pollitoxd', 'ACTIVO', '2025-11-21 02:37:46', '2025-11-21 02:37:46'),
(6, 6, 6, 'toribioxd21', 'nero123', 'ACTIVO', '2025-11-21 03:19:03', '2025-11-21 03:19:03'),
(7, 8, 6, 'calebxd', '12345678', 'ACTIVO', '2025-11-22 04:12:22', '2025-12-02 04:15:54');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vehiculo`
--

CREATE TABLE `vehiculo` (
  `id` int(11) NOT NULL,
  `placa` varchar(20) NOT NULL,
  `marca` varchar(50) DEFAULT NULL,
  `modelo` varchar(50) DEFAULT NULL,
  `capacidad_kg` decimal(10,2) DEFAULT NULL,
  `estado` enum('DISPONIBLE','EN_RUTA','MANTENIMIENTO','INACTIVO') DEFAULT 'DISPONIBLE',
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `venta`
--

CREATE TABLE `venta` (
  `id` int(11) NOT NULL,
  `id_cliente` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_almacen` int(11) NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  `subtotal` decimal(10,2) DEFAULT NULL,
  `descuento_total` decimal(10,2) DEFAULT 0.00,
  `igv` decimal(10,2) DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL,
  `estado` enum('PENDIENTE','COMPLETADA','ANULADA') DEFAULT 'PENDIENTE',
  `usa_codigo_barras` tinyint(1) DEFAULT 0,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `venta`
--

INSERT INTO `venta` (`id`, `id_cliente`, `id_usuario`, `id_almacen`, `fecha`, `subtotal`, `descuento_total`, `igv`, `total`, `estado`, `usa_codigo_barras`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, 1, 1, 1, '2025-11-29 04:57:57', 15.00, 0.00, 2.70, 17.70, 'PENDIENTE', NULL, '2025-11-29 04:57:57', '2025-11-29 04:57:57'),
(2, 2, 1, 1, '2025-12-02 04:38:18', 24.60, 0.00, 4.43, 29.03, 'PENDIENTE', NULL, '2025-12-02 04:38:18', '2025-12-02 04:38:18'),
(3, 2, 1, 1, '2025-12-02 04:39:17', 24.60, 0.00, 5.40, 5.40, 'PENDIENTE', NULL, '2025-12-02 04:39:17', '2025-12-02 04:39:17'),
(4, 2, 1, 1, '2025-12-02 04:39:47', 12.30, 0.00, 2.70, 15.00, 'PENDIENTE', NULL, '2025-12-02 04:39:47', '2025-12-02 04:39:47'),
(5, 2, 1, 1, '2025-12-02 04:57:16', 24.60, 0.00, 5.40, 30.00, 'PENDIENTE', NULL, '2025-12-02 04:57:16', '2025-12-02 04:57:16'),
(6, 2, 1, 1, '2025-12-02 05:04:58', 24.60, 0.00, 5.40, 30.00, 'PENDIENTE', NULL, '2025-12-02 05:04:58', '2025-12-02 05:04:58'),
(7, 2, 1, 1, '2025-12-02 05:07:35', 24.60, 0.00, 5.40, 30.00, 'PENDIENTE', NULL, '2025-12-02 05:07:35', '2025-12-02 05:07:35'),
(8, 2, 1, 1, '2025-12-02 05:07:54', 12.30, 0.00, 2.70, 15.00, 'PENDIENTE', NULL, '2025-12-02 05:07:54', '2025-12-02 05:07:54');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `almacen`
--
ALTER TABLE `almacen`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `codigo` (`codigo`);

--
-- Indices de la tabla `categoria_producto`
--
ALTER TABLE `categoria_producto`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `cliente`
--
ALTER TABLE `cliente`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_persona` (`id_persona`);

--
-- Indices de la tabla `codigo_barras`
--
ALTER TABLE `codigo_barras`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `codigo` (`codigo`),
  ADD KEY `idx_codigo` (`codigo`),
  ADD KEY `idx_producto` (`id_producto`),
  ADD KEY `idx_proveedor` (`id_proveedor`);

--
-- Indices de la tabla `compra`
--
ALTER TABLE `compra`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_almacen` (`id_almacen`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `idx_proveedor_fecha` (`id_proveedor`,`fecha`),
  ADD KEY `idx_compra_proveedor_fecha` (`id_proveedor`,`fecha`);

--
-- Indices de la tabla `comprobante`
--
ALTER TABLE `comprobante`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `serie` (`serie`,`numero`),
  ADD KEY `id_venta` (`id_venta`);

--
-- Indices de la tabla `conductor`
--
ALTER TABLE `conductor`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `licencia` (`licencia`),
  ADD KEY `id_persona` (`id_persona`);

--
-- Indices de la tabla `departamento`
--
ALTER TABLE `departamento`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `detalle_compra`
--
ALTER TABLE `detalle_compra`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_compra` (`id_compra`),
  ADD KEY `id_producto` (`id_producto`),
  ADD KEY `id_codigo_barras` (`id_codigo_barras`);

--
-- Indices de la tabla `detalle_devolucion`
--
ALTER TABLE `detalle_devolucion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_devolucion` (`id_devolucion`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indices de la tabla `detalle_pago`
--
ALTER TABLE `detalle_pago`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_pago` (`id_pago`),
  ADD KEY `id_metodo_pago` (`id_metodo_pago`);

--
-- Indices de la tabla `detalle_venta`
--
ALTER TABLE `detalle_venta`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_venta` (`id_venta`),
  ADD KEY `id_producto` (`id_producto`),
  ADD KEY `id_codigo_barras` (`id_codigo_barras`);

--
-- Indices de la tabla `devolucion`
--
ALTER TABLE `devolucion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_venta` (`id_venta`),
  ADD KEY `id_compra` (`id_compra`),
  ADD KEY `id_almacen` (`id_almacen`);

--
-- Indices de la tabla `empleado`
--
ALTER TABLE `empleado`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_persona` (`id_persona`),
  ADD KEY `departamento_id` (`departamento_id`);

--
-- Indices de la tabla `envio`
--
ALTER TABLE `envio`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_pedido` (`id_pedido`),
  ADD KEY `id_vehiculo` (`id_vehiculo`),
  ADD KEY `id_conductor` (`id_conductor`),
  ADD KEY `id_ruta` (`id_ruta`);

--
-- Indices de la tabla `historial_escaneo`
--
ALTER TABLE `historial_escaneo`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_producto` (`id_producto`),
  ADD KEY `id_compra` (`id_compra`),
  ADD KEY `id_venta` (`id_venta`),
  ADD KEY `idx_codigo_barras` (`id_codigo_barras`),
  ADD KEY `idx_codigo_escaneado` (`codigo_escaneado`),
  ADD KEY `idx_fecha` (`fecha_escaneo`),
  ADD KEY `idx_usuario` (`id_usuario`);

--
-- Indices de la tabla `inventario`
--
ALTER TABLE `inventario`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id_producto` (`id_producto`,`id_almacen`),
  ADD KEY `idx_producto` (`id_producto`),
  ADD KEY `idx_almacen` (`id_almacen`),
  ADD KEY `idx_inventario_producto` (`id_producto`),
  ADD KEY `idx_inventario_almacen` (`id_almacen`);

--
-- Indices de la tabla `logs_sistema`
--
ALTER TABLE `logs_sistema`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_logs_usuario_fecha` (`id_usuario`,`fecha`);

--
-- Indices de la tabla `metodo_pago`
--
ALTER TABLE `metodo_pago`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `modulo`
--
ALTER TABLE `modulo`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `movimiento_inventario`
--
ALTER TABLE `movimiento_inventario`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_inventario` (`id_inventario`),
  ADD KEY `id_producto` (`id_producto`),
  ADD KEY `id_almacen` (`id_almacen`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_compra` (`id_compra`),
  ADD KEY `id_venta` (`id_venta`),
  ADD KEY `id_devolucion` (`id_devolucion`),
  ADD KEY `idx_codigo_barras` (`id_codigo_barras`),
  ADD KEY `idx_fecha` (`fecha_movimiento`),
  ADD KEY `idx_tipo` (`tipo_movimiento`),
  ADD KEY `idx_movimiento_inventario_fecha` (`fecha_movimiento`);

--
-- Indices de la tabla `pago`
--
ALTER TABLE `pago`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_venta` (`id_venta`),
  ADD KEY `id_compra` (`id_compra`);

--
-- Indices de la tabla `pedido`
--
ALTER TABLE `pedido`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_cliente_fecha` (`id_cliente`,`fecha_pedido`),
  ADD KEY `idx_pedido_cliente_fecha` (`id_cliente`,`fecha_pedido`);

--
-- Indices de la tabla `persona`
--
ALTER TABLE `persona`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `numero_documento` (`numero_documento`);

--
-- Indices de la tabla `producto`
--
ALTER TABLE `producto`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sku` (`sku`),
  ADD KEY `idx_nombre` (`nombre`),
  ADD KEY `idx_sku` (`sku`),
  ADD KEY `idx_producto_nombre` (`nombre`),
  ADD KEY `idx_producto_categoria` (`categoria_id`);

--
-- Indices de la tabla `proveedor`
--
ALTER TABLE `proveedor`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ruc` (`ruc`);

--
-- Indices de la tabla `proveedor_producto`
--
ALTER TABLE `proveedor_producto`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id_proveedor` (`id_proveedor`,`id_producto`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indices de la tabla `rol`
--
ALTER TABLE `rol`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `role_module_permissions`
--
ALTER TABLE `role_module_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id_rol` (`id_rol`,`id_modulo`),
  ADD KEY `id_modulo` (`id_modulo`);

--
-- Indices de la tabla `ruta`
--
ALTER TABLE `ruta`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `id_persona` (`id_persona`),
  ADD KEY `id_rol` (`id_rol`);

--
-- Indices de la tabla `vehiculo`
--
ALTER TABLE `vehiculo`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `placa` (`placa`);

--
-- Indices de la tabla `venta`
--
ALTER TABLE `venta`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_almacen` (`id_almacen`),
  ADD KEY `idx_cliente_fecha` (`id_cliente`,`fecha`),
  ADD KEY `idx_venta_cliente_fecha` (`id_cliente`,`fecha`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `almacen`
--
ALTER TABLE `almacen`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `categoria_producto`
--
ALTER TABLE `categoria_producto`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `cliente`
--
ALTER TABLE `cliente`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `codigo_barras`
--
ALTER TABLE `codigo_barras`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `compra`
--
ALTER TABLE `compra`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `comprobante`
--
ALTER TABLE `comprobante`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `conductor`
--
ALTER TABLE `conductor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `departamento`
--
ALTER TABLE `departamento`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `detalle_compra`
--
ALTER TABLE `detalle_compra`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `detalle_devolucion`
--
ALTER TABLE `detalle_devolucion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `detalle_pago`
--
ALTER TABLE `detalle_pago`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `detalle_venta`
--
ALTER TABLE `detalle_venta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `devolucion`
--
ALTER TABLE `devolucion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `empleado`
--
ALTER TABLE `empleado`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `envio`
--
ALTER TABLE `envio`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `historial_escaneo`
--
ALTER TABLE `historial_escaneo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `inventario`
--
ALTER TABLE `inventario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `logs_sistema`
--
ALTER TABLE `logs_sistema`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `metodo_pago`
--
ALTER TABLE `metodo_pago`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `modulo`
--
ALTER TABLE `modulo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `movimiento_inventario`
--
ALTER TABLE `movimiento_inventario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `pago`
--
ALTER TABLE `pago`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pedido`
--
ALTER TABLE `pedido`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `persona`
--
ALTER TABLE `persona`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `producto`
--
ALTER TABLE `producto`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `proveedor`
--
ALTER TABLE `proveedor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `proveedor_producto`
--
ALTER TABLE `proveedor_producto`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `rol`
--
ALTER TABLE `rol`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `role_module_permissions`
--
ALTER TABLE `role_module_permissions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT de la tabla `ruta`
--
ALTER TABLE `ruta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `vehiculo`
--
ALTER TABLE `vehiculo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `venta`
--
ALTER TABLE `venta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `cliente`
--
ALTER TABLE `cliente`
  ADD CONSTRAINT `cliente_ibfk_1` FOREIGN KEY (`id_persona`) REFERENCES `persona` (`id`);

--
-- Filtros para la tabla `codigo_barras`
--
ALTER TABLE `codigo_barras`
  ADD CONSTRAINT `codigo_barras_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id`),
  ADD CONSTRAINT `codigo_barras_ibfk_2` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedor` (`id`);

--
-- Filtros para la tabla `compra`
--
ALTER TABLE `compra`
  ADD CONSTRAINT `compra_ibfk_1` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedor` (`id`),
  ADD CONSTRAINT `compra_ibfk_2` FOREIGN KEY (`id_almacen`) REFERENCES `almacen` (`id`),
  ADD CONSTRAINT `compra_ibfk_3` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`);

--
-- Filtros para la tabla `comprobante`
--
ALTER TABLE `comprobante`
  ADD CONSTRAINT `comprobante_ibfk_1` FOREIGN KEY (`id_venta`) REFERENCES `venta` (`id`);

--
-- Filtros para la tabla `conductor`
--
ALTER TABLE `conductor`
  ADD CONSTRAINT `conductor_ibfk_1` FOREIGN KEY (`id_persona`) REFERENCES `persona` (`id`);

--
-- Filtros para la tabla `detalle_compra`
--
ALTER TABLE `detalle_compra`
  ADD CONSTRAINT `detalle_compra_ibfk_1` FOREIGN KEY (`id_compra`) REFERENCES `compra` (`id`),
  ADD CONSTRAINT `detalle_compra_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id`),
  ADD CONSTRAINT `detalle_compra_ibfk_3` FOREIGN KEY (`id_codigo_barras`) REFERENCES `codigo_barras` (`id`);

--
-- Filtros para la tabla `detalle_devolucion`
--
ALTER TABLE `detalle_devolucion`
  ADD CONSTRAINT `detalle_devolucion_ibfk_1` FOREIGN KEY (`id_devolucion`) REFERENCES `devolucion` (`id`),
  ADD CONSTRAINT `detalle_devolucion_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id`);

--
-- Filtros para la tabla `detalle_pago`
--
ALTER TABLE `detalle_pago`
  ADD CONSTRAINT `detalle_pago_ibfk_1` FOREIGN KEY (`id_pago`) REFERENCES `pago` (`id`),
  ADD CONSTRAINT `detalle_pago_ibfk_2` FOREIGN KEY (`id_metodo_pago`) REFERENCES `metodo_pago` (`id`);

--
-- Filtros para la tabla `detalle_venta`
--
ALTER TABLE `detalle_venta`
  ADD CONSTRAINT `detalle_venta_ibfk_1` FOREIGN KEY (`id_venta`) REFERENCES `venta` (`id`),
  ADD CONSTRAINT `detalle_venta_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id`),
  ADD CONSTRAINT `detalle_venta_ibfk_3` FOREIGN KEY (`id_codigo_barras`) REFERENCES `codigo_barras` (`id`);

--
-- Filtros para la tabla `devolucion`
--
ALTER TABLE `devolucion`
  ADD CONSTRAINT `devolucion_ibfk_1` FOREIGN KEY (`id_venta`) REFERENCES `venta` (`id`),
  ADD CONSTRAINT `devolucion_ibfk_2` FOREIGN KEY (`id_compra`) REFERENCES `compra` (`id`),
  ADD CONSTRAINT `devolucion_ibfk_3` FOREIGN KEY (`id_almacen`) REFERENCES `almacen` (`id`);

--
-- Filtros para la tabla `empleado`
--
ALTER TABLE `empleado`
  ADD CONSTRAINT `empleado_ibfk_1` FOREIGN KEY (`id_persona`) REFERENCES `persona` (`id`),
  ADD CONSTRAINT `empleado_ibfk_2` FOREIGN KEY (`departamento_id`) REFERENCES `departamento` (`id`);

--
-- Filtros para la tabla `envio`
--
ALTER TABLE `envio`
  ADD CONSTRAINT `envio_ibfk_1` FOREIGN KEY (`id_pedido`) REFERENCES `pedido` (`id`),
  ADD CONSTRAINT `envio_ibfk_2` FOREIGN KEY (`id_vehiculo`) REFERENCES `vehiculo` (`id`),
  ADD CONSTRAINT `envio_ibfk_3` FOREIGN KEY (`id_conductor`) REFERENCES `conductor` (`id`),
  ADD CONSTRAINT `envio_ibfk_4` FOREIGN KEY (`id_ruta`) REFERENCES `ruta` (`id`);

--
-- Filtros para la tabla `historial_escaneo`
--
ALTER TABLE `historial_escaneo`
  ADD CONSTRAINT `historial_escaneo_ibfk_1` FOREIGN KEY (`id_codigo_barras`) REFERENCES `codigo_barras` (`id`),
  ADD CONSTRAINT `historial_escaneo_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id`),
  ADD CONSTRAINT `historial_escaneo_ibfk_3` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`),
  ADD CONSTRAINT `historial_escaneo_ibfk_4` FOREIGN KEY (`id_compra`) REFERENCES `compra` (`id`),
  ADD CONSTRAINT `historial_escaneo_ibfk_5` FOREIGN KEY (`id_venta`) REFERENCES `venta` (`id`);

--
-- Filtros para la tabla `inventario`
--
ALTER TABLE `inventario`
  ADD CONSTRAINT `inventario_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id`),
  ADD CONSTRAINT `inventario_ibfk_2` FOREIGN KEY (`id_almacen`) REFERENCES `almacen` (`id`);

--
-- Filtros para la tabla `logs_sistema`
--
ALTER TABLE `logs_sistema`
  ADD CONSTRAINT `logs_sistema_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`);

--
-- Filtros para la tabla `movimiento_inventario`
--
ALTER TABLE `movimiento_inventario`
  ADD CONSTRAINT `movimiento_inventario_ibfk_1` FOREIGN KEY (`id_inventario`) REFERENCES `inventario` (`id`),
  ADD CONSTRAINT `movimiento_inventario_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id`),
  ADD CONSTRAINT `movimiento_inventario_ibfk_3` FOREIGN KEY (`id_almacen`) REFERENCES `almacen` (`id`),
  ADD CONSTRAINT `movimiento_inventario_ibfk_4` FOREIGN KEY (`id_codigo_barras`) REFERENCES `codigo_barras` (`id`),
  ADD CONSTRAINT `movimiento_inventario_ibfk_5` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`),
  ADD CONSTRAINT `movimiento_inventario_ibfk_6` FOREIGN KEY (`id_compra`) REFERENCES `compra` (`id`),
  ADD CONSTRAINT `movimiento_inventario_ibfk_7` FOREIGN KEY (`id_venta`) REFERENCES `venta` (`id`),
  ADD CONSTRAINT `movimiento_inventario_ibfk_8` FOREIGN KEY (`id_devolucion`) REFERENCES `devolucion` (`id`);

--
-- Filtros para la tabla `pago`
--
ALTER TABLE `pago`
  ADD CONSTRAINT `pago_ibfk_1` FOREIGN KEY (`id_venta`) REFERENCES `venta` (`id`),
  ADD CONSTRAINT `pago_ibfk_2` FOREIGN KEY (`id_compra`) REFERENCES `compra` (`id`);

--
-- Filtros para la tabla `pedido`
--
ALTER TABLE `pedido`
  ADD CONSTRAINT `pedido_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `cliente` (`id`);

--
-- Filtros para la tabla `producto`
--
ALTER TABLE `producto`
  ADD CONSTRAINT `producto_ibfk_1` FOREIGN KEY (`categoria_id`) REFERENCES `categoria_producto` (`id`);

--
-- Filtros para la tabla `proveedor_producto`
--
ALTER TABLE `proveedor_producto`
  ADD CONSTRAINT `proveedor_producto_ibfk_1` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedor` (`id`),
  ADD CONSTRAINT `proveedor_producto_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id`);

--
-- Filtros para la tabla `role_module_permissions`
--
ALTER TABLE `role_module_permissions`
  ADD CONSTRAINT `role_module_permissions_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`id`),
  ADD CONSTRAINT `role_module_permissions_ibfk_2` FOREIGN KEY (`id_modulo`) REFERENCES `modulo` (`id`);

--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`id_persona`) REFERENCES `persona` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `usuario_ibfk_2` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`id`);

--
-- Filtros para la tabla `venta`
--
ALTER TABLE `venta`
  ADD CONSTRAINT `venta_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `cliente` (`id`),
  ADD CONSTRAINT `venta_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`),
  ADD CONSTRAINT `venta_ibfk_3` FOREIGN KEY (`id_almacen`) REFERENCES `almacen` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
