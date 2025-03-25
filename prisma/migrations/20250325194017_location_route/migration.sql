/*
  Warnings:

  - You are about to drop the column `creator_id` on the `activity` table. All the data in the column will be lost.
  - Added the required column `creatorId` to the `activity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `activity` DROP COLUMN `creator_id`,
    ADD COLUMN `creatorId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `location` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(70) NOT NULL,
    `description` MEDIUMTEXT NOT NULL,
    `address` VARCHAR(35) NOT NULL,
    `latitude` DECIMAL(65, 30) NOT NULL,
    `longitude` DECIMAL(65, 30) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Route` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `startLocation_id` INTEGER NOT NULL,
    `endLocation_id` INTEGER NOT NULL,
    `timeToLocation` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
