/*
  Warnings:

  - Added the required column `polarity` to the `vote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `vote` ADD COLUMN `polarity` INTEGER NOT NULL;
