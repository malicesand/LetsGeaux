/*
  Warnings:

  - You are about to drop the column `creatorId` on the `activity` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `activity` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `activity` DROP COLUMN `creatorId`,
    DROP COLUMN `notes`,
    ADD COLUMN `address` VARCHAR(191) NULL,
    ADD COLUMN `phone` VARCHAR(150) NULL,
    ADD COLUMN `time` VARCHAR(191) NULL,
    MODIFY `participant` INTEGER NULL,
    MODIFY `name` VARCHAR(50) NULL;
