-- phpMyAdmin SQL Dump
-- version 4.2.12deb2+deb8u2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: May 28, 2018 at 05:28 AM
-- Server version: 5.5.58-0+deb8u1
-- PHP Version: 5.6.30-0+deb8u1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `prueba`
--

-- --------------------------------------------------------

--
-- Table structure for table `Actividad`
--

CREATE TABLE IF NOT EXISTS `Actividad` (
`id_actividad` int(11) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `descripcion` text NOT NULL,
  `requisitos` text NOT NULL,
  `fecha` date NOT NULL,
  `inicio_inscripcion` date NOT NULL,
  `fin_inscripcion` date NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Actividad`
--

INSERT INTO `Actividad` (`id_actividad`, `titulo`, `descripcion`, `requisitos`, `fecha`, `inicio_inscripcion`, `fin_inscripcion`) VALUES
(2, 'Actividad 2', 'Descripcion actividad 2', 'Requisitos actividad 2', '2017-12-27', '2017-12-01', '2017-12-26'),
(3, 'Actividad 1', 'Descripcion actividad 1', 'Requisitos actividad 1', '2018-04-28', '2018-04-01', '2018-04-24'),
(4, 'Actividad Enero', 'Descripcion actividad enero', 'requisitos actividad enero', '2018-01-16', '2017-12-31', '2018-01-14'),
(5, 'Titulo Actividad 5', 'Descripcion actividad cinco5', 'Requisitos actividad cinco', '2018-06-02', '2018-05-31', '2018-06-07'),
(8, 'titulo actividad 1', 'descripcion actividad 1', 'requisitos actividad 1', '2018-06-17', '2018-06-01', '2018-06-06'),
(9, 'Actividad 6', 'Descripción de la actividad 6', 'Requisitos de la actividad 6', '2018-06-14', '2018-05-31', '2018-06-08'),
(11, 'Actividad 7', 'Actividad 7 descripción', 'Requisitos de la actividad 7', '2018-06-08', '2018-05-18', '2018-05-25'),
(13, 'Actividad 8', 'prueba de actividad 8', 'actividad 8 requisitosss', '2018-06-02', '2018-05-02', '2018-06-07');

-- --------------------------------------------------------

--
-- Table structure for table `Organizar`
--

CREATE TABLE IF NOT EXISTS `Organizar` (
  `id_actividad` int(11) NOT NULL,
  `id_monitor` varchar(9) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Organizar`
--

INSERT INTO `Organizar` (`id_actividad`, `id_monitor`) VALUES
(5, '1111'),
(11, '1111'),
(2, '1444'),
(5, '1444'),
(2, '25555'),
(3, '25555'),
(4, '25555');

-- --------------------------------------------------------

--
-- Table structure for table `Participantes`
--

CREATE TABLE IF NOT EXISTS `Participantes` (
  `id_actividad` int(11) NOT NULL,
  `id_usuario` varchar(9) NOT NULL,
  `pagado` tinyint(1) DEFAULT '0',
  `firmado` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Participantes`
--

INSERT INTO `Participantes` (`id_actividad`, `id_usuario`, `pagado`, `firmado`) VALUES
(2, '12u', 0, 0),
(2, '1444', 1, 1),
(3, '12345678A', 0, 0),
(3, '12345678H', 1, 0),
(3, '12u', 0, 0),
(3, '1444', 0, 0),
(3, '345', 0, 1),
(4, '12u', 1, 1),
(4, '1444', 1, 1),
(5, '123', 0, 0),
(5, '12345678A', 0, 1),
(5, '12345678H', 0, 0),
(5, '12u', 1, 0),
(5, '1444', 0, 0),
(5, '25555', 0, 0),
(5, '345', 0, 0),
(13, '1111', 1, 0),
(13, '345', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `Usuarios`
--

CREATE TABLE IF NOT EXISTS `Usuarios` (
  `dni` varchar(9) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `apellidos` varchar(255) NOT NULL,
  `telefono` varchar(9) NOT NULL,
  `direccion` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `perfil` enum('participante','secretaria','administrador','monitor') DEFAULT 'participante'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Usuarios`
--

INSERT INTO `Usuarios` (`dni`, `nombre`, `apellidos`, `telefono`, `direccion`, `email`, `password`, `perfil`) VALUES
('1111', 'pruebamonitor', 'prueba', '3333', 'Calle', 'mon1@gmail.com', '$2a$10$7OG6NGUEqAlx5.tQu.TnperyZFS88WMENXLnSNqGyp9gbFaeRvdnu', 'monitor'),
('123', 'Aaabb', 'Bbbcc', '1', 'Calle Mayor', 'abc@gmail.com', '$2a$10$9QAufJYEdgJPgna/rSd/buysTvI5k/KlIsJaYSt6ifVm/2pKf3N6C', 'participante'),
('12345', 'Mnau', 'Perez', '1234', 'Calle Principal', 'man@gmail.com', '$2a$10$yPE9yJzWPPjCVVWCyB8K5eJh79TCyZt6.aYjtlrZVMxFW8EXvCgYm', 'administrador'),
('12345678A', 'Miguelona', 'Caller', '12344', 'Calle Principal', 'macalleperez@gmail.com', '$2a$10$tzVYOkQKVi/61Di.J5b9/uKNq.K5pxe6XiADsm9f9RZ0x53KIUk56', 'participante'),
('12345678H', 'abcd', 'prueba acd', '11111111', 'fasfdaadfasdf', 'mig@gmail.com', '$2a$10$b/taF14PFISMg8gHed8IpOME8frA/a6lQgmB4HjL.ul/pi/xupkwy', 'participante'),
('12u', 'Pedrito', 'Murciano', '5553335', 'Calle Principal1', 'direccion12@gmail.com', '$2a$10$E/xPJj7X3tZOM7tYJrtplulPZnjB0vi1jLSxPt5GRPgOZcNpP8HR6', 'participante'),
('13', 'B', 'B', '1234', 'Calle Menor', 'b@gmail.com', '$2a$10$bfP5784eTVchmkeHAoFhxeAlGa8b5uJZc5oudqojK28nJeOMWbHp6', 'participante'),
('1444', 'Manolito', 'Perezzdgs', '564634611', 'Calle Menor1', 'macalle@iessantiagohernandez.com', '$2a$10$jQCWCbIalwi/4SyDz.eI3exqIurb0JgsR5S4y0x2zicbqwsBLr/fu', 'monitor'),
('24', 'pr', 'pr', '443', 'calle mayor', 'mb@gmail.com', '$2a$10$o3kugEVCliYN/j7.9BSKaOdERWm5al8zJaigGDb2EeLBhMxV/krn2', 'secretaria'),
('25555', 'monitor', 'monitor', '3456', 'calle menor', 'mon@gmail.com', '$2a$10$5BiGbh2Ey.28JnYwIUGIx.aNcv.OTpQdANcFVKmrcxpD5HaKvA8uu', 'monitor'),
('345', 'Miguel Angel', 'Calle Pérez', '665447090', 'Calle Principal', 'par@agmail.com', '$2a$10$o3kugEVCliYN/j7.9BSKaOdERWm5al8zJaigGDb2EeLBhMxV/krn2', 'participante');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Actividad`
--
ALTER TABLE `Actividad`
 ADD PRIMARY KEY (`id_actividad`), ADD UNIQUE KEY `UK_titulo` (`titulo`);

--
-- Indexes for table `Organizar`
--
ALTER TABLE `Organizar`
 ADD PRIMARY KEY (`id_actividad`,`id_monitor`), ADD KEY `FK_monitororg` (`id_monitor`);

--
-- Indexes for table `Participantes`
--
ALTER TABLE `Participantes`
 ADD PRIMARY KEY (`id_actividad`,`id_usuario`), ADD KEY `FK_part1` (`id_usuario`);

--
-- Indexes for table `Usuarios`
--
ALTER TABLE `Usuarios`
 ADD PRIMARY KEY (`dni`), ADD UNIQUE KEY `UK_email` (`email`), ADD UNIQUE KEY `UK_nombre` (`nombre`,`apellidos`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Actividad`
--
ALTER TABLE `Actividad`
MODIFY `id_actividad` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=15;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `Organizar`
--
ALTER TABLE `Organizar`
ADD CONSTRAINT `FK_actividadorg` FOREIGN KEY (`id_actividad`) REFERENCES `Actividad` (`id_actividad`),
ADD CONSTRAINT `FK_monitororg` FOREIGN KEY (`id_monitor`) REFERENCES `Usuarios` (`dni`) ON UPDATE CASCADE;

--
-- Constraints for table `Participantes`
--
ALTER TABLE `Participantes`
ADD CONSTRAINT `FK_actividadpart` FOREIGN KEY (`id_actividad`) REFERENCES `Actividad` (`id_actividad`),
ADD CONSTRAINT `FK_part` FOREIGN KEY (`id_usuario`) REFERENCES `Usuarios` (`dni`) ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
