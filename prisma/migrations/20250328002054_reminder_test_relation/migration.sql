/*
  Warnings:

  - You are about to drop the column `user_id` on the `reminder` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `reminder` DROP COLUMN `user_id`,
    ADD COLUMN `userId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `reminder` ADD CONSTRAINT `reminder_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
