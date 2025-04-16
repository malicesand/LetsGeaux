/*
  Warnings:

  - A unique constraint covering the columns `[partyId]` on the table `itinerary` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `itinerary_partyId_key` ON `itinerary`(`partyId`);
