/*
  Warnings:

  - You are about to drop the column `Title` on the `post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `post` DROP COLUMN `Title`,
    ADD COLUMN `title` VARCHAR(191) NULL;
