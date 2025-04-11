/*
  Warnings:

  - A unique constraint covering the columns `[viewCode]` on the table `itinerary` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `viewCode` to the `itinerary` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `itinerary` ADD COLUMN `viewCode` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `itinerary_viewCode_key` ON `itinerary`(`viewCode`);
