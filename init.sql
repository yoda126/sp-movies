CREATE DATABASE  IF NOT EXISTS `spmovies` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `spmovies`;
-- MySQL dump 10.13  Distrib 8.0.25, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: spmovies
-- ------------------------------------------------------
-- Server version	8.0.25

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

--
-- Table structure for table `genres`
--

DROP TABLE IF EXISTS `genres`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `genres` (
  `genreid` int NOT NULL AUTO_INCREMENT,
  `genre` varchar(255) NOT NULL,
  `description` mediumtext NOT NULL,
  PRIMARY KEY (`genreid`),
  UNIQUE KEY `genre` (`genre`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `genres`
--

LOCK TABLES `genres` WRITE;
/*!40000 ALTER TABLE `genres` DISABLE KEYS */;
INSERT INTO `genres` VALUES (1,'Actions','pew pew bang bang'),(2,'Sci-fi','Science fiction'),(3,'Mature','For 18 and above'),(4,'Anime','For weebs\n');
/*!40000 ALTER TABLE `genres` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movies`
--

DROP TABLE IF EXISTS `movies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movies` (
  `movieid` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` mediumtext NOT NULL,
  `cast` text NOT NULL,
  `time` varchar(255) NOT NULL,
  `opening date` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`movieid`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movies`
--

LOCK TABLES `movies` WRITE;
/*!40000 ALTER TABLE `movies` DISABLE KEYS */;
INSERT INTO `movies` VALUES (1,'Godzilla vs Kong','Legends collide as Godzilla and Kong, the two most powerful forces of nature, clash on the big screen in a spectacular battle for the ages. As a squadron embarks on a perilous mission into fantastic uncharted terrain, unearthing clues to the Titans\' very origins and mankind\'s survival, a conspiracy threatens to wipe the creatures, both good and bad, from the face of the earth forever.','Shun Oguri, Rebecca Hall, Kyle Chandler, Millie Bobby Brown, Brian Tyree Henry, Alexander Skarsgård , Eiza González, Julian Dennison, Demián Bichir','69 mins','21 March 2021','2021-08-04 10:44:03'),(2,'Godzilla','Godzilla only none of that king kong','Godzilla, atom bomb','123 mins','1 August 2021','2021-08-04 10:45:01'),(3,'Sword art online ordinal scale','Anime movie for weebs','Kirito, Asuna, yuna','120 mins','2 August 2021','2021-08-04 10:45:53'),(4,'Sword art online ordinal scale 2','anime movie for weebs 2','Monica','160 mins','3 August 2021','2021-08-04 10:47:46'),(5,'How to train your dragon','A movie on how to touch and train and fly your dragon','Dragon, Hiccup','200 mins','4 August 2021','2021-08-04 10:53:52');
/*!40000 ALTER TABLE `movies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movies_genres`
--

DROP TABLE IF EXISTS `movies_genres`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movies_genres` (
  `movies_genres_id` int NOT NULL AUTO_INCREMENT,
  `movieid` int NOT NULL,
  `genreid` int NOT NULL,
  PRIMARY KEY (`movies_genres_id`),
  KEY `movieid` (`movieid`),
  KEY `genreid` (`genreid`),
  CONSTRAINT `movies_genres_ibfk_1` FOREIGN KEY (`movieid`) REFERENCES `movies` (`movieid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `movies_genres_ibfk_2` FOREIGN KEY (`genreid`) REFERENCES `genres` (`genreid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movies_genres`
--

LOCK TABLES `movies_genres` WRITE;
/*!40000 ALTER TABLE `movies_genres` DISABLE KEYS */;
INSERT INTO `movies_genres` VALUES (1,1,1),(2,1,2),(3,1,3),(4,2,1),(5,2,2),(6,3,2),(7,3,4),(8,4,4),(9,5,3);
/*!40000 ALTER TABLE `movies_genres` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movies_image`
--

DROP TABLE IF EXISTS `movies_image`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movies_image` (
  `movieid` int NOT NULL,
  `imagepath` varchar(260) NOT NULL,
  PRIMARY KEY (`movieid`),
  CONSTRAINT `movies_image_ibfk_1` FOREIGN KEY (`movieid`) REFERENCES `movies` (`movieid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movies_image`
--

LOCK TABLES `movies_image` WRITE;
/*!40000 ALTER TABLE `movies_image` DISABLE KEYS */;
INSERT INTO `movies_image` VALUES (1,'images\\1_1628073843679.jpeg'),(2,'images\\2_1628073901897.jpeg'),(4,'images\\4_1628074066968.jpeg'),(5,'images\\5_1628074432777.jpeg');
/*!40000 ALTER TABLE `movies_image` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movies_review`
--

DROP TABLE IF EXISTS `movies_review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movies_review` (
  `reviewid` int NOT NULL AUTO_INCREMENT,
  `movieid` int NOT NULL,
  `userid` int NOT NULL,
  `rating` int NOT NULL,
  `review` mediumtext,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`reviewid`),
  KEY `movieid` (`movieid`),
  KEY `userid` (`userid`),
  CONSTRAINT `movies_review_ibfk_1` FOREIGN KEY (`movieid`) REFERENCES `movies` (`movieid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `movies_review_ibfk_2` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movies_review`
--

LOCK TABLES `movies_review` WRITE;
/*!40000 ALTER TABLE `movies_review` DISABLE KEYS */;
INSERT INTO `movies_review` VALUES (1,1,4,5,'great movie','2021-08-04 11:22:50'),(2,1,5,1,'bad movie','2021-08-04 11:24:38'),(3,2,5,3,'wheres kong','2021-08-04 11:24:45'),(4,3,5,4,'good for weeb','2021-08-04 11:25:01'),(5,2,4,4,'good godzilla only','2021-08-04 11:27:09'),(6,3,4,2,'hate anime','2021-08-04 11:27:22');
/*!40000 ALTER TABLE `movies_review` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movies_screening`
--

DROP TABLE IF EXISTS `movies_screening`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movies_screening` (
  `screeningid` int NOT NULL AUTO_INCREMENT,
  `movieid` int NOT NULL,
  `screeningtime` datetime NOT NULL,
  PRIMARY KEY (`screeningid`),
  KEY `movieid` (`movieid`),
  CONSTRAINT `movies_screening_ibfk_1` FOREIGN KEY (`movieid`) REFERENCES `movies` (`movieid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movies_screening`
--

LOCK TABLES `movies_screening` WRITE;
/*!40000 ALTER TABLE `movies_screening` DISABLE KEYS */;
INSERT INTO `movies_screening` VALUES (6,1,'2021-04-25 22:00:00'),(7,1,'2021-10-25 22:00:00'),(8,1,'2021-12-25 20:00:00'),(9,2,'2021-10-10 10:00:00'),(10,1,'2021-10-09 22:00:00'),(11,2,'2021-10-25 22:00:00');
/*!40000 ALTER TABLE `movies_screening` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `userid` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(320) NOT NULL,
  `contact` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `profile_pic_url` varchar(2048) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`userid`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin1','sample@gmail.com','12345678','$2b$10$C/KwNUKIqpUheUszS6zJ4uc.fJnZf6U9W.qWOG3rAotHt8dpg05MC','Admin','','2021-08-04 10:33:36'),(3,'admin2','sample@gmail.com','12345678','$2b$10$M3Bbg9GmewQfle.2/ql9pOjpvtdIJZIUIndf3NpaLPynPHqt9QRaS','Admin','','2021-08-04 10:39:59'),(4,'user1','test@gmail.com','96876543','$2b$10$NNTOrAxICzTFOt1MUvGIBeSwqenZWdtlYWLfH422DdZ8jiUc/F996','Customer','','2021-08-04 11:22:12'),(5,'user2','testing@gmail.com','12345678','$2b$10$gq7ky1qxexpysYTnrEYdKusaQ4XkUIvpGRRDOYLwwomc9EvfSUYR2','Customer','','2021-08-04 11:23:15');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-08-04 19:28:24
