/*
  Warnings:

  - You are about to drop the `emails` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `emails` DROP FOREIGN KEY `emails_userId_fkey`;

-- DropTable
DROP TABLE `emails`;

-- CreateTable
CREATE TABLE `email` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `address` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` INTEGER NOT NULL,
    `partyId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `email` ADD CONSTRAINT `email_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `email` ADD CONSTRAINT `email_partyId_fkey` FOREIGN KEY (`partyId`) REFERENCES `party`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
