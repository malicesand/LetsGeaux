/*
  Warnings:

  - You are about to drop the `activity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `budget` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `chatHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `group` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `image` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `itinerary` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `message` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reminder` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `route` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `suggestion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `userGroups` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `userInterest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `userOnsuggestion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `vote` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `activity` DROP FOREIGN KEY `activity_itineraryId_fkey`;

-- DropForeignKey
ALTER TABLE `budget` DROP FOREIGN KEY `budget_groupId_fkey`;

-- DropForeignKey
ALTER TABLE `image` DROP FOREIGN KEY `image_groupId_fkey`;

-- DropForeignKey
ALTER TABLE `image` DROP FOREIGN KEY `image_userId_fkey`;

-- DropForeignKey
ALTER TABLE `itinerary` DROP FOREIGN KEY `itinerary_creatorId_fkey`;

-- DropForeignKey
ALTER TABLE `itinerary` DROP FOREIGN KEY `itinerary_groupId_fkey`;

-- DropForeignKey
ALTER TABLE `message` DROP FOREIGN KEY `message_sessionId_fkey`;

-- DropForeignKey
ALTER TABLE `reminder` DROP FOREIGN KEY `reminder_userId_fkey`;

-- DropForeignKey
ALTER TABLE `route` DROP FOREIGN KEY `route_itineraryId_fkey`;

-- DropForeignKey
ALTER TABLE `userGroups` DROP FOREIGN KEY `userGroups_groupId_fkey`;

-- DropForeignKey
ALTER TABLE `userGroups` DROP FOREIGN KEY `userGroups_userId_fkey`;

-- DropForeignKey
ALTER TABLE `userInterest` DROP FOREIGN KEY `userInterest_interestId_fkey`;

-- DropForeignKey
ALTER TABLE `userInterest` DROP FOREIGN KEY `userInterest_userId_fkey`;

-- DropForeignKey
ALTER TABLE `userOnsuggestion` DROP FOREIGN KEY `userOnsuggestion_suggestionId_fkey`;

-- DropForeignKey
ALTER TABLE `userOnsuggestion` DROP FOREIGN KEY `userOnsuggestion_userId_fkey`;

-- DropForeignKey
ALTER TABLE `vote` DROP FOREIGN KEY `vote_userId_fkey`;

-- DropTable
DROP TABLE `activity`;

-- DropTable
DROP TABLE `budget`;

-- DropTable
DROP TABLE `chatHistory`;

-- DropTable
DROP TABLE `group`;

-- DropTable
DROP TABLE `image`;

-- DropTable
DROP TABLE `itinerary`;

-- DropTable
DROP TABLE `message`;

-- DropTable
DROP TABLE `reminder`;

-- DropTable
DROP TABLE `route`;

-- DropTable
DROP TABLE `suggestion`;

-- DropTable
DROP TABLE `user`;

-- DropTable
DROP TABLE `userGroups`;

-- DropTable
DROP TABLE `userInterest`;

-- DropTable
DROP TABLE `userOnsuggestion`;

-- DropTable
DROP TABLE `vote`;
