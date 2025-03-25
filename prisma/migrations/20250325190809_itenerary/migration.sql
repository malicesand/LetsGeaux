-- AlterTable
ALTER TABLE `suggestion` MODIFY `title` VARCHAR(120) NOT NULL;

-- CreateTable
CREATE TABLE `itinerary` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `creator_id` INTEGER NOT NULL,
    `member_id` INTEGER NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `begin` DATETIME(3) NOT NULL,
    `end` DATETIME(3) NOT NULL,
    `upVotes` INTEGER NOT NULL,
    `downVotes` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
