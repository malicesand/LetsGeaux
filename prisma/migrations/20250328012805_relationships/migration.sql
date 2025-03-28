/*
  Warnings:

  - You are about to drop the column `location_id` on the `activity` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `budget` table. All the data in the column will be lost.
  - You are about to drop the column `group_id` on the `budget` table. All the data in the column will be lost.
  - You are about to drop the column `activity_id` on the `image` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `image` table. All the data in the column will be lost.
  - You are about to drop the column `activity_id` on the `reminder` table. All the data in the column will be lost.
  - You are about to drop the column `endLocation_id` on the `route` table. All the data in the column will be lost.
  - You are about to drop the column `startLocation_id` on the `route` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `route` table. All the data in the column will be lost.
  - You are about to drop the column `location_id` on the `suggestion` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `suggestion` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `vote` table. All the data in the column will be lost.
  - Added the required column `id` to the `group` table without a default value. This is not possible if the table is not empty.
  - Added the required column `destination` to the `route` table without a default value. This is not possible if the table is not empty.
  - Added the required column `origin` to the `route` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `activity` DROP COLUMN `location_id`,
    ADD COLUMN `locationId` INTEGER NULL;

-- AlterTable
ALTER TABLE `budget` DROP COLUMN `category`,
    DROP COLUMN `group_id`,
    ADD COLUMN `groupItinerary_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `category` MODIFY `budgetId` INTEGER NULL;

-- AlterTable
ALTER TABLE `group` ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `image` DROP COLUMN `activity_id`,
    DROP COLUMN `user_id`,
    ADD COLUMN `activityId` INTEGER NULL,
    ADD COLUMN `userId` INTEGER NULL;

-- AlterTable
ALTER TABLE `location` ADD COLUMN `suggestionId` INTEGER NULL;

-- AlterTable
ALTER TABLE `reminder` DROP COLUMN `activity_id`,
    ADD COLUMN `activityId` INTEGER NULL;

-- AlterTable
ALTER TABLE `route` DROP COLUMN `endLocation_id`,
    DROP COLUMN `startLocation_id`,
    DROP COLUMN `user_id`,
    ADD COLUMN `destination` VARCHAR(191) NOT NULL,
    ADD COLUMN `origin` VARCHAR(191) NOT NULL,
    ADD COLUMN `userId` INTEGER NULL;

-- AlterTable
ALTER TABLE `suggestion` DROP COLUMN `location_id`,
    DROP COLUMN `user_id`,
    ADD COLUMN `userId` INTEGER NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `groupId` INTEGER NULL;

-- AlterTable
ALTER TABLE `vote` DROP COLUMN `user_id`,
    ADD COLUMN `userId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `group`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `suggestion` ADD CONSTRAINT `suggestion_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `activity` ADD CONSTRAINT `activity_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `location`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `location` ADD CONSTRAINT `location_suggestionId_fkey` FOREIGN KEY (`suggestionId`) REFERENCES `suggestion`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `route` ADD CONSTRAINT `route_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vote` ADD CONSTRAINT `vote_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reminder` ADD CONSTRAINT `reminder_activityId_fkey` FOREIGN KEY (`activityId`) REFERENCES `activity`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `image` ADD CONSTRAINT `image_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `image` ADD CONSTRAINT `image_activityId_fkey` FOREIGN KEY (`activityId`) REFERENCES `activity`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `budget` ADD CONSTRAINT `budget_groupItinerary_id_fkey` FOREIGN KEY (`groupItinerary_id`) REFERENCES `group`(`itinerary_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `category` ADD CONSTRAINT `category_budgetId_fkey` FOREIGN KEY (`budgetId`) REFERENCES `budget`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
