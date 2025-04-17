-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `comment_postId_fkey`;

-- DropForeignKey
ALTER TABLE `post` DROP FOREIGN KEY `post_userId_fkey`;

-- DropIndex
DROP INDEX `comment_postId_fkey` ON `comment`;

-- DropIndex
DROP INDEX `post_userId_fkey` ON `post`;

-- AlterTable
ALTER TABLE `comment` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `dislikes` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `likes` INTEGER NOT NULL DEFAULT 0,
    MODIFY `postName` TINYTEXT NULL;

-- AlterTable
ALTER TABLE `post` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `dislikes` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `likes` INTEGER NOT NULL DEFAULT 0,
    MODIFY `postName` TINYTEXT NULL;

-- AddForeignKey
ALTER TABLE `post` ADD CONSTRAINT `post_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comment` ADD CONSTRAINT `comment_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
