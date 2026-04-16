-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: transpobot
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `chauffeurs`
--

DROP TABLE IF EXISTS `chauffeurs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chauffeurs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prenom` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telephone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_embauche` date NOT NULL,
  `permis` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `statut` enum('actif','conge','suspendu') COLLATE utf8mb4_unicode_ci DEFAULT 'actif',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `telephone` (`telephone`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_statut` (`statut`),
  KEY `idx_nom` (`nom`,`prenom`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chauffeurs`
--

LOCK TABLES `chauffeurs` WRITE;
/*!40000 ALTER TABLE `chauffeurs` DISABLE KEYS */;
INSERT INTO `chauffeurs` VALUES (1,'FALL','Ibrahima','+221771234567','ibrahima.fall@email.com','2022-01-15','B-123456','actif','2026-04-15 00:51:36','2026-04-15 00:51:36'),(2,'NDOYE','Fatou','+221772345678','fatou.ndoye@email.com','2021-06-20','B-234567','actif','2026-04-15 00:51:36','2026-04-15 00:51:36'),(3,'DIOUF','Moussa','+221773456789','moussa.diouf@email.com','2023-03-10','B-345678','actif','2026-04-15 00:51:36','2026-04-15 00:51:36'),(4,'SOW','Aminata','+221774567890','aminata.sow@email.com','2022-09-05','B-456789','actif','2026-04-15 00:51:36','2026-04-15 00:51:36'),(5,'BA','Cheikh','+221775678901','cheikh.ba@email.com','2020-11-12','B-567890','conge','2026-04-15 00:51:36','2026-04-15 00:51:36'),(6,'MBAYE','Mariama','+221776789012','mariama.mbaye@email.com','2023-01-20','B-678901','actif','2026-04-15 00:51:36','2026-04-15 00:51:36'),(7,'KANE','Ousmane','+221777890123','ousmane.kane@email.com','2021-08-25','B-789012','suspendu','2026-04-15 00:51:36','2026-04-15 00:51:36');
/*!40000 ALTER TABLE `chauffeurs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `incidents`
--

DROP TABLE IF EXISTS `incidents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `incidents` (
  `id` int NOT NULL AUTO_INCREMENT,
  `trajet_id` int NOT NULL,
  `type_incident` enum('mecanique','accident','retard','agression','panne','autre') COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `gravite` enum('mineure','moyenne','majeure') COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_incident` datetime NOT NULL,
  `resolu` tinyint(1) DEFAULT '0',
  `date_resolution` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_trajet` (`trajet_id`),
  KEY `idx_type` (`type_incident`),
  KEY `idx_date` (`date_incident`),
  KEY `idx_resolu` (`resolu`),
  CONSTRAINT `incidents_ibfk_1` FOREIGN KEY (`trajet_id`) REFERENCES `trajets` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `incidents`
--

LOCK TABLES `incidents` WRITE;
/*!40000 ALTER TABLE `incidents` DISABLE KEYS */;
INSERT INTO `incidents` VALUES (1,2,'retard','Embouteillage exceptionnel sur la route de Rufisque','mineure','2025-04-06 09:30:00',1,'2025-04-06 10:00:00','2026-04-15 00:51:36','2026-04-15 00:51:36'),(2,4,'mecanique','Problème de freinage, arrêt pour vérification','moyenne','2025-04-06 09:45:00',1,'2025-04-06 13:00:00','2026-04-15 00:51:36','2026-04-15 00:51:36'),(3,6,'panne','Panne moteur sur la ligne Dakar - Pikine','majeure','2025-04-07 08:20:00',1,'2025-04-07 14:30:00','2026-04-15 00:51:36','2026-04-15 00:51:36'),(4,8,'retard','Retard dû aux intempéries (pluie)','mineure','2025-04-08 08:00:00',1,'2025-04-08 08:45:00','2026-04-15 00:51:36','2026-04-15 00:51:36'),(5,10,'mecanique','Climatisation défaillante','mineure','2025-04-08 09:30:00',0,NULL,'2026-04-15 00:51:36','2026-04-15 00:51:36'),(6,3,'accident','Légère collision sans blessure','moyenne','2025-04-07 07:15:00',1,'2025-04-07 12:00:00','2026-04-15 00:51:36','2026-04-15 00:51:36'),(7,9,'agression','Conflit entre passagers','moyenne','2025-04-08 07:00:00',1,'2025-04-08 07:30:00','2026-04-15 00:51:36','2026-04-15 00:51:36');
/*!40000 ALTER TABLE `incidents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lignes`
--

DROP TABLE IF EXISTS `lignes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lignes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nom` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `depart` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `arrivee` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `distance_km` decimal(6,2) NOT NULL,
  `duree_estimee` int NOT NULL,
  `statut` enum('actif','suspendu') COLLATE utf8mb4_unicode_ci DEFAULT 'actif',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `idx_code` (`code`),
  KEY `idx_statut` (`statut`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lignes`
--

LOCK TABLES `lignes` WRITE;
/*!40000 ALTER TABLE `lignes` DISABLE KEYS */;
INSERT INTO `lignes` VALUES (1,'L01','Ligne Dakar - Pikine','Dakar (Plateau)','Pikine (Guédiawaye)',15.50,45,'actif','2026-04-15 00:51:36','2026-04-15 00:51:36'),(2,'L02','Ligne Dakar - Rufisque','Dakar (Plateau)','Rufisque (Centre)',28.00,60,'actif','2026-04-15 00:51:36','2026-04-15 00:51:36'),(3,'L03','Ligne Dakar - Thiès','Dakar (Plateau)','Thiès (Centre)',70.00,90,'actif','2026-04-15 00:51:36','2026-04-15 00:51:36'),(4,'L04','Ligne Pikine - Rufisque','Pikine (Guédiawaye)','Rufisque (Centre)',18.50,40,'actif','2026-04-15 00:51:36','2026-04-15 00:51:36'),(5,'L05','Ligne Dakar - Mbour','Dakar (Plateau)','Mbour (Centre)',85.00,100,'suspendu','2026-04-15 00:51:36','2026-04-15 00:51:36');
/*!40000 ALTER TABLE `lignes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tarifs`
--

DROP TABLE IF EXISTS `tarifs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tarifs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ligne_id` int NOT NULL,
  `type_ticket` enum('standard','etudiant','senior','abonnement_mensuel') COLLATE utf8mb4_unicode_ci NOT NULL,
  `prix` decimal(10,2) NOT NULL,
  `description` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_ligne` (`ligne_id`),
  KEY `idx_type` (`type_ticket`),
  CONSTRAINT `tarifs_ibfk_1` FOREIGN KEY (`ligne_id`) REFERENCES `lignes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tarifs`
--

LOCK TABLES `tarifs` WRITE;
/*!40000 ALTER TABLE `tarifs` DISABLE KEYS */;
INSERT INTO `tarifs` VALUES (17,1,'standard',150.00,'Ticket standard','2026-04-15 00:53:38','2026-04-15 00:53:38'),(18,1,'etudiant',100.00,'Tarif étudiant avec carte','2026-04-15 00:53:38','2026-04-15 00:53:38'),(19,1,'senior',100.00,'Tarif senior +60 ans','2026-04-15 00:53:38','2026-04-15 00:53:38'),(20,1,'abonnement_mensuel',4500.00,'Abonnement mensuel illimité','2026-04-15 00:53:38','2026-04-15 00:53:38'),(21,2,'standard',250.00,'Ticket standard','2026-04-15 00:53:38','2026-04-15 00:53:38'),(22,2,'etudiant',175.00,'Tarif étudiant avec carte','2026-04-15 00:53:38','2026-04-15 00:53:38'),(23,2,'senior',175.00,'Tarif senior +60 ans','2026-04-15 00:53:38','2026-04-15 00:53:38'),(24,2,'abonnement_mensuel',7500.00,'Abonnement mensuel illimité','2026-04-15 00:53:38','2026-04-15 00:53:38'),(25,3,'standard',500.00,'Ticket standard','2026-04-15 00:53:38','2026-04-15 00:53:38'),(26,3,'etudiant',350.00,'Tarif étudiant avec carte','2026-04-15 00:53:38','2026-04-15 00:53:38'),(27,3,'senior',350.00,'Tarif senior +60 ans','2026-04-15 00:53:38','2026-04-15 00:53:38'),(28,3,'abonnement_mensuel',15000.00,'Abonnement mensuel illimité','2026-04-15 00:53:38','2026-04-15 00:53:38'),(29,4,'standard',200.00,'Ticket standard','2026-04-15 00:53:38','2026-04-15 00:53:38'),(30,4,'etudiant',140.00,'Tarif étudiant avec carte','2026-04-15 00:53:38','2026-04-15 00:53:38'),(31,4,'senior',140.00,'Tarif senior +60 ans','2026-04-15 00:53:38','2026-04-15 00:53:38'),(32,4,'abonnement_mensuel',6000.00,'Abonnement mensuel illimité','2026-04-15 00:53:38','2026-04-15 00:53:38');
/*!40000 ALTER TABLE `tarifs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trajets`
--

DROP TABLE IF EXISTS `trajets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trajets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `vehicule_id` int NOT NULL,
  `chauffeur_id` int NOT NULL,
  `ligne_id` int NOT NULL,
  `date_heure_depart` datetime NOT NULL,
  `date_heure_arrivee` datetime DEFAULT NULL,
  `nombre_passagers` int DEFAULT '0',
  `recette` decimal(10,2) DEFAULT '0.00',
  `statut` enum('planifie','en_cours','termine','annule') COLLATE utf8mb4_unicode_ci DEFAULT 'planifie',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_vehicule` (`vehicule_id`),
  KEY `idx_chauffeur` (`chauffeur_id`),
  KEY `idx_ligne` (`ligne_id`),
  KEY `idx_date_depart` (`date_heure_depart`),
  KEY `idx_statut` (`statut`),
  CONSTRAINT `trajets_ibfk_1` FOREIGN KEY (`vehicule_id`) REFERENCES `vehicules` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `trajets_ibfk_2` FOREIGN KEY (`chauffeur_id`) REFERENCES `chauffeurs` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `trajets_ibfk_3` FOREIGN KEY (`ligne_id`) REFERENCES `lignes` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trajets`
--

LOCK TABLES `trajets` WRITE;
/*!40000 ALTER TABLE `trajets` DISABLE KEYS */;
INSERT INTO `trajets` VALUES (1,1,1,1,'2025-04-06 07:00:00','2025-04-06 07:45:00',15,2250.00,'termine','2026-04-15 00:51:36','2026-04-15 00:51:36'),(2,1,1,1,'2025-04-06 08:30:00','2025-04-06 09:15:00',12,1800.00,'termine','2026-04-15 00:51:36','2026-04-15 00:51:36'),(3,2,2,2,'2025-04-06 07:15:00','2025-04-06 08:15:00',25,6250.00,'termine','2026-04-15 00:51:36','2026-04-15 00:51:36'),(4,2,2,2,'2025-04-06 09:00:00','2025-04-06 10:00:00',28,7000.00,'termine','2026-04-15 00:51:36','2026-04-15 00:51:36'),(5,4,3,3,'2025-04-07 06:30:00','2025-04-07 08:00:00',40,20000.00,'termine','2026-04-15 00:51:36','2026-04-15 00:51:36'),(6,1,1,1,'2025-04-07 07:00:00','2025-04-07 07:48:00',16,2400.00,'termine','2026-04-15 00:51:36','2026-04-15 00:51:36'),(7,5,4,1,'2025-04-07 08:00:00','2025-04-07 08:50:00',14,2100.00,'termine','2026-04-15 00:51:36','2026-04-15 00:51:36'),(8,2,2,2,'2025-04-08 07:30:00','2025-04-08 08:35:00',22,5500.00,'termine','2026-04-15 00:51:36','2026-04-15 00:51:36'),(9,4,3,3,'2025-04-08 06:00:00','2025-04-08 07:35:00',42,21000.00,'termine','2026-04-15 00:51:36','2026-04-15 00:51:36'),(10,7,6,4,'2025-04-08 09:00:00','2025-04-08 09:42:00',12,2400.00,'termine','2026-04-15 00:51:36','2026-04-15 00:51:36'),(11,1,1,1,'2025-04-09 07:00:00',NULL,0,0.00,'en_cours','2026-04-15 00:51:36','2026-04-15 00:51:36'),(12,5,4,2,'2025-04-09 08:00:00',NULL,0,0.00,'planifie','2026-04-15 00:51:36','2026-04-15 00:51:36'),(13,2,2,3,'2025-04-10 06:30:00',NULL,0,0.00,'planifie','2026-04-15 00:51:36','2026-04-15 00:51:36'),(14,4,3,1,'2025-04-10 07:15:00',NULL,0,0.00,'planifie','2026-04-15 00:51:36','2026-04-15 00:51:36'),(15,7,6,4,'2025-04-11 08:30:00',NULL,0,0.00,'planifie','2026-04-15 00:51:36','2026-04-15 00:51:36'),(16,1,1,2,'2025-04-12 07:00:00',NULL,0,0.00,'planifie','2026-04-15 00:51:36','2026-04-15 00:51:36');
/*!40000 ALTER TABLE `trajets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `v_stats_chauffeurs`
--

DROP TABLE IF EXISTS `v_stats_chauffeurs`;
/*!50001 DROP VIEW IF EXISTS `v_stats_chauffeurs`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_stats_chauffeurs` AS SELECT 
 1 AS `id`,
 1 AS `nom`,
 1 AS `prenom`,
 1 AS `nombre_trajets`,
 1 AS `total_passagers`,
 1 AS `total_recette`,
 1 AS `nombre_incidents`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_stats_vehicules`
--

DROP TABLE IF EXISTS `v_stats_vehicules`;
/*!50001 DROP VIEW IF EXISTS `v_stats_vehicules`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_stats_vehicules` AS SELECT 
 1 AS `id`,
 1 AS `immatriculation`,
 1 AS `marque`,
 1 AS `modele`,
 1 AS `kilometrage`,
 1 AS `statut`,
 1 AS `nombre_trajets`,
 1 AS `total_passagers`,
 1 AS `total_recette`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_trajets_recents`
--

DROP TABLE IF EXISTS `v_trajets_recents`;
/*!50001 DROP VIEW IF EXISTS `v_trajets_recents`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_trajets_recents` AS SELECT 
 1 AS `id`,
 1 AS `immatriculation`,
 1 AS `chauffeur`,
 1 AS `ligne_code`,
 1 AS `ligne_nom`,
 1 AS `date_heure_depart`,
 1 AS `date_heure_arrivee`,
 1 AS `nombre_passagers`,
 1 AS `recette`,
 1 AS `statut`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `vehicules`
--

DROP TABLE IF EXISTS `vehicules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vehicules` (
  `id` int NOT NULL AUTO_INCREMENT,
  `immatriculation` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `marque` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `modele` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type_vehicule` enum('bus','minibus','taxi','van') COLLATE utf8mb4_unicode_ci NOT NULL,
  `capacite` int NOT NULL,
  `kilometrage` int DEFAULT '0',
  `date_mise_service` date NOT NULL,
  `statut` enum('actif','maintenance','hors_service','en_route') COLLATE utf8mb4_unicode_ci DEFAULT 'actif',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `immatriculation` (`immatriculation`),
  KEY `idx_statut` (`statut`),
  KEY `idx_immatriculation` (`immatriculation`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehicules`
--

LOCK TABLES `vehicules` WRITE;
/*!40000 ALTER TABLE `vehicules` DISABLE KEYS */;
INSERT INTO `vehicules` VALUES (1,'DK-9012-EF','Mercedes','Sprinter','minibus',18,45000,'2021-03-01','actif','2026-04-15 00:51:36','2026-04-15 00:51:36'),(2,'DK-2345-FG','Toyota','Coaster','bus',30,78000,'2020-07-15','actif','2026-04-15 00:51:36','2026-04-15 00:51:36'),(3,'DK-5678-GH','Hyundai','H350','van',14,32000,'2022-01-20','maintenance','2026-04-15 00:51:36','2026-04-15 00:51:36'),(4,'DK-8901-HI','Mercedes','Citaro','bus',45,120000,'2019-05-10','actif','2026-04-15 00:51:36','2026-04-15 00:51:36'),(5,'DK-1234-IJ','Peugeot','Boxer','minibus',16,55000,'2021-11-30','actif','2026-04-15 00:51:36','2026-04-15 00:51:36'),(6,'DK-3456-JK','Renault','Master','van',12,28000,'2022-06-15','hors_service','2026-04-15 00:51:36','2026-04-15 00:51:36'),(7,'DK-6789-KL','Toyota','Hiace','minibus',15,41000,'2021-08-20','en_route','2026-04-15 00:51:36','2026-04-15 00:51:36');
/*!40000 ALTER TABLE `vehicules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Final view structure for view `v_stats_chauffeurs`
--

/*!50001 DROP VIEW IF EXISTS `v_stats_chauffeurs`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_stats_chauffeurs` AS select `c`.`id` AS `id`,`c`.`nom` AS `nom`,`c`.`prenom` AS `prenom`,count(`t`.`id`) AS `nombre_trajets`,sum(`t`.`nombre_passagers`) AS `total_passagers`,sum(`t`.`recette`) AS `total_recette`,count(`i`.`id`) AS `nombre_incidents` from ((`chauffeurs` `c` left join `trajets` `t` on((`c`.`id` = `t`.`chauffeur_id`))) left join `incidents` `i` on((`t`.`id` = `i`.`trajet_id`))) group by `c`.`id`,`c`.`nom`,`c`.`prenom` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_stats_vehicules`
--

/*!50001 DROP VIEW IF EXISTS `v_stats_vehicules`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_stats_vehicules` AS select `v`.`id` AS `id`,`v`.`immatriculation` AS `immatriculation`,`v`.`marque` AS `marque`,`v`.`modele` AS `modele`,`v`.`kilometrage` AS `kilometrage`,`v`.`statut` AS `statut`,count(`t`.`id`) AS `nombre_trajets`,sum(`t`.`nombre_passagers`) AS `total_passagers`,sum(`t`.`recette`) AS `total_recette` from (`vehicules` `v` left join `trajets` `t` on((`v`.`id` = `t`.`vehicule_id`))) group by `v`.`id`,`v`.`immatriculation`,`v`.`marque`,`v`.`modele`,`v`.`kilometrage`,`v`.`statut` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_trajets_recents`
--

/*!50001 DROP VIEW IF EXISTS `v_trajets_recents`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_trajets_recents` AS select `t`.`id` AS `id`,`v`.`immatriculation` AS `immatriculation`,concat(`c`.`nom`,' ',`c`.`prenom`) AS `chauffeur`,`l`.`code` AS `ligne_code`,`l`.`nom` AS `ligne_nom`,`t`.`date_heure_depart` AS `date_heure_depart`,`t`.`date_heure_arrivee` AS `date_heure_arrivee`,`t`.`nombre_passagers` AS `nombre_passagers`,`t`.`recette` AS `recette`,`t`.`statut` AS `statut` from (((`trajets` `t` join `vehicules` `v` on((`t`.`vehicule_id` = `v`.`id`))) join `chauffeurs` `c` on((`t`.`chauffeur_id` = `c`.`id`))) join `lignes` `l` on((`t`.`ligne_id` = `l`.`id`))) order by `t`.`date_heure_depart` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-16 17:10:12
