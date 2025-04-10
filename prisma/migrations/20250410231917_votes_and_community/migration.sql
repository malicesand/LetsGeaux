/*
  Warnings:

  - You are about to drop the column `vote_polarity` on the `vote` table. All the data in the column will be lost.
  - You are about to drop the column `vote_topic` on the `vote` table. All the data in the column will be lost.
  - You are about to drop the column `voted_item_id` on the `vote` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `vote` DROP COLUMN `vote_polarity`,
    DROP COLUMN `vote_topic`,
    DROP COLUMN `voted_item_id`,
    ADD COLUMN `commentId` INTEGER NULL,
    ADD COLUMN `postId` INTEGER NULL,
    ADD COLUMN `suggestionId` INTEGER NULL;

-- CreateTable
CREATE TABLE `post` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `comment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `post` ADD CONSTRAINT `post_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comment` ADD CONSTRAINT `comment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vote` ADD CONSTRAINT `vote_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `post`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vote` ADD CONSTRAINT `vote_commentId_fkey` FOREIGN KEY (`commentId`) REFERENCES `comment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vote` ADD CONSTRAINT `vote_suggestionId_fkey` FOREIGN KEY (`suggestionId`) REFERENCES `suggestion`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
