/*
  Warnings:

  - You are about to alter the column `url` on the `image` table. The data in that column could be lost. The data in that column will be cast from `LongText` to `TinyText`.
  - You are about to alter the column `name` on the `location` table. The data in that column could be lost. The data in that column will be cast from `VarChar(70)` to `VarChar(50)`.
  - You are about to drop the `Route` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `notes` to the `itinerary` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `activity` MODIFY `description` VARCHAR(200) NOT NULL,
    MODIFY `notes` VARCHAR(150) NOT NULL;

-- AlterTable
ALTER TABLE `budget` MODIFY `notes` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `image` MODIFY `url` TINYTEXT NOT NULL,
    MODIFY `notes` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `itinerary` ADD COLUMN `notes` VARCHAR(150) NOT NULL;

-- AlterTable
ALTER TABLE `location` MODIFY `name` VARCHAR(50) NOT NULL,
    MODIFY `description` VARCHAR(255) NOT NULL,
    MODIFY `address` VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE `reminder` MODIFY `call_message` VARCHAR(40) NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `groupItinerary_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `vote` MODIFY `vote_topic` VARCHAR(25) NOT NULL;

-- DropTable
DROP TABLE `Route`;

-- CreateTable
CREATE TABLE `route` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `startLocation_id` INTEGER NOT NULL,
    `endLocation_id` INTEGER NOT NULL,
    `timeToLocation` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_groupItinerary_id_fkey` FOREIGN KEY (`groupItinerary_id`) REFERENCES `group`(`itinerary_id`) ON DELETE SET NULL ON UPDATE CASCADE;
