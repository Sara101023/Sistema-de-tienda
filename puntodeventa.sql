-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 27-06-2025 a las 07:30:10
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
-- Base de datos: `puntodeventa`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_venta`
--

CREATE TABLE `detalle_venta` (
  `id_detalle_venta` bigint(20) UNSIGNED NOT NULL,
  `id_venta` bigint(20) UNSIGNED NOT NULL,
  `id_producto` bigint(20) UNSIGNED NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  `descuento` decimal(10,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalle_venta`
--

INSERT INTO `detalle_venta` (`id_detalle_venta`, `id_venta`, `id_producto`, `cantidad`, `precio_unitario`, `descuento`) VALUES
(1, 9, 219, 1, 87.82, 0.00),
(2, 10, 219, 1, 87.82, 0.00),
(3, 11, 219, 1, 87.82, 0.00),
(4, 12, 218, 1, 88.38, 0.00),
(5, 13, 213, 1, 84.52, 0.00),
(6, 14, 239, 1, 94.86, 0.00),
(7, 14, 227, 1, 79.33, 0.00),
(8, 15, 219, 1, 87.82, 0.00),
(9, 15, 214, 1, 12.91, 0.00),
(10, 16, 219, 1, 87.82, 0.00),
(11, 16, 214, 2, 12.91, 0.00),
(12, 17, 219, 1, 87.82, 0.00),
(13, 17, 214, 2, 12.91, 0.00),
(14, 17, 215, 1, 43.99, 0.00),
(15, 18, 219, 1, 87.82, 0.00),
(16, 18, 214, 2, 12.91, 0.00),
(17, 18, 215, 1, 43.99, 0.00),
(18, 19, 215, 1, 43.99, 0.00),
(19, 19, 216, 1, 37.50, 0.00),
(20, 20, 219, 1, 87.82, 0.00),
(21, 20, 214, 1, 12.91, 0.00),
(22, 20, 213, 1, 84.52, 0.00),
(23, 20, 217, 1, 29.88, 0.00),
(24, 20, 216, 1, 37.50, 0.00),
(25, 21, 214, 1, 12.91, 0.00),
(26, 22, 215, 1, 43.99, 0.00),
(27, 22, 218, 1, 88.38, 0.00),
(28, 22, 213, 1, 84.52, 0.00),
(29, 22, 216, 1, 37.50, 0.00),
(30, 23, 215, 1, 43.99, 0.00),
(31, 23, 216, 1, 37.50, 0.00),
(32, 23, 214, 1, 12.91, 0.00),
(33, 23, 218, 1, 88.38, 0.00),
(34, 24, 214, 1, 12.91, 0.00),
(35, 24, 213, 1, 84.52, 0.00),
(36, 24, 215, 1, 43.99, 0.00),
(37, 24, 216, 1, 37.50, 0.00),
(38, 25, 215, 1, 43.99, 0.00),
(39, 25, 214, 1, 12.91, 0.00),
(40, 25, 218, 1, 88.38, 0.00),
(41, 25, 219, 1, 87.82, 0.00),
(42, 25, 220, 1, 31.47, 0.00),
(43, 26, 214, 1, 12.91, 0.00),
(44, 26, 215, 1, 43.99, 0.00),
(45, 26, 216, 1, 37.50, 0.00),
(46, 26, 219, 1, 87.82, 0.00),
(47, 26, 218, 1, 88.38, 0.00),
(48, 27, 214, 1, 12.91, 0.00),
(49, 27, 215, 1, 43.99, 0.00),
(50, 27, 216, 1, 37.50, 0.00),
(51, 27, 219, 1, 87.82, 0.00),
(52, 27, 218, 1, 88.38, 0.00),
(53, 28, 214, 1, 12.91, 0.00),
(54, 28, 215, 1, 43.99, 0.00),
(55, 28, 216, 1, 37.50, 0.00),
(56, 28, 219, 1, 87.82, 0.00),
(57, 28, 218, 1, 88.38, 0.00),
(58, 29, 214, 1, 12.91, 0.00),
(59, 29, 218, 1, 88.38, 0.00),
(60, 29, 219, 1, 87.82, 0.00),
(61, 29, 215, 1, 43.99, 0.00),
(62, 29, 216, 1, 37.50, 0.00),
(63, 29, 220, 1, 31.47, 0.00),
(64, 30, 214, 1, 12.91, 0.00),
(65, 30, 218, 1, 88.38, 0.00),
(66, 30, 219, 1, 87.82, 0.00),
(67, 30, 215, 1, 43.99, 0.00),
(68, 30, 216, 1, 37.50, 0.00),
(69, 30, 220, 1, 31.47, 0.00),
(70, 31, 214, 1, 12.91, 0.00),
(71, 31, 215, 1, 43.99, 0.00),
(72, 31, 213, 1, 84.52, 0.00),
(73, 31, 217, 1, 29.88, 0.00),
(74, 31, 218, 1, 88.38, 0.00),
(75, 31, 219, 1, 87.82, 0.00),
(76, 31, 220, 1, 31.47, 0.00),
(77, 32, 213, 1, 84.52, 0.00),
(78, 32, 214, 1, 12.91, 0.00),
(79, 32, 215, 1, 43.99, 0.00),
(80, 32, 219, 1, 87.82, 0.00),
(81, 32, 220, 1, 31.47, 0.00),
(82, 33, 213, 1, 84.52, 0.00),
(83, 33, 217, 1, 29.88, 0.00),
(84, 33, 218, 1, 88.38, 0.00),
(85, 33, 214, 1, 12.91, 0.00),
(86, 33, 215, 1, 43.99, 0.00),
(87, 33, 219, 1, 87.82, 0.00),
(88, 34, 214, 1, 12.91, 0.00),
(89, 34, 213, 1, 84.52, 0.00),
(90, 34, 217, 2, 29.88, 0.00),
(91, 34, 218, 1, 88.38, 0.00),
(92, 34, 219, 1, 87.82, 0.00),
(93, 35, 213, 1, 84.52, 0.00),
(94, 35, 217, 1, 29.88, 0.00),
(95, 35, 218, 1, 88.38, 0.00),
(96, 35, 214, 1, 12.91, 0.00),
(97, 35, 215, 1, 43.99, 0.00),
(98, 35, 220, 1, 31.47, 0.00),
(99, 36, 213, 1, 84.52, 0.00),
(100, 36, 217, 1, 29.88, 0.00),
(101, 36, 218, 1, 88.38, 0.00),
(102, 36, 214, 1, 12.91, 0.00),
(103, 36, 215, 1, 43.99, 0.00),
(104, 36, 219, 1, 87.82, 0.00),
(105, 37, 213, 1, 84.52, 0.00),
(106, 37, 217, 1, 29.88, 0.00),
(107, 37, 218, 1, 88.38, 0.00),
(108, 37, 214, 1, 12.91, 0.00),
(109, 37, 215, 1, 43.99, 0.00),
(110, 37, 219, 1, 87.82, 0.00),
(111, 38, 213, 1, 84.52, 0.00),
(112, 38, 217, 1, 29.88, 0.00),
(113, 38, 218, 1, 88.38, 0.00),
(114, 38, 214, 1, 12.91, 0.00),
(115, 38, 215, 1, 43.99, 0.00),
(116, 38, 219, 1, 87.82, 0.00),
(117, 39, 214, 1, 12.91, 0.00),
(118, 40, 215, 1, 43.99, 0.00),
(119, 41, 215, 1, 43.99, 0.00),
(120, 42, 214, 1, 12.91, 0.00),
(121, 43, 214, 1, 12.91, 0.00),
(122, 43, 213, 1, 84.52, 0.00),
(123, 43, 215, 1, 43.99, 0.00),
(124, 43, 219, 1, 87.82, 0.00),
(125, 44, 383, 1, 85.42, 0.00),
(126, 44, 358, 1, 68.30, 0.00),
(127, 44, 393, 1, 45.72, 0.00),
(128, 44, 340, 1, 22.93, 0.00),
(129, 44, 336, 1, 36.18, 0.00),
(130, 44, 333, 1, 97.50, 0.00),
(131, 44, 289, 1, 58.68, 0.00),
(132, 44, 235, 4, 39.22, 0.00),
(133, 45, 227, 1, 79.33, 0.00),
(134, 45, 239, 2, 94.86, 0.00),
(135, 45, 243, 1, 34.20, 0.00),
(136, 45, 271, 1, 36.87, 0.00),
(137, 45, 258, 1, 38.25, 0.00),
(138, 45, 253, 1, 78.14, 0.00),
(139, 45, 276, 1, 16.45, 0.00),
(140, 45, 304, 1, 68.88, 0.00),
(141, 45, 296, 1, 64.94, 0.00),
(142, 45, 295, 1, 78.25, 0.00),
(143, 45, 293, 1, 51.08, 0.00),
(144, 45, 343, 1, 92.54, 0.00),
(145, 45, 316, 4, 75.98, 0.00),
(146, 45, 403, 2, 18.84, 0.00),
(147, 45, 387, 1, 46.80, 0.00),
(148, 45, 379, 1, 31.77, 0.00),
(149, 45, 352, 1, 66.18, 0.00),
(150, 46, 228, 1, 16.11, 0.00),
(151, 46, 242, 1, 51.38, 0.00),
(152, 46, 244, 1, 22.92, 0.00),
(153, 46, 272, 1, 88.80, 0.00),
(154, 46, 279, 1, 24.15, 0.00),
(155, 46, 292, 1, 12.05, 0.00),
(156, 46, 303, 1, 63.29, 0.00),
(157, 46, 312, 1, 53.50, 0.00),
(158, 46, 398, 10, 59.05, 0.00),
(159, 46, 348, 2, 70.81, 0.00),
(160, 46, 399, 2, 59.55, 0.00),
(161, 47, 220, 1, 31.47, 0.00),
(162, 47, 276, 1, 16.45, 0.00),
(163, 47, 243, 6, 34.20, 0.00),
(164, 48, 213, 3, 84.52, 0.00),
(165, 49, 218, 19, 88.38, 0.00),
(166, 50, 215, 1, 43.99, 0.00),
(167, 50, 214, 1, 12.91, 0.00),
(168, 50, 219, 1, 87.82, 0.00),
(169, 50, 321, 1, 84.34, 0.00),
(170, 50, 315, 1, 77.34, 0.00),
(171, 50, 289, 1, 58.68, 0.00),
(172, 50, 262, 1, 29.09, 0.00),
(173, 51, 217, 5, 29.88, 0.00),
(174, 52, 215, 3, 43.99, 0.00),
(175, 53, 214, 3, 12.91, 0.00),
(176, 54, 214, 3, 12.91, 12.91);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `devolucion`
--

CREATE TABLE `devolucion` (
  `id_devolucion` bigint(20) UNSIGNED NOT NULL,
  `id_venta` int(11) DEFAULT NULL,
  `fecha_devolucion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `motivo` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `metodo_pago`
--

CREATE TABLE `metodo_pago` (
  `id_metodo_pago` bigint(20) UNSIGNED NOT NULL,
  `tipo_pago` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `metodo_pago`
--

INSERT INTO `metodo_pago` (`id_metodo_pago`, `tipo_pago`) VALUES
(1, 'Efectivo'),
(2, 'Tarjeta');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto`
--

CREATE TABLE `producto` (
  `id_producto` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `precio` decimal(10,2) NOT NULL,
  `stock` int(11) NOT NULL,
  `codigo_barras` varchar(150) DEFAULT NULL,
  `id_proveedor` bigint(20) UNSIGNED DEFAULT NULL,
  `estado` enum('activo','inactivo') NOT NULL DEFAULT 'activo',
  `fecha_desactivacion` datetime DEFAULT NULL,
  `categoria` varchar(50) DEFAULT NULL,
  `tiene_iva` tinyint(1) NOT NULL DEFAULT 1 COMMENT '1 = aplica IVA, 0 = no aplica'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `producto`
--

INSERT INTO `producto` (`id_producto`, `nombre`, `descripcion`, `precio`, `stock`, `codigo_barras`, `id_proveedor`, `estado`, `fecha_desactivacion`, `categoria`, `tiene_iva`) VALUES
(213, 'Agua Bonafont 1L ', 'Presentación práctica para el hogar o negocio.', 84.52, 1, '7507182554366', 1, 'activo', NULL, 'Dulces', 1),
(214, 'Pan Bimbo Integral ', 'Aporta energía y nutrientes esenciales.', 12.91, 60, '7505144987029', 1, 'activo', NULL, 'Bebidas', 1),
(215, 'Refresco Coca-Cola 600ml ', 'Producto de alta calidad para el consumo diario.', 43.99, 51, '7506994316884', 3, 'activo', NULL, 'Panadería', 1),
(216, 'Leche Lala Entera 1L #4', 'Producto de alta calidad para el consumo diario.', 37.50, 0, '7507042049886', 5, 'activo', NULL, 'Abarrotes', 1),
(217, 'Yogur Yoplait Fresa 220g ', 'Receta clásica, lista para disfrutar.', 29.88, 125, '7505356304633', 6, 'activo', NULL, 'Abarrotes', 1),
(218, 'Atún Dolores en Agua 140g ', 'Producto de alta calidad para el consumo diario.', 88.38, 0, '7505403159302', 6, 'activo', NULL, 'Cereales', 1),
(219, 'Galletas María Gamesa 170g #7', 'Aporta energía y nutrientes esenciales.', 87.82, 36, '7504082714404', 7, 'activo', NULL, 'Carnes', 1),
(220, 'Chiles La Costeña 220g #8', 'Producto líder en su categoría.', 31.47, 139, '7506905747396', 6, 'activo', NULL, 'Cereales', 1),
(221, 'Queso Panela Lala 200g #9', 'Sabor auténtico, hecho en México.', 53.14, 107, '7501143983881', 8, 'activo', NULL, 'Botanas', 1),
(222, 'Frijoles Refritos La Sierra 430g #10', 'Producto de alta calidad para el consumo diario.', 46.34, 58, '7501705925280', 2, 'activo', NULL, 'Limpieza', 1),
(223, 'Sopa Maruchan Pollo #11', 'Sabor auténtico, hecho en México.', 25.16, 42, '7501478485184', 2, 'activo', NULL, 'Carnes', 1),
(224, 'Jugo Jumex Mango 1L #12', 'Fácil de preparar y perfecto para cualquier ocasión.', 72.78, 11, '7501551607002', 1, 'activo', NULL, 'Dulces', 1),
(225, 'Mayonesa McCormick 390g #13', 'Receta clásica, lista para disfrutar.', 25.75, 86, '7501278831758', 4, 'activo', NULL, 'Carnes', 1),
(226, 'Detergente Ariel 750g #14', 'Empaque económico y duradero.', 90.71, 34, '7507279459468', 7, 'activo', NULL, 'Carnes', 1),
(227, 'Cloro Cloralex 950ml #15', 'Fácil de preparar y perfecto para cualquier ocasión.', 79.33, 23, '7509760254988', 10, 'activo', NULL, 'Bebidas', 1),
(228, 'Aceite Nutrioli 850ml #16', 'Ideal para toda la familia, sabor tradicional.', 16.11, 11, '7508079152098', 10, 'activo', NULL, 'Botanas', 1),
(229, 'Papel Higiénico Regio 4 rollos #17', 'Ideal para toda la familia, sabor tradicional.', 18.88, 47, '7504827702295', 6, 'activo', NULL, 'Panadería', 1),
(230, 'Cereal Zucaritas 500g #18', 'Empaque económico y duradero.', 59.23, 10, '7508515948113', 6, 'activo', NULL, 'Dulces', 1),
(231, 'Café Nescafé Clásico 100g #19', 'Sabor auténtico, hecho en México.', 76.11, 71, '7501409349603', 2, 'activo', NULL, 'Abarrotes', 1),
(232, 'Salchichas Fud 500g #20', 'Sabor auténtico, hecho en México.', 49.46, 55, '7503975174780', 4, 'activo', NULL, 'Abarrotes', 1),
(233, 'Tortillas Tía Rosa 10pz #21', 'Ideal para toda la familia, sabor tradicional.', 68.13, 42, '7502185376854', 4, 'activo', NULL, 'Dulces', 1),
(234, 'Dulces Pelón Pelo Rico #22', 'Sabor auténtico, hecho en México.', 23.23, 101, '7506972071629', 8, 'activo', NULL, 'Lácteos', 1),
(235, 'Chocolate Abuelita Tabletas #23', 'Producto de alta calidad para el consumo diario.', 39.22, 117, '7509009419080', 9, 'activo', NULL, 'Panadería', 1),
(236, 'Shampoo Sedal 400ml #24', 'Empaque económico y duradero.', 91.24, 146, '7502810998055', 2, 'activo', NULL, 'Carnes', 1),
(237, 'Crema Corporal Nivea 200ml #25', 'Presentación práctica para el hogar o negocio.', 34.49, 13, '7503946772168', 10, 'activo', NULL, 'Enlatados', 1),
(238, 'Refresco Pepsi 600ml #26', 'Empaque económico y duradero.', 63.70, 60, '7506275201609', 5, 'activo', NULL, 'Abarrotes', 1),
(239, 'Pan Molido Bimbo 200g #27', 'Ingrediente esencial en la despensa mexicana.', 94.86, 103, '7507924911447', 9, 'activo', NULL, 'Bebidas', 1),
(240, 'Sardinas La Costeña 425g #28', 'Ideal para toda la familia, sabor tradicional.', 74.25, 74, '7503834642578', 9, 'activo', NULL, 'Enlatados', 1),
(241, 'Té Lipton Durazno 500ml #29', 'Aporta energía y nutrientes esenciales.', 71.55, 51, '7502573937939', 3, 'activo', NULL, 'Carnes', 1),
(242, 'Galletas Oreo 132g #30', 'Producto de alta calidad para el consumo diario.', 51.38, 100, '7501413887371', 10, 'activo', NULL, 'Botanas', 1),
(243, 'Gansito Marinela 50g #31', 'Producto de alta calidad para el consumo diario.', 34.20, 90, '7504621585695', 10, 'activo', NULL, 'Bebidas', 1),
(244, 'Choco Krispis Kellogg’s 500g #32', 'Ingrediente esencial en la despensa mexicana.', 22.92, 29, '7504139271293', 6, 'activo', NULL, 'Botanas', 1),
(245, 'Cacahuates Mafer 100g #33', 'Fácil de preparar y perfecto para cualquier ocasión.', 57.36, 100, '7506568407900', 1, 'activo', NULL, 'Cereales', 1),
(246, 'Jamón Virginia Fud 250g #34', 'Producto líder en su categoría.', 29.04, 128, '7509322981668', 2, 'activo', NULL, 'Dulces', 1),
(247, 'Chiles Chipotles La Morena #35', 'Receta clásica, lista para disfrutar.', 83.12, 123, '7502794842949', 8, 'activo', NULL, 'Panadería', 1),
(248, 'Detergente Roma 1kg #36', 'Aporta energía y nutrientes esenciales.', 59.66, 59, '7507851210862', 2, 'activo', NULL, 'Carnes', 1),
(249, 'Helado Holanda Napolitano #37', 'Fácil de preparar y perfecto para cualquier ocasión.', 85.68, 138, '7505377899682', 10, 'activo', NULL, 'Enlatados', 1),
(250, 'Refresco 7Up 600ml #38', 'Fácil de preparar y perfecto para cualquier ocasión.', 59.29, 128, '7505173186544', 1, 'activo', NULL, 'Lácteos', 1),
(251, 'Queso Amarillo Kraft 300g #39', 'Sabor auténtico, hecho en México.', 79.43, 73, '7506885490809', 1, 'activo', NULL, 'Enlatados', 1),
(252, 'Agua Ciel 1.5L #40', 'Aporta energía y nutrientes esenciales.', 68.93, 50, '7504517160561', 2, 'activo', NULL, 'Dulces', 1),
(253, 'Salsa Valentina 370ml #41', 'Producto líder en su categoría.', 78.14, 39, '7509967784687', 9, 'activo', NULL, 'Bebidas', 1),
(254, 'Churrumais 50g #42', 'Producto de alta calidad para el consumo diario.', 10.01, 86, '7505586170610', 8, 'activo', NULL, 'Enlatados', 1),
(255, 'Pan Blanco Bimbo 680g #43', 'Empaque económico y duradero.', 92.06, 25, '7502864159229', 9, 'activo', NULL, 'Limpieza', 1),
(256, 'Agua Bonafont 1L #44', 'Fácil de preparar y perfecto para cualquier ocasión.', 65.29, 110, '7509113665446', 1, 'activo', NULL, 'Dulces', 1),
(257, 'Pan Bimbo Integral #45', 'Aporta energía y nutrientes esenciales.', 40.50, 102, '7508070801334', 3, 'activo', NULL, 'Limpieza', 1),
(258, 'Refresco Coca-Cola 600ml #46', 'Ingrediente esencial en la despensa mexicana.', 38.25, 81, '7501117336803', 2, 'activo', NULL, 'Bebidas', 1),
(259, 'Leche Lala Entera 1L #47', 'Presentación práctica para el hogar o negocio.', 20.37, 57, '7508202495450', 4, 'activo', NULL, 'Panadería', 1),
(260, 'Yogur Yoplait Fresa 220g #48', 'Empaque económico y duradero.', 15.55, 112, '7503088296469', 10, 'activo', NULL, 'Panadería', 1),
(261, 'Atún Dolores en Agua 140g #49', 'Aporta energía y nutrientes esenciales.', 41.58, 74, '7509304136850', 10, 'activo', NULL, 'Carnes', 1),
(262, 'Galletas María Gamesa 170g #50', 'Receta clásica, lista para disfrutar.', 29.09, 137, '7507446972127', 9, 'activo', NULL, 'Abarrotes', 1),
(263, 'Chiles La Costeña 220g #51', 'Aporta energía y nutrientes esenciales.', 16.76, 121, '7501261680658', 6, 'activo', NULL, 'Cereales', 1),
(264, 'Queso Panela Lala 200g #52', 'Ideal para toda la familia, sabor tradicional.', 49.73, 71, '7505967242984', 5, 'activo', NULL, 'Panadería', 1),
(265, 'Frijoles Refritos La Sierra 430g #53', 'Receta clásica, lista para disfrutar.', 90.26, 97, '7502410947435', 10, 'activo', NULL, 'Carnes', 1),
(266, 'Sopa Maruchan Pollo #54', 'Sabor auténtico, hecho en México.', 85.26, 48, '7506686706230', 5, 'activo', NULL, 'Botanas', 1),
(267, 'Jugo Jumex Mango 1L #55', 'Presentación práctica para el hogar o negocio.', 37.95, 27, '7501416999620', 3, 'activo', NULL, 'Botanas', 1),
(268, 'Mayonesa McCormick 390g #56', 'Producto de alta calidad para el consumo diario.', 99.97, 94, '7503608479765', 4, 'activo', NULL, 'Lácteos', 1),
(269, 'Detergente Ariel 750g #57', 'Presentación práctica para el hogar o negocio.', 34.20, 133, '7505239463716', 4, 'activo', NULL, 'Enlatados', 1),
(270, 'Cloro Cloralex 950ml #58', 'Ingrediente esencial en la despensa mexicana.', 42.39, 121, '7501420253470', 1, 'activo', NULL, 'Dulces', 1),
(271, 'Aceite Nutrioli 850ml #59', 'Producto líder en su categoría.', 36.87, 15, '7509665961440', 3, 'activo', NULL, 'Bebidas', 1),
(272, 'Papel Higiénico Regio 4 rollos #60', 'Receta clásica, lista para disfrutar.', 88.80, 143, '7502741891730', 9, 'activo', NULL, 'Botanas', 1),
(273, 'Cereal Zucaritas 500g #61', 'Aporta energía y nutrientes esenciales.', 44.56, 85, '7502840788377', 6, 'activo', NULL, 'Dulces', 1),
(274, 'Café Nescafé Clásico 100g #62', 'Producto líder en su categoría.', 67.50, 99, '7504464709896', 8, 'activo', NULL, 'Lácteos', 1),
(275, 'Salchichas Fud 500g #63', 'Aporta energía y nutrientes esenciales.', 99.73, 92, '7508106217548', 5, 'activo', NULL, 'Panadería', 1),
(276, 'Tortillas Tía Rosa 10pz #64', 'Ingrediente esencial en la despensa mexicana.', 16.45, 60, '7507813671304', 6, 'activo', NULL, 'Bebidas', 1),
(277, 'Dulces Pelón Pelo Rico #65', 'Empaque económico y duradero.', 58.49, 56, '7504980732728', 6, 'activo', NULL, 'Botanas', 1),
(278, 'Chocolate Abuelita Tabletas #66', 'Producto líder en su categoría.', 41.12, 143, '7502161058353', 3, 'activo', NULL, 'Abarrotes', 1),
(279, 'Shampoo Sedal 400ml #67', 'Aporta energía y nutrientes esenciales.', 24.15, 76, '7501233650139', 3, 'activo', NULL, 'Botanas', 1),
(280, 'Crema Corporal Nivea 200ml #68', 'Producto de alta calidad para el consumo diario.', 66.57, 102, '7507866620891', 8, 'activo', NULL, 'Enlatados', 1),
(281, 'Refresco Pepsi 600ml #69', 'Producto líder en su categoría.', 76.34, 139, '7505603761218', 9, 'activo', NULL, 'Carnes', 1),
(282, 'Pan Molido Bimbo 200g #70', 'Producto de alta calidad para el consumo diario.', 76.63, 99, '7508871208418', 9, 'activo', NULL, 'Lácteos', 1),
(283, 'Sardinas La Costeña 425g #71', 'Receta clásica, lista para disfrutar.', 54.98, 30, '7505605233702', 9, 'activo', NULL, 'Dulces', 1),
(284, 'Té Lipton Durazno 500ml #72', 'Sabor auténtico, hecho en México.', 32.37, 49, '7507398582212', 10, 'activo', NULL, 'Dulces', 1),
(285, 'Galletas Oreo 132g #73', 'Aporta energía y nutrientes esenciales.', 84.67, 44, '7509446396183', 1, 'activo', NULL, 'Dulces', 1),
(286, 'Gansito Marinela 50g #74', 'Producto líder en su categoría.', 20.64, 133, '7505688532652', 10, 'activo', NULL, 'Dulces', 1),
(287, 'Choco Krispis Kellogg’s 500g #75', 'Presentación práctica para el hogar o negocio.', 46.18, 18, '7501595682907', 3, 'activo', NULL, 'Carnes', 1),
(288, 'Cacahuates Mafer 100g #76', 'Producto de alta calidad para el consumo diario.', 90.34, 49, '7503922744658', 4, 'activo', NULL, 'Cereales', 1),
(289, 'Jamón Virginia Fud 250g #77', 'Ingrediente esencial en la despensa mexicana.', 58.68, 123, '7501670036745', 10, 'activo', NULL, 'Abarrotes', 1),
(290, 'Chiles Chipotles La Morena #78', 'Receta clásica, lista para disfrutar.', 35.15, 86, '7504043026880', 10, 'activo', NULL, 'Limpieza', 1),
(291, 'Detergente Roma 1kg #79', 'Producto de alta calidad para el consumo diario.', 86.52, 86, '7504260745937', 6, 'activo', NULL, 'Dulces', 1),
(292, 'Helado Holanda Napolitano #80', 'Presentación práctica para el hogar o negocio.', 12.05, 67, '7506229519626', 7, 'activo', NULL, 'Botanas', 1),
(293, 'Refresco 7Up 600ml #81', 'Producto líder en su categoría.', 51.08, 134, '7506572603221', 9, 'activo', NULL, 'Bebidas', 1),
(294, 'Queso Amarillo Kraft 300g #82', 'Producto de alta calidad para el consumo diario.', 66.07, 18, '7501538300158', 6, 'activo', NULL, 'Limpieza', 1),
(295, 'Agua Ciel 1.5L #83', 'Sabor auténtico, hecho en México.', 78.25, 49, '7507246906282', 10, 'activo', NULL, 'Bebidas', 1),
(296, 'Salsa Valentina 370ml #84', 'Ingrediente esencial en la despensa mexicana.', 64.94, 126, '7504670720352', 2, 'activo', NULL, 'Bebidas', 1),
(297, 'Churrumais 50g #85', 'Aporta energía y nutrientes esenciales.', 38.57, 23, '7506885804682', 4, 'activo', NULL, 'Lácteos', 1),
(298, 'Pan Blanco Bimbo 680g #86', 'Receta clásica, lista para disfrutar.', 31.01, 132, '7504527965385', 1, 'activo', NULL, 'Dulces', 1),
(299, 'Agua Bonafont 1L #87', 'Producto de alta calidad para el consumo diario.', 66.21, 134, '7502547401979', 10, 'activo', NULL, 'Dulces', 1),
(300, 'Pan Bimbo Integral #88', 'Empaque económico y duradero.', 12.12, 22, '7504372981695', 4, 'activo', NULL, 'Limpieza', 1),
(301, 'Refresco Coca-Cola 600ml #89', 'Fácil de preparar y perfecto para cualquier ocasión.', 94.40, 55, '7501909709897', 2, 'activo', NULL, 'Dulces', 1),
(302, 'Leche Lala Entera 1L #90', 'Fácil de preparar y perfecto para cualquier ocasión.', 24.10, 33, '7507216673831', 7, 'activo', NULL, 'Cereales', 1),
(303, 'Yogur Yoplait Fresa 220g #91', 'Ingrediente esencial en la despensa mexicana.', 63.29, 126, '7506714102769', 6, 'activo', NULL, 'Botanas', 1),
(304, 'Atún Dolores en Agua 140g #92', 'Producto de alta calidad para el consumo diario.', 68.88, 52, '7505990864849', 1, 'activo', NULL, 'Bebidas', 1),
(305, 'Galletas María Gamesa 170g #93', 'Receta clásica, lista para disfrutar.', 18.08, 75, '7503043714051', 4, 'activo', NULL, 'Lácteos', 1),
(306, 'Chiles La Costeña 220g #94', 'Fácil de preparar y perfecto para cualquier ocasión.', 32.86, 145, '7508605941937', 5, 'activo', NULL, 'Lácteos', 1),
(307, 'Queso Panela Lala 200g #95', 'Presentación práctica para el hogar o negocio.', 86.05, 141, '7505042951263', 3, 'activo', NULL, 'Enlatados', 1),
(308, 'Frijoles Refritos La Sierra 430g #96', 'Receta clásica, lista para disfrutar.', 28.60, 50, '7502197207063', 8, 'activo', NULL, 'Limpieza', 1),
(309, 'Sopa Maruchan Pollo #97', 'Fácil de preparar y perfecto para cualquier ocasión.', 35.10, 82, '7508830313869', 2, 'activo', NULL, 'Enlatados', 1),
(310, 'Jugo Jumex Mango 1L #98', 'Ideal para toda la familia, sabor tradicional.', 75.12, 48, '7501206692324', 9, 'activo', NULL, 'Enlatados', 1),
(311, 'Mayonesa McCormick 390g #99', 'Fácil de preparar y perfecto para cualquier ocasión.', 18.99, 58, '7508040601024', 10, 'activo', NULL, 'Bebidas', 1),
(312, 'Detergente Ariel 750g #100', 'Sabor auténtico, hecho en México.', 53.50, 78, '7503658423148', 5, 'activo', NULL, 'Botanas', 1),
(313, 'Cloro Cloralex 950ml #101', 'Empaque económico y duradero.', 76.38, 12, '7506638671219', 6, 'activo', NULL, 'Abarrotes', 1),
(314, 'Aceite Nutrioli 850ml #102', 'Ingrediente esencial en la despensa mexicana.', 42.48, 60, '7504057281438', 9, 'activo', NULL, 'Panadería', 1),
(315, 'Papel Higiénico Regio 4 rollos #103', 'Producto líder en su categoría.', 77.34, 110, '7507472444107', 2, 'activo', NULL, 'Abarrotes', 1),
(316, 'Cereal Zucaritas 500g #104', 'Receta clásica, lista para disfrutar.', 75.98, 37, '7501028774157', 10, 'activo', NULL, 'Bebidas', 1),
(317, 'Café Nescafé Clásico 100g #105', 'Producto de alta calidad para el consumo diario.', 63.73, 116, '7505501790946', 6, 'activo', NULL, 'Limpieza', 1),
(318, 'Salchichas Fud 500g #106', 'Fácil de preparar y perfecto para cualquier ocasión.', 67.70, 123, '7506087869954', 4, 'activo', NULL, 'Dulces', 1),
(319, 'Tortillas Tía Rosa 10pz #107', 'Producto de alta calidad para el consumo diario.', 43.93, 88, '7503003002396', 8, 'activo', NULL, 'Botanas', 1),
(320, 'Dulces Pelón Pelo Rico #108', 'Sabor auténtico, hecho en México.', 56.20, 149, '7504428037694', 9, 'activo', NULL, 'Bebidas', 1),
(321, 'Chocolate Abuelita Tabletas #109', 'Receta clásica, lista para disfrutar.', 84.34, 60, '7509986881748', 10, 'activo', NULL, 'Abarrotes', 1),
(322, 'Shampoo Sedal 400ml #110', 'Aporta energía y nutrientes esenciales.', 33.38, 107, '7502421899523', 10, 'activo', NULL, 'Panadería', 1),
(323, 'Crema Corporal Nivea 200ml #111', 'Producto líder en su categoría.', 59.27, 84, '7501565099328', 2, 'activo', NULL, 'Dulces', 1),
(324, 'Refresco Pepsi 600ml #112', 'Aporta energía y nutrientes esenciales.', 16.06, 106, '7502438702669', 3, 'activo', NULL, 'Carnes', 1),
(325, 'Pan Molido Bimbo 200g #113', 'Empaque económico y duradero.', 28.16, 148, '7503287877853', 1, 'activo', NULL, 'Carnes', 1),
(326, 'Sardinas La Costeña 425g #114', 'Aporta energía y nutrientes esenciales.', 66.80, 12, '7501467293749', 6, 'activo', NULL, 'Limpieza', 1),
(327, 'Té Lipton Durazno 500ml #115', 'Producto líder en su categoría.', 63.09, 80, '7505835033196', 6, 'activo', NULL, 'Limpieza', 1),
(328, 'Galletas Oreo 132g #116', 'Empaque económico y duradero.', 82.81, 53, '7501578232095', 7, 'activo', NULL, 'Panadería', 1),
(329, 'Gansito Marinela 50g #117', 'Producto de alta calidad para el consumo diario.', 55.93, 150, '7502805421854', 1, 'activo', NULL, 'Abarrotes', 1),
(330, 'Choco Krispis Kellogg’s 500g #118', 'Ideal para toda la familia, sabor tradicional.', 83.11, 39, '7501872957315', 5, 'activo', NULL, 'Carnes', 1),
(331, 'Cacahuates Mafer 100g #119', 'Ideal para toda la familia, sabor tradicional.', 92.10, 40, '7506819088099', 6, 'activo', NULL, 'Bebidas', 1),
(332, 'Jamón Virginia Fud 250g #120', 'Empaque económico y duradero.', 24.59, 37, '7506369045951', 8, 'activo', NULL, 'Panadería', 1),
(333, 'Chiles Chipotles La Morena #121', 'Presentación práctica para el hogar o negocio.', 97.50, 102, '7503298299982', 3, 'activo', NULL, 'Abarrotes', 1),
(334, 'Detergente Roma 1kg #122', 'Fácil de preparar y perfecto para cualquier ocasión.', 49.81, 36, '7507040838527', 4, 'activo', NULL, 'Bebidas', 1),
(335, 'Helado Holanda Napolitano #123', 'Fácil de preparar y perfecto para cualquier ocasión.', 16.83, 42, '7502959681368', 2, 'activo', NULL, 'Enlatados', 1),
(336, 'Refresco 7Up 600ml #124', 'Empaque económico y duradero.', 36.18, 55, '7509925507209', 2, 'activo', NULL, 'Abarrotes', 1),
(337, 'Queso Amarillo Kraft 300g #125', 'Receta clásica, lista para disfrutar.', 76.12, 44, '7504459646251', 9, 'activo', NULL, 'Botanas', 1),
(338, 'Agua Ciel 1.5L #126', 'Presentación práctica para el hogar o negocio.', 50.66, 136, '7505885807897', 8, 'activo', NULL, 'Cereales', 1),
(339, 'Salsa Valentina 370ml #127', 'Receta clásica, lista para disfrutar.', 49.03, 88, '7503650754723', 3, 'activo', NULL, 'Cereales', 1),
(340, 'Churrumais 50g #128', 'Empaque económico y duradero.', 22.93, 59, '7509645580928', 2, 'activo', NULL, 'Abarrotes', 1),
(341, 'Pan Blanco Bimbo 680g #129', 'Receta clásica, lista para disfrutar.', 67.57, 72, '7505958487195', 1, 'activo', NULL, 'Limpieza', 1),
(342, 'Agua Bonafont 1L #130', 'Producto líder en su categoría.', 32.84, 106, '7505972790642', 10, 'activo', NULL, 'Botanas', 1),
(343, 'Pan Bimbo Integral #131', 'Producto de alta calidad para el consumo diario.', 92.54, 12, '7508266035522', 5, 'activo', NULL, 'Bebidas', 1),
(344, 'Refresco Coca-Cola 600ml #132', 'Receta clásica, lista para disfrutar.', 10.99, 81, '7502367362328', 3, 'activo', NULL, 'Cereales', 1),
(345, 'Leche Lala Entera 1L #133', 'Ingrediente esencial en la despensa mexicana.', 56.13, 10, '7508737603704', 8, 'activo', NULL, 'Botanas', 1),
(346, 'Yogur Yoplait Fresa 220g #134', 'Receta clásica, lista para disfrutar.', 61.32, 147, '7501502006301', 5, 'activo', NULL, 'Bebidas', 1),
(347, 'Atún Dolores en Agua 140g #135', 'Empaque económico y duradero.', 95.75, 133, '7508769104302', 4, 'activo', NULL, 'Panadería', 1),
(348, 'Galletas María Gamesa 170g #136', 'Empaque económico y duradero.', 70.81, 10, '7508882435223', 2, 'activo', NULL, 'Botanas', 1),
(349, 'Chiles La Costeña 220g #137', 'Receta clásica, lista para disfrutar.', 25.81, 57, '7505594133387', 9, 'activo', NULL, 'Carnes', 1),
(350, 'Queso Panela Lala 200g #138', 'Fácil de preparar y perfecto para cualquier ocasión.', 51.91, 37, '7504562550823', 6, 'activo', NULL, 'Bebidas', 1),
(351, 'Frijoles Refritos La Sierra 430g #139', 'Ingrediente esencial en la despensa mexicana.', 59.37, 52, '7502585899188', 6, 'activo', NULL, 'Carnes', 1),
(352, 'Sopa Maruchan Pollo #140', 'Receta clásica, lista para disfrutar.', 66.18, 22, '7501265881564', 7, 'activo', NULL, 'Bebidas', 1),
(353, 'Jugo Jumex Mango 1L #141', 'Fácil de preparar y perfecto para cualquier ocasión.', 92.59, 106, '7507757300138', 9, 'activo', NULL, 'Dulces', 1),
(354, 'Mayonesa McCormick 390g #142', 'Empaque económico y duradero.', 89.70, 143, '7509627599576', 1, 'activo', NULL, 'Abarrotes', 1),
(355, 'Detergente Ariel 750g #143', 'Producto de alta calidad para el consumo diario.', 50.55, 19, '7507342132757', 1, 'activo', NULL, 'Dulces', 1),
(356, 'Cloro Cloralex 950ml #144', 'Aporta energía y nutrientes esenciales.', 15.88, 38, '7501596554357', 6, 'activo', NULL, 'Limpieza', 1),
(357, 'Aceite Nutrioli 850ml #145', 'Presentación práctica para el hogar o negocio.', 90.46, 145, '7509694878271', 4, 'activo', NULL, 'Dulces', 1),
(358, 'Papel Higiénico Regio 4 rollos #146', 'Ingrediente esencial en la despensa mexicana.', 68.30, 94, '7505483586860', 3, 'activo', NULL, 'Abarrotes', 1),
(359, 'Cereal Zucaritas 500g #147', 'Empaque económico y duradero.', 46.28, 129, '7504162694604', 7, 'activo', NULL, 'Enlatados', 1),
(360, 'Café Nescafé Clásico 100g #148', 'Empaque económico y duradero.', 28.13, 112, '7506682127418', 10, 'activo', NULL, 'Panadería', 1),
(361, 'Salchichas Fud 500g #149', 'Presentación práctica para el hogar o negocio.', 72.95, 95, '7504709008454', 4, 'activo', NULL, 'Abarrotes', 1),
(362, 'Tortillas Tía Rosa 10pz #150', 'Sabor auténtico, hecho en México.', 34.69, 113, '7508068074499', 6, 'activo', NULL, 'Dulces', 1),
(363, 'Dulces Pelón Pelo Rico #151', 'Ideal para toda la familia, sabor tradicional.', 62.58, 12, '7505237468031', 7, 'activo', NULL, 'Lácteos', 1),
(364, 'Chocolate Abuelita Tabletas #152', 'Aporta energía y nutrientes esenciales.', 74.59, 48, '7503880344986', 2, 'activo', NULL, 'Enlatados', 1),
(365, 'Shampoo Sedal 400ml #153', 'Aporta energía y nutrientes esenciales.', 42.53, 32, '7509761044128', 8, 'activo', NULL, 'Enlatados', 1),
(366, 'Crema Corporal Nivea 200ml #154', 'Producto líder en su categoría.', 98.65, 78, '7505534417584', 7, 'activo', NULL, 'Dulces', 1),
(367, 'Refresco Pepsi 600ml #155', 'Fácil de preparar y perfecto para cualquier ocasión.', 91.87, 82, '7506202554301', 9, 'activo', NULL, 'Dulces', 1),
(368, 'Pan Molido Bimbo 200g #156', 'Empaque económico y duradero.', 89.32, 131, '7501736746058', 8, 'activo', NULL, 'Limpieza', 1),
(369, 'Sardinas La Costeña 425g #157', 'Presentación práctica para el hogar o negocio.', 77.40, 59, '7509875813766', 7, 'activo', NULL, 'Dulces', 1),
(370, 'Té Lipton Durazno 500ml #158', 'Presentación práctica para el hogar o negocio.', 59.50, 59, '7505617755171', 6, 'activo', NULL, 'Bebidas', 1),
(371, 'Galletas Oreo 132g #159', 'Fácil de preparar y perfecto para cualquier ocasión.', 22.56, 70, '7506577220737', 4, 'activo', NULL, 'Limpieza', 1),
(372, 'Gansito Marinela 50g #160', 'Presentación práctica para el hogar o negocio.', 30.14, 24, '7501019129932', 10, 'activo', NULL, 'Dulces', 1),
(373, 'Choco Krispis Kellogg’s 500g #161', 'Receta clásica, lista para disfrutar.', 98.12, 97, '7506783189190', 7, 'activo', NULL, 'Dulces', 1),
(374, 'Cacahuates Mafer 100g #162', 'Receta clásica, lista para disfrutar.', 22.98, 82, '7502582196865', 5, 'activo', NULL, 'Limpieza', 1),
(375, 'Jamón Virginia Fud 250g #163', 'Sabor auténtico, hecho en México.', 23.78, 50, '7506407676867', 3, 'activo', NULL, 'Cereales', 1),
(376, 'Chiles Chipotles La Morena #164', 'Ideal para toda la familia, sabor tradicional.', 23.44, 35, '7503171115279', 1, 'activo', NULL, 'Cereales', 1),
(377, 'Detergente Roma 1kg #165', 'Sabor auténtico, hecho en México.', 35.93, 22, '7506264037751', 1, 'activo', NULL, 'Bebidas', 1),
(378, 'Helado Holanda Napolitano #166', 'Ingrediente esencial en la despensa mexicana.', 95.22, 48, '7508803841962', 7, 'activo', NULL, 'Bebidas', 1),
(379, 'Refresco 7Up 600ml #167', 'Aporta energía y nutrientes esenciales.', 31.77, 106, '7505140534636', 4, 'activo', NULL, 'Bebidas', 1),
(380, 'Queso Amarillo Kraft 300g #168', 'Ingrediente esencial en la despensa mexicana.', 84.57, 17, '7506512056406', 2, 'activo', NULL, 'Botanas', 1),
(381, 'Agua Ciel 1.5L #169', 'Fácil de preparar y perfecto para cualquier ocasión.', 42.62, 104, '7506204005015', 7, 'activo', NULL, 'Cereales', 1),
(382, 'Salsa Valentina 370ml #170', 'Sabor auténtico, hecho en México.', 66.92, 76, '7508240670365', 1, 'activo', NULL, 'Enlatados', 1),
(383, 'Churrumais 50g #171', 'Empaque económico y duradero.', 85.42, 129, '7503666519190', 7, 'activo', NULL, 'Abarrotes', 1),
(384, 'Pan Blanco Bimbo 680g #172', 'Producto de alta calidad para el consumo diario.', 50.35, 90, '7507278530415', 8, 'activo', NULL, 'Dulces', 1),
(385, 'Agua Bonafont 1L #173', 'Sabor auténtico, hecho en México.', 93.84, 64, '7504310274951', 7, 'activo', NULL, 'Carnes', 1),
(386, 'Pan Bimbo Integral #174', 'Ingrediente esencial en la despensa mexicana.', 59.15, 118, '7505164145696', 5, 'activo', NULL, 'Cereales', 1),
(387, 'Refresco Coca-Cola 600ml #175', 'Presentación práctica para el hogar o negocio.', 46.80, 56, '7504956528764', 1, 'activo', NULL, 'Bebidas', 1),
(388, 'Leche Lala Entera 1L #176', 'Fácil de preparar y perfecto para cualquier ocasión.', 86.38, 61, '7505883524497', 4, 'activo', NULL, 'Carnes', 1),
(389, 'Yogur Yoplait Fresa 220g #177', 'Ingrediente esencial en la despensa mexicana.', 64.15, 82, '7505373235849', 2, 'activo', NULL, 'Lácteos', 1),
(390, 'Atún Dolores en Agua 140g #178', 'Producto líder en su categoría.', 58.71, 58, '7501862166849', 3, 'activo', NULL, 'Limpieza', 1),
(391, 'Galletas María Gamesa 170g #179', 'Aporta energía y nutrientes esenciales.', 97.22, 47, '7503897848535', 3, 'activo', NULL, 'Enlatados', 1),
(392, 'Chiles La Costeña 220g #180', 'Fácil de preparar y perfecto para cualquier ocasión.', 29.77, 10, '7507956982935', 5, 'activo', NULL, 'Limpieza', 1),
(393, 'Queso Panela Lala 200g #181', 'Fácil de preparar y perfecto para cualquier ocasión.', 45.72, 119, '7503635603486', 1, 'activo', NULL, 'Abarrotes', 1),
(394, 'Frijoles Refritos La Sierra 430g #182', 'Presentación práctica para el hogar o negocio.', 94.49, 140, '7503615654346', 4, 'activo', NULL, 'Enlatados', 1),
(395, 'Sopa Maruchan Pollo #183', 'Sabor auténtico, hecho en México.', 69.91, 130, '7501093429290', 2, 'activo', NULL, 'Enlatados', 1),
(396, 'Jugo Jumex Mango 1L #184', 'Ideal para toda la familia, sabor tradicional.', 91.97, 38, '7503074253978', 8, 'activo', NULL, 'Dulces', 1),
(397, 'Mayonesa McCormick 390g #185', 'Fácil de preparar y perfecto para cualquier ocasión.', 21.98, 101, '7507257922024', 4, 'activo', NULL, 'Enlatados', 1),
(398, 'Detergente Ariel 750g #186', 'Fácil de preparar y perfecto para cualquier ocasión.', 59.05, 47, '7509127141101', 8, 'activo', NULL, 'Botanas', 1),
(399, 'Cloro Cloralex 950ml #187', 'Aporta energía y nutrientes esenciales.', 59.55, 45, '7508074919952', 4, 'activo', NULL, 'Botanas', 1),
(400, 'Aceite Nutrioli 850ml #188', 'Fácil de preparar y perfecto para cualquier ocasión.', 86.38, 34, '7509076123011', 1, 'activo', NULL, 'Cereales', 1),
(401, 'Papel Higiénico Regio 4 rollos #189', 'Aporta energía y nutrientes esenciales.', 63.98, 36, '7503077144217', 2, 'activo', NULL, 'Limpieza', 1),
(402, 'Cereal Zucaritas 500g #190', 'Producto líder en su categoría.', 30.17, 23, '7502573046023', 8, 'activo', NULL, 'Abarrotes', 1),
(403, 'Café Nescafé Clásico 100g #191', 'Fácil de preparar y perfecto para cualquier ocasión.', 18.84, 144, '7501572730156', 1, 'activo', NULL, 'Bebidas', 1),
(404, 'Salchichas Fud 500g #192', 'Aporta energía y nutrientes esenciales.', 21.93, 117, '7501637000034', 5, 'activo', NULL, 'Lácteos', 1),
(405, 'Tortillas Tía Rosa 10pz #193', 'Receta clásica, lista para disfrutar.', 24.05, 79, '7503522979407', 10, 'activo', NULL, 'Carnes', 1),
(406, 'Dulces Pelón Pelo Rico #194', 'Fácil de preparar y perfecto para cualquier ocasión.', 94.15, 95, '7506751808169', 3, 'activo', NULL, 'Carnes', 1),
(407, 'Chocolate Abuelita Tabletas #195', 'Fácil de preparar y perfecto para cualquier ocasión.', 10.18, 135, '7506189010942', 8, 'activo', NULL, 'Botanas', 1),
(408, 'Shampoo Sedal 400ml #196', 'Ingrediente esencial en la despensa mexicana.', 54.26, 90, '7506483329652', 6, 'activo', NULL, 'Botanas', 1),
(409, 'Crema Corporal Nivea 200ml #197', 'Empaque económico y duradero.', 55.34, 105, '7509337233516', 10, 'activo', NULL, 'Carnes', 1),
(410, 'Refresco Pepsi 600ml #198', 'Producto líder en su categoría.', 53.15, 140, '7503309790750', 6, 'activo', NULL, 'Cereales', 1),
(411, 'Pan Molido Bimbo 200g #199', 'Presentación práctica para el hogar o negocio.', 50.03, 83, '7509320305233', 1, 'activo', NULL, 'Enlatados', 1),
(412, 'Sardinas La Costeña 425g #200', 'Ideal para toda la familia, sabor tradicional.', 58.08, 95, '7502282086967', 3, 'activo', NULL, 'Enlatados', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `promocion`
--

CREATE TABLE `promocion` (
  `id_promocion` bigint(20) UNSIGNED NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `tipo_promocion` varchar(50) DEFAULT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `tipo` varchar(50) DEFAULT NULL,
  `descuento` decimal(10,2) DEFAULT NULL,
  `buy_x` int(11) DEFAULT NULL,
  `get_y` int(11) DEFAULT NULL,
  `aplicacion` varchar(50) DEFAULT NULL,
  `categoria` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `promocion`
--

INSERT INTO `promocion` (`id_promocion`, `descripcion`, `tipo_promocion`, `fecha_inicio`, `fecha_fin`, `nombre`, `tipo`, `descuento`, `buy_x`, `get_y`, `aplicacion`, `categoria`) VALUES
(29, 'promoción en dulcería ', '3x2', '2025-06-26', '2025-06-27', 'Promo 3x2', NULL, NULL, 3, 2, 'categoria', 'Dulces'),
(30, 'descuento n x $ en panaderia ', 'Nx$', '2025-06-26', '2025-06-27', 'Promocion n x $', NULL, NULL, NULL, NULL, 'categoria', 'Panadería');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `promocion_producto`
--

CREATE TABLE `promocion_producto` (
  `id_promocion_producto` bigint(20) UNSIGNED NOT NULL,
  `id_promocion` int(11) DEFAULT NULL,
  `id_producto` int(11) DEFAULT NULL,
  `precio_promocional` decimal(10,2) DEFAULT NULL,
  `cantidad_minima` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `promocion_producto`
--

INSERT INTO `promocion_producto` (`id_promocion_producto`, `id_promocion`, `id_producto`, `precio_promocional`, `cantidad_minima`) VALUES
(1, 29, 213, NULL, 3),
(2, 29, 224, NULL, 3),
(3, 29, 230, NULL, 3),
(4, 29, 233, NULL, 3),
(5, 29, 246, NULL, 3),
(6, 29, 252, NULL, 3),
(7, 29, 256, NULL, 3),
(8, 29, 270, NULL, 3),
(9, 29, 273, NULL, 3),
(10, 29, 283, NULL, 3),
(11, 29, 284, NULL, 3),
(12, 29, 285, NULL, 3),
(13, 29, 286, NULL, 3),
(14, 29, 291, NULL, 3),
(15, 29, 298, NULL, 3),
(16, 29, 299, NULL, 3),
(17, 29, 301, NULL, 3),
(18, 29, 318, NULL, 3),
(19, 29, 323, NULL, 3),
(20, 29, 353, NULL, 3),
(21, 29, 355, NULL, 3),
(22, 29, 357, NULL, 3),
(23, 29, 362, NULL, 3),
(24, 29, 366, NULL, 3),
(25, 29, 367, NULL, 3),
(26, 29, 369, NULL, 3),
(27, 29, 372, NULL, 3),
(28, 29, 373, NULL, 3),
(29, 29, 384, NULL, 3),
(30, 29, 396, NULL, 3),
(31, 30, 215, 50.00, 3),
(32, 30, 229, 50.00, 3),
(33, 30, 235, 50.00, 3),
(34, 30, 247, 50.00, 3),
(35, 30, 259, 50.00, 3),
(36, 30, 260, 50.00, 3),
(37, 30, 264, 50.00, 3),
(38, 30, 275, 50.00, 3),
(39, 30, 314, 50.00, 3),
(40, 30, 322, 50.00, 3),
(41, 30, 328, 50.00, 3),
(42, 30, 332, 50.00, 3),
(43, 30, 347, 50.00, 3),
(44, 30, 360, 50.00, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedor`
--

CREATE TABLE `proveedor` (
  `id_proveedor` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `contacto` varchar(50) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `proveedor`
--

INSERT INTO `proveedor` (`id_proveedor`, `nombre`, `contacto`, `direccion`) VALUES
(1, 'Distribuidora Abarrotes del Centro', 'Luis Gómez', 'Calle Comercio #101'),
(2, 'Alimentos del Norte', 'María Ruiz', 'Av. Central #456'),
(3, 'Productos Selectos S.A.', 'Jorge Martínez', 'Blvd. Insurgentes #890'),
(4, 'Grupo Herdez', 'Carlos Méndez', 'Av. Industrias #123, CDMX'),
(5, 'Bimbo', 'Laura Fernández', 'Blvd. Toluca #456, Edo. México'),
(6, 'Coca-Cola FEMSA', 'Roberto Sánchez', 'Calle Refrescos #789, Monterrey'),
(7, 'PepsiCo México', 'Ana García', 'Av. Bebidas #321, Guadalajara'),
(8, 'Nestlé México', 'Juan Pérez', 'Calle Alimentos #654, Querétaro'),
(9, 'Unilever México', 'Sofía Ramírez', 'Blvd. Consumo #987, Puebla'),
(10, 'Kellogg\'s México', 'Miguel Ángel', 'Av. Cereales #135, León'),
(11, 'Sabritas', 'Patricia López', 'Calle Botanas #246, Toluca'),
(12, 'Lala', 'Fernando Castro', 'Av. Lácteos #579, Torreón'),
(13, 'Sigma Alimentos', 'Mariana Díaz', 'Blvd. Cárnicos #864, Aguascalientes');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reporte`
--

CREATE TABLE `reporte` (
  `id_reporte` bigint(20) UNSIGNED NOT NULL,
  `tipo_reporte` varchar(100) DEFAULT NULL,
  `fecha_generacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `datos_csv` text DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol`
--

CREATE TABLE `rol` (
  `id_rol` bigint(20) UNSIGNED NOT NULL,
  `nombre_rol` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `rol`
--

INSERT INTO `rol` (`id_rol`, `nombre_rol`) VALUES
(1, 'administrador'),
(2, 'cajero');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id_usuario` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `contrasena` varchar(100) NOT NULL,
  `numero_trabajador` varchar(50) NOT NULL,
  `id_rol` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `nombre`, `contrasena`, `numero_trabajador`, `id_rol`) VALUES
(103, 'Admin', '$2a$10$yVYKpjmIbU8PVjWc7LJ5s.zDOhlt6PJdWzEcOigcqzJAdvV50e0Zq', '1000', 1),
(104, 'Omar', '$2a$10$zDptF1WmsZsdZ85bwGtR8O/SU.aBMQ4yDBP/awyKWk47/UaiLHDEC', '1001', 2),
(105, 'Ana Torres', '$2a$10$cPbN6Fs4mv2bzAc2gb.mNOXE318Zc4hsy2wWxFI25WySHac8NMsBK', '1002', 2),
(106, 'Luis Martínez', '$2a$10$ZCIqtbv27wfScLOb0nvc6uOhb8BdPS5pVEcEI1QZ/8b/fXi.tMPhe', '1003', 2),
(107, 'Carla Jiménez', '$2a$10$p0PnSzDAPd1gUUG/qpRXkOC60Abq6K5ESRiNLv7SiWTmgaT6.BHpK', '1004', 2),
(108, 'Pedro Sánchez', '$2a$10$VaUCfWGbaJ44MneYoWQTP.etTbzqBCP0QHukgN8U/tOTjMV0HfJay', '1005', 2),
(109, 'Sofía Delgado', '$2a$10$55IQh5xa8AZCMzNV.nNUourPKb.yaqVTG04OqiGf4fWjTeNkTgGqm', '1006', 2),
(110, 'Diego Herrera', '$2a$10$sgVh8RB5UKtbSzSAlG6gN.VSE7QfCt.d6dVpYhX5rPFBMX.plhKXm', '1007', 2),
(111, 'Mariana López', '$2a$10$cPbN6Fs4mv2bzAc2gb.mNOXE318Zc4hsy2wWxFI25WySHac8NMsBK', '1008', 2),
(112, 'Javier Ruiz', '$2a$10$QcPtYErPAA5oFh1XCSGooOhCiNkJSp6qK0KY575A3bqouG0ZYs5kq', '1009', 1),
(114, 'Sara', '$2a$10$1tpL4KK6f3zZ53JCDbDXXOw5jYNRz9v5uDCk7jCVeSnHLsCT5CYfm', '1010', 1),
(115, 'Enrique', '$2a$10$v14JNMdk7Z7J55rahgbMiOTfIQt0HZkpPK66fwaigoJo8duScYN0W', '1012', 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `venta`
--

CREATE TABLE `venta` (
  `id_venta` bigint(20) UNSIGNED NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  `total` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) DEFAULT NULL,
  `iva` decimal(10,2) DEFAULT NULL,
  `id_usuario` bigint(20) UNSIGNED DEFAULT NULL,
  `id_metodo_pago` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `venta`
--

INSERT INTO `venta` (`id_venta`, `fecha`, `total`, `subtotal`, `iva`, `id_usuario`, `id_metodo_pago`) VALUES
(9, '2025-06-21 19:16:52', 87.82, 87.82, 0.00, NULL, 1),
(10, '2025-06-21 19:31:50', 87.82, 87.82, 0.00, NULL, 1),
(11, '2025-06-21 19:31:59', 87.82, 87.82, 0.00, NULL, 2),
(12, '2025-06-21 19:35:37', 88.38, 88.38, 0.00, NULL, 1),
(13, '2025-06-21 19:53:21', 84.52, 84.52, 0.00, NULL, 1),
(14, '2025-06-21 20:56:58', 174.19, 174.19, 0.00, NULL, 2),
(15, '2025-06-21 21:10:41', 100.73, 100.73, 0.00, NULL, 1),
(16, '2025-06-21 21:11:15', 113.64, 113.64, 0.00, NULL, 1),
(17, '2025-06-21 21:11:33', 157.63, 157.63, 0.00, NULL, 1),
(18, '2025-06-21 21:12:51', 157.63, 157.63, 0.00, NULL, 1),
(19, '2025-06-21 21:18:20', 81.49, 81.49, 0.00, NULL, 1),
(20, '2025-06-21 21:23:18', 252.63, 252.63, 0.00, NULL, 1),
(21, '2025-06-21 21:34:43', 12.91, 12.91, 0.00, NULL, 1),
(22, '2025-06-21 21:43:28', 254.39, 254.39, 0.00, NULL, 1),
(23, '2025-06-21 21:46:43', 182.78, 182.78, 0.00, NULL, 1),
(24, '2025-06-21 21:48:58', 178.92, 178.92, 0.00, NULL, 1),
(25, '2025-06-21 21:49:51', 264.57, 264.57, 0.00, NULL, 1),
(26, '2025-06-21 22:51:18', 270.60, 270.60, 0.00, NULL, 2),
(27, '2025-06-21 22:56:20', 270.60, 270.60, 0.00, NULL, 2),
(28, '2025-06-21 22:59:16', 270.60, 270.60, 0.00, NULL, 1),
(29, '2025-06-21 23:03:12', 302.07, 302.07, 0.00, NULL, 1),
(30, '2025-06-21 23:05:51', 302.07, 302.07, 0.00, NULL, 1),
(31, '2025-06-21 23:15:58', 378.97, 378.97, 0.00, NULL, 2),
(32, '2025-06-21 23:28:09', 302.42, 260.71, 41.71, NULL, 1),
(33, '2025-06-21 23:36:25', 403.10, 347.50, 55.60, NULL, 1),
(34, '2025-06-21 23:38:20', 386.73, 333.39, 53.34, NULL, 1),
(35, '2025-06-21 23:41:18', 337.73, 291.15, 46.58, NULL, 1),
(36, '2025-06-21 23:45:10', 403.10, 347.50, 55.60, NULL, 1),
(37, '2025-06-21 23:47:22', 403.10, 347.50, 55.60, NULL, 1),
(38, '2025-06-21 23:48:54', 403.10, 347.50, 55.60, NULL, 1),
(39, '2025-06-21 23:54:01', 14.98, 12.91, 2.07, NULL, 2),
(40, '2025-06-22 01:18:07', 51.03, 43.99, 7.04, NULL, 1),
(41, '2025-06-22 01:22:37', 51.03, 43.99, 7.04, NULL, 1),
(42, '2025-06-22 01:23:30', 14.98, 12.91, 2.07, NULL, 1),
(43, '2025-06-23 20:21:56', 265.92, 229.24, 36.68, NULL, 1),
(44, '2025-06-23 20:22:36', 663.07, 571.61, 91.46, NULL, 2),
(45, '2025-06-23 20:30:17', 1525.40, 1315.00, 210.40, NULL, 1),
(46, '2025-06-24 01:12:15', 1372.77, 1183.42, 189.35, NULL, 1),
(47, '2025-06-24 01:14:32', 293.62, 253.12, 40.50, NULL, 2),
(48, '2025-06-24 17:51:58', 294.13, 253.56, 40.57, NULL, 2),
(49, '2025-06-24 17:53:10', 1947.90, 1679.22, 268.68, NULL, 1),
(50, '2025-06-25 22:05:51', 457.24, 394.17, 63.07, NULL, 2),
(51, '2025-06-26 04:07:44', 173.30, 149.40, 23.90, NULL, 1),
(52, '2025-06-26 06:42:22', 153.09, 131.97, 21.12, NULL, 1),
(53, '2025-06-26 06:43:30', 44.93, 38.73, 6.20, NULL, 1),
(54, '2025-06-27 01:01:54', 32.02, 25.82, 6.20, NULL, 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `detalle_venta`
--
ALTER TABLE `detalle_venta`
  ADD PRIMARY KEY (`id_detalle_venta`),
  ADD UNIQUE KEY `id_venta` (`id_venta`,`id_producto`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indices de la tabla `devolucion`
--
ALTER TABLE `devolucion`
  ADD PRIMARY KEY (`id_devolucion`);

--
-- Indices de la tabla `metodo_pago`
--
ALTER TABLE `metodo_pago`
  ADD PRIMARY KEY (`id_metodo_pago`);

--
-- Indices de la tabla `producto`
--
ALTER TABLE `producto`
  ADD PRIMARY KEY (`id_producto`),
  ADD KEY `id_proveedor` (`id_proveedor`);

--
-- Indices de la tabla `promocion`
--
ALTER TABLE `promocion`
  ADD PRIMARY KEY (`id_promocion`);

--
-- Indices de la tabla `promocion_producto`
--
ALTER TABLE `promocion_producto`
  ADD PRIMARY KEY (`id_promocion_producto`);

--
-- Indices de la tabla `proveedor`
--
ALTER TABLE `proveedor`
  ADD PRIMARY KEY (`id_proveedor`);

--
-- Indices de la tabla `reporte`
--
ALTER TABLE `reporte`
  ADD PRIMARY KEY (`id_reporte`);

--
-- Indices de la tabla `rol`
--
ALTER TABLE `rol`
  ADD PRIMARY KEY (`id_rol`),
  ADD UNIQUE KEY `nombre_rol` (`nombre_rol`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usuario`),
  ADD KEY `id_rol` (`id_rol`);

--
-- Indices de la tabla `venta`
--
ALTER TABLE `venta`
  ADD PRIMARY KEY (`id_venta`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_metodo_pago` (`id_metodo_pago`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `detalle_venta`
--
ALTER TABLE `detalle_venta`
  MODIFY `id_detalle_venta` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=177;

--
-- AUTO_INCREMENT de la tabla `devolucion`
--
ALTER TABLE `devolucion`
  MODIFY `id_devolucion` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `metodo_pago`
--
ALTER TABLE `metodo_pago`
  MODIFY `id_metodo_pago` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `producto`
--
ALTER TABLE `producto`
  MODIFY `id_producto` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=413;

--
-- AUTO_INCREMENT de la tabla `promocion`
--
ALTER TABLE `promocion`
  MODIFY `id_promocion` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT de la tabla `promocion_producto`
--
ALTER TABLE `promocion_producto`
  MODIFY `id_promocion_producto` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT de la tabla `proveedor`
--
ALTER TABLE `proveedor`
  MODIFY `id_proveedor` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `reporte`
--
ALTER TABLE `reporte`
  MODIFY `id_reporte` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `rol`
--
ALTER TABLE `rol`
  MODIFY `id_rol` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=116;

--
-- AUTO_INCREMENT de la tabla `venta`
--
ALTER TABLE `venta`
  MODIFY `id_venta` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `detalle_venta`
--
ALTER TABLE `detalle_venta`
  ADD CONSTRAINT `detalle_venta_ibfk_1` FOREIGN KEY (`id_venta`) REFERENCES `venta` (`id_venta`),
  ADD CONSTRAINT `detalle_venta_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`);

--
-- Filtros para la tabla `producto`
--
ALTER TABLE `producto`
  ADD CONSTRAINT `producto_ibfk_1` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedor` (`id_proveedor`);

--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`id_rol`);

--
-- Filtros para la tabla `venta`
--
ALTER TABLE `venta`
  ADD CONSTRAINT `venta_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`),
  ADD CONSTRAINT `venta_ibfk_2` FOREIGN KEY (`id_metodo_pago`) REFERENCES `metodo_pago` (`id_metodo_pago`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
