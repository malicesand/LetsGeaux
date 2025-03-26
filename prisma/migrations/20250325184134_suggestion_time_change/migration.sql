/*
  Warnings:

  - You are about to drop the column `time` on the `suggestion` table. All the data in the column will be lost.
  - Added the required column `timeAvailable` to the `suggestion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `suggestion` DROP COLUMN `time`,
    ADD COLUMN `timeAvailable` DATETIME(3) NOT NULL;
