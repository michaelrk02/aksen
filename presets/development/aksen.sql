-- Adminer 4.7.1 MySQL dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

DROP TABLE IF EXISTS `accesses`;
CREATE TABLE `accesses` (
  `ip_address` char(32) NOT NULL,
  `unlock_time` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `category_id` char(8) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `name` char(50) NOT NULL,
  `capacity` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  `locked` tinyint(4) NOT NULL,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `config`;
CREATE TABLE `config` (
  `key` char(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `value` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `description` text NOT NULL,
  `editable` tinyint(4) NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `config` (`key`, `value`, `description`, `editable`) VALUES
('admin.password',	'$2y$05$6Wj2fp0ZX3K7HgSXnfV/iubAKlRTCrG5F6tVADfIOzU4tMgCa06jS',	'Admin password (BCrypt)',	0),
('info.contact_persons',	'Jimmy:628386440145,Zein:6281330886083',	'Contact persons list. Format: NAME:PHONE,...',	1),
('order.cooldown',	'10800',	'Order cooldown in seconds',	1),
('order.expire',	'24',	'Order expiration in hours',	1),
('order.max_tickets',	'5',	'Maximum number of tickets customers are allowed to order',	1);

DROP TABLE IF EXISTS `customers`;
CREATE TABLE `customers` (
  `invoice_id` char(16) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `email` char(254) NOT NULL,
  `order_details` char(200) NOT NULL,
  `category_id` char(8) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `tickets` int(11) NOT NULL,
  `order_time` datetime NOT NULL,
  PRIMARY KEY (`invoice_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `customers_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `invoices`;
CREATE TABLE `invoices` (
  `invoice_id` char(16) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `email` char(254) NOT NULL,
  `order_details` char(200) NOT NULL,
  `category_id` char(8) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `tickets` int(11) NOT NULL,
  `order_time` datetime NOT NULL,
  `expire_time` datetime NOT NULL,
  PRIMARY KEY (`invoice_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `invoices_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- 2020-05-08 13:25:44
