/*
  Warnings:

  - You are about to drop the column `limit` on the `budget` table. All the data in the column will be lost.
  - You are about to drop the column `priority` on the `suggestion` table. All the data in the column will be lost.
  - Added the required column `totalBudget` to the `budget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `budget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address` to the `suggestion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `suggestion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `suggestion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNum` to the `suggestion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `budget` DROP COLUMN `limit`,
    ADD COLUMN `totalBudget` DECIMAL(65, 30) NOT NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `chatHistory` MODIFY `userId` INTEGER NULL,
    MODIFY `timeStamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `sessionId` VARCHAR(100) NULL;

-- AlterTable
ALTER TABLE `post` ADD COLUMN `suggestionId` INTEGER NULL,
    MODIFY `location` VARCHAR(191) NULL,
    MODIFY `latitude` DECIMAL(65, 30) NULL,
    MODIFY `longitude` DECIMAL(65, 30) NULL,
    MODIFY `category` VARCHAR(191) NULL,
    MODIFY `Tags` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `suggestion` DROP COLUMN `priority`,
    ADD COLUMN `address` VARCHAR(50) NOT NULL,
    ADD COLUMN `description` MEDIUMTEXT NOT NULL,
    ADD COLUMN `image` TINYTEXT NOT NULL,
    ADD COLUMN `phoneNum` VARCHAR(15) NOT NULL,
    MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateTable
CREATE TABLE `category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `budgetId` INTEGER NOT NULL,
    `name` VARCHAR(30) NOT NULL,
    `allocated` DECIMAL(65, 30) NOT NULL,
    `spent` DECIMAL(65, 30) NOT NULL,
    `notes` VARCHAR(150) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
