-- AlterTable
ALTER TABLE `user` MODIFY `isVerified` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `phoneNum` VARCHAR(10) NULL,
    MODIFY `isNotified` BOOLEAN NOT NULL DEFAULT false;
