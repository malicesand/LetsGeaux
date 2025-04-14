/*
  Warnings:

  - Added the required column `body` to the `comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `body` to the `post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `comment` ADD COLUMN `body` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `post` ADD COLUMN `body` VARCHAR(255) NOT NULL;
