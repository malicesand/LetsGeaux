-- AlterTable
-- ALTER TABLE `user` ADD COLUMN `groupItinerary_id` INTEGER NULL;

-- CreateTable
CREATE TABLE IF NOT EXISTS `suggestion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(120) NOT NULL,
    `priority` INTEGER NOT NULL,
    `upVotes` INTEGER NOT NULL,
    `downVotes` INTEGER NOT NULL,
    `timeAvailable` DATETIME(3) NOT NULL,
    `location_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `cost` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE IF NOT EXISTS `itinerary` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `creator_id` INTEGER NOT NULL,
    `member_id` INTEGER NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `notes` MEDIUMTEXT NOT NULL,
    `begin` DATETIME(3) NOT NULL,
    `end` DATETIME(3) NOT NULL,
    `upVotes` INTEGER NOT NULL,
    `downVotes` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE IF NOT EXISTS `activity` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `creatorId` INTEGER NOT NULL,
    `participant` INTEGER NOT NULL,
    `suggestion_id` INTEGER NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `description` MEDIUMTEXT NOT NULL,
    `notes` TEXT NOT NULL,
    `location_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE IF NOT EXISTS `location` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(70) NOT NULL,
    `description` MEDIUMTEXT NOT NULL,
    `address` VARCHAR(35) NOT NULL,
    `latitude` DECIMAL(65, 30) NOT NULL,
    `longitude` DECIMAL(65, 30) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE IF NOT EXISTS `route` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `startLocation_id` INTEGER NOT NULL,
    `endLocation_id` INTEGER NOT NULL,
    `timeToLocation` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE IF NOT EXISTS `vote` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `vote_polarity` BOOLEAN NOT NULL,
    `vote_topic` TEXT NOT NULL,
    `voted_item_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE IF NOT EXISTS `interest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(25) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE IF NOT EXISTS `group` (
    `itinerary_id` INTEGER NOT NULL,
    `activity_id` INTEGER NOT NULL,

    UNIQUE INDEX `group_itinerary_id_key`(`itinerary_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE IF NOT EXISTS `reminder` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `activity_id` INTEGER NOT NULL,
    `call_time` DATETIME(3) NOT NULL,
    `call_message` TINYTEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE IF NOT EXISTS `image` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `url` LONGTEXT NOT NULL,
    `activity_id` INTEGER NOT NULL,
    `notes` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE IF NOT EXISTS `budget` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `category` VARCHAR(30) NOT NULL,
    `group_id` INTEGER NOT NULL,
    `spent` INTEGER NOT NULL,
    `limit` INTEGER NOT NULL,
    `notes` MEDIUMTEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
-- ALTER TABLE `user` ADD CONSTRAINT `user_groupItinerary_id_fkey` FOREIGN KEY (`groupItinerary_id`) REFERENCES `group`(`itinerary_id`) ON DELETE SET NULL ON UPDATE CASCADE;
