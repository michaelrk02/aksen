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
  `name` varchar(50) NOT NULL,
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
('email.from.address',	'aksen@localhost.localdomain',	'Sender e-mail address',	1),
('email.from.name',	'AKSEN SMAGA',	'Sender e-mail name',	1),
('email.protocol',	'mail',	'Protocol used for sending e-mails [mail|sendmail|smtp]',	1),
('email.sendmail.path',	'/usr/bin/sendmail',	'Path to sendmail executable',	1),
('email.smtp.host',	'ssl://smtp.gmail.com',	'Host address for SMTP e-mail protocol',	1),
('email.smtp.pass',	'',	'Password used for SMTP authentication (base64)',	1),
('email.smtp.port',	'465',	'SMTP port',	1),
('email.smtp.user',	'',	'E-mail address used for SMTP (base64)',	1),
('info.contact_persons',	'Alice:123456789,Bob:987654321',	'Contact persons list. Format: NAME:PHONE,...',	1),
('order.cooldown',	'10800',	'Order cooldown in seconds',	1),
('order.expire',	'1',	'Order expiration in days (Nx24H format)',	1),
('order.max_tickets',	'5',	'Maximum number of tickets customers are allowed to order',	1),
('order.next_id',	'2',	'Next order ID',	0),
('payment.bank_accounts',	'Joko Widodo:BNI:123456789,Ma\'ruf Amin:BCA:987654321',	'Bank accounts used for payment. Format: NAME:VENDOR:NUMBER,...',	1),
('payment.gopay_account',	'Abdul:123456789',	'GO-PAY account used for payment. Format: NAME:ID',	1),
('payment.offline_schedule',	'Senin-Kamis: 16.00-17.00, Jumat: 15.00-17.00, Sabtu: 12.00-17.00',	'Offline schedule used for offline payments',	1),
('payment.ovo_account',	'John Doe:081234567890',	'OVO account used for payment. Format: NAME:NUMBER',	1),
('payment.partners',	'OSIS SMAN 1 San Andreas;SMAN 3 Vice City;SMAN 8 Washington DC',	'Partners in receiving payments',	1);

DROP TABLE IF EXISTS `customers`;
CREATE TABLE `customers` (
  `invoice_id` char(16) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `email` char(254) NOT NULL,
  `order_details` varchar(200) NOT NULL,
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
  `order_details` varchar(200) NOT NULL,
  `category_id` char(8) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `tickets` int(11) NOT NULL,
  `order_time` datetime NOT NULL,
  `order_id` int(11) NOT NULL,
  `expire_time` datetime NOT NULL,
  `keep` tinyint(4) NOT NULL,
  PRIMARY KEY (`invoice_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `invoices_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- 2020-05-09 09:43:00
