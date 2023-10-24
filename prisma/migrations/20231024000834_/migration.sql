/*
  Warnings:

  - A unique constraint covering the columns `[userID]` on the table `UserPreference` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserPreference_userID_key" ON "UserPreference"("userID");
