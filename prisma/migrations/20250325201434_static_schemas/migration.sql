-- CreateTable
CREATE TABLE `vote` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `vote_polarity` BOOLEAN NOT NULL,
    `vote_topic` TEXT NOT NULL,
    `voted_item_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `interest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(25) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `group` (
    `itinerary_id` INTEGER NOT NULL,
    `activity_id` INTEGER NOT NULL,

    UNIQUE INDEX `group_itinerary_id_key`(`itinerary_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reminder` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `activity_id` INTEGER NOT NULL,
    `call_time` DATETIME(3) NOT NULL,
    `call_message` TINYTEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `image` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `url` LONGTEXT NOT NULL,
    `activity_id` INTEGER NOT NULL,
    `notes` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `budget` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `category` VARCHAR(30) NOT NULL,
    `group_id` INTEGER NOT NULL,
    `spent` INTEGER NOT NULL,
    `limit` INTEGER NOT NULL,
    `notes` MEDIUMTEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
