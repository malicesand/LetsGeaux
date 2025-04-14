-- AlterTable
ALTER TABLE `comment` ADD COLUMN `postId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `comment` ADD CONSTRAINT `comment_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `post`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
