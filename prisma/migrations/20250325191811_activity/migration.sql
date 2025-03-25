/*
  Warnings:

  - Added the required column `cost` to the `suggestion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `suggestion` ADD COLUMN `cost` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `activity` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `creator_id` INTEGER NOT NULL,
    `participant` INTEGER NOT NULL,
    `suggestion_id` INTEGER NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `description` MEDIUMTEXT NOT NULL,
    `notes` TEXT NOT NULL,
    `location_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
