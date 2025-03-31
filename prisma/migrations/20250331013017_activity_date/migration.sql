/*
  Warnings:

  - Added the required column `date` to the `activity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `activity` ADD COLUMN `date` DATETIME(3) NOT NULL;
