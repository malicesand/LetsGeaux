/*
  Warnings:

  - You are about to drop the column `groupItinerary_id` on the `budget` table. All the data in the column will be lost.
  - You are about to drop the column `itinerary_id` on the `group` table. All the data in the column will be lost.
  - You are about to drop the column `member_id` on the `itinerary` table. All the data in the column will be lost.
  - You are about to drop the column `groupId` on the `user` table. All the data in the column will be lost.
  - Added the required column `name` to the `group` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `budget` DROP FOREIGN KEY `budget_groupItinerary_id_fkey`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `user_groupId_fkey`;

-- DropIndex
DROP INDEX `budget_groupItinerary_id_fkey` ON `budget`;

-- DropIndex
DROP INDEX `group_itinerary_id_key` ON `group`;

-- DropIndex
DROP INDEX `user_groupId_fkey` ON `user`;

-- AlterTable
ALTER TABLE `budget` DROP COLUMN `groupItinerary_id`,
    ADD COLUMN `groupId` INTEGER NULL;

-- AlterTable
ALTER TABLE `group` DROP COLUMN `itinerary_id`,
    ADD COLUMN `itineraryId` INTEGER NULL,
    ADD COLUMN `name` VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE `itinerary` DROP COLUMN `member_id`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `groupId`;

-- CreateTable
CREATE TABLE `userGroups` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `groupId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `userGroups` ADD CONSTRAINT `userGroups_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `userGroups` ADD CONSTRAINT `userGroups_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `group`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `itinerary` ADD CONSTRAINT `itinerary_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `group`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `budget` ADD CONSTRAINT `budget_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `group`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
