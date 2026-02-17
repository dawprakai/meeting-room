-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 17, 2026 at 07:00 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `meeting_room_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `room_id` int(11) DEFAULT NULL,
  `booking_date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `status` enum('pending','confirmed','cancelled') DEFAULT 'confirmed',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`id`, `user_id`, `room_id`, `booking_date`, `start_time`, `end_time`, `status`, `created_at`) VALUES
(5, 1, 1, '2026-02-09', '22:00:00', '23:00:00', 'confirmed', '2026-02-09 16:07:02'),
(6, 1, 1, '2026-02-17', '11:58:00', '11:59:00', 'confirmed', '2026-02-17 04:58:27'),
(7, 1, 2, '2026-02-17', '12:09:00', '12:10:00', 'confirmed', '2026-02-17 05:09:34');

-- --------------------------------------------------------

--
-- Table structure for table `rooms`
--

CREATE TABLE `rooms` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `building` varchar(50) DEFAULT NULL,
  `floor` varchar(10) DEFAULT NULL,
  `capacity` int(11) NOT NULL,
  `type` varchar(50) DEFAULT NULL,
  `image_url` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `status` enum('active','maintenance') DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rooms`
--

INSERT INTO `rooms` (`id`, `name`, `building`, `floor`, `capacity`, `type`, `image_url`, `description`, `status`) VALUES
(1, 'Room A-201 (Small)', 'ตึก A', '2', 4, 'Small', 'https://images.unsplash.com/photo-1497366216548-37526070297c', NULL, 'active'),
(2, 'Room B-305 (Medium)', 'ตึก B', '3', 8, 'Medium', 'https://images.unsplash.com/photo-1497366811353-6870744d04b2', NULL, 'active'),
(3, 'Room C-101 (Large)', 'C', '1', 15, 'Large', 'https://www.banidea.com/wp-content/uploads/2013/10/Office-Board-Room-Design-2.jpg', 'ห้องใหญ่ รองรับการประชุมสำคัญ', 'active'),
(4, 'Boardroom A-501', 'A', '5', 20, 'Boardroom', 'https://riverineplace.com/wp-content/uploads/2024/05/big-empty-modern-meetingseminarconference-room-hotel.jpg', 'ห้องประชุมผู้บริหาร ตกแต่งหรูหรา', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `room_equipment`
--

CREATE TABLE `room_equipment` (
  `id` int(11) NOT NULL,
  `room_id` int(11) DEFAULT NULL,
  `item_name` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `room_equipment`
--

INSERT INTO `room_equipment` (`id`, `room_id`, `item_name`) VALUES
(1, 1, 'TV 43\"'),
(2, 1, 'Whiteboard'),
(3, 2, 'Projector'),
(4, 2, 'Conference phone'),
(5, 3, 'Smart TV 65\"'),
(6, 3, 'Video Conf'),
(7, 3, 'Sound'),
(8, 4, 'Full AV setup'),
(9, 4, 'Catering Area');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `role`, `created_at`) VALUES
(1, 'admin', '1234', 'admin', '2026-02-09 16:04:44'),
(2, 'user1', '1234', 'user', '2026-02-17 04:55:35'),
(3, 'user2', '1234', 'user', '2026-02-17 04:55:35'),
(4, 'user3', '1234', 'user', '2026-02-17 04:55:35'),
(5, 'user4', '1234', 'user', '2026-02-17 04:55:35'),
(6, 'user5', '1234', 'user', '2026-02-17 04:55:35'),
(7, 'test1', '1234', 'user', '2026-02-17 05:59:20');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `room_id` (`room_id`);

--
-- Indexes for table `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `room_equipment`
--
ALTER TABLE `room_equipment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `room_id` (`room_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `rooms`
--
ALTER TABLE `rooms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `room_equipment`
--
ALTER TABLE `room_equipment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`);

--
-- Constraints for table `room_equipment`
--
ALTER TABLE `room_equipment`
  ADD CONSTRAINT `room_equipment_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
