-- MySQL dump 10.13  Distrib 5.7.10, for osx10.11 (x86_64)
--
-- Host: localhost    Database: schemeBeam
-- ------------------------------------------------------
-- Server version	5.7.10

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `emails`
--

DROP TABLE IF EXISTS `emails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `emails` (
  `idemails` int(11) NOT NULL AUTO_INCREMENT,
  `emailaddress` varchar(45) DEFAULT NULL,
  `referrals` int(11) DEFAULT '0',
  `datetime` datetime DEFAULT CURRENT_TIMESTAMP,
  `referralcode` varchar(45) DEFAULT NULL,
  `verified` varchar(45) DEFAULT 'false',
  `referredby` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idemails`),
  UNIQUE KEY `emailaddress_UNIQUE` (`emailaddress`)
) ENGINE=InnoDB AUTO_INCREMENT=245 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `emails`
--

LOCK TABLES `emails` WRITE;
/*!40000 ALTER TABLE `emails` DISABLE KEYS */;
INSERT INTO `emails` VALUES (24,'dgs@dfsgd.com',3,'2016-12-11 20:00:26','ef5e53ef36a39afbe1e64105750ad1e1','true',NULL),(88,'sdfvasr@fs.com',0,'2016-12-17 15:58:44','48fff8702f548b89b8248a8d795a4e79','false','none'),(136,'dix@dix.com',1,'2016-12-17 19:39:46','00730d90b9208b395b8af9e5ff2dc9a7','true','none'),(202,'sdfsfsfs@s.com',0,'2016-12-19 20:06:36','f2b08f46906fb8ed06b3808fc6ba8f49','false','none'),(209,'fff@rrr.com',0,'2016-12-31 01:17:13','52e2af03b757cd89a1d71f2a61c5a7a5','false','none'),(210,'fsf@fff.com',0,'2016-12-31 01:21:43','8ba318d7f8c5a97990444c7ebe73a471','false','none'),(211,'yyy@www.com',0,'2016-12-31 18:05:37','dde0cd94b597881873d65c8380fc59d3','false','none'),(212,'jhkkjhlh@dsdaf.com',0,'2017-01-04 17:20:20','b3b102931f9dc859b872516b2798d805','false','none'),(215,'kdshfsdf@weed.com',0,'2017-01-05 00:17:20','7505c9b4e5bc691b8890a2d333328b8d','false','none'),(216,'eeee@sadfsdf.com',0,'2017-01-10 13:59:51','ed83f6b9b4185d3ce2a7fea307ed8c0e','false','none'),(217,'boop@shoop.com',0,'2017-01-10 14:05:30','61ad64da198fc6b13d22306c6faa0d61','false','none'),(241,'eeme.barbe@gmail.com',0,'2017-01-10 19:50:35','1189eebc01d968a27be0edf57ef353b1','true','none'),(242,'asfsd@fsd.com',0,'2017-01-10 20:10:23','4248d20a1a3ed17a971da3de774dc8ae','false','none'),(243,'lkhh@sdf.com',0,'2017-01-10 22:11:02','017a90093b56c408d7898e95aca01295','false','none'),(244,'453454@dsfs.com',0,'2017-01-10 22:12:21','7b1f2609e7d0231ecc1e5fb8dbeb4fc5','false','none');
/*!40000 ALTER TABLE `emails` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-01-11 12:20:35
