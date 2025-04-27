-- DropForeignKey
ALTER TABLE `email` DROP FOREIGN KEY `email_partyId_fkey`;

-- DropIndex
DROP INDEX `email_partyId_fkey` ON `email`;

-- AddForeignKey
ALTER TABLE `email` ADD CONSTRAINT `email_partyId_fkey` FOREIGN KEY (`partyId`) REFERENCES `party`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
