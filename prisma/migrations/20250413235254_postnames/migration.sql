/*
  Warnings:

  - Added the required column `postName` to the `comment` table without a default value. This is not possible if the table is not empty.
  - Made the column `postId` on table `comment` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `postName` to the `post` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `comment_postId_fkey`;

-- DropIndex
DROP INDEX `comment_postId_fkey` ON `comment`;

-- AlterTable
ALTER TABLE `comment` ADD COLUMN `postName` TINYTEXT NOT NULL,
    MODIFY `postId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `post` ADD COLUMN `postName` TINYTEXT NOT NULL;

-- AddForeignKey
ALTER TABLE `comment` ADD CONSTRAINT `comment_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `post`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
