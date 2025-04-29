-- DropForeignKey
ALTER TABLE `activity` DROP FOREIGN KEY `activity_itineraryId_fkey`;

-- AddForeignKey
ALTER TABLE `activity` ADD CONSTRAINT `activity_itineraryId_fkey` FOREIGN KEY (`itineraryId`) REFERENCES `itinerary`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
