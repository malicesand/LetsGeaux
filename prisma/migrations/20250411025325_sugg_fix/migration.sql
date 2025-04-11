/*
  Warnings:

  - Made the column `userId` on table `vote` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `vote` DROP FOREIGN KEY `vote_userId_fkey`;

-- AlterTable
ALTER TABLE `suggestion` MODIFY `address` VARCHAR(100) NULL,
    MODIFY `description` TEXT NULL;

-- AlterTable
ALTER TABLE `vote` MODIFY `userId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `vote` ADD CONSTRAINT `vote_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
