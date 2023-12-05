-- CreateTable
CREATE TABLE `Airline` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `iata` VARCHAR(191) NOT NULL,
    `icao` VARCHAR(191) NULL,
    `logoFullImageURL` VARCHAR(191) NULL,
    `logoFullImageType` ENUM('SVG', 'PNG') NULL,
    `logoCompactImageURL` VARCHAR(191) NULL,
    `logoCompactImageType` ENUM('SVG', 'PNG') NULL,
    `isLowCost` BOOLEAN NULL,

    UNIQUE INDEX `Airline_iata_key`(`iata`),
    UNIQUE INDEX `Airline_icao_key`(`icao`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Timezone` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `gmt` INTEGER NOT NULL,
    `dst` INTEGER NOT NULL,
    `countryCode` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Timezone_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Airport` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `iata` VARCHAR(191) NULL,
    `icao` VARCHAR(191) NULL,
    `timezone` VARCHAR(191) NOT NULL,
    `cityName` VARCHAR(191) NOT NULL,
    `cityCode` VARCHAR(191) NOT NULL,
    `countryCode` VARCHAR(191) NOT NULL,
    `elevation` INTEGER NULL,
    `countyName` VARCHAR(191) NULL,
    `state` VARCHAR(191) NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,

    UNIQUE INDEX `Airport_iata_key`(`iata`),
    INDEX `Airport_countryCode_idx`(`countryCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AirportCondition` (
    `id` VARCHAR(191) NOT NULL,
    `airportIata` VARCHAR(191) NOT NULL,
    `departureDelayPercent` INTEGER NOT NULL,
    `departureCanceledPercent` INTEGER NOT NULL,
    `departureAverageDelayMs` INTEGER NOT NULL,
    `arrivalDelayPercent` INTEGER NOT NULL,
    `arrivalCanceledPercent` INTEGER NOT NULL,
    `arrivalAverageDelayMs` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AirportWeather` (
    `id` VARCHAR(191) NOT NULL,
    `airportIata` VARCHAR(191) NOT NULL,
    `airTemperatureCelsius` INTEGER NOT NULL,
    `precipitationAmountMillimeter` INTEGER NOT NULL,
    `windSpeedMeterPerSecond` INTEGER NOT NULL,
    `windFromDirectionDegrees` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `iconURL` VARCHAR(191) NOT NULL,
    `vendor` VARCHAR(191) NOT NULL,
    `year` SMALLINT NOT NULL,
    `month` SMALLINT NOT NULL,
    `date` SMALLINT NOT NULL,
    `hour` SMALLINT NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `AirportWeather_airportIata_year_month_date_hour_key`(`airportIata`, `year`, `month`, `date`, `hour`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `City` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `countryCode` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `timezone` VARCHAR(191) NOT NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,

    UNIQUE INDEX `City_code_key`(`code`),
    INDEX `City_countryCode_idx`(`countryCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Country` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `isoCode` VARCHAR(191) NOT NULL,
    `dialCode` VARCHAR(191) NOT NULL,
    `flagImageURL` VARCHAR(191) NULL,
    `flagImageType` ENUM('SVG', 'PNG') NULL,

    UNIQUE INDEX `Country_isoCode_key`(`isoCode`),
    INDEX `Country_name_idx`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Flight` (
    `id` VARCHAR(191) NOT NULL,
    `flightYear` SMALLINT NOT NULL,
    `flightMonth` SMALLINT NOT NULL,
    `flightDate` SMALLINT NOT NULL,
    `airlineIata` VARCHAR(191) NOT NULL,
    `flightNumber` VARCHAR(191) NOT NULL,
    `aircraftTailNumber` VARCHAR(191) NULL,
    `status` ENUM('SCHEDULED', 'DEPARTED', 'DELAYED', 'ARRIVED', 'CANCELED', 'ARCHIVED', 'LANDED') NOT NULL,
    `totalDistanceKm` INTEGER NULL,
    `originUtcHourOffset` INTEGER NOT NULL,
    `originIata` VARCHAR(191) NOT NULL,
    `originGate` VARCHAR(191) NULL,
    `originTerminal` VARCHAR(191) NULL,
    `destinationIata` VARCHAR(191) NOT NULL,
    `destinationGate` VARCHAR(191) NULL,
    `destinationUtcHourOffset` INTEGER NOT NULL,
    `destinationTerminal` VARCHAR(191) NULL,
    `destinationBaggageClaim` VARCHAR(191) NULL,
    `scheduledGateDeparture` DATETIME(3) NOT NULL,
    `estimatedGateDeparture` DATETIME(3) NOT NULL,
    `actualGateDeparture` DATETIME(3) NULL,
    `scheduledGateArrival` DATETIME(3) NOT NULL,
    `estimatedGateArrival` DATETIME(3) NOT NULL,
    `actualGateArrival` DATETIME(3) NULL,
    `co2EmissionKgEconomy` DOUBLE NULL,
    `co2EmissionKgFirst` DOUBLE NULL,
    `co2EmissionKgBusiness` DOUBLE NULL,
    `co2EmissionKgEco` DOUBLE NULL,
    `reconAttempt` INTEGER NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Flight_originIata_idx`(`originIata`),
    INDEX `Flight_destinationIata_idx`(`destinationIata`),
    UNIQUE INDEX `Flight_airlineIata_flightNumber_originIata_destinationIata_f_key`(`airlineIata`, `flightNumber`, `originIata`, `destinationIata`, `flightYear`, `flightMonth`, `flightDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FlightPromptness` (
    `id` VARCHAR(191) NOT NULL,
    `airlineIata` VARCHAR(191) NOT NULL,
    `flightNumber` VARCHAR(191) NOT NULL,
    `originIata` VARCHAR(191) NOT NULL,
    `destinationIata` VARCHAR(191) NOT NULL,
    `vendor` ENUM('FLIGHT_STATS', 'AERO_DATA_BOX') NOT NULL,
    `rating` INTEGER NULL,
    `onTimePercent` INTEGER NULL,
    `averageDelayTimeMs` INTEGER NULL,
    `daysObserved` INTEGER NULL,
    `flightsObserved` INTEGER NULL,
    `onTimeCount` INTEGER NULL,
    `lateCount` INTEGER NULL,
    `veryLateCount` INTEGER NULL,
    `excessiveCount` INTEGER NULL,
    `cancelledCount` INTEGER NULL,
    `divertedCount` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,

    INDEX `FlightPromptness_expiresAt_idx`(`expiresAt`),
    INDEX `FlightPromptness_vendor_idx`(`vendor`),
    UNIQUE INDEX `FlightPromptness_airlineIata_flightNumber_originIata_destina_key`(`airlineIata`, `flightNumber`, `originIata`, `destinationIata`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FlightVendorConnection` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `vendor` ENUM('FLIGHT_STATS', 'AERO_DATA_BOX') NOT NULL,
    `vendorResourceID` VARCHAR(191) NOT NULL,
    `flightID` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `FlightVendorConnection_flightID_vendor_key`(`flightID`, `vendor`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Aircraft` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `iata` VARCHAR(191) NULL,
    `icao` VARCHAR(191) NOT NULL,
    `model` VARCHAR(191) NOT NULL,
    `airlineIata` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `tailNumber` VARCHAR(191) NOT NULL,
    `imageURL` VARCHAR(191) NULL,
    `firstFlight` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Aircraft_tailNumber_key`(`tailNumber`),
    INDEX `Aircraft_icao_idx`(`icao`),
    INDEX `Aircraft_iata_idx`(`iata`),
    INDEX `Aircraft_airlineIata_idx`(`airlineIata`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AircraftPosition` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `aircraftID` INTEGER NOT NULL,
    `latitude` DOUBLE NULL,
    `longitude` DOUBLE NULL,
    `altitude` DOUBLE NULL,
    `flightYear` SMALLINT NOT NULL,
    `flightMonth` SMALLINT NOT NULL,
    `flightDate` SMALLINT NOT NULL,
    `flightNumber` VARCHAR(191) NOT NULL,
    `airlineIata` VARCHAR(191) NOT NULL,
    `originIata` VARCHAR(191) NOT NULL,
    `destinationIata` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `AircraftPosition_updatedAt_key`(`updatedAt`),
    INDEX `AircraftPosition_aircraftID_idx`(`aircraftID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FlightEvent` (
    `id` VARCHAR(191) NOT NULL,
    `flightTimelineID` VARCHAR(191) NOT NULL,
    `index` INTEGER NOT NULL DEFAULT 0,
    `flightID` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `requireAlert` BOOLEAN NOT NULL,
    `valueType` ENUM('NUMBER', 'STRING', 'DATE', 'BOOLEAN') NULL,
    `changeType` ENUM('ADDED', 'REMOVED', 'MODIFIED') NULL,
    `currentValue` JSON NULL,
    `previousValue` JSON NULL,
    `timestamp` DATETIME(3) NOT NULL,

    INDEX `FlightEvent_flightTimelineID_idx`(`flightTimelineID`),
    UNIQUE INDEX `FlightEvent_flightID_flightTimelineID_index_key`(`flightID`, `flightTimelineID`, `index`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FlightTimeline` (
    `id` VARCHAR(191) NOT NULL,
    `flightID` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `source` VARCHAR(191) NOT NULL,
    `timestamp` DATETIME(3) NOT NULL,
    `hasAlerted` BOOLEAN NOT NULL DEFAULT false,
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `FlightTimeline_flightID_timestamp_key`(`flightID`, `timestamp`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FlightPlan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `flightID` VARCHAR(191) NOT NULL,
    `index` INTEGER NOT NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,

    INDEX `FlightPlan_flightID_idx`(`flightID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FlightAlert` (
    `id` VARCHAR(191) NOT NULL,
    `flightID` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `body` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `FlightAlert_flightID_idx`(`flightID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `displayName` VARCHAR(191) NULL,
    `isAnonymous` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `avatarURL` VARCHAR(191) NULL,
    `lastSignInAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserAuthentication` (
    `id` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `userID` VARCHAR(191) NOT NULL,
    `avatarURL` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `UserAuthentication_userID_idx`(`userID`),
    UNIQUE INDEX `UserAuthentication_provider_userID_key`(`provider`, `userID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserFlight` (
    `id` VARCHAR(191) NOT NULL,
    `userID` VARCHAR(191) NOT NULL,
    `flightID` VARCHAR(191) NOT NULL,
    `shouldAlert` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `UserFlight_userID_idx`(`userID`),
    UNIQUE INDEX `UserFlight_flightID_userID_key`(`flightID`, `userID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserWaitList` (
    `id` VARCHAR(191) NOT NULL,
    `userID` VARCHAR(191) NOT NULL,
    `feature` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `UserWaitList_userID_feature_key`(`userID`, `feature`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserPreference` (
    `id` VARCHAR(191) NOT NULL,
    `userID` VARCHAR(191) NOT NULL,
    `measurement` ENUM('AMERICAN', 'METRIC') NOT NULL DEFAULT 'AMERICAN',
    `dateFormat` ENUM('AMERICAN', 'WORLD') NOT NULL DEFAULT 'AMERICAN',

    UNIQUE INDEX `UserPreference_userID_key`(`userID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ScheduledJob` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `lockDuration` INTEGER NOT NULL,
    `cronTime` VARCHAR(191) NOT NULL,
    `lastFailedReason` VARCHAR(191) NULL,
    `lastFailedAt` DATETIME(3) NULL,
    `lastSucceedAt` DATETIME(3) NULL,
    `unlockAt` DATETIME(3) NULL,
    `nextRunAt` DATETIME(3) NULL,
    `lastRunAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ScheduledJob_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JsonCache` (
    `id` VARCHAR(191) NOT NULL,
    `data` JSON NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,

    INDEX `JsonCache_expiresAt_idx`(`expiresAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Airport` ADD CONSTRAINT `Airport_countryCode_fkey` FOREIGN KEY (`countryCode`) REFERENCES `Country`(`isoCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AirportWeather` ADD CONSTRAINT `AirportWeather_airportIata_fkey` FOREIGN KEY (`airportIata`) REFERENCES `Airport`(`iata`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `City` ADD CONSTRAINT `City_countryCode_fkey` FOREIGN KEY (`countryCode`) REFERENCES `Country`(`isoCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Flight` ADD CONSTRAINT `Flight_airlineIata_fkey` FOREIGN KEY (`airlineIata`) REFERENCES `Airline`(`iata`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Flight` ADD CONSTRAINT `Flight_destinationIata_fkey` FOREIGN KEY (`destinationIata`) REFERENCES `Airport`(`iata`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Flight` ADD CONSTRAINT `Flight_originIata_fkey` FOREIGN KEY (`originIata`) REFERENCES `Airport`(`iata`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FlightVendorConnection` ADD CONSTRAINT `FlightVendorConnection_flightID_fkey` FOREIGN KEY (`flightID`) REFERENCES `Flight`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `AircraftPosition` ADD CONSTRAINT `AircraftPosition_aircraftID_fkey` FOREIGN KEY (`aircraftID`) REFERENCES `Aircraft`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `FlightEvent` ADD CONSTRAINT `FlightEvent_flightID_fkey` FOREIGN KEY (`flightID`) REFERENCES `Flight`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FlightEvent` ADD CONSTRAINT `FlightEvent_flightTimelineID_fkey` FOREIGN KEY (`flightTimelineID`) REFERENCES `FlightTimeline`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FlightTimeline` ADD CONSTRAINT `FlightTimeline_flightID_fkey` FOREIGN KEY (`flightID`) REFERENCES `Flight`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FlightPlan` ADD CONSTRAINT `FlightPlan_flightID_fkey` FOREIGN KEY (`flightID`) REFERENCES `Flight`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FlightAlert` ADD CONSTRAINT `FlightAlert_flightID_fkey` FOREIGN KEY (`flightID`) REFERENCES `Flight`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserAuthentication` ADD CONSTRAINT `UserAuthentication_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserFlight` ADD CONSTRAINT `UserFlight_flightID_fkey` FOREIGN KEY (`flightID`) REFERENCES `Flight`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `UserFlight` ADD CONSTRAINT `UserFlight_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserWaitList` ADD CONSTRAINT `UserWaitList_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserPreference` ADD CONSTRAINT `UserPreference_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
