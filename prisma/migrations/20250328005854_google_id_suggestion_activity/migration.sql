/*
  Warnings:

  - You are about to drop the column `suggestion_id` on the `activity` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[googleId]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `googleId` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `activity` DROP COLUMN `suggestion_id`,
    ADD COLUMN `suggestionId` INTEGER NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `googleId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `user_googleId_key` ON `user`(`googleId`);

-- AddForeignKey
ALTER TABLE `activity` ADD CONSTRAINT `activity_suggestionId_fkey` FOREIGN KEY (`suggestionId`) REFERENCES `suggestion`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
