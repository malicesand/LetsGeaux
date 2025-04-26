/*
  Warnings:

  - You are about to drop the column `phoneNum` on the `suggestion` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `suggestion` DROP COLUMN `phoneNum`,
    ADD COLUMN `link` VARCHAR(50) NULL;
