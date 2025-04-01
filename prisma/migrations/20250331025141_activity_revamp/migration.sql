/*
  Warnings:

  - You are about to drop the column `locationId` on the `activity` table. All the data in the column will be lost.
  - You are about to drop the column `participant` on the `activity` table. All the data in the column will be lost.
  - You are about to drop the column `suggestionId` on the `activity` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `activity` DROP FOREIGN KEY `activity_locationId_fkey`;

-- DropForeignKey
ALTER TABLE `activity` DROP FOREIGN KEY `activity_suggestionId_fkey`;

-- DropForeignKey
ALTER TABLE `image` DROP FOREIGN KEY `image_activityId_fkey`;

-- DropForeignKey
ALTER TABLE `reminder` DROP FOREIGN KEY `reminder_activityId_fkey`;

-- DropIndex
DROP INDEX `activity_locationId_fkey` ON `activity`;

-- DropIndex
DROP INDEX `activity_suggestionId_fkey` ON `activity`;

-- AlterTable
ALTER TABLE `activity` DROP COLUMN `locationId`,
    DROP COLUMN `participant`,
    DROP COLUMN `suggestionId`,
    ADD COLUMN `image` VARCHAR(191) NULL,
    ADD COLUMN `location` VARCHAR(191) NULL;
