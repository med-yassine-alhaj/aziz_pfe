-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 09, 2026 at 07:59 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `fmcom`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_logs`
--

CREATE TABLE `activity_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `action` varchar(255) NOT NULL,
  `entity_type` varchar(255) NOT NULL,
  `entity_id` bigint(20) UNSIGNED DEFAULT NULL,
  `description` text DEFAULT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `activity_logs`
--

INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `metadata`, `created_at`, `updated_at`) VALUES
(1, 4, 'created', 'ServiceRequest', 1, 'Nouvelle demande créée : je veux site web pour ma boutique', NULL, '2026-05-09 12:30:20', '2026-05-09 12:30:20'),
(2, 5, 'status_changed', 'ServiceRequest', 1, 'Statut changé de discussion vers quote_accepted', NULL, '2026-05-09 12:35:53', '2026-05-09 12:35:53'),
(3, 5, 'sent', 'Quote', 2, 'Devis envoyé au client : DEV-2026-00002', NULL, '2026-05-09 12:42:34', '2026-05-09 12:42:34'),
(4, 5, 'status_changed', 'ServiceRequest', 1, 'Statut changé de quote_sent vers quote_accepted', NULL, '2026-05-09 13:05:21', '2026-05-09 13:05:21'),
(5, 5, 'status_changed', 'ServiceRequest', 1, 'Statut changé de quote_accepted vers completed', NULL, '2026-05-09 13:06:01', '2026-05-09 13:06:01'),
(6, 5, 'sent', 'Quote', 1, 'Devis envoyé au client : DEV-2026-00001', NULL, '2026-05-09 13:25:27', '2026-05-09 13:25:27'),
(7, 4, 'accepted', 'Quote', 1, 'Devis accepté : DEV-2026-00001', NULL, '2026-05-09 13:27:46', '2026-05-09 13:27:46'),
(8, 4, 'created', 'Invoice', 1, 'Facture créée automatiquement depuis devis accepté : DEV-2026-00001', NULL, '2026-05-09 13:27:46', '2026-05-09 13:27:46'),
(9, 6, 'validated', 'Invoice', 1, 'Facture validée par le comptable Comptable F_MCOM', NULL, '2026-05-09 13:29:59', '2026-05-09 13:29:59'),
(10, 4, 'payment_submitted', 'Invoice', 1, 'Paiement soumis pour la facture FAC-2026-00001', NULL, '2026-05-09 14:10:10', '2026-05-09 14:10:10'),
(11, 6, 'validated', 'Payment', 1, 'Paiement validé par Comptable F_MCOM', NULL, '2026-05-09 14:21:58', '2026-05-09 14:21:58'),
(12, 4, 'created', 'ServiceRequest', 2, 'Nouvelle demande créée : desgin pour mon site', NULL, '2026-05-09 15:18:08', '2026-05-09 15:18:08'),
(13, 5, 'sent', 'Quote', 3, 'Devis envoyé au client : DEV-2026-00002', NULL, '2026-05-09 15:20:09', '2026-05-09 15:20:09'),
(14, 4, 'accepted', 'Quote', 3, 'Devis accepté : DEV-2026-00002', NULL, '2026-05-09 15:21:26', '2026-05-09 15:21:26'),
(15, 4, 'created', 'Invoice', 2, 'Facture créée automatiquement depuis devis accepté : DEV-2026-00002', NULL, '2026-05-09 15:21:26', '2026-05-09 15:21:26'),
(16, 6, 'validated', 'Invoice', 2, 'Facture validée par le comptable Comptable F_MCOM', NULL, '2026-05-09 15:23:48', '2026-05-09 15:23:48'),
(17, 4, 'payment_submitted', 'Invoice', 2, 'Paiement soumis pour la facture FAC-2026-00002', NULL, '2026-05-09 15:24:44', '2026-05-09 15:24:44'),
(18, 6, 'validated', 'Payment', 2, 'Paiement validé par Comptable F_MCOM', NULL, '2026-05-09 15:25:51', '2026-05-09 15:25:51'),
(19, 4, 'created', 'ServiceRequest', 3, 'Nouvelle demande créée : okokjpok', NULL, '2026-05-09 15:48:00', '2026-05-09 15:48:00'),
(20, 5, 'sent', 'Quote', 4, 'Devis envoyé au client : DEV-2026-00003', NULL, '2026-05-09 15:50:03', '2026-05-09 15:50:03'),
(21, 4, 'refused', 'Quote', 4, 'Devis refusé : DEV-2026-00003', NULL, '2026-05-09 15:50:16', '2026-05-09 15:50:16');

-- --------------------------------------------------------

--
-- Table structure for table `agency_settings`
--

CREATE TABLE `agency_settings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `agency_name` varchar(255) NOT NULL DEFAULT 'F_MCOM',
  `logo` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL DEFAULT 'contact@fmcom.ma',
  `phone` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `tax_number` varchar(255) DEFAULT NULL,
  `default_tax_rate` decimal(5,2) NOT NULL DEFAULT 20.00,
  `bank_name` varchar(255) DEFAULT NULL,
  `bank_account` varchar(255) DEFAULT NULL,
  `bank_iban` varchar(255) DEFAULT NULL,
  `invoice_legal_mentions` text DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `social_links` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`social_links`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `agency_settings`
--

INSERT INTO `agency_settings` (`id`, `agency_name`, `logo`, `email`, `phone`, `address`, `tax_number`, `default_tax_rate`, `bank_name`, `bank_account`, `bank_iban`, `invoice_legal_mentions`, `website`, `social_links`, `created_at`, `updated_at`) VALUES
(1, 'F_MCOM', NULL, 'contact@fmcom.ma', NULL, NULL, NULL, 20.00, NULL, NULL, NULL, NULL, NULL, NULL, '2026-05-09 11:30:52', '2026-05-09 11:30:52');

-- --------------------------------------------------------

--
-- Table structure for table `conversations`
--

CREATE TABLE `conversations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `service_request_id` bigint(20) UNSIGNED NOT NULL,
  `client_id` bigint(20) UNSIGNED NOT NULL,
  `admin_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `conversations`
--

INSERT INTO `conversations` (`id`, `service_request_id`, `client_id`, `admin_id`, `created_at`, `updated_at`) VALUES
(1, 1, 4, 5, '2026-05-09 12:30:41', '2026-05-09 12:30:41'),
(2, 2, 4, 5, '2026-05-09 15:18:25', '2026-05-09 15:18:25'),
(3, 3, 4, 5, '2026-05-09 15:48:23', '2026-05-09 15:48:23');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `invoices`
--

CREATE TABLE `invoices` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `invoice_number` varchar(255) NOT NULL,
  `client_id` bigint(20) UNSIGNED NOT NULL,
  `service_request_id` bigint(20) UNSIGNED DEFAULT NULL,
  `quote_id` bigint(20) UNSIGNED DEFAULT NULL,
  `subtotal` decimal(12,2) NOT NULL DEFAULT 0.00,
  `discount_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `tax_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `total` decimal(12,2) NOT NULL DEFAULT 0.00,
  `status` enum('draft','waiting_accountant_validation','unpaid','payment_pending','paid','cancelled') NOT NULL DEFAULT 'draft',
  `notes` text DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `validated_by_accountant_id` bigint(20) UNSIGNED DEFAULT NULL,
  `validated_at` timestamp NULL DEFAULT NULL,
  `paid_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `invoices`
--

INSERT INTO `invoices` (`id`, `invoice_number`, `client_id`, `service_request_id`, `quote_id`, `subtotal`, `discount_amount`, `tax_amount`, `total`, `status`, `notes`, `due_date`, `validated_by_accountant_id`, `validated_at`, `paid_at`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'FAC-2026-00001', 4, 1, 1, 100.00, 0.00, 20.00, 120.00, 'paid', 'Test', NULL, 6, '2026-05-09 13:29:59', '2026-05-09 14:21:57', 4, '2026-05-09 13:27:46', '2026-05-09 14:21:57'),
(2, 'FAC-2026-00002', 4, 2, 3, 5990.00, 0.00, 1198.00, 7188.00, 'paid', NULL, NULL, 6, '2026-05-09 15:23:48', '2026-05-09 15:25:50', 4, '2026-05-09 15:21:26', '2026-05-09 15:25:50');

-- --------------------------------------------------------

--
-- Table structure for table `invoice_items`
--

CREATE TABLE `invoice_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `invoice_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `quantity` decimal(10,2) NOT NULL DEFAULT 1.00,
  `unit_price` decimal(12,2) NOT NULL DEFAULT 0.00,
  `tax_rate` decimal(5,2) NOT NULL DEFAULT 20.00,
  `discount_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `total` decimal(12,2) NOT NULL DEFAULT 0.00,
  `order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `invoice_items`
--

INSERT INTO `invoice_items` (`id`, `invoice_id`, `title`, `description`, `quantity`, `unit_price`, `tax_rate`, `discount_amount`, `total`, `order`, `created_at`, `updated_at`) VALUES
(1, 1, 'Service UI Test', 'Service UI Test', 1.00, 100.00, 20.00, 0.00, 100.00, 0, '2026-05-09 13:27:46', '2026-05-09 13:27:46'),
(2, 2, 'mrigl', 'mrigl', 1.00, 6000.00, 20.00, 10.00, 5990.00, 0, '2026-05-09 15:21:26', '2026-05-09 15:21:26');

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `conversation_id` bigint(20) UNSIGNED NOT NULL,
  `sender_id` bigint(20) UNSIGNED NOT NULL,
  `message` text NOT NULL,
  `attachment_path` varchar(255) DEFAULT NULL,
  `attachment_name` varchar(255) DEFAULT NULL,
  `is_internal_note` tinyint(1) NOT NULL DEFAULT 0,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `conversation_id`, `sender_id`, `message`, `attachment_path`, `attachment_name`, `is_internal_note`, `is_read`, `created_at`, `updated_at`) VALUES
(1, 1, 5, 'salut', NULL, NULL, 0, 1, '2026-05-09 12:30:48', '2026-05-09 12:31:17'),
(2, 1, 4, 'je veux une site web pour ma boutique', NULL, NULL, 0, 1, '2026-05-09 12:31:33', '2026-05-09 12:31:43'),
(3, 1, 4, '', 'messages/1/ndLTIwTMtJHpJUNgqvWp42ujqrXeJZiYVGLuqqzK.jpg', '57bb743e-8e7c-407a-ab79-1bd4d9d0e87f.jfif', 0, 1, '2026-05-09 12:32:25', '2026-05-09 12:32:37'),
(4, 1, 5, 'mrigl 5ouya', NULL, NULL, 0, 1, '2026-05-09 12:33:10', '2026-05-09 12:33:18'),
(5, 2, 5, 'famech 5edma', NULL, NULL, 0, 1, '2026-05-09 15:18:32', '2026-05-09 15:18:52'),
(6, 2, 4, 'mrigl 5ouya', NULL, NULL, 0, 1, '2026-05-09 15:19:01', '2026-05-09 15:19:10'),
(7, 3, 5, 'ahla bik', NULL, NULL, 0, 1, '2026-05-09 15:48:33', '2026-05-09 15:48:43'),
(8, 3, 4, '', 'messages/3/VJUkZSec3sCqw7DTwHHdSRtJvnQQh0ge0z5KaPSd.jpg', '57bb743e-8e7c-407a-ab79-1bd4d9d0e87f.jfif', 0, 1, '2026-05-09 15:48:52', '2026-05-09 15:48:56');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2014_10_12_100000_create_password_reset_tokens_table', 1),
(2, '2019_08_19_000000_create_failed_jobs_table', 1),
(3, '2019_12_14_000001_create_personal_access_tokens_table', 1),
(4, '2024_01_01_000001_create_users_table', 2),
(5, '2024_01_01_000002_create_services_table', 2),
(6, '2024_01_01_000003_create_packs_table', 2),
(7, '2024_01_01_000004_create_service_requests_table', 2),
(8, '2024_01_01_000005_create_conversations_table', 2),
(9, '2024_01_01_000006_create_quotes_table', 2),
(10, '2024_01_01_000007_create_invoices_table', 2),
(11, '2024_01_01_000008_create_payments_table', 2),
(12, '2024_01_01_000009_create_notifications_table', 2),
(13, '2024_01_01_000010_create_agency_settings_table', 2);

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `type` varchar(255) NOT NULL DEFAULT 'info',
  `link` varchar(255) DEFAULT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `title`, `message`, `type`, `link`, `is_read`, `created_at`, `updated_at`) VALUES
(1, 5, 'Nouvelle demande reçue', 'Med yassine Hajji a envoyé une nouvelle demande : je veux site web pour ma boutique', 'new_request', '/admin/requests/1', 1, '2026-05-09 12:30:20', '2026-05-09 15:45:50'),
(2, 4, 'Discussion ouverte', 'Un admin a ouvert une discussion sur votre demande : je veux site web pour ma boutique', 'discussion_opened', '/client/requests/1', 1, '2026-05-09 12:30:41', '2026-05-09 15:18:45'),
(3, 4, 'Nouveau message', 'Un admin vous a répondu.', 'new_message', '/client/requests/1', 1, '2026-05-09 12:30:48', '2026-05-09 15:18:45'),
(4, 5, 'Nouveau message', 'Med yassine Hajji a envoyé un message.', 'new_message', '/admin/requests/1', 1, '2026-05-09 12:31:33', '2026-05-09 15:45:50'),
(5, 5, 'Nouveau message', 'Med yassine Hajji a envoyé un message.', 'new_message', '/admin/requests/1', 1, '2026-05-09 12:32:25', '2026-05-09 15:45:50'),
(6, 4, 'Nouveau message', 'Un admin vous a répondu.', 'new_message', '/client/requests/1', 1, '2026-05-09 12:33:10', '2026-05-09 15:18:45'),
(7, 4, 'Statut mis à jour', 'Votre demande \"je veux site web pour ma boutique\" est maintenant : Devis accepté', 'status_update', '/client/requests/1', 1, '2026-05-09 12:35:53', '2026-05-09 15:18:45'),
(8, 4, 'Devis reçu', 'Vous avez reçu un devis : DEV-2026-00002. Consultez-le dans votre espace.', 'quote_sent', '/client/quotes/2', 1, '2026-05-09 12:42:34', '2026-05-09 15:18:45'),
(9, 4, 'Statut mis à jour', 'Votre demande \"je veux site web pour ma boutique\" est maintenant : Devis accepté', 'status_update', '/client/requests/1', 1, '2026-05-09 13:05:21', '2026-05-09 15:18:45'),
(10, 4, 'Statut mis à jour', 'Votre demande \"je veux site web pour ma boutique\" est maintenant : Terminée', 'status_update', '/client/requests/1', 1, '2026-05-09 13:06:01', '2026-05-09 15:18:45'),
(11, 4, 'Devis reçu', 'Vous avez reçu un devis : DEV-2026-00001. Consultez-le dans votre espace.', 'quote_sent', '/client/quotes/1', 1, '2026-05-09 13:25:27', '2026-05-09 15:18:45'),
(12, 5, 'Devis accepté', 'Med yassine Hajji a accepté le devis DEV-2026-00001', 'quote_accepted', '/admin/quotes/1', 1, '2026-05-09 13:27:46', '2026-05-09 15:45:50'),
(13, 4, 'Facture générée', 'Votre devis a été accepté. Une facture a été créée : FAC-2026-00001', 'invoice_generated', '/client/invoices/1', 1, '2026-05-09 13:27:46', '2026-05-09 15:18:45'),
(14, 6, 'Facture à valider', 'La facture FAC-2026-00001 attend votre validation.', 'invoice_to_validate', '/accountant/invoices/1', 1, '2026-05-09 13:27:46', '2026-05-09 15:25:29'),
(15, 4, 'Facture disponible', 'Votre facture FAC-2026-00001 est prête. Vous pouvez la régler.', 'invoice_validated', '/client/invoices/1', 1, '2026-05-09 13:29:59', '2026-05-09 15:18:45'),
(16, 6, 'Paiement reçu', 'Paiement en attente de validation pour la facture FAC-2026-00001', 'payment_pending', '/accountant/payments/1', 1, '2026-05-09 14:10:10', '2026-05-09 15:25:29'),
(17, 4, 'Paiement validé', 'Votre paiement de 120.00 MAD a été validé. Reçu disponible.', 'payment_validated', '/client/receipts/1', 1, '2026-05-09 14:21:58', '2026-05-09 15:18:45'),
(18, 5, 'Nouvelle demande reçue', 'Med yassine Hajji a envoyé une nouvelle demande : desgin pour mon site', 'new_request', '/admin/requests/2', 1, '2026-05-09 15:18:08', '2026-05-09 15:45:50'),
(19, 4, 'Discussion ouverte', 'Un admin a ouvert une discussion sur votre demande : desgin pour mon site', 'discussion_opened', '/client/requests/2', 1, '2026-05-09 15:18:25', '2026-05-09 15:18:45'),
(20, 4, 'Nouveau message', 'Un admin vous a répondu.', 'new_message', '/client/requests/2', 1, '2026-05-09 15:18:32', '2026-05-09 15:18:45'),
(21, 5, 'Nouveau message', 'Med yassine Hajji a envoyé un message.', 'new_message', '/admin/requests/2', 1, '2026-05-09 15:19:01', '2026-05-09 15:45:50'),
(22, 4, 'Devis reçu', 'Vous avez reçu un devis : DEV-2026-00002. Consultez-le dans votre espace.', 'quote_sent', '/client/quotes/3', 0, '2026-05-09 15:20:09', '2026-05-09 15:20:09'),
(23, 5, 'Devis accepté', 'Med yassine Hajji a accepté le devis DEV-2026-00002', 'quote_accepted', '/admin/quotes/3', 1, '2026-05-09 15:21:26', '2026-05-09 15:45:50'),
(24, 4, 'Facture générée', 'Votre devis a été accepté. Une facture a été créée : FAC-2026-00002', 'invoice_generated', '/client/invoices/2', 0, '2026-05-09 15:21:26', '2026-05-09 15:21:26'),
(25, 6, 'Facture à valider', 'La facture FAC-2026-00002 attend votre validation.', 'invoice_to_validate', '/accountant/invoices/2', 1, '2026-05-09 15:21:26', '2026-05-09 15:25:29'),
(26, 4, 'Facture disponible', 'Votre facture FAC-2026-00002 est prête. Vous pouvez la régler.', 'invoice_validated', '/client/invoices/2', 0, '2026-05-09 15:23:48', '2026-05-09 15:23:48'),
(27, 6, 'Paiement reçu', 'Paiement en attente de validation pour la facture FAC-2026-00002', 'payment_pending', '/accountant/payments/2', 1, '2026-05-09 15:24:44', '2026-05-09 15:25:29'),
(28, 4, 'Paiement validé', 'Votre paiement de 7,188.00 MAD a été validé. Reçu disponible.', 'payment_validated', '/client/receipts/2', 0, '2026-05-09 15:25:51', '2026-05-09 15:25:51'),
(29, 5, 'Nouvelle demande reçue', 'Med yassine Hajji a envoyé une nouvelle demande : okokjpok', 'new_request', '/admin/requests/3', 0, '2026-05-09 15:48:00', '2026-05-09 15:48:00'),
(30, 4, 'Discussion ouverte', 'Un admin a ouvert une discussion sur votre demande : okokjpok', 'discussion_opened', '/client/requests/3', 0, '2026-05-09 15:48:23', '2026-05-09 15:48:23'),
(31, 4, 'Nouveau message', 'Un admin vous a répondu.', 'new_message', '/client/requests/3', 0, '2026-05-09 15:48:33', '2026-05-09 15:48:33'),
(32, 5, 'Nouveau message', 'Med yassine Hajji a envoyé un message.', 'new_message', '/admin/requests/3', 0, '2026-05-09 15:48:52', '2026-05-09 15:48:52'),
(33, 4, 'Devis reçu', 'Vous avez reçu un devis : DEV-2026-00003. Consultez-le dans votre espace.', 'quote_sent', '/client/quotes/4', 0, '2026-05-09 15:50:03', '2026-05-09 15:50:03');

-- --------------------------------------------------------

--
-- Table structure for table `packs`
--

CREATE TABLE `packs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `badge_label` varchar(255) NOT NULL DEFAULT 'Sur devis',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `packs`
--

INSERT INTO `packs` (`id`, `name`, `slug`, `description`, `badge_label`, `is_active`, `order`, `created_at`, `updated_at`) VALUES
(3, '3jab sa7bi', '3jab-sa7bi', 'eslmfjqsf', 'Sur devis', 1, 0, '2026-05-09 15:16:43', '2026-05-09 15:16:43');

-- --------------------------------------------------------

--
-- Table structure for table `pack_services`
--

CREATE TABLE `pack_services` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `pack_id` bigint(20) UNSIGNED NOT NULL,
  `service_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `pack_services`
--

INSERT INTO `pack_services` (`id`, `pack_id`, `service_id`, `created_at`, `updated_at`) VALUES
(2, 3, 2, NULL, NULL),
(3, 3, 3, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `invoice_id` bigint(20) UNSIGNED NOT NULL,
  `client_id` bigint(20) UNSIGNED NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `method` enum('manual','online_mock','bank_transfer','cash') NOT NULL DEFAULT 'manual',
  `status` enum('pending','success','failed','rejected') NOT NULL DEFAULT 'pending',
  `transaction_reference` varchar(255) DEFAULT NULL,
  `payment_proof` varchar(255) DEFAULT NULL,
  `accountant_comment` text DEFAULT NULL,
  `validated_by_accountant_id` bigint(20) UNSIGNED DEFAULT NULL,
  `paid_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `invoice_id`, `client_id`, `amount`, `method`, `status`, `transaction_reference`, `payment_proof`, `accountant_comment`, `validated_by_accountant_id`, `paid_at`, `created_at`, `updated_at`) VALUES
(1, 1, 4, 120.00, 'online_mock', 'success', NULL, 'payments/1/xPQ4XyaH2Bod9LWDWI4ufHrYGyxGc9RkkalGwjgs.png', NULL, 6, '2026-05-09 14:21:57', '2026-05-09 14:10:10', '2026-05-09 14:21:57'),
(2, 2, 4, 7188.00, 'online_mock', 'success', NULL, 'payments/2/gsF8npdGRv9l8GN9w7B78Caz3uFHso4DNTI1vDhH.png', NULL, 6, '2026-05-09 15:25:50', '2026-05-09 15:24:44', '2026-05-09 15:25:50');

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(8, 'App\\Models\\User', 2, 'auth_token', '3dcce0406b147869e5a7be792932824898ceb53f100bf59e05f4fb0a237d6b52', '[\"*\"]', NULL, NULL, '2026-05-09 11:56:36', '2026-05-09 11:56:36'),
(9, 'App\\Models\\User', 3, 'auth_token', '1a75e5b4f60b28cae0bb36a99c026f92817ff60d69ea522d31680743b215dd8b', '[\"*\"]', '2026-05-09 11:57:59', NULL, '2026-05-09 11:57:59', '2026-05-09 11:57:59'),
(39, 'App\\Models\\User', 1, 'auth_token', 'a4014e2e10db91287611b078f3364ac39afac3c02456d326a4ed1f62b7fad370', '[\"*\"]', '2026-05-09 13:25:05', NULL, '2026-05-09 13:25:05', '2026-05-09 13:25:05'),
(62, 'App\\Models\\User', 5, 'auth_token', 'fa59726e9de4ea128d10aca5dcc215bf0d02466350f311ffc701dde315f28347', '[\"*\"]', '2026-05-09 15:50:21', NULL, '2026-05-09 15:45:38', '2026-05-09 15:50:21'),
(64, 'App\\Models\\User', 6, 'auth_token', '498c0e0f4d3f854731cf30a709b5c21d87879fd06de24b75773020497374784f', '[\"*\"]', '2026-05-09 15:56:55', NULL, '2026-05-09 15:50:52', '2026-05-09 15:56:55');

-- --------------------------------------------------------

--
-- Table structure for table `quotes`
--

CREATE TABLE `quotes` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `quote_number` varchar(255) NOT NULL,
  `client_id` bigint(20) UNSIGNED NOT NULL,
  `service_request_id` bigint(20) UNSIGNED NOT NULL,
  `subtotal` decimal(12,2) NOT NULL DEFAULT 0.00,
  `discount_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `tax_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `total` decimal(12,2) NOT NULL DEFAULT 0.00,
  `status` enum('draft','sent','accepted','refused','expired','cancelled') NOT NULL DEFAULT 'draft',
  `notes` text DEFAULT NULL,
  `valid_until` date DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `quotes`
--

INSERT INTO `quotes` (`id`, `quote_number`, `client_id`, `service_request_id`, `subtotal`, `discount_amount`, `tax_amount`, `total`, `status`, `notes`, `valid_until`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'DEV-2026-00001', 4, 1, 100.00, 0.00, 20.00, 120.00, 'accepted', 'Test', '2099-12-31', 5, '2026-05-09 12:41:31', '2026-05-09 13:27:46'),
(3, 'DEV-2026-00002', 4, 2, 5990.00, 0.00, 1198.00, 7188.00, 'accepted', NULL, NULL, 5, '2026-05-09 15:20:09', '2026-05-09 15:21:26'),
(4, 'DEV-2026-00003', 4, 3, 3000.00, 0.00, 600.00, 3600.00, 'refused', 'dgsdgdfg', '2026-05-16', 5, '2026-05-09 15:50:03', '2026-05-09 15:50:16');

-- --------------------------------------------------------

--
-- Table structure for table `quote_items`
--

CREATE TABLE `quote_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `quote_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `quantity` decimal(10,2) NOT NULL DEFAULT 1.00,
  `unit_price` decimal(12,2) NOT NULL DEFAULT 0.00,
  `tax_rate` decimal(5,2) NOT NULL DEFAULT 20.00,
  `discount_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `total` decimal(12,2) NOT NULL DEFAULT 0.00,
  `order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `quote_items`
--

INSERT INTO `quote_items` (`id`, `quote_id`, `title`, `description`, `quantity`, `unit_price`, `tax_rate`, `discount_amount`, `total`, `order`, `created_at`, `updated_at`) VALUES
(1, 1, 'Service UI Test', 'Service UI Test', 1.00, 100.00, 20.00, 0.00, 100.00, 0, '2026-05-09 12:41:31', '2026-05-09 12:41:31'),
(3, 3, 'mrigl', 'mrigl', 1.00, 6000.00, 20.00, 10.00, 5990.00, 0, '2026-05-09 15:20:09', '2026-05-09 15:20:09'),
(4, 4, 'sdfsdgds', 'sdfsdgds', 1.00, 3000.00, 20.00, 0.00, 3000.00, 0, '2026-05-09 15:50:03', '2026-05-09 15:50:03');

-- --------------------------------------------------------

--
-- Table structure for table `receipts`
--

CREATE TABLE `receipts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `receipt_number` varchar(255) NOT NULL,
  `payment_id` bigint(20) UNSIGNED NOT NULL,
  `invoice_id` bigint(20) UNSIGNED NOT NULL,
  `client_id` bigint(20) UNSIGNED NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `pdf_path` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `receipts`
--

INSERT INTO `receipts` (`id`, `receipt_number`, `payment_id`, `invoice_id`, `client_id`, `amount`, `pdf_path`, `created_at`, `updated_at`) VALUES
(1, 'REC-2026-00001', 1, 1, 4, 120.00, 'receipts/REC-2026-00001.pdf', '2026-05-09 14:21:57', '2026-05-09 14:21:58'),
(2, 'REC-2026-00002', 2, 2, 4, 7188.00, 'receipts/REC-2026-00002.pdf', '2026-05-09 15:25:50', '2026-05-09 15:25:51');

-- --------------------------------------------------------

--
-- Table structure for table `request_files`
--

CREATE TABLE `request_files` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `service_request_id` bigint(20) UNSIGNED NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_type` varchar(255) NOT NULL,
  `file_size` bigint(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `request_files`
--

INSERT INTO `request_files` (`id`, `service_request_id`, `file_path`, `file_name`, `file_type`, `file_size`, `created_at`, `updated_at`) VALUES
(1, 1, 'requests/1/OWCpsIBdE419MwHSces6vJW611LDdvjOiKpCt1ab.png', 'ideogram-v3.0_manga_cinematic_scene_smartphone_glowing_in_farmer_s_hand_futuristic_interface_A-0.jpg', 'image/png', 1414785, '2026-05-09 12:30:20', '2026-05-09 12:30:20'),
(2, 2, 'requests/2/9MmPXQYujUfSiUrlsxeAw5LlmLbUDOULskb6lgSC.jpg', 'lucid-origin_manga_style_african_farmer_standing_in_a_dry_cracked_field_dramatic_sky_strong_s-0.jpg', 'image/jpeg', 634285, '2026-05-09 15:18:08', '2026-05-09 15:18:08'),
(3, 3, 'requests/3/WauPv15uyHpAIVllx2TtZUKUK8LOarhBhk0SHDBV.pdf', 'Commercial Video Guide (PI-CDIO).pdf', 'application/pdf', 282404, '2026-05-09 15:48:00', '2026-05-09 15:48:00');

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `icon` varchar(255) NOT NULL DEFAULT 'SparklesIcon',
  `image` varchar(255) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`id`, `name`, `slug`, `description`, `icon`, `image`, `category`, `order`, `is_active`, `created_at`, `updated_at`) VALUES
(2, 'Service UI Test', 'service-ui-test', '', 'SparklesIcon', NULL, 'design', 0, 1, '2026-05-09 12:26:04', '2026-05-09 12:26:04'),
(3, 'desgin', 'desgin', 'qsfmqsdfklm', 'desgin', 'services/lcCuQvb73xyWpnA1k4y8WOfcsLFBVMJua6F8DHvX.png', 'design', 1, 1, '2026-05-09 15:16:15', '2026-05-09 15:16:15'),
(4, 'jdid', 'jdid', 'iojooijojoijnoijopjoipjoijop', 'ioo', 'services/lfzlaBgSMK7b4Dn5u8ezKkBBgaaMAkLFphrAnGrE.jpg', 'video', 5, 1, '2026-05-09 15:47:18', '2026-05-09 15:47:18');

-- --------------------------------------------------------

--
-- Table structure for table `service_requests`
--

CREATE TABLE `service_requests` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `client_id` bigint(20) UNSIGNED NOT NULL,
  `service_id` bigint(20) UNSIGNED DEFAULT NULL,
  `pack_id` bigint(20) UNSIGNED DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `approximate_budget` varchar(255) DEFAULT NULL,
  `desired_deadline` date DEFAULT NULL,
  `status` enum('pending','discussion','quote_sent','quote_accepted','quote_refused','invoice_generated','payment_pending','paid','in_progress','completed','cancelled') NOT NULL DEFAULT 'pending',
  `assigned_admin_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `service_requests`
--

INSERT INTO `service_requests` (`id`, `client_id`, `service_id`, `pack_id`, `title`, `description`, `approximate_budget`, `desired_deadline`, `status`, `assigned_admin_id`, `created_at`, `updated_at`) VALUES
(1, 4, 2, NULL, 'je veux site web pour ma boutique', 'n7eb 3la site mizyen nbi3 fi dbach', '5001', '2026-06-30', 'invoice_generated', 5, '2026-05-09 12:30:20', '2026-05-09 13:27:46'),
(2, 4, 3, NULL, 'desgin pour mon site', 'fsdfsdvgsdgsdvgfqfsdgfsdgsfdgsdf', '6000', '2026-05-30', 'invoice_generated', 5, '2026-05-09 15:18:08', '2026-05-09 15:21:26'),
(3, 4, 4, NULL, 'okokjpok', 'oijoijoijoipjoinjoijoipjoijpoi', '7000', '2026-05-19', 'quote_refused', 5, '2026-05-09 15:48:00', '2026-05-09 15:50:16');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('client','admin','accountant') NOT NULL DEFAULT 'client',
  `google_id` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `phone`, `email_verified_at`, `password`, `role`, `google_id`, `avatar`, `is_active`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Client Test', 'client@example.com', NULL, NULL, '$2y$12$QxRixzxplg11Q7cyB7zCVuIrC.S5A.bfah4wUjFJfWtwCTIzkSlG2', 'client', NULL, NULL, 1, NULL, '2026-05-09 11:37:55', '2026-05-09 11:37:55'),
(2, 'Test Client 2', 'testclient2@example.com', '5551234', NULL, '$2y$12$1nRbRjwSkfc1AmrZVfnOYugO9a1PXfA3.RdREWAT1lGU88Pw36xrO', 'client', NULL, NULL, 1, NULL, '2026-05-09 11:56:36', '2026-05-09 11:56:36'),
(3, 'Test Client 3', 'testclient3@example.com', '5559999', NULL, '$2y$12$AxxUd9NXwMePCRt6G2o0zucZGpi/pzL7bp9naKQccBbwWvaOZL63a', 'client', NULL, NULL, 0, NULL, '2026-05-09 11:57:59', '2026-05-09 12:14:14'),
(4, 'Med yassine Hajji', 'medyassinehaji87@gmail.com', '56046336', NULL, '$2y$12$S6M4wuM09L4NJJOScivXzezOqoYnVmc0buFuZ6y23F8G.QPatxM8e', 'client', NULL, NULL, 1, NULL, '2026-05-09 11:59:24', '2026-05-09 11:59:24'),
(5, 'Admin F_MCOM', 'admin@fmcom.ma', '+212600000001', NULL, '$2y$12$KZ8JCfcqqfP3Kd96k964u.mvUc1s4NrOJQps2xkssw7Em0Vq3.MK.', 'admin', NULL, NULL, 1, NULL, '2026-05-09 12:04:19', '2026-05-09 12:05:01'),
(6, 'Comptable F_MCOM', 'comptable@fmcom.ma', '+212600000002', NULL, '$2y$12$yx/Jhh1MCNEZXwiz7H.j3.vb4Sfx4FYYT8OWd2NZG2k5DLhdDmDpG', 'accountant', NULL, NULL, 1, NULL, '2026-05-09 13:00:06', '2026-05-09 13:00:06');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `activity_logs_user_id_foreign` (`user_id`);

--
-- Indexes for table `agency_settings`
--
ALTER TABLE `agency_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `conversations`
--
ALTER TABLE `conversations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `conversations_service_request_id_foreign` (`service_request_id`),
  ADD KEY `conversations_client_id_foreign` (`client_id`),
  ADD KEY `conversations_admin_id_foreign` (`admin_id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `invoices`
--
ALTER TABLE `invoices`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `invoices_invoice_number_unique` (`invoice_number`),
  ADD KEY `invoices_client_id_foreign` (`client_id`),
  ADD KEY `invoices_service_request_id_foreign` (`service_request_id`),
  ADD KEY `invoices_quote_id_foreign` (`quote_id`),
  ADD KEY `invoices_validated_by_accountant_id_foreign` (`validated_by_accountant_id`),
  ADD KEY `invoices_created_by_foreign` (`created_by`);

--
-- Indexes for table `invoice_items`
--
ALTER TABLE `invoice_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `invoice_items_invoice_id_foreign` (`invoice_id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `messages_conversation_id_foreign` (`conversation_id`),
  ADD KEY `messages_sender_id_foreign` (`sender_id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notifications_user_id_foreign` (`user_id`);

--
-- Indexes for table `packs`
--
ALTER TABLE `packs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `packs_slug_unique` (`slug`);

--
-- Indexes for table `pack_services`
--
ALTER TABLE `pack_services`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pack_services_pack_id_foreign` (`pack_id`),
  ADD KEY `pack_services_service_id_foreign` (`service_id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `payments_invoice_id_foreign` (`invoice_id`),
  ADD KEY `payments_client_id_foreign` (`client_id`),
  ADD KEY `payments_validated_by_accountant_id_foreign` (`validated_by_accountant_id`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indexes for table `quotes`
--
ALTER TABLE `quotes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `quotes_quote_number_unique` (`quote_number`),
  ADD KEY `quotes_client_id_foreign` (`client_id`),
  ADD KEY `quotes_service_request_id_foreign` (`service_request_id`),
  ADD KEY `quotes_created_by_foreign` (`created_by`);

--
-- Indexes for table `quote_items`
--
ALTER TABLE `quote_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `quote_items_quote_id_foreign` (`quote_id`);

--
-- Indexes for table `receipts`
--
ALTER TABLE `receipts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `receipts_receipt_number_unique` (`receipt_number`),
  ADD KEY `receipts_payment_id_foreign` (`payment_id`),
  ADD KEY `receipts_invoice_id_foreign` (`invoice_id`),
  ADD KEY `receipts_client_id_foreign` (`client_id`);

--
-- Indexes for table `request_files`
--
ALTER TABLE `request_files`
  ADD PRIMARY KEY (`id`),
  ADD KEY `request_files_service_request_id_foreign` (`service_request_id`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `services_slug_unique` (`slug`);

--
-- Indexes for table `service_requests`
--
ALTER TABLE `service_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `service_requests_client_id_foreign` (`client_id`),
  ADD KEY `service_requests_service_id_foreign` (`service_id`),
  ADD KEY `service_requests_pack_id_foreign` (`pack_id`),
  ADD KEY `service_requests_assigned_admin_id_foreign` (`assigned_admin_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD UNIQUE KEY `users_google_id_unique` (`google_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `agency_settings`
--
ALTER TABLE `agency_settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `conversations`
--
ALTER TABLE `conversations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `invoices`
--
ALTER TABLE `invoices`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `invoice_items`
--
ALTER TABLE `invoice_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `packs`
--
ALTER TABLE `packs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `pack_services`
--
ALTER TABLE `pack_services`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT for table `quotes`
--
ALTER TABLE `quotes`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `quote_items`
--
ALTER TABLE `quote_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `receipts`
--
ALTER TABLE `receipts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `request_files`
--
ALTER TABLE `request_files`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `service_requests`
--
ALTER TABLE `service_requests`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `activity_logs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `conversations`
--
ALTER TABLE `conversations`
  ADD CONSTRAINT `conversations_admin_id_foreign` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `conversations_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `conversations_service_request_id_foreign` FOREIGN KEY (`service_request_id`) REFERENCES `service_requests` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `invoices`
--
ALTER TABLE `invoices`
  ADD CONSTRAINT `invoices_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `invoices_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `invoices_quote_id_foreign` FOREIGN KEY (`quote_id`) REFERENCES `quotes` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `invoices_service_request_id_foreign` FOREIGN KEY (`service_request_id`) REFERENCES `service_requests` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `invoices_validated_by_accountant_id_foreign` FOREIGN KEY (`validated_by_accountant_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `invoice_items`
--
ALTER TABLE `invoice_items`
  ADD CONSTRAINT `invoice_items_invoice_id_foreign` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_conversation_id_foreign` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_sender_id_foreign` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `pack_services`
--
ALTER TABLE `pack_services`
  ADD CONSTRAINT `pack_services_pack_id_foreign` FOREIGN KEY (`pack_id`) REFERENCES `packs` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `pack_services_service_id_foreign` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `payments_invoice_id_foreign` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `payments_validated_by_accountant_id_foreign` FOREIGN KEY (`validated_by_accountant_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `quotes`
--
ALTER TABLE `quotes`
  ADD CONSTRAINT `quotes_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `quotes_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `quotes_service_request_id_foreign` FOREIGN KEY (`service_request_id`) REFERENCES `service_requests` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `quote_items`
--
ALTER TABLE `quote_items`
  ADD CONSTRAINT `quote_items_quote_id_foreign` FOREIGN KEY (`quote_id`) REFERENCES `quotes` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `receipts`
--
ALTER TABLE `receipts`
  ADD CONSTRAINT `receipts_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `receipts_invoice_id_foreign` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `receipts_payment_id_foreign` FOREIGN KEY (`payment_id`) REFERENCES `payments` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `request_files`
--
ALTER TABLE `request_files`
  ADD CONSTRAINT `request_files_service_request_id_foreign` FOREIGN KEY (`service_request_id`) REFERENCES `service_requests` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `service_requests`
--
ALTER TABLE `service_requests`
  ADD CONSTRAINT `service_requests_assigned_admin_id_foreign` FOREIGN KEY (`assigned_admin_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `service_requests_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `service_requests_pack_id_foreign` FOREIGN KEY (`pack_id`) REFERENCES `packs` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `service_requests_service_id_foreign` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
