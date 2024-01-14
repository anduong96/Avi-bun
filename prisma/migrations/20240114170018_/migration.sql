/*
  Warnings:

  - You are about to drop the column `lockDuration` on the `ScheduledJob` table. All the data in the column will be lost.
  - Added the required column `lockDurationMs` to the `ScheduledJob` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `ScheduledJob_name_key` ON `ScheduledJob`;

-- AlterTable
ALTER TABLE `JsonCache` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `ScheduledJob` DROP COLUMN `lockDuration`,
    ADD COLUMN `deleteAt` DATETIME(3) NULL,
    ADD COLUMN `error` VARCHAR(191) NULL,
    ADD COLUMN `lockDurationMs` INTEGER NOT NULL,
    ADD COLUMN `props` JSON NULL,
    MODIFY `cronTime` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `AircraftSeatMeta` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `aircraftTailNumber` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `pitchInches` INTEGER NOT NULL,
    `widthInches` INTEGER NOT NULL,

    INDEX `AircraftSeatMeta_aircraftTailNumber_idx`(`aircraftTailNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AircraftAmenity` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `aircraftTailNumber` VARCHAR(191) NOT NULL,
    `type` ENUM('INTERNET', 'FOOD', 'AC_POWER', 'AUDIO', 'VIDEO') NOT NULL,
    `descriptionMarkdown` LONGTEXT NOT NULL,

    INDEX `AircraftAmenity_aircraftTailNumber_idx`(`aircraftTailNumber`),
    UNIQUE INDEX `AircraftAmenity_aircraftTailNumber_type_key`(`aircraftTailNumber`, `type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `ScheduledJob_name_idx` ON `ScheduledJob`(`name`);

-- CreateIndex
CREATE INDEX `ScheduledJob_nextRunAt_idx` ON `ScheduledJob`(`nextRunAt`);

-- CreateIndex
CREATE INDEX `ScheduledJob_deleteAt_idx` ON `ScheduledJob`(`deleteAt`);

-- CreateIndex
CREATE INDEX `ScheduledJob_unlockAt_idx` ON `ScheduledJob`(`unlockAt`);
