-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: do_an_kiet
-- ------------------------------------------------------
-- Server version	9.5.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '276a749b-b97c-11f0-a025-33016a13216d:1-1021';

--
-- Table structure for table `appointments`
--

DROP TABLE IF EXISTS `appointments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appointments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nguoi_dung_id` bigint NOT NULL,
  `dai_ly_id` bigint NOT NULL,
  `ngay_gio_hen` datetime NOT NULL,
  `ghi_chu` text,
  `trang_thai` enum('Scheduled','Completed','Cancelled') NOT NULL DEFAULT 'Scheduled',
  `thoi_gian_tao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `nguoi_dung_id` (`nguoi_dung_id`),
  KEY `dai_ly_id` (`dai_ly_id`),
  CONSTRAINT `appointments_ibfk_1` FOREIGN KEY (`nguoi_dung_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `appointments_ibfk_2` FOREIGN KEY (`dai_ly_id`) REFERENCES `dealers` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointments`
--

LOCK TABLES `appointments` WRITE;
/*!40000 ALTER TABLE `appointments` DISABLE KEYS */;
/*!40000 ALTER TABLE `appointments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `car_configurations`
--

DROP TABLE IF EXISTS `car_configurations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `car_configurations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `xe_id` bigint NOT NULL,
  `phien_ban_id` bigint DEFAULT NULL,
  `mau_ngoai_that` varchar(100) NOT NULL,
  `mau_noi_that` varchar(100) NOT NULL,
  `loai_pin` varchar(100) NOT NULL,
  `loai_noi_that` varchar(100) NOT NULL,
  `tong_gia` decimal(15,2) NOT NULL,
  `thoi_gian_tao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `xe_id` (`xe_id`),
  KEY `phien_ban_id` (`phien_ban_id`),
  CONSTRAINT `car_configurations_ibfk_1` FOREIGN KEY (`xe_id`) REFERENCES `cars` (`id`) ON DELETE CASCADE,
  CONSTRAINT `car_configurations_ibfk_2` FOREIGN KEY (`phien_ban_id`) REFERENCES `car_versions` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `car_configurations`
--

LOCK TABLES `car_configurations` WRITE;
/*!40000 ALTER TABLE `car_configurations` DISABLE KEYS */;
INSERT INTO `car_configurations` VALUES (1,1,1,'Trắng','Đen','LFP 18.64 kWh','Standard',302000000.00,'2026-04-12 09:00:39'),(2,2,3,'Đỏ','Xám','LFP 37.23 kWh','Premium',529000000.00,'2026-04-12 09:00:39'),(3,2,3,'Cam','Đen','Pin thuê','Da tổng hợp',500000000.00,'2026-04-13 07:21:15'),(4,3,4,'Trắng','Đen','Mua pin','Da tổng hợp',600000000.00,'2026-04-13 07:22:24'),(5,1,2,'Xanh dương','Đen','Mua pin','Da tổng hợp',350000000.00,'2026-04-13 07:24:12'),(6,1,1,'Trắng cơ bản','Đen','Pin thuê(cọc)','Da công nghiệp Thái',317000000.00,'2026-04-22 09:06:59'),(7,1,2,'Xanh lục bảo','Xanh đen','Pin thuê(cọc)','Da Nappa tiêu chuẩn',337000000.00,'2026-04-22 09:07:48'),(8,1,1,'Đỏ','Xanh đen','Pin mua','Da công nghiệp Thái',377000000.00,'2026-04-22 09:08:15'),(9,1,2,'Xanh lục bảo','Xanh đen','Pin mua','Da Nappa tiêu chuẩn',397000000.00,'2026-04-22 09:08:29'),(10,2,19,'Trắng cơ bản','Đen','Pin thuê(cọc)','Da công nghiệp Thái',520200000.00,'2026-04-22 09:12:05'),(11,2,3,'Xanh dương nóc trắng (nâng cao)','Xanh đen','Pin thuê(cọc)','Da Nappa tiêu chuẩn',558200000.00,'2026-04-22 09:12:28'),(12,2,19,'Đỏ','Đen','Pin mua','Da công nghiệp Thái',585200000.00,'2026-04-22 09:12:45'),(13,2,19,'Đỏ','Đen','Pin mua','Da công nghiệp Thái',585200000.00,'2026-04-22 09:13:38'),(14,2,3,'Xanh dương nóc trắng (nâng cao)','Xanh đen','Pin mua','Da Nappa tiêu chuẩn',623200000.00,'2026-04-22 09:13:48');
/*!40000 ALTER TABLE `car_configurations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `car_images`
--

DROP TABLE IF EXISTS `car_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `car_images` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `xe_id` bigint NOT NULL,
  `duong_dan_hinh_anh` varchar(500) NOT NULL,
  `loai_anh` enum('main','gallery','video_thumbnail') NOT NULL DEFAULT 'gallery',
  `thu_tu_sap_xep` smallint DEFAULT '0',
  `thoi_gian_tao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `xe_id` (`xe_id`),
  CONSTRAINT `car_images_ibfk_1` FOREIGN KEY (`xe_id`) REFERENCES `cars` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `car_images`
--

LOCK TABLES `car_images` WRITE;
/*!40000 ALTER TABLE `car_images` DISABLE KEYS */;
INSERT INTO `car_images` VALUES (1,1,'https://vinfastotominhdao.vn/wp-content/uploads/VinFast-VF3-mau-trang-noc-trang-798x466.jpg','main',1,'2026-04-12 09:00:39'),(2,1,'https://vinfastotominhdao.vn/wp-content/uploads/VinFast-VF3-noi-that-798x466.jpg','gallery',2,'2026-04-12 09:00:39'),(3,1,'https://vinfastotominhdao.vn/wp-content/uploads/VinFast-VF3-mau-hong-798x466.jpg','gallery',3,'2026-04-12 09:00:39'),(4,2,'https://vinfastotominhdao.vn/wp-content/uploads/vf5-2023-798x466.jpg','main',1,'2026-04-12 09:00:39'),(5,2,'https://vinfastotominhdao.vn/wp-content/uploads/VinFast-VF5-noi-that.jpg','gallery',2,'2026-04-12 09:00:39'),(6,3,'https://vinfastotominhdao.vn/wp-content/uploads/VF6-2023-798x466.jpg','main',1,'2026-04-12 09:00:39'),(7,4,'https://vinfastotominhdao.vn/wp-content/uploads/vf7-2023-798x466.jpg','main',1,'2026-04-12 09:00:39'),(8,5,'https://vinfastotominhdao.vn/wp-content/uploads/VinFast-VF8-1-798x466.jpg','main',1,'2026-04-12 09:00:39'),(9,6,'https://vinfastotominhdao.vn/wp-content/uploads/VinFast-VF9-9-798x466.jpg','main',1,'2026-04-12 09:00:39'),(10,7,'https://vinfastotominhdao.vn/wp-content/uploads/VinFast-Minio-Green-798x466.jpeg','main',1,'2026-04-12 09:00:39'),(11,8,'https://vinfastotominhdao.vn/wp-content/uploads/Herio-green1-798x466.jpg','main',1,'2026-04-12 09:00:39'),(12,9,'https://vinfastotominhdao.vn/wp-content/uploads/Limo-green-1-798x466.jpg','main',1,'2026-04-12 09:00:39'),(13,10,'https://vinfastotominhdao.vn/wp-content/uploads/Nerio-Green-1-798x466.jpg','main',1,'2026-04-12 09:00:39'),(14,11,'https://vinfastotominhdao.vn/wp-content/uploads/minivan-white-03-798x466.webp','main',1,'2026-04-12 09:00:39');
/*!40000 ALTER TABLE `car_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `car_versions`
--

DROP TABLE IF EXISTS `car_versions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `car_versions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `xe_id` bigint NOT NULL,
  `ten_phien_ban` varchar(100) NOT NULL,
  `gia_co_ban` decimal(15,2) NOT NULL,
  `dung_luong_pin` float NOT NULL,
  `quang_duong_di_chuyen` int NOT NULL,
  `so_cho_ngoi` tinyint DEFAULT '5',
  `thoi_gian_tao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `xe_id` (`xe_id`),
  CONSTRAINT `car_versions_ibfk_1` FOREIGN KEY (`xe_id`) REFERENCES `cars` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `car_versions`
--

LOCK TABLES `car_versions` WRITE;
/*!40000 ALTER TABLE `car_versions` DISABLE KEYS */;
INSERT INTO `car_versions` VALUES (1,1,'Eco',302000000.00,18.64,210,4,'2026-04-12 09:00:39',0),(2,1,'Plus',315000000.00,18.64,210,4,'2026-04-12 09:00:39',0),(3,2,'Plus',529000000.00,37.23,300,5,'2026-04-12 09:00:39',0),(4,3,'Eco',689000000.00,59.6,399,5,'2026-04-12 09:00:39',0),(5,3,'Plus',745000000.00,59.6,381,5,'2026-04-12 09:00:39',0),(6,4,'Eco',789000000.00,59.6,498,5,'2026-04-12 09:00:39',0),(7,4,'Plus',949000000.00,75.3,431,5,'2026-04-12 09:00:39',0),(8,5,'Eco',1019000000.00,87.7,531,5,'2026-04-12 09:00:39',0),(9,5,'Plus',1199000000.00,87.7,457,5,'2026-04-12 09:00:39',0),(10,6,'Eco',1499000000.00,123,485,7,'2026-04-12 09:00:39',0),(11,6,'Plus',1699000000.00,123,626,7,'2026-04-12 09:00:39',0),(12,7,'Standard',269000000.00,15.2,170,4,'2026-04-12 09:00:39',0),(13,8,'Standard',499000000.00,37.23,326,5,'2026-04-12 09:00:39',0),(14,9,'Standard',749000000.00,60.13,450,7,'2026-04-12 09:00:39',0),(15,10,'Standard',668000000.00,60,318,5,'2026-04-12 09:00:39',0),(16,11,'Standard',285000000.00,40,150,2,'2026-04-12 09:00:39',0),(17,11,'PLus',300000000.00,50,200,2,'2026-04-21 10:13:32',0),(18,11,'Extra',350000000.00,45,200,3,'2026-04-21 10:13:47',0),(19,2,'Eco',500000000.00,37.23,320,5,'2026-04-22 09:09:53',0);
/*!40000 ALTER TABLE `car_versions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cars`
--

DROP TABLE IF EXISTS `cars`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cars` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `mau_xe` varchar(100) NOT NULL,
  `mo_ta` text,
  `trang_thai_hoat_dong` enum('active','inactive') NOT NULL DEFAULT 'active',
  `thoi_gian_tao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cars`
--

LOCK TABLES `cars` WRITE;
/*!40000 ALTER TABLE `cars` DISABLE KEYS */;
INSERT INTO `cars` VALUES (1,'VF 3','Mini car điện cỡ nhỏ, giá phổ thông, thiết kế nhỏ gọn phù hợp di chuyển đô thị Việt Nam.','active','2026-04-12 09:00:39',0),(2,'VF 5','SUV điện hạng A hiện đại, không gian rộng rãi, công nghệ thông minh cho gia đình trẻ.','active','2026-04-12 09:00:39',0),(3,'VF 6','SUV hạng B thiết kế tinh tế bởi Torino Design, hiệu suất cao, phù hợp gia đình.','active','2026-04-12 09:00:39',0),(4,'VF 7','SUV hạng C, động cơ mạnh, cao cấp, nội thất sang trọng','active','2026-04-12 09:00:39',0),(5,'VF8','SUV hạng D, sang trọng, ADAS cao cấp','active','2026-04-12 09:00:39',0),(6,'VF9','SUV cao cấp 6-7 chỗ, pin lớn, đẳng cấp flagship','active','2026-04-12 09:00:39',0),(7,'Minio Green','Xe điện mini dịch vụ, giá rẻ, tiết kiệm, lý tưởng cho taxi/grab.','active','2026-04-12 09:00:39',0),(8,'Herio Green','SUV điện dịch vụ 5 chỗ, quãng đường dài, chi phí vận hành thấp.','active','2026-04-12 09:00:39',0),(9,'Limo Green','MPV điện 7 chỗ dịch vụ, không gian rộng, phù hợp vận chuyển.','active','2026-04-12 09:00:39',0),(10,'Nerio Green','Xe điện dịch vụ cao cấp, tiện nghi, quãng đường tốt.','active','2026-04-12 09:00:39',0),(11,'EC Van','Xe van điện dịch vụ vận tải hàng hóa, dung lượng lớn.','active','2026-04-12 09:00:39',0);
/*!40000 ALTER TABLE `cars` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nguoi_dung_id` bigint NOT NULL,
  `xe_id` bigint NOT NULL,
  `cau_hinh_xe` json NOT NULL,
  `gia` decimal(15,2) NOT NULL,
  `so_luong` int DEFAULT '1',
  `thoi_gian_tao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `nguoi_dung_id` (`nguoi_dung_id`),
  KEY `xe_id` (`xe_id`),
  CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`nguoi_dung_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`xe_id`) REFERENCES `cars` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
INSERT INTO `cart_items` VALUES (3,1,1,'{\"loaiPin\": \"LFP 18.64 kWh\", \"mauNoiThat\": \"Đen\", \"phienBanId\": \"1\", \"loaiNoiThat\": \"Standard\", \"mauNgoaiThat\": \"Trắng\"}',302000000.00,1,'2026-04-12 19:45:27'),(4,1,2,'{\"loaiPin\": \"LFP 37.23 kWh\", \"mauNoiThat\": \"Xám\", \"phienBanId\": \"3\", \"loaiNoiThat\": \"Premium\", \"mauNgoaiThat\": \"Đỏ\"}',529000000.00,1,'2026-04-12 19:45:44'),(6,4,1,'{\"loaiPin\": \"LFP 18.64 kWh\", \"mauNoiThat\": \"Đen\", \"phienBanId\": \"1\", \"loaiNoiThat\": \"Standard\", \"mauNgoaiThat\": \"Trắng\"}',302000000.00,1,'2026-04-12 23:19:20'),(7,4,3,'{\"loaiPin\": \"Mua pin\", \"mauNoiThat\": \"Đen\", \"phienBanId\": \"4\", \"loaiNoiThat\": \"Da tổng hợp\", \"mauNgoaiThat\": \"Trắng\"}',600000000.00,1,'2026-04-13 00:23:14');
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `consultations`
--

DROP TABLE IF EXISTS `consultations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `consultations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nguoi_dung_id` bigint DEFAULT NULL,
  `ho_ten` varchar(255) NOT NULL,
  `so_dien_thoai` varchar(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `mau_xe_quan_tam` varchar(100) NOT NULL,
  `noi_dung` text NOT NULL,
  `muc_do_uu_tien` enum('NORMAL','HIGH') NOT NULL DEFAULT 'NORMAL',
  `anh_dinh_kem` varchar(500) NOT NULL,
  `ma_tracking` varchar(50) NOT NULL,
  `trang_thai_xy_ly` enum('New','InProgress','Resolved') NOT NULL DEFAULT 'New',
  `thoi_gian_tao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ma_tracking` (`ma_tracking`),
  KEY `nguoi_dung_id` (`nguoi_dung_id`),
  CONSTRAINT `consultations_ibfk_1` FOREIGN KEY (`nguoi_dung_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `consultations`
--

LOCK TABLES `consultations` WRITE;
/*!40000 ALTER TABLE `consultations` DISABLE KEYS */;
INSERT INTO `consultations` VALUES (1,5,'Trương Văn Kiệt','0312456789','kiet2@gmail.com','VF 3','test','NORMAL','','TV20260419BFE2','New','2026-04-19 09:22:29'),(2,5,'Trương Văn Kiệt','0312456789','kiet2@gmail.com','VF 6','test2','NORMAL','','TV20260419FE3F','New','2026-04-19 09:29:55'),(3,5,'Trương Văn Kiệt','0312456789','kiet2@gmail.com','VF 8','test','NORMAL','','TV202604193D8C','New','2026-04-19 09:44:24');
/*!40000 ALTER TABLE `consultations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dealer_inventory`
--

DROP TABLE IF EXISTS `dealer_inventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dealer_inventory` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `dai_ly_id` bigint NOT NULL,
  `xe_id` bigint NOT NULL,
  `cau_hinh_xe` json NOT NULL,
  `so_luong_ton_kho` int NOT NULL DEFAULT '0',
  `nguong_canh_bao_ton_thap` int DEFAULT '5',
  `thoi_gian_tao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `dai_ly_id` (`dai_ly_id`),
  KEY `xe_id` (`xe_id`),
  CONSTRAINT `dealer_inventory_ibfk_1` FOREIGN KEY (`dai_ly_id`) REFERENCES `dealers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `dealer_inventory_ibfk_2` FOREIGN KEY (`xe_id`) REFERENCES `cars` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dealer_inventory`
--

LOCK TABLES `dealer_inventory` WRITE;
/*!40000 ALTER TABLE `dealer_inventory` DISABLE KEYS */;
INSERT INTO `dealer_inventory` VALUES (1,1,1,'{\"mau_noi\": \"Đen\", \"loai_pin\": \"LFP tiêu chuẩn\", \"mau_ngoai\": \"Trắng cơ bản\", \"phien_ban\": \"Eco\"}',10,5,'2026-04-13 04:31:52'),(2,1,2,'{\"mau_noi\": \"Đen\", \"loai_pin\": \"LFP tiêu chuẩn\", \"mau_ngoai\": \"Trắng cơ bản\", \"phien_ban\": \"Plus\"}',10,5,'2026-04-13 04:31:52'),(3,1,3,'{\"mau_noi\": \"Đen\", \"loai_pin\": \"LFP tiêu chuẩn\", \"mau_ngoai\": \"Trắng cơ bản\", \"phien_ban\": \"Eco\"}',10,5,'2026-04-13 04:31:52'),(4,1,4,'{\"mau_noi\": \"Đen\", \"loai_pin\": \"LFP tiêu chuẩn\", \"mau_ngoai\": \"Trắng cơ bản\", \"phien_ban\": \"Eco\"}',10,5,'2026-04-13 04:31:52'),(5,1,5,'{\"mau_noi\": \"Đen\", \"loai_pin\": \"LFP tiêu chuẩn\", \"mau_ngoai\": \"Trắng cơ bản\", \"phien_ban\": \"Eco\"}',10,5,'2026-04-13 04:31:52'),(6,1,6,'{\"mau_noi\": \"Đen\", \"loai_pin\": \"LFP tiêu chuẩn\", \"mau_ngoai\": \"Trắng cơ bản\", \"phien_ban\": \"Eco\"}',10,5,'2026-04-13 04:31:52'),(7,1,7,'{\"mau_noi\": \"Đen\", \"loai_pin\": \"LFP tiêu chuẩn\", \"mau_ngoai\": \"Trắng cơ bản\", \"phien_ban\": \"Eco\"}',10,5,'2026-04-13 04:31:52'),(8,1,8,'{\"mau_noi\": \"Đen\", \"loai_pin\": \"LFP tiêu chuẩn\", \"mau_ngoai\": \"Trắng cơ bản\", \"phien_ban\": \"Eco\"}',10,5,'2026-04-13 04:31:52'),(9,1,9,'{\"mau_noi\": \"Đen\", \"loai_pin\": \"LFP tiêu chuẩn\", \"mau_ngoai\": \"Trắng cơ bản\", \"phien_ban\": \"Eco\"}',10,5,'2026-04-13 04:31:52'),(10,1,10,'{\"mau_noi\": \"Đen\", \"loai_pin\": \"LFP tiêu chuẩn\", \"mau_ngoai\": \"Trắng cơ bản\", \"phien_ban\": \"Eco\"}',10,5,'2026-04-13 04:31:52'),(11,1,11,'{\"mau_noi\": \"Đen\", \"loai_pin\": \"LFP tiêu chuẩn\", \"mau_ngoai\": \"Trắng cơ bản\", \"phien_ban\": \"Eco\"}',10,5,'2026-04-13 04:31:52');
/*!40000 ALTER TABLE `dealer_inventory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dealers`
--

DROP TABLE IF EXISTS `dealers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dealers` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `ten_dai_ly` varchar(255) NOT NULL,
  `dia_chi` text NOT NULL,
  `so_dien_thoai_dai_ly` varchar(20) NOT NULL,
  `tinh_thanh_pho` varchar(100) NOT NULL,
  `thoi_gian_tao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dealers`
--

LOCK TABLES `dealers` WRITE;
/*!40000 ALTER TABLE `dealers` DISABLE KEYS */;
INSERT INTO `dealers` VALUES (1,'Đại Lý VinFast Bắc Ninh','Yên Phong, Bắc Ninh','0123456789','Bắc Ninh','2026-04-13 02:40:29');
/*!40000 ALTER TABLE `dealers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `options`
--

DROP TABLE IF EXISTS `options`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `options` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `xe_id` bigint NOT NULL,
  `loai_tuy_chon` enum('exterior_color','interior_color','battery_type','interior_type') NOT NULL,
  `ten_tuy_chon` varchar(100) NOT NULL,
  `anh_huong_den_gia` decimal(18,2) DEFAULT NULL,
  `trang_thai_kha_dung` tinyint(1) DEFAULT '1',
  `thoi_gian_tao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `xe_id` (`xe_id`),
  CONSTRAINT `options_ibfk_1` FOREIGN KEY (`xe_id`) REFERENCES `cars` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=93 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `options`
--

LOCK TABLES `options` WRITE;
/*!40000 ALTER TABLE `options` DISABLE KEYS */;
INSERT INTO `options` VALUES (1,1,'exterior_color','Trắng cơ bản',0.00,1,'2026-04-12 09:00:39'),(2,1,'exterior_color','Đỏ',0.00,1,'2026-04-12 09:00:39'),(3,1,'exterior_color','Xanh dương nóc trắng (nâng cao)',8000000.00,1,'2026-04-12 09:00:39'),(4,1,'interior_color','Đen',0.00,1,'2026-04-12 09:00:39'),(5,1,'interior_color','Xanh đen',0.00,1,'2026-04-12 09:00:39'),(6,1,'battery_type','Pin thuê(cọc)',10000000.00,1,'2026-04-12 09:00:39'),(7,2,'exterior_color','Trắng cơ bản',0.00,1,'2026-04-12 09:00:39'),(8,2,'exterior_color','Đỏ',0.00,1,'2026-04-12 09:00:39'),(9,2,'exterior_color','Xanh dương nóc trắng (nâng cao)',8000000.00,1,'2026-04-12 09:00:39'),(10,2,'interior_color','Đen',0.00,1,'2026-04-12 09:00:39'),(11,2,'interior_color','Xanh đen',0.00,1,'2026-04-12 09:00:39'),(12,2,'battery_type','Pin thuê(cọc)',15000000.00,1,'2026-04-12 09:00:39'),(13,3,'exterior_color','Trắng cơ bản',0.00,1,'2026-04-12 09:00:39'),(14,3,'exterior_color','Đỏ',0.00,1,'2026-04-12 09:00:39'),(15,3,'exterior_color','Xanh dương nóc trắng (nâng cao)',8000000.00,1,'2026-04-12 09:00:39'),(16,3,'interior_color','Đen',0.00,1,'2026-04-12 09:00:39'),(17,3,'interior_color','Xanh đen',0.00,1,'2026-04-12 09:00:39'),(18,3,'battery_type','Pin thuê(cọc)',30000000.00,1,'2026-04-12 09:00:39'),(19,4,'exterior_color','Trắng cơ bản',0.00,1,'2026-04-12 09:00:39'),(20,4,'exterior_color','Đỏ',0.00,1,'2026-04-12 09:00:39'),(21,4,'exterior_color','Xanh dương nóc trắng (nâng cao)',8000000.00,1,'2026-04-12 09:00:39'),(22,4,'interior_color','Đen',0.00,1,'2026-04-12 09:00:39'),(23,4,'interior_color','Xanh đen',0.00,1,'2026-04-12 09:00:39'),(24,4,'battery_type','Pin thuê(cọc)',41000000.00,1,'2026-04-12 09:00:39'),(25,5,'exterior_color','Trắng cơ bản',0.00,1,'2026-04-12 09:00:39'),(26,5,'exterior_color','Đỏ',0.00,1,'2026-04-12 09:00:39'),(27,5,'exterior_color','Xanh dương nóc trắng (nâng cao)',8000000.00,1,'2026-04-12 09:00:39'),(28,5,'interior_color','Đen',0.00,1,'2026-04-12 09:00:39'),(29,5,'interior_color','Xanh đen',0.00,1,'2026-04-12 09:00:39'),(30,5,'battery_type','Pin thuê(cọc)',50000000.00,1,'2026-04-12 09:00:39'),(31,6,'exterior_color','Trắng cơ bản',0.00,1,'2026-04-12 09:00:39'),(32,6,'exterior_color','Đỏ',0.00,1,'2026-04-12 09:00:39'),(33,6,'exterior_color','Xanh dương nóc trắng (nâng cao)',8000000.00,1,'2026-04-12 09:00:39'),(34,6,'interior_color','Đen',0.00,1,'2026-04-12 09:00:39'),(35,6,'interior_color','Xanh đen',0.00,1,'2026-04-12 09:00:39'),(36,6,'battery_type','Pin thuê(cọc)',70000000.00,1,'2026-04-12 09:00:39'),(37,1,'exterior_color','Xanh lục bảo',6000000.00,1,'2026-04-22 02:16:48'),(38,6,'battery_type','Pin mua',480000000.00,1,'2026-04-22 08:12:33'),(39,6,'battery_type','Pin mua',493000000.00,1,'2026-04-22 08:13:22'),(40,5,'battery_type','Pin mua',384000000.00,1,'2026-04-22 08:14:02'),(41,4,'battery_type','Pin mua',100000000.00,1,'2026-04-22 08:14:24'),(42,3,'battery_type','Pin mua',90000000.00,1,'2026-04-22 08:15:03'),(43,2,'battery_type','Pin mua',80000000.00,1,'2026-04-22 08:15:26'),(44,1,'battery_type','Pin mua',70000000.00,1,'2026-04-22 08:19:31'),(45,6,'interior_type','Da công nghiệp Thái',6760000.00,1,'2026-04-22 08:26:03'),(46,6,'interior_type','Da Nappa tiêu chuẩn',8060000.00,1,'2026-04-22 08:26:31'),(47,6,'interior_type','Da Nappa thế hệ mới',10140000.00,1,'2026-04-22 08:26:52'),(48,6,'interior_type','Da Nappa VIP thế hệ mới',17680000.00,1,'2026-04-22 08:27:21'),(49,6,'interior_type','Da bò tái sinh Diamon Pro',13600000.00,1,'2026-04-22 08:27:50'),(50,6,'interior_type','Da Bò Ý nội địa - Boston',21840000.00,1,'2026-04-22 08:28:14'),(51,6,'interior_type','Da Nappa Brazin',32760000.00,1,'2026-04-22 08:31:19'),(52,6,'interior_type','Da Nappa tự nhiên nội địa Ý',52650000.00,1,'2026-04-22 08:31:51'),(53,5,'interior_type','Da công nghiệp Thái',5200000.00,1,'2026-04-22 08:33:02'),(54,5,'interior_type','Da Nappa tiêu chuẩn',6200000.00,1,'2026-04-22 08:33:17'),(55,5,'interior_type','Da Nappa thế hệ mới',7800000.00,1,'2026-04-22 08:33:39'),(56,5,'interior_type','Da Nappa VIP thế hệ mới',9600000.00,1,'2026-04-22 08:33:56'),(57,5,'interior_type','Da bò tái sinh Diamon Pro',13600000.00,1,'2026-04-22 08:34:18'),(58,5,'interior_type','Da Bò Ý nội địa - Boston',16800000.00,1,'2026-04-22 08:34:35'),(59,5,'interior_type','Da Nappa Brazin',25200000.00,1,'2026-04-22 08:34:50'),(60,5,'interior_type','Da Nappa tự nhiên nội địa Ý',40500000.00,1,'2026-04-22 08:35:06'),(61,4,'interior_type','Da công nghiệp Thái',5200000.00,1,'2026-04-22 08:42:11'),(62,4,'interior_type','Da Nappa tiêu chuẩn',6200000.00,1,'2026-04-22 08:42:30'),(63,4,'interior_type','Da Nappa thế hệ mới',7800000.00,1,'2026-04-22 08:42:55'),(64,4,'interior_type','Da Nappa VIP thế hệ mới',9600000.00,1,'2026-04-22 08:43:11'),(65,4,'interior_type','Da bò tái sinh Diamon Pro',13600000.00,1,'2026-04-22 08:43:27'),(66,4,'interior_type','Da Bò Ý nội địa - Boston',16800000.00,1,'2026-04-22 08:43:45'),(67,4,'interior_type','Da Nappa Brazin',25200000.00,1,'2026-04-22 08:43:58'),(68,4,'interior_type','Da Nappa tự nhiên nội địa Ý',40500000.00,1,'2026-04-22 08:44:10'),(69,3,'interior_type','Da công nghiệp Thái',5200000.00,1,'2026-04-22 08:44:49'),(70,3,'interior_type','Da Nappa tiêu chuẩn',6200000.00,1,'2026-04-22 08:45:01'),(71,3,'interior_type','Da Nappa thế hệ mới',7800000.00,1,'2026-04-22 08:45:17'),(72,3,'interior_type','Da Nappa VIP thế hệ mới',9600000.00,1,'2026-04-22 08:45:33'),(73,3,'interior_type','Da bò tái sinh Diamon Pro',13600000.00,1,'2026-04-22 08:45:51'),(74,3,'interior_type','Da Bò Ý nội địa - Boston',16800000.00,1,'2026-04-22 08:46:08'),(75,3,'interior_type','Da Nappa Brazin',25200000.00,1,'2026-04-22 08:46:22'),(76,3,'interior_type','Da Nappa tự nhiên nội địa Ý',40500000.00,1,'2026-04-22 08:46:38'),(77,2,'interior_type','Da công nghiệp Thái',5200000.00,1,'2026-04-22 08:47:42'),(78,2,'interior_type','Da Nappa tiêu chuẩn',6200000.00,1,'2026-04-22 08:47:54'),(79,2,'interior_type','Da Nappa thế hệ mới',7800000.00,1,'2026-04-22 08:48:10'),(80,2,'interior_type','Da Nappa VIP thế hệ mới',9600000.00,1,'2026-04-22 08:48:23'),(81,2,'interior_type','Da bò tái sinh Diamon Pro',13600000.00,1,'2026-04-22 08:48:46'),(82,2,'interior_type','Da Bò Ý nội địa - Boston',16800000.00,1,'2026-04-22 08:49:03'),(83,2,'interior_type','Da Nappa Brazin',25200000.00,1,'2026-04-22 08:49:16'),(84,2,'interior_type','Da Nappa tự nhiên nội địa Ý',40500000.00,1,'2026-04-22 08:49:31'),(85,1,'interior_type','Da công nghiệp Thái',5000000.00,1,'2026-04-22 08:50:46'),(86,1,'interior_type','Da Nappa tiêu chuẩn',6000000.00,1,'2026-04-22 08:50:59'),(87,1,'interior_type','Da Nappa thế hệ mới',7600000.00,1,'2026-04-22 08:51:14'),(88,1,'interior_type','Da Nappa VIP thế hệ mới',9400000.00,1,'2026-04-22 08:51:28'),(89,1,'interior_type','Da bò tái sinh Diamon Pro',13400000.00,1,'2026-04-22 08:51:49'),(90,1,'interior_type','Da Bò Ý nội địa - Boston',16600000.00,1,'2026-04-22 08:52:04'),(91,1,'interior_type','Da Nappa Brazin',25000000.00,1,'2026-04-22 08:52:18'),(92,1,'interior_type','Da Nappa tự nhiên nội địa Ý',40300000.00,1,'2026-04-22 08:52:37');
/*!40000 ALTER TABLE `options` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_customer_info`
--

DROP TABLE IF EXISTS `order_customer_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_customer_info` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `don_hang_id` bigint NOT NULL,
  `ho_ten` varchar(255) NOT NULL,
  `so_dien_thoai` varchar(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `dia_chi_khach_hang` text NOT NULL,
  `so_CCCD` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `don_hang_id` (`don_hang_id`),
  CONSTRAINT `order_customer_info_ibfk_1` FOREIGN KEY (`don_hang_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_customer_info`
--

LOCK TABLES `order_customer_info` WRITE;
/*!40000 ALTER TABLE `order_customer_info` DISABLE KEYS */;
INSERT INTO `order_customer_info` VALUES (1,1,'Trương Văn Kiệt','0123456789','truongvankiet04@gmail.com','test','0123456789'),(2,2,'Nguyễn Văn Kiệt','0321654987','kiet1@gmail.com','test2','0321654987'),(3,3,'Trương Văn Kiệt','0123456789','kiet1@gmail.com','test','0321654987');
/*!40000 ALTER TABLE `order_customer_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `don_hang_id` bigint NOT NULL,
  `xe_id` bigint NOT NULL,
  `cau_hinh_xe` json NOT NULL,
  `gia` decimal(15,2) NOT NULL,
  `so_luong` int DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `xe_id` (`xe_id`),
  KEY `don_hang_id` (`don_hang_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`xe_id`) REFERENCES `cars` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`don_hang_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,1,1,'{\"loaiPin\": \"LFP 18.64 kWh\", \"mauNoiThat\": \"Đen\", \"phienBanId\": \"1\", \"loaiNoiThat\": \"Standard\", \"mauNgoaiThat\": \"Trắng\"}',302000000.00,1),(2,1,2,'{\"loaiPin\": \"LFP 37.23 kWh\", \"mauNoiThat\": \"Xám\", \"phienBanId\": \"3\", \"loaiNoiThat\": \"Premium\", \"mauNgoaiThat\": \"Đỏ\"}',529000000.00,1),(3,2,1,'{\"loaiPin\": \"LFP 18.64 kWh\", \"mauNoiThat\": \"Đen\", \"phienBanId\": \"1\", \"loaiNoiThat\": \"Standard\", \"mauNgoaiThat\": \"Trắng\"}',302000000.00,1),(4,3,1,'{\"loaiPin\": \"LFP 18.64 kWh\", \"mauNoiThat\": \"Đen\", \"phienBanId\": \"1\", \"loaiNoiThat\": \"Standard\", \"mauNgoaiThat\": \"Trắng\"}',302000000.00,1);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_status_history`
--

DROP TABLE IF EXISTS `order_status_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_status_history` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `don_hang_id` bigint NOT NULL,
  `trang_thai` varchar(50) NOT NULL,
  `nguoi_cap_nhat` bigint DEFAULT NULL,
  `thoi_gian_cap_nhat` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `don_hang_id` (`don_hang_id`),
  KEY `nguoi_cap_nhat` (`nguoi_cap_nhat`),
  CONSTRAINT `order_status_history_ibfk_1` FOREIGN KEY (`don_hang_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_status_history_ibfk_2` FOREIGN KEY (`nguoi_cap_nhat`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_status_history`
--

LOCK TABLES `order_status_history` WRITE;
/*!40000 ALTER TABLE `order_status_history` DISABLE KEYS */;
INSERT INTO `order_status_history` VALUES (1,1,'Confirmed',1,'2026-04-12 20:17:59'),(2,1,'InProduction',1,'2026-04-12 20:18:09'),(3,1,'Confirmed',1,'2026-04-12 20:18:23'),(4,2,'Confirmed',1,'2026-04-12 22:53:16'),(5,3,'Confirmed',1,'2026-04-19 07:10:04'),(6,3,'Delivered',1,'2026-04-19 07:10:11');
/*!40000 ALTER TABLE `order_status_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nguoi_dung_id` bigint NOT NULL,
  `dai_ly_id` bigint DEFAULT NULL,
  `trang_thai_don_hang` enum('Pending','Paid','Confirmed','InProduction','Delivered','Cancelled') NOT NULL DEFAULT 'Pending',
  `so_tien_dat_coc` decimal(15,2) NOT NULL,
  `tong_tien` decimal(15,2) NOT NULL,
  `thoi_gian_tao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `nguoi_dung_id` (`nguoi_dung_id`),
  KEY `dai_ly_id` (`dai_ly_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`nguoi_dung_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`dai_ly_id`) REFERENCES `dealers` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,1,1,'Confirmed',166200000.00,831000000.00,'2026-04-12 19:44:18','2026-04-12 20:18:23'),(2,4,1,'Confirmed',60400000.00,302000000.00,'2026-04-12 22:52:47','2026-04-12 22:53:16'),(3,5,1,'Delivered',60400000.00,302000000.00,'2026-04-19 07:07:03','2026-04-19 07:10:11');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `don_hang_id` bigint NOT NULL,
  `so_tien_thanh_toan` decimal(15,2) NOT NULL,
  `phuong_thuc_thanh_toan` varchar(50) NOT NULL,
  `trang_thai_thanh_toan` enum('Pending','Success','Failed','Refunded') NOT NULL DEFAULT 'Pending',
  `ma_giao_dich` varchar(100) NOT NULL,
  `duong_dan_thanh_toan` varchar(500) NOT NULL,
  `thoi_gian_tao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ma_giao_dich` (`ma_giao_dich`),
  KEY `don_hang_id` (`don_hang_id`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`don_hang_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `ho_ten` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `so_dien_thoai` varchar(20) NOT NULL,
  `mat_khau_hash` varchar(255) NOT NULL,
  `vai_tro` enum('Customer','DealerStaff','Admin') NOT NULL DEFAULT 'Customer',
  `trang_thai_tai_khoan` enum('ACTIVE','LOCKED','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  `so_lan_nhap_sai` int DEFAULT '0',
  `thoi_gian_khoa_tai_khoan` datetime NOT NULL,
  `thoi_gian_tao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `thoi_gian_cap_nhat` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `so_dien_thoai` (`so_dien_thoai`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Trương Văn Kiệt','truongvankiet04@gmail.com','0123456789','$2a$11$STcAgIW44z.4cl/QlZ6kEu2f6Et5r07ggsWSI42D592Aq4maeqTG2','Customer','ACTIVE',0,'2026-04-17 09:24:09','2026-04-12 02:01:10','2026-04-12 09:01:10',0),(2,'Admin','admin@gmail.com','0901234567','$2a$11$STcAgIW44z.4cl/QlZ6kEu2f6Et5r07ggsWSI42D592Aq4maeqTG2','Admin','ACTIVE',0,'1970-01-01 00:00:00','2026-04-12 09:15:48','2026-04-12 09:15:48',0),(3,'Dealer staff','dealerstaff@gmail.com','0988777666','$2a$11$STcAgIW44z.4cl/QlZ6kEu2f6Et5r07ggsWSI42D592Aq4maeqTG2','DealerStaff','ACTIVE',0,'1970-01-01 00:00:00','2026-04-12 09:15:48','2026-04-12 09:15:48',0),(4,'Nguyễn Văn Kiệt','kiet1@gmail.com','0321654987','$2a$11$No5UO/P/F/6WK7TrQA2D.OZJTIbhG9H9IS2XMdgbsCqidIlc3eMcq','Customer','ACTIVE',0,'2026-04-13 05:49:27','2026-04-12 22:49:27','2026-04-13 05:49:27',0),(5,'Trương Văn Kiệt','kiet2@gmail.com','0312456789','$2a$11$vbXATXsYNQlfxc5d54mG3.PNi36xjFJI5JEELBz6cD6xKCipo7Lb.','Customer','LOCKED',11,'2026-04-20 02:31:55','2026-04-17 04:04:19','2026-04-17 11:04:19',0),(6,'Trương Văn Kiệt','dealerstaff1@gmail.com','0347852369','$2a$11$m2ifFgwe8oj3ZQ1XvEUAVu/Xkj4iFw9JhJ7rpglkmp9jM5XJPq09.','DealerStaff','ACTIVE',0,'2026-04-20 10:58:00','2026-04-20 03:58:00','2026-04-20 10:58:00',0),(7,'Người dùng mới','ndm@gmail.com','0512346789','$2a$11$yE/XTz0TwoqWhXU5M23d/eBfYXsFAeMNHWb6QlKy.LS5vAgHzifj6','Customer','ACTIVE',0,'2026-04-21 09:44:51','2026-04-21 02:44:51','2026-04-21 09:44:51',0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-22 17:42:18
