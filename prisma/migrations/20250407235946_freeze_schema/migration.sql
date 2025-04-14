/*
  Warnings:

  - You are about to drop the column `activity_id` on the `group` table. All the data in the column will be lost.
  - You are about to drop the `location` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `location` DROP FOREIGN KEY `location_suggestionId_fkey`;

-- AlterTable
ALTER TABLE `activity` MODIFY `description` VARCHAR(500) NULL;

-- AlterTable
ALTER TABLE `group` DROP COLUMN `activity_id`;

-- AlterTable
ALTER TABLE `image` ADD COLUMN `groupId` INTEGER NULL,
    MODIFY `url` TEXT NOT NULL,
    MODIFY `notes` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `itinerary` ADD COLUMN `groupId` INTEGER NULL;

-- AlterTable
ALTER TABLE `reminder` MODIFY `call_message` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `profilePic` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `location`;

-- CreateTable
CREATE TABLE `userInterest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `interestId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `userInterest` ADD CONSTRAINT `userInterest_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `userInterest` ADD CONSTRAINT `userInterest_interestId_fkey` FOREIGN KEY (`interestId`) REFERENCES `interest`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `image` ADD CONSTRAINT `image_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `group`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
