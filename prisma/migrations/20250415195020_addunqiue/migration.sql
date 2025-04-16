/*
  Warnings:

  - A unique constraint covering the columns `[itineraryId]` on the table `party` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `party_itineraryId_key` ON `party`(`itineraryId`);
