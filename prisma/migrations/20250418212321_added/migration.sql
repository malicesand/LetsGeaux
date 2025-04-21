-- AlterTable
ALTER TABLE `budget` ADD COLUMN `creatorId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `budget` ADD CONSTRAINT `budget_creatorId_fkey` FOREIGN KEY (`creatorId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
