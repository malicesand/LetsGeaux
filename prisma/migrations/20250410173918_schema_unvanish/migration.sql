/*
  Warnings:

  - A unique constraint covering the columns `[googleId]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `googleId` to the `user` table without a default value. This is not possible if the table is not empty.

*/

CREATE TABLE `user` (
 `id` INTEGER NOT NULL AUTO_INCREMENT,
 `username` VARCHAR(50) NOT NULL,
 `email` VARCHAR(50) NOT NULL,
 `isVerified` BOOLEAN NULL,
 `phoneNum` VARCHAR(10) NULL,
 `isNotified` BOOLEAN NULL,

 PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


-- AlterTable
ALTER TABLE `user` ADD COLUMN `googleId` VARCHAR(191) NOT NULL,
    ADD COLUMN `profilePic` VARCHAR(191) NULL,
    ADD COLUMN `suggestionId` INTEGER NULL,
    MODIFY `isVerified` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `phoneNum` VARCHAR(10) NULL,
    MODIFY `isNotified` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `userGroups` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `groupId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `userOnsuggestion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NULL,
    `suggestionId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `suggestion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(120) NOT NULL,
    `upVotes` INTEGER NULL,
    `downVotes` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `timeAvailable` VARCHAR(191) NULL,
    `cost` INTEGER NULL,
    `address` VARCHAR(100) NOT NULL,
    `description` TEXT NOT NULL,
    `image` TEXT NULL,
    `phoneNum` VARCHAR(50) NULL,
    `userId` INTEGER NULL,
    `latitude` VARCHAR(191) NULL,
    `longitude` VARCHAR(191) NULL,

    INDEX `suggestion_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `itinerary` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `groupId` INTEGER NULL,
    `name` VARCHAR(50) NOT NULL,
    `begin` DATETIME(3) NOT NULL,
    `end` DATETIME(3) NOT NULL,
    `upVotes` INTEGER NOT NULL,
    `downVotes` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL,
    `notes` VARCHAR(150) NOT NULL,
    `creatorId` INTEGER NULL,

    INDEX `itinerary_creatorId_fkey`(`creatorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `activity` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NULL,
    `description` VARCHAR(500) NULL,
    `address` VARCHAR(191) NULL,
    `phone` VARCHAR(150) NULL,
    `time` VARCHAR(191) NULL,
    `date` VARCHAR(191) NULL,
    `image` VARCHAR(191) NULL,
    `location` VARCHAR(191) NULL,
    `itineraryId` INTEGER NULL,

    INDEX `activity_itineraryId_fkey`(`itineraryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `route` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `destination` VARCHAR(191) NOT NULL,
    `origin` VARCHAR(191) NOT NULL,
    `travelTime` VARCHAR(191) NOT NULL,
    `itineraryId` INTEGER NULL,

    INDEX `route_itineraryId_fkey`(`itineraryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vote` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `vote_polarity` BOOLEAN NOT NULL,
    `vote_topic` VARCHAR(25) NOT NULL,
    `voted_item_id` INTEGER NOT NULL,
    `userId` INTEGER NULL,

    INDEX `vote_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `userInterest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `interestId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `group` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `itineraryId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reminder` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `call_time` DATETIME(3) NOT NULL,
    `call_message` VARCHAR(255) NOT NULL,
    `userId` INTEGER NULL,
    `activityId` INTEGER NULL,

    INDEX `reminder_activityId_fkey`(`activityId`),
    INDEX `reminder_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `image` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` TEXT NOT NULL,
    `notes` VARCHAR(255) NULL,
    `activityId` INTEGER NULL,
    `userId` INTEGER NULL,
    `groupId` INTEGER NULL,

    INDEX `image_activityId_fkey`(`activityId`),
    INDEX `image_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `budget` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `spent` DECIMAL(65, 30) NOT NULL,
    `notes` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `limit` DECIMAL(65, 30) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `category` VARCHAR(191) NOT NULL DEFAULT '',
    `groupId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chatHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NULL,
    `sessionId` VARCHAR(191) NOT NULL,
    `conversationName` VARCHAR(255) NULL,
    `lastActive` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `chatHistory_sessionId_key`(`sessionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `message` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NULL,
    `userMessage` TEXT NOT NULL,
    `botResponse` LONGTEXT NOT NULL,
    `timeStamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `sessionId` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `user_googleId_key` ON `user`(`googleId`);

-- AddForeignKey
ALTER TABLE `userGroups` ADD CONSTRAINT `userGroups_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `userGroups` ADD CONSTRAINT `userGroups_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `group`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `userOnsuggestion` ADD CONSTRAINT `userOnsuggestion_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `userOnsuggestion` ADD CONSTRAINT `userOnsuggestion_suggestionId_fkey` FOREIGN KEY (`suggestionId`) REFERENCES `suggestion`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `itinerary` ADD CONSTRAINT `itinerary_creatorId_fkey` FOREIGN KEY (`creatorId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `itinerary` ADD CONSTRAINT `itinerary_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `group`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `activity` ADD CONSTRAINT `activity_itineraryId_fkey` FOREIGN KEY (`itineraryId`) REFERENCES `itinerary`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `route` ADD CONSTRAINT `route_itineraryId_fkey` FOREIGN KEY (`itineraryId`) REFERENCES `itinerary`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vote` ADD CONSTRAINT `vote_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `userInterest` ADD CONSTRAINT `userInterest_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `userInterest` ADD CONSTRAINT `userInterest_interestId_fkey` FOREIGN KEY (`interestId`) REFERENCES `interest`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reminder` ADD CONSTRAINT `reminder_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `image` ADD CONSTRAINT `image_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `group`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `image` ADD CONSTRAINT `image_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `budget` ADD CONSTRAINT `budget_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `group`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `message` ADD CONSTRAINT `message_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `chatHistory`(`sessionId`) ON DELETE RESTRICT ON UPDATE CASCADE;
