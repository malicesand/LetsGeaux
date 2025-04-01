/*
  Warnings:

  - Added the required column `walkingTravelTime` to the `route` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `activity` ADD COLUMN `itineraryId` INTEGER NULL;

-- AlterTable
ALTER TABLE `route` ADD COLUMN `walkingTravelTime` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `activity` ADD CONSTRAINT `activity_itineraryId_fkey` FOREIGN KEY (`itineraryId`) REFERENCES `itinerary`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
