/*
  Warnings:

  - Added the required column `creatorId` to the `activity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `activity` ADD COLUMN `creatorId` INTEGER NOT NULL;
