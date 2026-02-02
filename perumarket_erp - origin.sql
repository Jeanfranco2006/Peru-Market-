-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 02-02-2026 a las 03:24:36
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
(1, 'ZZZ', 'u2322', 'Lima', 22000.00, 'jean', 'ACTIVO', '2025-11-29 04:55:08', '2025-12-18 05:19:00'),
(2, 'FIBRE AIRS Professional', 'd-500', 'Avenida José Carlos Mariátegui', 5000.00, 'neritogey', 'ACTIVO', '2025-12-21 21:53:21', '2025-12-21 21:53:21'),
(3, 'Los pollitos pio', '358', 'Av. Grau 123 - Lima', 200.00, 'Jorge Andres Campo', 'ACTIVO', '2025-12-30 06:05:15', '2025-12-30 06:05:15');

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
  `estado` varchar(20) DEFAULT 'ACTIVO',
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cliente`
--

INSERT INTO `cliente` (`id`, `id_persona`, `tipo`, `estado`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, 7, 'NATURAL', 'INACTIVO', '2025-11-29 04:52:22', '2025-12-06 06:44:34'),
(2, 10, 'NATURAL', 'ACTIVO', '2025-11-29 05:09:34', '2025-12-06 06:46:08'),
(3, 9, 'NATURAL', 'INACTIVO', '2025-12-03 03:35:19', '2025-12-06 06:18:42'),
(12, 19, 'NATURAL', 'ACTIVO', '2025-12-06 06:45:04', '2025-12-27 22:35:23'),
(13, 6, 'JURIDICA', 'ACTIVO', '2025-12-10 05:20:22', '2025-12-10 05:20:22'),
(14, 21, 'NATURAL', 'ACTIVO', '2025-12-28 01:20:08', '2025-12-28 01:20:08'),
(15, 22, 'NATURAL', 'ACTIVO', '2025-12-28 01:39:59', '2025-12-28 01:39:59'),
(17, 24, 'NATURAL', 'ACTIVO', '2025-12-28 01:44:08', '2025-12-28 01:44:08');

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
(37, '647876055445', 52, 1, 'EAN13', NULL, 1, 1, 'ACTIVO', '2025-12-22 00:53:10', '2025-12-22 00:53:10', '2025-12-22 00:53:10'),
(38, '688274104012', 53, 1, 'EAN13', NULL, 1, 1, 'ACTIVO', '2025-12-22 02:00:34', '2025-12-22 02:00:34', '2025-12-22 02:00:34'),
(39, '495874385580', 55, 2, 'EAN13', NULL, 1, 1, 'ACTIVO', '2025-12-23 00:26:30', '2025-12-23 00:26:30', '2025-12-23 00:26:30'),
(40, '514641740276', 56, 2, 'EAN13', NULL, 1, 1, 'ACTIVO', '2025-12-23 00:57:45', '2025-12-23 00:57:45', '2025-12-23 00:57:45'),
(41, '530437208357', 58, 2, 'EAN13', NULL, 1, 1, 'ACTIVO', '2025-12-23 01:24:05', '2025-12-23 01:24:05', '2025-12-23 01:24:05'),
(42, '610705445719', 59, 2, 'EAN13', NULL, 1, 1, 'ACTIVO', '2025-12-23 03:38:04', '2025-12-23 03:38:04', '2025-12-23 03:38:04'),
(43, '262107477664', 61, 1, 'EAN13', NULL, 1, 1, 'ACTIVO', '2025-12-23 21:43:34', '2025-12-23 21:43:34', '2025-12-23 21:43:34'),
(44, '445114012957', 62, 2, 'EAN13', NULL, 1, 1, 'ACTIVO', '2025-12-24 02:48:52', '2025-12-24 02:48:52', '2025-12-24 02:48:52'),
(45, '455391301211', 64, 1, 'EAN13', NULL, 1, 1, 'ACTIVO', '2025-12-24 03:05:41', '2025-12-24 03:05:41', '2025-12-24 03:05:41'),
(46, '907161161797', 66, 1, 'EAN13', NULL, 1, 1, 'ACTIVO', '2025-12-26 23:12:03', '2025-12-26 23:12:03', '2025-12-26 23:12:03'),
(50, '779547364672', 72, 1, 'EAN13', NULL, 1, 1, 'ACTIVO', '2026-02-01 20:32:36', '2026-02-01 20:32:36', '2026-02-01 20:32:36'),
(51, '800768269027', 73, NULL, 'EAN13', NULL, 1, 1, 'ACTIVO', '2026-02-01 21:07:56', '2026-02-01 21:07:56', '2026-02-01 21:07:56');

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
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `metodo_pago` enum('EFECTIVO','TARJETA','TRANSFERENCIA','YAPE','PLIN','OTROS') DEFAULT NULL,
  `observaciones` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `compra`
--

INSERT INTO `compra` (`id`, `id_proveedor`, `id_almacen`, `id_usuario`, `fecha`, `tipo_comprobante`, `numero_comprobante`, `subtotal`, `igv`, `total`, `estado`, `usa_codigo_barras`, `ruta_documento`, `fecha_creacion`, `fecha_actualizacion`, `metodo_pago`, `observaciones`) VALUES
(32, 1, 1, 1, '2025-12-22 01:44:34', 'ORDEN_COMPRA', 'OC01-367874', 450.00, 81.00, 531.00, 'COMPLETADA', 0, NULL, '2025-12-22 01:44:34', '2025-12-22 01:44:40', 'EFECTIVO', ''),
(33, 2, 2, 1, '2025-12-22 01:50:17', 'ORDEN_COMPRA', 'OC01-368217', 125.00, 22.50, 147.50, 'COMPLETADA', 0, NULL, '2025-12-22 01:50:17', '2025-12-22 02:16:27', 'EFECTIVO', ''),
(34, 2, 1, 1, '2025-12-22 02:03:39', 'ORDEN_COMPRA', 'OC01-369019', 72.00, 12.96, 84.96, 'COMPLETADA', 0, NULL, '2025-12-22 02:03:39', '2025-12-22 02:16:30', 'EFECTIVO', ''),
(35, 1, 2, 1, '2025-12-22 02:09:34', 'FACTURA', 'F001-369374', 180.00, 32.40, 212.40, 'COMPLETADA', 0, NULL, '2025-12-22 02:09:34', '2025-12-23 00:59:43', 'YAPE', ''),
(36, 2, 1, 1, '2025-12-23 01:01:15', 'BOLETA', 'B001-451675', 250.00, 45.00, 295.00, 'COMPLETADA', 0, NULL, '2025-12-23 01:01:15', '2025-12-23 01:03:31', 'EFECTIVO', ''),
(37, 2, 1, 1, '2025-12-23 01:02:20', 'FACTURA', 'F001-451740', 375.00, 67.50, 442.50, 'COMPLETADA', 0, NULL, '2025-12-23 01:02:20', '2025-12-23 01:04:26', 'EFECTIVO', ''),
(38, 1, 1, 1, '2025-12-23 01:22:01', 'ORDEN_COMPRA', 'OC01-452921', 150.00, 27.00, 177.00, 'COMPLETADA', 0, NULL, '2025-12-23 01:22:01', '2025-12-23 01:22:59', 'EFECTIVO', ''),
(39, 2, 1, 1, '2025-12-23 01:22:47', 'ORDEN_COMPRA', 'OC01-452967', 200.00, 36.00, 236.00, 'COMPLETADA', 0, NULL, '2025-12-23 01:22:47', '2025-12-23 01:23:17', 'EFECTIVO', ''),
(40, 1, 2, 1, '2025-12-23 20:50:29', 'BOLETA', 'B001-523029', 1500.00, 270.00, 1770.00, 'COMPLETADA', 0, NULL, '2025-12-23 20:50:29', '2025-12-24 02:29:50', 'YAPE', ''),
(41, 1, 1, 1, '2025-12-23 21:42:33', 'BOLETA', 'B001-526153', 1000.00, 180.00, 1180.00, 'COMPLETADA', 0, NULL, '2025-12-23 21:42:33', '2025-12-24 03:03:53', 'YAPE', ''),
(42, 1, 1, 1, '2025-12-24 03:04:40', 'BOLETA', 'B001-545480', 25.00, 4.50, 29.50, 'COMPLETADA', 0, NULL, '2025-12-24 03:04:40', '2025-12-24 03:04:45', 'YAPE', ''),
(43, 1, 1, 1, '2025-12-26 23:11:05', 'BOLETA', 'B001-790665', 100.00, 18.00, 118.00, 'COMPLETADA', 0, NULL, '2025-12-26 23:11:05', '2025-12-26 23:11:14', 'YAPE', ''),
(44, 1, 1, 1, '2025-12-29 03:25:45', 'ORDEN_COMPRA', 'OC01-978745', 124.00, 22.32, 146.32, 'COMPLETADA', 0, NULL, '2025-12-29 03:25:45', '2025-12-29 03:25:50', 'YAPE', ''),
(45, 1, 1, 1, '2026-02-01 20:25:40', 'BOLETA', 'B001-977539', 270.00, 48.60, 318.60, 'PENDIENTE', 0, NULL, '2026-02-01 20:25:40', '2026-02-01 20:25:40', 'TARJETA', ''),
(46, 1, 2, 1, '2026-02-01 20:33:53', 'FACTURA', 'F001-978033', 270.00, 48.60, 318.60, 'COMPLETADA', 0, NULL, '2026-02-01 20:33:53', '2026-02-01 20:34:53', 'TRANSFERENCIA', ''),
(47, 1, 2, 1, '2026-02-01 20:53:32', 'FACTURA', 'F001-979212', 3750.00, 675.00, 4425.00, 'COMPLETADA', 0, NULL, '2026-02-01 20:53:32', '2026-02-01 20:53:38', 'TRANSFERENCIA', ''),
(48, 1, 2, 1, '2026-02-01 21:04:14', 'ORDEN_COMPRA', 'OC01-979854', 25.00, 4.50, 29.50, 'COMPLETADA', 0, NULL, '2026-02-01 21:04:14', '2026-02-01 21:04:22', 'EFECTIVO', '');

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
  `estado` varchar(20) DEFAULT 'ACTIVO',
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `nombres` varchar(100) DEFAULT NULL,
  `apellido_paterno` varchar(100) DEFAULT NULL,
  `apellido_materno` varchar(100) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `numero_documento` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `conductor`
--

INSERT INTO `conductor` (`id`, `id_persona`, `licencia`, `categoria_licencia`, `estado`, `fecha_creacion`, `fecha_actualizacion`, `nombres`, `apellido_paterno`, `apellido_materno`, `telefono`, `numero_documento`) VALUES
(1, 26, 'aiib', NULL, '', '2025-12-29 03:05:39', '2026-02-02 02:21:17', 'Toribio', 'DASDS', 'Barron', '946087678', '74885470'),
(2, 26, 'A78966459', 'AIIB', '', '2025-12-29 03:14:43', '2026-02-01 23:25:07', NULL, NULL, NULL, NULL, NULL);

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
(5, 'Area de Sistemas', 'dev/ front / back / analist / full stack', '2025-11-21 03:46:39', '2025-11-21 03:46:39'),
(6, 'rhhh', 'd', '2025-12-06 03:28:34', '2025-12-06 03:28:34');

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

--
-- Volcado de datos para la tabla `detalle_compra`
--

INSERT INTO `detalle_compra` (`id`, `id_compra`, `id_producto`, `id_codigo_barras`, `cantidad`, `precio_unitario`, `subtotal`, `registrado_con_escaner`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(32, 32, 51, NULL, 15, 30.00, 450.00, NULL, '2025-12-22 01:44:34', '2025-12-22 01:44:34'),
(33, 33, 49, NULL, 5, 25.00, 125.00, NULL, '2025-12-22 01:50:17', '2025-12-22 01:50:17'),
(34, 34, 54, NULL, 6, 12.00, 72.00, NULL, '2025-12-22 02:03:39', '2025-12-22 02:03:39'),
(35, 35, 51, NULL, 6, 30.00, 180.00, NULL, '2025-12-22 02:09:34', '2025-12-22 02:09:34'),
(36, 36, 49, NULL, 10, 25.00, 250.00, NULL, '2025-12-23 01:01:15', '2025-12-23 01:01:15'),
(37, 37, 49, NULL, 15, 25.00, 375.00, NULL, '2025-12-23 01:02:20', '2025-12-23 01:02:20'),
(38, 38, 51, NULL, 5, 30.00, 150.00, NULL, '2025-12-23 01:22:01', '2025-12-23 01:22:01'),
(39, 39, 57, NULL, 10, 20.00, 200.00, NULL, '2025-12-23 01:22:47', '2025-12-23 01:22:47'),
(40, 40, 53, NULL, 50, 30.00, 1500.00, NULL, '2025-12-23 20:50:29', '2025-12-23 20:50:29'),
(41, 41, 60, NULL, 40, 25.00, 1000.00, NULL, '2025-12-23 21:42:33', '2025-12-23 21:42:33'),
(42, 42, 60, NULL, 1, 25.00, 25.00, NULL, '2025-12-24 03:04:40', '2025-12-24 03:04:40'),
(43, 43, 65, NULL, 40, 2.50, 100.00, NULL, '2025-12-26 23:11:05', '2025-12-26 23:11:05'),
(44, 44, 68, NULL, 31, 4.00, 124.00, NULL, '2025-12-29 03:25:45', '2025-12-29 03:25:45'),
(45, 45, 70, NULL, 18, 15.00, 270.00, NULL, '2026-02-01 20:25:40', '2026-02-01 20:25:40'),
(46, 46, 70, NULL, 18, 15.00, 270.00, NULL, '2026-02-01 20:33:53', '2026-02-01 20:33:53'),
(47, 47, 61, NULL, 150, 25.00, 3750.00, NULL, '2026-02-01 20:53:32', '2026-02-01 20:53:32'),
(48, 48, 73, NULL, 1, 25.00, 25.00, NULL, '2026-02-01 21:04:14', '2026-02-01 21:04:14');

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
(29, 22, 52, NULL, 5, 59.98, 0.00, 299.90, 0, '2025-12-22 00:59:38', '2025-12-22 00:59:38'),
(30, 23, 53, NULL, 4, 60.00, 0.00, 240.00, 0, '2025-12-22 02:00:52', '2025-12-22 02:00:52'),
(31, 24, 53, NULL, 1, 60.00, 0.00, 60.00, 0, '2025-12-22 02:01:14', '2025-12-22 02:01:14'),
(32, 25, 58, NULL, 4, 50.00, 0.00, 200.00, 0, '2025-12-23 01:25:32', '2025-12-23 01:25:32'),
(33, 26, 61, NULL, 2, 30.01, 0.00, 60.02, 0, '2025-12-24 02:36:24', '2025-12-24 02:36:24'),
(34, 27, 61, NULL, 1, 30.01, 0.00, 30.01, 0, '2025-12-24 02:36:57', '2025-12-24 02:36:57'),
(35, 27, 59, NULL, 1, 31.99, 0.00, 31.99, 0, '2025-12-24 02:36:57', '2025-12-24 02:36:57'),
(36, 28, 59, NULL, 1, 31.99, 0.00, 31.99, 0, '2025-12-24 02:38:08', '2025-12-24 02:38:08'),
(37, 29, 64, NULL, 1, 27.00, 0.00, 27.00, 0, '2025-12-24 03:07:50', '2025-12-24 03:07:50'),
(38, 30, 66, NULL, 2, 3.00, 0.00, 6.00, 0, '2025-12-26 23:13:11', '2025-12-26 23:13:11'),
(39, 31, 64, NULL, 4, 27.00, 0.00, 108.00, 0, '2025-12-26 23:50:49', '2025-12-26 23:50:49'),
(40, 32, 61, NULL, 1, 30.01, 0.00, 30.01, 0, '2025-12-27 01:05:17', '2025-12-27 01:05:17'),
(41, 33, 64, NULL, 3, 27.00, 0.00, 81.00, 0, '2025-12-27 02:24:46', '2025-12-27 02:24:46'),
(42, 34, 66, NULL, 3, 3.00, 0.00, 9.00, 0, '2025-12-27 04:55:26', '2025-12-27 04:55:26'),
(43, 35, 66, NULL, 3, 3.00, 0.00, 9.00, 0, '2025-12-27 04:55:29', '2025-12-27 04:55:29'),
(44, 36, 66, NULL, 3, 3.00, 0.00, 9.00, 0, '2025-12-27 04:55:51', '2025-12-27 04:55:51'),
(45, 37, 66, NULL, 3, 3.00, 0.00, 9.00, 0, '2025-12-27 05:01:37', '2025-12-27 05:01:37'),
(46, 38, 66, NULL, 2, 3.00, 0.00, 6.00, 0, '2025-12-27 05:03:12', '2025-12-27 05:03:12'),
(47, 39, 66, NULL, 2, 3.00, 0.00, 6.00, 0, '2025-12-27 05:03:55', '2025-12-27 05:03:55'),
(48, 40, 66, NULL, 2, 3.00, 0.00, 6.00, 0, '2025-12-27 05:04:28', '2025-12-27 05:04:28'),
(49, 41, 66, NULL, 1, 3.00, 0.00, 3.00, 0, '2025-12-27 05:05:28', '2025-12-27 05:05:28'),
(50, 42, 66, NULL, 2, 3.00, 0.00, 6.00, 0, '2025-12-27 05:19:57', '2025-12-27 05:19:57'),
(51, 43, 66, NULL, 2, 3.00, 0.00, 6.00, 0, '2025-12-27 05:24:13', '2025-12-27 05:24:13'),
(52, 44, 66, NULL, 1, 3.00, 0.00, 3.00, 0, '2025-12-27 05:29:56', '2025-12-27 05:29:56'),
(53, 45, 61, NULL, 2, 30.01, 0.00, 60.02, 0, '2025-12-27 05:41:36', '2025-12-27 05:41:36'),
(54, 46, 66, NULL, 1, 3.00, 0.00, 3.00, 0, '2025-12-27 05:55:34', '2025-12-27 05:55:34'),
(55, 47, 66, NULL, 4, 3.00, 0.00, 12.00, 0, '2025-12-27 05:56:12', '2025-12-27 05:56:12'),
(56, 48, 66, NULL, 1, 3.00, 0.00, 3.00, 0, '2025-12-27 06:04:23', '2025-12-27 06:04:23'),
(57, 49, 66, NULL, 2, 3.00, 0.00, 6.00, 0, '2025-12-27 06:14:41', '2025-12-27 06:14:41'),
(58, 49, 64, NULL, 2, 27.00, 0.00, 54.00, 0, '2025-12-27 06:14:41', '2025-12-27 06:14:41'),
(59, 50, 59, NULL, 2, 31.99, 0.00, 63.98, 0, '2025-12-27 22:35:36', '2025-12-27 22:35:36'),
(60, 51, 66, NULL, 1, 3.00, 0.00, 3.00, 0, '2025-12-28 04:45:53', '2025-12-28 04:45:53'),
(61, 52, 64, NULL, 4, 27.00, 0.00, 108.00, 0, '2025-12-29 22:51:25', '2025-12-29 22:51:25'),
(62, 52, 62, NULL, 2, 122.00, 0.00, 244.00, 0, '2025-12-29 22:51:25', '2025-12-29 22:51:25'),
(63, 53, 61, NULL, 1, 30.01, 0.00, 30.01, 0, '2025-12-29 23:40:26', '2025-12-29 23:40:26'),
(64, 53, 62, NULL, 1, 122.00, 0.00, 122.00, 0, '2025-12-29 23:40:26', '2025-12-29 23:40:26'),
(65, 54, 61, NULL, 1, 30.01, 0.00, 30.01, 0, '2025-12-29 23:42:03', '2025-12-29 23:42:03'),
(66, 54, 62, NULL, 1, 122.00, 0.00, 122.00, 0, '2025-12-29 23:42:03', '2025-12-29 23:42:03'),
(67, 55, 59, NULL, 2, 31.99, 0.00, 63.98, 0, '2025-12-29 23:54:27', '2025-12-29 23:54:27'),
(68, 56, 59, NULL, 2, 31.99, 0.00, 63.98, 0, '2025-12-29 23:56:41', '2025-12-29 23:56:41'),
(69, 57, 59, NULL, 1, 31.99, 0.00, 31.99, 0, '2025-12-29 23:57:01', '2025-12-29 23:57:01'),
(70, 58, 59, NULL, 2, 31.99, 0.00, 63.98, 0, '2025-12-30 00:01:16', '2025-12-30 00:01:16'),
(71, 59, 61, NULL, 8, 30.01, 0.00, 240.08, 0, '2025-12-30 00:52:46', '2025-12-30 00:52:46'),
(72, 60, 59, NULL, 6, 31.99, 0.00, 191.94, 0, '2025-12-30 01:36:11', '2025-12-30 01:36:11'),
(73, 61, 52, NULL, 4, 59.98, 0.00, 239.92, 0, '2025-12-30 02:57:19', '2025-12-30 02:57:19'),
(74, 62, 72, NULL, 1, 15.00, 0.00, 15.00, 0, '2026-02-01 22:26:23', '2026-02-01 22:26:23'),
(75, 63, 72, NULL, 7, 15.00, 0.00, 105.00, 0, '2026-02-01 22:27:01', '2026-02-01 22:27:01');

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
(2, 9, 5, 'Cachinero', 155.00, '2025-11-22', 'blob:http://localhost:5173/c35e1ea5-a15a-419d-8340-ae6798424737', 'AyS_s14.docx.pdf', 'ACTIVO', '2025-11-22 04:22:34', '2025-12-06 03:47:47'),
(4, 5, 6, 'vf', 1800.00, '2025-12-04', '', 'comprobante_35_1764794448994.pdf', 'ACTIVO', '2025-12-04 03:45:39', '2025-12-06 03:34:56'),
(5, 11, 5, 'develop', 1500.00, '2025-12-05', 'blob:http://localhost:5173/ff756345-83fd-4739-9175-15af5cd3703c', 'comprobante_27_1764786142843.pdf', 'ACTIVO', '2025-12-04 04:12:03', '2025-12-04 04:12:03');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `envio`
--

CREATE TABLE `envio` (
  `id` int(11) NOT NULL,
  `id_pedido` int(11) DEFAULT NULL,
  `id_venta` int(11) DEFAULT NULL,
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

--
-- Volcado de datos para la tabla `envio`
--

INSERT INTO `envio` (`id`, `id_pedido`, `id_venta`, `id_vehiculo`, `id_conductor`, `id_ruta`, `direccion_envio`, `fecha_envio`, `fecha_entrega`, `costo_transporte`, `estado`, `observaciones`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(7, 7, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'PENDIENTE', NULL, '2025-12-29 22:51:25', '2025-12-29 22:51:25'),
(8, 11, NULL, NULL, NULL, NULL, NULL, '2025-12-29', NULL, NULL, 'PENDIENTE', NULL, '2025-12-29 23:56:41', '2025-12-29 23:56:41'),
(9, 12, NULL, NULL, NULL, NULL, NULL, '2025-12-29', NULL, NULL, 'PENDIENTE', NULL, '2025-12-29 23:57:01', '2025-12-29 23:57:01'),
(10, 13, NULL, NULL, NULL, NULL, NULL, '2025-12-29', NULL, NULL, 'PENDIENTE', NULL, '2025-12-30 00:01:16', '2025-12-30 00:01:16'),
(11, 14, NULL, NULL, NULL, NULL, NULL, '2025-12-29', NULL, NULL, 'PENDIENTE', NULL, '2025-12-30 00:52:46', '2025-12-30 00:52:46'),
(12, 15, NULL, NULL, NULL, NULL, NULL, '2025-12-29', NULL, NULL, 'PENDIENTE', NULL, '2025-12-30 01:36:11', '2025-12-30 01:36:11'),
(13, 16, NULL, NULL, NULL, NULL, NULL, '2025-12-29', NULL, NULL, 'PENDIENTE', NULL, '2025-12-30 02:57:19', '2025-12-30 02:57:19'),
(14, NULL, 3, NULL, NULL, NULL, 'Lima', '2026-02-01', NULL, 15.00, 'PENDIENTE', NULL, '2026-02-01 23:31:56', '2026-02-01 23:33:30'),
(15, NULL, 1, 9, 1, 7, 'Plaza 2 de Mayo, Urbanización Cercado de Lima, Lima, Lima Metropolitana, Lima, 15082, Perú', '2026-02-01', NULL, 18.00, 'PENDIENTE', 'asdads', '2026-02-02 00:04:01', '2026-02-02 00:19:13');

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
(40, 52, 1, 6, 10, 1000, 'ate', '2025-12-22 00:53:10', '2025-12-30 02:57:19'),
(42, 51, 1, 21, 10, 1000, NULL, '2025-12-22 01:41:52', '2025-12-23 01:22:01'),
(43, 49, 2, 5, 10, 1000, NULL, '2025-12-22 01:50:17', '2025-12-22 01:50:17'),
(44, 53, 1, 10, 10, 1000, 'ate', '2025-12-22 02:00:34', '2025-12-22 02:01:14'),
(45, 54, 1, 6, 10, 1000, NULL, '2025-12-22 02:03:39', '2025-12-22 02:03:39'),
(46, 51, 2, 6, 10, 1000, NULL, '2025-12-22 02:09:34', '2025-12-22 02:09:34'),
(47, 55, 1, 6, 1, 5, 'mi casa', '2025-12-23 00:26:30', '2025-12-23 00:26:30'),
(48, 56, 2, 5, 10, 1000, 'mi casa', '2025-12-23 00:57:45', '2025-12-23 00:57:45'),
(49, 49, 1, 25, 10, 1000, NULL, '2025-12-23 01:01:15', '2025-12-23 01:02:20'),
(50, 57, 1, 10, 10, 1000, NULL, '2025-12-23 01:22:47', '2025-12-23 01:22:47'),
(51, 58, 1, 26, 10, 1000, 'mi casa', '2025-12-23 01:24:05', '2025-12-23 01:25:32'),
(52, 59, 1, 13, 12, 1000, '', '2025-12-23 03:38:04', '2025-12-30 01:36:11'),
(53, 53, 2, 50, 10, 1000, NULL, '2025-12-23 20:50:29', '2025-12-23 20:50:29'),
(54, 60, 1, 41, 10, 1000, NULL, '2025-12-23 21:42:33', '2025-12-24 03:04:40'),
(55, 61, 1, 24, 10, 1000, '12', '2025-12-23 21:43:34', '2025-12-30 00:52:46'),
(56, 62, 1, 2, 10, 1000, '12', '2025-12-24 02:48:52', '2025-12-29 23:42:03'),
(57, 64, 1, 27, 10, 1000, '', '2025-12-24 03:05:41', '2025-12-29 22:51:25'),
(58, 65, 1, 40, 10, 1000, NULL, '2025-12-26 23:11:05', '2025-12-26 23:11:05'),
(59, 66, 1, 5, 10, 20, '', '2025-12-26 23:12:03', '2025-12-28 04:45:53'),
(61, 68, 1, 31, 10, 1000, NULL, '2025-12-29 03:25:45', '2025-12-29 03:25:45'),
(63, 70, 1, 18, 10, 1000, NULL, '2026-02-01 20:25:40', '2026-02-01 20:25:40'),
(65, 72, 1, 77, 10, 1000, '15', '2026-02-01 20:32:36', '2026-02-01 22:27:01'),
(66, 70, 2, 18, 10, 1000, NULL, '2026-02-01 20:33:53', '2026-02-01 20:33:53'),
(67, 61, 2, 150, 10, 1000, NULL, '2026-02-01 20:53:38', '2026-02-01 20:53:38'),
(68, 73, 2, 1, 10, 1000, 'altillo', '2026-02-01 21:04:22', '2026-02-01 21:27:30');

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
(45, 40, 52, 1, NULL, 'ENTRADA', 15, 0, 15, 'Stock inicial en la creación del producto.', 'MANUAL', 1, NULL, NULL, NULL, '2025-12-22 00:53:10', '2025-12-22 00:53:10', '2025-12-22 00:53:10'),
(46, 44, 53, 1, NULL, 'ENTRADA', 15, 0, 15, 'Stock inicial en la creación del producto.', 'MANUAL', 1, NULL, NULL, NULL, '2025-12-22 02:00:34', '2025-12-22 02:00:34', '2025-12-22 02:00:34'),
(47, 47, 55, 1, NULL, 'ENTRADA', 6, 0, 6, 'Stock inicial en la creación del producto.', 'MANUAL', 1, NULL, NULL, NULL, '2025-12-23 00:26:30', '2025-12-23 00:26:30', '2025-12-23 00:26:30'),
(48, 48, 56, 2, NULL, 'ENTRADA', 5, 0, 5, 'Stock inicial en la creación del producto.', 'MANUAL', 1, NULL, NULL, NULL, '2025-12-23 00:57:45', '2025-12-23 00:57:45', '2025-12-23 00:57:45'),
(49, 51, 58, 1, NULL, 'ENTRADA', 30, 0, 30, 'Stock inicial en la creación del producto.', 'MANUAL', 1, NULL, NULL, NULL, '2025-12-23 01:24:05', '2025-12-23 01:24:05', '2025-12-23 01:24:05'),
(50, 52, 59, 1, NULL, 'ENTRADA', 30, 0, 30, 'Stock inicial en la creación del producto.', 'MANUAL', 1, NULL, NULL, NULL, '2025-12-23 03:38:04', '2025-12-23 03:38:04', '2025-12-23 03:38:04'),
(51, 55, 61, 1, NULL, 'ENTRADA', 40, 0, 40, 'Stock inicial en la creación del producto.', 'MANUAL', 1, NULL, NULL, NULL, '2025-12-23 21:43:34', '2025-12-23 21:43:34', '2025-12-23 21:43:34'),
(52, 56, 62, 1, NULL, 'ENTRADA', 6, 0, 6, 'Stock inicial en la creación del producto.', 'MANUAL', 1, NULL, NULL, NULL, '2025-12-24 02:48:52', '2025-12-24 02:48:52', '2025-12-24 02:48:52'),
(53, 57, 64, 1, NULL, 'ENTRADA', 41, 0, 41, 'Stock inicial en la creación del producto.', 'MANUAL', 1, NULL, NULL, NULL, '2025-12-24 03:05:41', '2025-12-24 03:05:41', '2025-12-24 03:05:41'),
(54, 59, 66, 1, NULL, 'ENTRADA', 40, 0, 40, 'Stock inicial en la creación del producto.', 'MANUAL', 1, NULL, NULL, NULL, '2025-12-26 23:12:03', '2025-12-26 23:12:03', '2025-12-26 23:12:03'),
(58, 65, 72, 1, NULL, 'ENTRADA', 85, 0, 85, 'Stock inicial en la creación del producto.', 'MANUAL', 1, NULL, NULL, NULL, '2026-02-01 20:32:36', '2026-02-01 20:32:36', '2026-02-01 20:32:36'),
(59, 65, 72, 1, NULL, 'SALIDA', 1, 85, 84, 'Salida por venta', 'MANUAL', 8, NULL, NULL, NULL, '2026-02-01 22:26:23', '2026-02-01 22:26:23', '2026-02-01 22:26:23'),
(60, 65, 72, 1, NULL, 'SALIDA', 7, 84, 77, 'Salida por venta', 'MANUAL', 8, NULL, NULL, NULL, '2026-02-01 22:27:01', '2026-02-01 22:27:01', '2026-02-01 22:27:01');

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
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `id_venta` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pedido`
--

INSERT INTO `pedido` (`id`, `id_cliente`, `fecha_pedido`, `estado`, `total`, `fecha_creacion`, `fecha_actualizacion`, `id_venta`) VALUES
(1, 13, '2025-12-27 05:55:34', 'PENDIENTE', 3.00, '2025-12-27 05:55:34', '2025-12-27 05:55:34', 46),
(2, 2, '2025-12-27 05:56:12', 'PENDIENTE', 12.00, '2025-12-27 05:56:12', '2025-12-27 05:56:12', 47),
(3, 13, '2025-12-27 06:04:23', 'PENDIENTE', 3.00, '2025-12-27 06:04:23', '2025-12-27 06:04:23', 48),
(4, 13, '2025-12-27 06:14:41', 'PENDIENTE', 60.00, '2025-12-27 06:14:41', '2025-12-27 06:14:41', 49),
(5, 12, '2025-12-27 22:35:36', 'PENDIENTE', 63.98, '2025-12-27 22:35:36', '2025-12-27 22:35:36', 50),
(6, 2, '2025-12-28 04:45:53', 'PENDIENTE', 3.00, '2025-12-28 04:45:53', '2025-12-28 04:45:53', 51),
(7, 12, '2025-12-29 22:51:25', 'PENDIENTE', 352.00, '2025-12-29 22:51:25', '2025-12-29 22:51:25', 52),
(8, 2, '2025-12-29 23:40:26', 'PENDIENTE', 152.01, '2025-12-29 23:40:26', '2025-12-29 23:40:26', 53),
(9, 2, '2025-12-29 23:42:03', 'PENDIENTE', 152.01, '2025-12-29 23:42:03', '2025-12-29 23:42:03', 54),
(10, 12, '2025-12-29 23:54:27', 'PENDIENTE', 63.98, '2025-12-29 23:54:27', '2025-12-29 23:54:27', 55),
(11, 12, '2025-12-29 23:56:41', 'PENDIENTE', 63.98, '2025-12-29 23:56:41', '2025-12-29 23:56:41', 56),
(12, 12, '2025-12-29 23:57:01', 'PENDIENTE', 31.99, '2025-12-29 23:57:01', '2025-12-29 23:57:01', 57),
(13, 12, '2025-12-30 00:01:16', 'PENDIENTE', 63.98, '2025-12-30 00:01:16', '2025-12-30 00:01:16', 58),
(14, 14, '2025-12-30 00:52:46', 'PENDIENTE', 240.08, '2025-12-30 00:52:46', '2025-12-30 00:52:46', 59),
(15, 12, '2025-12-30 01:36:11', 'PENDIENTE', 191.94, '2025-12-30 01:36:11', '2025-12-30 01:36:11', 60),
(16, 17, '2025-12-30 02:57:19', 'PENDIENTE', 239.92, '2025-12-30 02:57:19', '2025-12-30 02:57:19', 61);

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
(5, 'DNI', '73457623', 'jean', 'ddd', 'chamorro', 'chamorrocg021@gmai.com', '946087675', '2025-12-04', 'Lima', '2025-11-21 02:37:46', '2025-12-06 06:24:14'),
(6, 'DNI', '75260852', 'José Adrian', 'Toribio', 'Toribio Barron', 'u22214417@utp.edu.pe', '924215942', NULL, 'ATE, San Gregorio, Asociación 8 de octubre Mz b lt 4', '2025-11-21 03:19:03', '2025-12-10 05:20:22'),
(7, 'DNI', '74883111', 'sssasasas', 'aaaaaa', 'saaa', 'chamorrocg021@gmai.com', '946087675', '2025-12-04', 'Lima', '2025-11-21 03:44:46', '2025-12-06 06:37:46'),
(8, 'DNI', '7389574', 'Caleb Cladimir ', 'Veramendi ', 'Alejos', 'caleb021@gmail.com', '946087678', '2006-01-18', 'Lima ', '2025-11-22 04:12:22', '2025-11-26 16:03:52'),
(9, 'DNI', '74855874', 'c', 'jean', 'g', 'cg@gmail.com', '987456321', '2025-12-03', 'Lima - Ate', '2025-11-22 04:22:34', '2025-12-06 06:03:44'),
(10, 'DNI', '78956451', 'Nero', 'kk', 'kkk', 'nero@gmail.com', '987456654', '2025-11-01', 'Lima / Ate', '2025-11-29 05:09:34', '2025-11-29 05:09:34'),
(11, 'DNI', '748556321', 'jean', 's', 'chamorro', 'chamorrocg021@gmai.com', '+51946087675', '2025-12-07', 'Lima', '2025-12-04 04:12:03', '2025-12-04 04:12:03'),
(13, 'DNI', '78498484', 'jean', 'aaaa', 'chamorro', 'chamorrocg021@gmai.com', '+51946087675', '2025-12-06', 'Lima', '2025-12-04 05:45:37', '2025-12-04 05:46:17'),
(14, 'DNI', '74883602', 'palsaaa', 'Jean', 'xxx', '74883602@gmail.com', '987456965', '2025-12-04', 'Lima- Ate', '2025-12-06 04:31:04', '2025-12-06 04:31:29'),
(15, 'DNI', '74881212', 'jean', 'ssss', 'chamorro', 'chamorrocg021@gmai.com', '946087675', '2025-10-02', 'Lima', '2025-12-06 06:16:48', '2025-12-06 06:16:48'),
(16, 'DNI', '74855871', 'jean', 'sss', 'chamorro', 'chamorrocg021@gmai.com', '946087675', '2025-12-03', 'Lima', '2025-12-06 06:32:33', '2025-12-06 06:32:33'),
(17, 'DNI', '74883675', 'Jeanfranco', 'Chamorro', 'Granados', 'chamorrocg021@gmai.com', '946087675', NULL, 'Lima', '2025-12-06 06:35:18', '2025-12-06 06:35:18'),
(18, 'DNI', '74881234', 'jean', 'uuu', 'chamorro', 'chamorrocg021@gmai.com', '946087675', '2025-12-04', 'Lima', '2025-12-06 06:42:02', '2025-12-06 06:42:02'),
(19, 'DNI', '74881245', 'jean', 'y', 'chamorro', 'chamorrocg021@gmai.com', '946087675', '2025-12-01', 'Lima', '2025-12-06 06:45:04', '2025-12-06 06:45:04'),
(20, 'DNI', '', 'Tonny Gabriel', 'Hinostroza', 'Palaco', 'tonnyghp577@gmail.com', '957302463', '2005-08-27', 'av los robles', '2025-12-26 23:07:50', '2025-12-26 23:07:50'),
(21, 'DNI', '76318795', 'holiwi', 'asw', 'sAS', 'sJIVB@GMAIL.COM', '', '2000-06-14', '', '2025-12-28 01:20:08', '2025-12-28 01:20:08'),
(22, 'DNI', '74541287', 'JHOSUA', 'A', 'S', 'J@GMAIL.COM', '13121', '1100-02-10', '1AS', '2025-12-28 01:39:59', '2025-12-28 01:39:59'),
(23, 'DNI', '74315265', 'ASA', 'ASAAS', '1QSASA', 'KIA@GMAIL.COM', '9756321012', '4000-07-15', 'asas<', '2025-12-28 01:42:59', '2025-12-28 01:42:59'),
(24, 'DNI', '15789564', 'gia', 's', 's', 'gia@gmail.com', '487563142', '2000-12-05', 'sss', '2025-12-28 01:44:08', '2025-12-28 01:44:08'),
(25, 'DNI', '71212325', 'jhadira', 'ad', 'ad', 'jha@gmail.com', '978654231', '2006-09-05', 'aaaaaa', '2025-12-28 02:10:18', '2025-12-28 02:10:18'),
(26, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-29 03:05:39', '2025-12-29 03:05:39');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto`
--

CREATE TABLE `producto` (
  `id` int(11) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `sku` varchar(50) DEFAULT NULL,
  `precio_venta` decimal(10,2) DEFAULT 0.00,
  `precio_compra` decimal(10,2) DEFAULT NULL,
  `stock` int(11) DEFAULT 0,
  `stock_minimo` int(11) DEFAULT 10,
  `stock_maximo` int(11) DEFAULT 1000,
  `unidad_medida` varchar(20) DEFAULT 'UNIDAD',
  `peso_kg` decimal(10,3) DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `categoria_id` int(11) DEFAULT NULL,
  `requiere_codigo_barras` tinyint(1) DEFAULT 1,
  `estado` enum('ACTIVO','INACTIVO','CATALOGO') DEFAULT 'ACTIVO',
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `producto`
--

INSERT INTO `producto` (`id`, `nombre`, `descripcion`, `sku`, `precio_venta`, `precio_compra`, `stock`, `stock_minimo`, `stock_maximo`, `unidad_medida`, `peso_kg`, `imagen`, `categoria_id`, `requiere_codigo_barras`, `estado`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(31, 'Pelota', NULL, 'PROV-149880', 0.00, 123.00, 18, 10, 1000, 'UNIDAD', 123.000, '/api/uploads/productos/prod_1766001149891_}.png', 1, 1, 'CATALOGO', '2025-12-17 19:52:29', '2025-12-22 00:32:10'),
(48, 'arroz', NULL, 'PROV-843723', 0.00, 20.00, 2, 10, 1000, 'UNIDAD', 30.000, NULL, 1, 1, 'CATALOGO', '2025-12-22 00:04:03', '2025-12-22 00:30:01'),
(49, 'arroz', NULL, 'PROV-873451', 0.00, 25.00, 30, 10, 1000, 'UNIDAD', 35.000, NULL, 1, 1, 'CATALOGO', '2025-12-22 00:04:33', '2025-12-23 01:02:20'),
(51, 'relojes', NULL, 'PROV-603980', 0.00, 30.00, 56, 10, 1000, 'UNIDAD', 5.000, '/api/uploads/productos/prod_1766364604024_reloj.png', 1, 1, 'CATALOGO', '2025-12-22 00:50:04', '2025-12-23 01:22:01'),
(52, 'relojes', '...............', 'RELO-8735', 59.98, 30.00, NULL, 10, 1000, 'KG', 5.000, '/uploads/productos/producto_1766364790760_producto_1766364790727_dx309p.png', 2, 1, 'ACTIVO', '2025-12-22 00:53:10', '2025-12-22 00:53:10'),
(53, 'relojes', 'aadada', 'RELO-1788', 60.00, 30.00, 50, 10, 1000, 'KG', 5.000, NULL, 1, 1, 'ACTIVO', '2025-12-22 02:00:34', '2025-12-23 20:50:29'),
(54, 'carne', NULL, 'PROV-998843', 0.00, 12.00, 6, 10, 1000, 'UNIDAD', 2.000, NULL, 1, 1, 'CATALOGO', '2025-12-22 02:03:18', '2025-12-22 02:03:39'),
(55, 'carne', '', 'CARN-8048', 30.00, 12.00, NULL, 10, 1000, 'KG', 2.000, NULL, 1, 1, 'ACTIVO', '2025-12-23 00:26:30', '2025-12-23 00:26:30'),
(56, 'arroz', '', 'ARRO-3448', 50.00, 25.00, NULL, 10, 1000, 'KG', 35.000, NULL, 4, 1, 'ACTIVO', '2025-12-23 00:57:45', '2025-12-23 00:57:45'),
(57, 'relojes', NULL, 'PROV-949562', 0.00, 20.00, 10, 10, 1000, 'UNIDAD', 5.000, NULL, 1, 1, 'CATALOGO', '2025-12-23 01:22:29', '2025-12-23 01:22:47'),
(58, 'relojes', '', 'RELO-5147', 50.00, 30.00, NULL, 10, 1000, 'KG', 5.000, '/uploads/productos/producto_1766453045714_producto_1766453045665_w87aqa.png', 1, 1, 'ACTIVO', '2025-12-23 01:24:05', '2025-12-23 01:24:05'),
(59, 'relojes', '', 'RELO-9707', 31.99, 30.00, NULL, 10, 1000, 'KG', 5.000, '/uploads/productos/producto_1766461100796_producto_1766461100785_gsx62e.png', 2, 1, 'ACTIVO', '2025-12-23 03:38:04', '2025-12-23 03:38:20'),
(60, 'Tallarin Bells', NULL, 'PROV-103786', 0.00, 25.00, 41, 10, 1000, 'UNIDAD', 5.000, '/api/uploads/productos/prod_1766526103805_images.jpeg', 1, 1, 'CATALOGO', '2025-12-23 21:41:43', '2025-12-24 03:04:40'),
(61, 'Tallarin Bells', '11111111', 'TALL-BELL-7970', 30.01, 25.00, 150, 10, 1000, 'KG', 5.000, '/uploads/productos/producto_1766526214310_producto_1766526214265_rr0t8l.jpeg', 3, 1, 'ACTIVO', '2025-12-23 21:43:34', '2026-02-01 20:53:38'),
(62, 'carne', '1212', 'CARN-5257', 122.00, 12.00, NULL, 10, 1000, 'KG', 2.000, NULL, 2, 1, 'ACTIVO', '2025-12-24 02:48:52', '2025-12-24 02:48:52'),
(64, 'Tallarin Bells', '', 'TALL-BELL-2055', 27.00, 25.00, NULL, 10, 1000, 'KG', 5.000, '/uploads/productos/producto_1766545541125_producto_1766545541118_a1b82r.jpeg', 1, 1, 'ACTIVO', '2025-12-24 03:05:41', '2025-12-24 03:05:41'),
(65, 'Atun Gloria', NULL, 'PROV-629815', 0.00, 2.50, 40, 10, 1000, 'UNIDAD', 0.750, '/api/uploads/productos/prod_1766790629846_images (1).jpeg', 1, 1, 'CATALOGO', '2025-12-26 23:10:29', '2025-12-26 23:11:05'),
(66, 'Atun Gloria', '', 'ATUN-GLOR-3535', 3.00, 2.50, NULL, 10, 1000, 'KG', 0.750, '/uploads/productos/producto_1766790723571_producto_1766790723520_18f7fn.jpeg', 4, 1, 'ACTIVO', '2025-12-26 23:12:03', '2025-12-26 23:12:03'),
(68, 'pokemon', NULL, 'PROV-711615', 0.00, 4.00, 31, 10, 1000, 'UNIDAD', 1.000, NULL, 1, 1, 'CATALOGO', '2025-12-29 03:25:11', '2025-12-29 03:25:45'),
(70, 'LOMO SALTADO', NULL, 'PROV-518540', 0.00, 15.00, 36, 10, 1000, 'UNIDAD', 15.000, '/api/uploads/productos/prod_1769977518590_logo jinnova.png', 1, 1, 'CATALOGO', '2026-02-01 20:25:18', '2026-02-01 20:33:53'),
(72, 'LOMO SALTADO', 'dfsfd', 'LOMO-SALT-5208', 15.00, 15.00, 0, 10, 1000, 'KG', 15.000, '/uploads/productos/producto_1769977956150_producto_1769977956136_otr088.png', 1, 1, 'ACTIVO', '2026-02-01 20:32:36', '2026-02-01 22:26:23'),
(73, 'PAPA HUAYRO', 'kg de papa', 'PROV-835365', 18.00, 25.00, 1, 10, 1000, 'UNIDAD', 80.000, '/api/uploads/productos/prod_1769979835375_image3.jpeg', 1, 1, 'ACTIVO', '2026-02-01 21:03:55', '2026-02-01 21:27:30');

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
(2, '20567891234', 'Tecnología Global EIRL', 'Juan Pérez', '945612378', 'ventas@tecnoglobal.pe', 'Calle Los Pinos 456 - Miraflores', 'ACTIVO', '2025-11-29 04:56:39', '2025-11-29 04:56:39');

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
(49, 2, 49, 25.00, NULL, 1, '2025-12-22 00:04:33', '2025-12-22 00:04:33'),
(51, 1, 51, 30.00, NULL, 1, '2025-12-22 00:50:04', '2025-12-22 00:50:04'),
(52, 1, 52, 30.00, NULL, 1, '2025-12-22 00:53:10', '2025-12-22 00:53:10'),
(53, 1, 53, 30.00, NULL, 1, '2025-12-22 02:00:34', '2025-12-22 02:00:34'),
(54, 2, 54, 12.00, NULL, 1, '2025-12-22 02:03:18', '2025-12-22 02:03:18'),
(55, 2, 55, 12.00, NULL, 1, '2025-12-23 00:26:30', '2025-12-23 00:26:30'),
(56, 2, 56, 25.00, NULL, 1, '2025-12-23 00:57:45', '2025-12-23 00:57:45'),
(57, 2, 57, 20.00, NULL, 1, '2025-12-23 01:22:29', '2025-12-23 01:22:29'),
(58, 2, 58, 30.00, NULL, 1, '2025-12-23 01:24:05', '2025-12-23 01:24:05'),
(59, 2, 59, 30.00, NULL, 1, '2025-12-23 03:38:04', '2025-12-23 03:38:04'),
(60, 1, 60, 25.00, NULL, 1, '2025-12-23 21:41:43', '2025-12-23 21:41:43'),
(61, 1, 61, 25.00, NULL, 1, '2025-12-23 21:43:34', '2025-12-23 21:43:34'),
(62, 2, 62, 12.00, NULL, 1, '2025-12-24 02:48:52', '2025-12-24 02:48:52'),
(64, 1, 64, 25.00, NULL, 1, '2025-12-24 03:05:41', '2025-12-24 03:05:41'),
(65, 1, 65, 2.50, NULL, 1, '2025-12-26 23:10:29', '2025-12-26 23:10:29'),
(66, 1, 66, 2.50, NULL, 1, '2025-12-26 23:12:03', '2025-12-26 23:12:03'),
(68, 1, 68, 4.00, NULL, 1, '2025-12-29 03:25:11', '2025-12-29 03:25:11'),
(70, 1, 70, 15.00, NULL, 1, '2026-02-01 20:25:18', '2026-02-01 20:25:18'),
(72, 1, 72, 15.00, NULL, 1, '2026-02-01 20:32:36', '2026-02-01 20:32:36'),
(73, 1, 73, 25.00, NULL, 1, '2026-02-01 21:03:55', '2026-02-01 21:03:55');

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

--
-- Volcado de datos para la tabla `ruta`
--

INSERT INTO `ruta` (`id`, `nombre`, `origen`, `destino`, `distancia_km`, `tiempo_estimado_horas`, `costo_base`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(7, 'Tarjeta video', 'ayacyucgi', 'taicaja', 12.00, 45.00, 333.00, '2025-12-29 04:17:07', '2025-12-29 04:17:07');

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
(1, 1, 1, 'toribio', '123456', 'ACTIVO', '2025-11-20 03:24:26', '2025-12-18 04:37:27'),
(2, 2, 2, 'maria', '12345678', 'ACTIVO', '2025-11-20 03:24:26', '2025-11-21 03:59:31'),
(4, 4, 1, 'tonny123', 'tonnykbro', 'INACTIVO', '2025-11-21 02:15:20', '2025-11-26 16:16:34'),
(5, 5, 1, 'jefferxd', 'pollitoxd', 'ACTIVO', '2025-11-21 02:37:46', '2025-11-21 02:37:46'),
(6, 6, 6, 'toribioxd21', 'nero123', 'ACTIVO', '2025-11-21 03:19:03', '2025-11-21 03:19:03'),
(7, 8, 6, 'calebxd', '12345678', 'ACTIVO', '2025-11-22 04:12:22', '2025-12-02 04:15:54'),
(8, 20, 1, 'tonny', 'admin123', 'ACTIVO', '2025-12-26 23:07:50', '2026-02-01 23:54:28');

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

--
-- Volcado de datos para la tabla `vehiculo`
--

INSERT INTO `vehiculo` (`id`, `placa`, `marca`, `modelo`, `capacidad_kg`, `estado`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, 'aji-849', 'Toyota', 'Hiace', NULL, 'DISPONIBLE', '2025-12-27 23:36:49', '2025-12-27 23:36:49'),
(2, 'AS-7841', 'Toyota', '111', NULL, 'MANTENIMIENTO', '2025-12-27 23:40:02', '2025-12-27 23:40:02'),
(3, 'rot-456', 'Toyota', 'yaris', NULL, 'DISPONIBLE', '2025-12-29 01:34:05', '2025-12-29 01:34:05'),
(8, 'rot-455', 'kiua', 'adda', NULL, 'DISPONIBLE', '2025-12-29 01:34:37', '2025-12-29 01:34:37'),
(9, 'adsas', 'das', 'asdd', 150.00, 'DISPONIBLE', '2026-02-02 00:16:17', '2026-02-02 00:16:17'),
(10, 'AF', 'ASF', 'AS', 1500.00, 'DISPONIBLE', '2026-02-02 02:21:17', '2026-02-02 02:21:17');

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
(8, 2, 1, 1, '2025-12-02 05:07:54', 12.30, 0.00, 2.70, 15.00, 'PENDIENTE', NULL, '2025-12-02 05:07:54', '2025-12-02 05:07:54'),
(9, 2, 1, 1, '2025-12-03 06:08:03', 24.60, 0.00, 5.40, 30.00, 'PENDIENTE', NULL, '2025-12-03 06:08:03', '2025-12-03 06:08:03'),
(10, 2, 1, 1, '2025-12-04 04:54:12', 24.60, 0.00, 5.40, 30.00, 'PENDIENTE', NULL, '2025-12-04 04:54:12', '2025-12-04 04:54:12'),
(11, 3, 1, 1, '2025-12-04 05:14:58', 53.30, 0.00, 11.70, 65.00, 'PENDIENTE', NULL, '2025-12-04 05:14:58', '2025-12-04 05:14:58'),
(12, 12, 1, 1, '2025-12-06 06:45:16', 24.60, 0.00, 5.40, 30.00, 'PENDIENTE', NULL, '2025-12-06 06:45:16', '2025-12-06 06:45:16'),
(13, 13, 5, 1, '2025-12-21 23:08:35', 41.00, 0.00, 9.00, 50.00, 'PENDIENTE', NULL, '2025-12-21 23:08:35', '2025-12-21 23:08:35'),
(14, 13, 5, 1, '2025-12-21 23:09:08', 49.20, 0.00, 10.80, 60.00, 'PENDIENTE', NULL, '2025-12-21 23:09:08', '2025-12-21 23:09:08'),
(15, 2, 5, 1, '2025-12-21 23:15:06', 295.20, 0.00, 64.80, 360.00, 'PENDIENTE', NULL, '2025-12-21 23:15:06', '2025-12-21 23:15:06'),
(16, 13, 5, 1, '2025-12-21 23:37:49', 123.00, 0.00, 27.00, 150.00, 'PENDIENTE', NULL, '2025-12-21 23:37:49', '2025-12-21 23:37:49'),
(17, 13, 5, 1, '2025-12-21 23:38:53', 49.19, 0.00, 10.80, 59.99, 'PENDIENTE', NULL, '2025-12-21 23:38:53', '2025-12-21 23:38:53'),
(18, 13, 5, 1, '2025-12-21 23:39:05', 24.58, 0.00, 5.40, 29.98, 'PENDIENTE', NULL, '2025-12-21 23:39:05', '2025-12-21 23:39:05'),
(19, 13, 5, 1, '2025-12-21 23:53:57', 61.50, 0.00, 13.50, 75.00, 'PENDIENTE', NULL, '2025-12-21 23:53:57', '2025-12-21 23:53:57'),
(20, 13, 5, 1, '2025-12-21 23:58:47', 61.50, 0.00, 13.50, 75.00, 'PENDIENTE', NULL, '2025-12-21 23:58:47', '2025-12-21 23:58:47'),
(21, 2, 5, 1, '2025-12-22 00:00:00', 287.00, 0.00, 63.00, 350.00, 'PENDIENTE', NULL, '2025-12-22 00:00:00', '2025-12-22 00:00:00'),
(22, 13, 5, 1, '2025-12-22 00:59:38', 245.92, 0.00, 53.98, 299.90, 'PENDIENTE', NULL, '2025-12-22 00:59:38', '2025-12-22 00:59:38'),
(23, 13, 5, 1, '2025-12-22 02:00:52', 196.80, 0.00, 43.20, 240.00, 'PENDIENTE', NULL, '2025-12-22 02:00:52', '2025-12-22 02:00:52'),
(24, 2, 5, 1, '2025-12-22 02:01:14', 49.20, 0.00, 10.80, 60.00, 'PENDIENTE', NULL, '2025-12-22 02:01:14', '2025-12-22 02:01:14'),
(25, 13, 5, 1, '2025-12-23 01:25:32', 164.00, 0.00, 36.00, 200.00, 'PENDIENTE', NULL, '2025-12-23 01:25:32', '2025-12-23 01:25:32'),
(26, 2, 5, 1, '2025-12-24 02:36:24', 49.22, 0.00, 10.80, 60.02, 'PENDIENTE', NULL, '2025-12-24 02:36:24', '2025-12-24 02:36:24'),
(27, 2, 5, 1, '2025-12-24 02:36:57', 50.84, 0.00, 11.16, 62.00, 'PENDIENTE', NULL, '2025-12-24 02:36:57', '2025-12-24 02:36:57'),
(28, 2, 5, 1, '2025-12-24 02:38:08', 26.23, 0.00, 5.76, 31.99, 'PENDIENTE', NULL, '2025-12-24 02:38:08', '2025-12-24 02:38:08'),
(29, 13, 5, 1, '2025-12-24 03:07:50', 22.14, 0.00, 4.86, 27.00, 'PENDIENTE', NULL, '2025-12-24 03:07:50', '2025-12-24 03:07:50'),
(30, 2, 8, 1, '2025-12-26 23:13:11', 4.92, 0.00, 1.08, 6.00, 'PENDIENTE', NULL, '2025-12-26 23:13:11', '2025-12-26 23:13:11'),
(31, 2, 8, 1, '2025-12-26 23:50:49', 88.56, 0.00, 19.44, 108.00, 'PENDIENTE', NULL, '2025-12-26 23:50:49', '2025-12-26 23:50:49'),
(32, 13, 8, 1, '2025-12-27 01:05:17', 24.61, 0.00, 5.40, 30.01, 'PENDIENTE', NULL, '2025-12-27 01:05:17', '2025-12-27 01:05:17'),
(33, 2, 8, 1, '2025-12-27 02:24:46', 66.42, 0.00, 14.58, 81.00, 'PENDIENTE', NULL, '2025-12-27 02:24:46', '2025-12-27 02:24:46'),
(34, 13, 8, 1, '2025-12-27 04:55:26', 7.38, 0.00, 1.62, 9.00, 'PENDIENTE', NULL, '2025-12-27 04:55:26', '2025-12-27 04:55:26'),
(35, 13, 8, 1, '2025-12-27 04:55:29', 7.38, 0.00, 1.62, 9.00, 'PENDIENTE', NULL, '2025-12-27 04:55:29', '2025-12-27 04:55:29'),
(36, 13, 8, 1, '2025-12-27 04:55:51', 7.38, 0.00, 1.62, 9.00, 'PENDIENTE', NULL, '2025-12-27 04:55:51', '2025-12-27 04:55:51'),
(37, 13, 8, 1, '2025-12-27 05:01:37', 7.38, 0.00, 1.62, 9.00, 'PENDIENTE', NULL, '2025-12-27 05:01:37', '2025-12-27 05:01:37'),
(38, 13, 8, 1, '2025-12-27 05:03:12', 4.92, 0.00, 1.08, 6.00, 'PENDIENTE', NULL, '2025-12-27 05:03:12', '2025-12-27 05:03:12'),
(39, 13, 8, 1, '2025-12-27 05:03:55', 4.92, 0.00, 1.08, 6.00, 'PENDIENTE', NULL, '2025-12-27 05:03:55', '2025-12-27 05:03:55'),
(40, 13, 8, 1, '2025-12-27 05:04:28', 4.92, 0.00, 1.08, 6.00, 'PENDIENTE', NULL, '2025-12-27 05:04:28', '2025-12-27 05:04:28'),
(41, 13, 8, 1, '2025-12-27 05:05:28', 2.46, 0.00, 0.54, 3.00, 'PENDIENTE', NULL, '2025-12-27 05:05:28', '2025-12-27 05:05:28'),
(42, 13, 8, 1, '2025-12-27 05:19:57', 4.92, 0.00, 1.08, 6.00, 'PENDIENTE', NULL, '2025-12-27 05:19:57', '2025-12-27 05:19:57'),
(43, 13, 8, 1, '2025-12-27 05:24:13', 4.92, 0.00, 1.08, 6.00, 'PENDIENTE', NULL, '2025-12-27 05:24:13', '2025-12-27 05:24:13'),
(44, 13, 8, 1, '2025-12-27 05:29:56', 2.46, 0.00, 0.54, 3.00, 'PENDIENTE', NULL, '2025-12-27 05:29:56', '2025-12-27 05:29:56'),
(45, 13, 8, 1, '2025-12-27 05:41:36', 49.22, 0.00, 10.80, 60.02, 'PENDIENTE', NULL, '2025-12-27 05:41:36', '2025-12-27 05:41:36'),
(46, 13, 8, 1, '2025-12-27 05:55:34', 2.46, 0.00, 0.54, 3.00, 'PENDIENTE', NULL, '2025-12-27 05:55:34', '2025-12-27 05:55:34'),
(47, 2, 8, 1, '2025-12-27 05:56:12', 9.84, 0.00, 2.16, 12.00, 'PENDIENTE', NULL, '2025-12-27 05:56:12', '2025-12-27 05:56:12'),
(48, 13, 8, 1, '2025-12-27 06:04:23', 2.46, 0.00, 0.54, 3.00, 'PENDIENTE', NULL, '2025-12-27 06:04:23', '2025-12-27 06:04:23'),
(49, 13, 8, 1, '2025-12-27 06:14:41', 49.20, 0.00, 10.80, 60.00, 'PENDIENTE', NULL, '2025-12-27 06:14:41', '2025-12-27 06:14:41'),
(50, 12, 8, 1, '2025-12-27 22:35:36', 52.46, 0.00, 11.52, 63.98, 'PENDIENTE', NULL, '2025-12-27 22:35:36', '2025-12-27 22:35:36'),
(51, 2, 8, 1, '2025-12-28 04:45:52', 2.46, 0.00, 0.54, 3.00, 'PENDIENTE', NULL, '2025-12-28 04:45:52', '2025-12-28 04:45:52'),
(52, 12, 8, 1, '2025-12-29 22:51:25', 288.64, 0.00, 63.36, 352.00, 'PENDIENTE', NULL, '2025-12-29 22:51:25', '2025-12-29 22:51:25'),
(53, 2, 8, 1, '2025-12-29 23:40:26', 124.65, 0.00, 27.36, 152.01, 'PENDIENTE', NULL, '2025-12-29 23:40:26', '2025-12-29 23:40:26'),
(54, 2, 8, 1, '2025-12-29 23:42:03', 124.65, 0.00, 27.36, 152.01, 'PENDIENTE', NULL, '2025-12-29 23:42:03', '2025-12-29 23:42:03'),
(55, 12, 8, 1, '2025-12-29 23:54:27', 52.46, 0.00, 11.52, 63.98, 'PENDIENTE', NULL, '2025-12-29 23:54:27', '2025-12-29 23:54:27'),
(56, 12, 8, 1, '2025-12-29 23:56:41', 52.46, 0.00, 11.52, 63.98, 'PENDIENTE', NULL, '2025-12-29 23:56:41', '2025-12-29 23:56:41'),
(57, 12, 8, 1, '2025-12-29 23:57:01', 26.23, 0.00, 5.76, 31.99, 'PENDIENTE', NULL, '2025-12-29 23:57:01', '2025-12-29 23:57:01'),
(58, 12, 8, 1, '2025-12-30 00:01:16', 52.46, 0.00, 11.52, 63.98, 'PENDIENTE', NULL, '2025-12-30 00:01:16', '2025-12-30 00:01:16'),
(59, 14, 8, 1, '2025-12-30 00:52:46', 196.87, 0.00, 43.21, 240.08, 'PENDIENTE', NULL, '2025-12-30 00:52:46', '2025-12-30 00:52:46'),
(60, 12, 8, 1, '2025-12-30 01:36:11', 157.39, 0.00, 34.55, 191.94, 'PENDIENTE', NULL, '2025-12-30 01:36:11', '2025-12-30 01:36:11'),
(61, 17, 8, 1, '2025-12-30 02:57:19', 196.73, 0.00, 43.19, 239.92, 'PENDIENTE', NULL, '2025-12-30 02:57:19', '2025-12-30 02:57:19'),
(62, 12, 8, 1, '2026-02-01 22:26:23', 12.30, 0.00, 2.70, 15.00, 'PENDIENTE', NULL, '2026-02-01 22:26:23', '2026-02-01 22:26:23'),
(63, 17, 8, 1, '2026-02-01 22:27:01', 86.10, 0.00, 18.90, 105.00, 'PENDIENTE', NULL, '2026-02-01 22:27:01', '2026-02-01 22:27:01');

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
  ADD KEY `id_ruta` (`id_ruta`),
  ADD KEY `fk_envio_venta` (`id_venta`);

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
  ADD KEY `idx_pedido_cliente_fecha` (`id_cliente`,`fecha_pedido`),
  ADD KEY `fk_pedido_venta` (`id_venta`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `categoria_producto`
--
ALTER TABLE `categoria_producto`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `cliente`
--
ALTER TABLE `cliente`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `codigo_barras`
--
ALTER TABLE `codigo_barras`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT de la tabla `compra`
--
ALTER TABLE `compra`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT de la tabla `comprobante`
--
ALTER TABLE `comprobante`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `conductor`
--
ALTER TABLE `conductor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `departamento`
--
ALTER TABLE `departamento`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `detalle_compra`
--
ALTER TABLE `detalle_compra`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=76;

--
-- AUTO_INCREMENT de la tabla `devolucion`
--
ALTER TABLE `devolucion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `empleado`
--
ALTER TABLE `empleado`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `envio`
--
ALTER TABLE `envio`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `historial_escaneo`
--
ALTER TABLE `historial_escaneo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `inventario`
--
ALTER TABLE `inventario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=69;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT de la tabla `pago`
--
ALTER TABLE `pago`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pedido`
--
ALTER TABLE `pedido`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `persona`
--
ALTER TABLE `persona`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT de la tabla `producto`
--
ALTER TABLE `producto`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=74;

--
-- AUTO_INCREMENT de la tabla `proveedor`
--
ALTER TABLE `proveedor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `proveedor_producto`
--
ALTER TABLE `proveedor_producto`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=74;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `vehiculo`
--
ALTER TABLE `vehiculo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `venta`
--
ALTER TABLE `venta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

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
  ADD CONSTRAINT `envio_ibfk_4` FOREIGN KEY (`id_ruta`) REFERENCES `ruta` (`id`),
  ADD CONSTRAINT `fk_envio_conductor` FOREIGN KEY (`id_conductor`) REFERENCES `conductor` (`id`),
  ADD CONSTRAINT `fk_envio_ruta` FOREIGN KEY (`id_ruta`) REFERENCES `ruta` (`id`),
  ADD CONSTRAINT `fk_envio_vehiculo` FOREIGN KEY (`id_vehiculo`) REFERENCES `vehiculo` (`id`),
  ADD CONSTRAINT `fk_envio_venta` FOREIGN KEY (`id_venta`) REFERENCES `venta` (`id`);

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
  ADD CONSTRAINT `fk_pedido_venta` FOREIGN KEY (`id_venta`) REFERENCES `venta` (`id`),
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
