/*
  Warnings:

  - You are about to drop the column `userId` on the `route` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `route` DROP FOREIGN KEY `route_userId_fkey`;

-- DropIndex
DROP INDEX `route_userId_fkey` ON `route`;

-- AlterTable
ALTER TABLE `route` DROP COLUMN `userId`,
    ADD COLUMN `itineraryId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `route` ADD CONSTRAINT `route_itineraryId_fkey` FOREIGN KEY (`itineraryId`) REFERENCES `itinerary`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
