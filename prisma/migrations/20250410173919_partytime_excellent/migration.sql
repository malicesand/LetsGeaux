/*
  Warnings:

  - You are about to drop the column `groupId` on the `budget` table. All the data in the column will be lost.
  - You are about to drop the column `groupId` on the `image` table. All the data in the column will be lost.
  - You are about to drop the column `groupId` on the `itinerary` table. All the data in the column will be lost.
  - You are about to drop the `group` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `userGroups` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `budget` DROP FOREIGN KEY `budget_groupId_fkey`;

-- DropForeignKey
ALTER TABLE `image` DROP FOREIGN KEY `image_groupId_fkey`;

-- DropForeignKey
ALTER TABLE `itinerary` DROP FOREIGN KEY `itinerary_groupId_fkey`;

-- DropForeignKey
ALTER TABLE `userGroups` DROP FOREIGN KEY `userGroups_groupId_fkey`;

-- DropForeignKey
ALTER TABLE `userGroups` DROP FOREIGN KEY `userGroups_userId_fkey`;

-- DropIndex
DROP INDEX `budget_groupId_fkey` ON `budget`;

-- DropIndex
DROP INDEX `image_groupId_fkey` ON `image`;

-- DropIndex
DROP INDEX `itinerary_groupId_fkey` ON `itinerary`;

-- AlterTable
ALTER TABLE `budget` DROP COLUMN `groupId`,
    ADD COLUMN `partyId` INTEGER NULL;

-- AlterTable
ALTER TABLE `image` DROP COLUMN `groupId`,
    ADD COLUMN `partyId` INTEGER NULL;

-- AlterTable
ALTER TABLE `itinerary` DROP COLUMN `groupId`,
    ADD COLUMN `partyId` INTEGER NULL;

-- DropTable
DROP TABLE `group`;

-- DropTable
DROP TABLE `userGroups`;

-- CreateTable
CREATE TABLE `userParty` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `partyId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `party` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `itineraryId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `userParty` ADD CONSTRAINT `userParty_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `userParty` ADD CONSTRAINT `userParty_partyId_fkey` FOREIGN KEY (`partyId`) REFERENCES `party`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `itinerary` ADD CONSTRAINT `itinerary_partyId_fkey` FOREIGN KEY (`partyId`) REFERENCES `party`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `image` ADD CONSTRAINT `image_partyId_fkey` FOREIGN KEY (`partyId`) REFERENCES `party`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `budget` ADD CONSTRAINT `budget_partyId_fkey` FOREIGN KEY (`partyId`) REFERENCES `party`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
