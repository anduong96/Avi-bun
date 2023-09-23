-- CreateEnum
CREATE TYPE "ImageType" AS ENUM ('SVG', 'PNG');

-- CreateEnum
CREATE TYPE "AlertChannel" AS ENUM ('PUSH');

-- CreateEnum
CREATE TYPE "FlightVendor" AS ENUM ('FLIGHT_STATS', 'AERO_DATA_BOX');

-- CreateEnum
CREATE TYPE "ValueType" AS ENUM ('NUMBER', 'STRING', 'DATE', 'BOOLEAN');

-- CreateEnum
CREATE TYPE "FlightStatus" AS ENUM ('SCHEDULED', 'DEPARTED', 'DELAYED', 'ARRIVED', 'CANCELED', 'ARCHIVED', 'LANDED');

-- CreateTable
CREATE TABLE "Airline" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "iata" TEXT NOT NULL,
    "logoFullImageURL" TEXT NOT NULL,
    "logoFullImageType" "ImageType" NOT NULL,
    "logoCompactImageURL" TEXT NOT NULL,
    "logoCompactImageType" "ImageType" NOT NULL,
    "isLowCost" BOOLEAN NOT NULL,

    CONSTRAINT "Airline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Airport" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "iata" TEXT NOT NULL,
    "timezone" TEXT NOT NULL,
    "cityName" TEXT NOT NULL,
    "cityCode" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "elevation" INTEGER,
    "countyName" TEXT,
    "state" TEXT,
    "latitude" INTEGER NOT NULL,
    "longitude" INTEGER NOT NULL,

    CONSTRAINT "Airport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "City" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "timezone" TEXT NOT NULL,
    "latitude" INTEGER NOT NULL,
    "longitude" INTEGER NOT NULL,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Country" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isoCode" TEXT NOT NULL,
    "dialCode" TEXT NOT NULL,
    "flagImageURL" TEXT NOT NULL,
    "flagImageType" "ImageType" NOT NULL,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Flight" (
    "id" TEXT NOT NULL,
    "originDepartureDate" TEXT NOT NULL,
    "airlineIata" TEXT NOT NULL,
    "flightNumber" TEXT NOT NULL,
    "aircraftTailnumber" TEXT,
    "status" "FlightStatus" NOT NULL,
    "totalDistanceKm" INTEGER DEFAULT 0,
    "originIata" TEXT NOT NULL,
    "originGate" TEXT,
    "originTerminal" TEXT,
    "destinationIata" TEXT NOT NULL,
    "destinationGate" TEXT,
    "destinationTerminal" TEXT,
    "destinationBaggageClaim" TEXT,
    "scheduledGateDeparture" TIMESTAMP(3) NOT NULL,
    "estimatedGateDeparture" TIMESTAMP(3) NOT NULL,
    "actualGateDeparture" TIMESTAMP(3),
    "scheduledGateArrival" TIMESTAMP(3) NOT NULL,
    "estimatedGateArrival" TIMESTAMP(3) NOT NULL,
    "actualGateArrival" TIMESTAMP(3),
    "reconAttempt" INTEGER DEFAULT 0,

    CONSTRAINT "Flight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlightVendorConnection" (
    "id" SERIAL NOT NULL,
    "vendor" "FlightVendor" NOT NULL,
    "vendorResourceID" TEXT NOT NULL,
    "flightID" TEXT NOT NULL,

    CONSTRAINT "FlightVendorConnection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Aircraft" (
    "id" SERIAL NOT NULL,
    "iata" TEXT,
    "icao" TEXT,
    "model" TEXT NOT NULL,
    "airlineIata" TEXT NOT NULL,
    "description" TEXT,
    "tailNumber" TEXT NOT NULL,
    "imageURL" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Aircraft_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AircraftPosition" (
    "id" SERIAL NOT NULL,
    "aircraftID" INTEGER NOT NULL,
    "latitude" INTEGER NOT NULL,
    "longitude" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AircraftPosition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlightEvent" (
    "id" TEXT NOT NULL,
    "flightTimelineID" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "flightID" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "requireAlert" BOOLEAN NOT NULL,
    "changedValueType" "ValueType",
    "prevValueType" "ValueType",
    "changedValue" JSONB,
    "prevValue" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FlightEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlightTimeline" (
    "id" TEXT NOT NULL,
    "flightID" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "source" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "hasAlerted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "FlightTimeline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlightPosition" (
    "id" SERIAL NOT NULL,
    "flightID" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "latitude" INTEGER NOT NULL,
    "longitude" INTEGER NOT NULL,
    "course" INTEGER NOT NULL,
    "speedMph" INTEGER NOT NULL,
    "vrateMps" INTEGER NOT NULL,
    "altitudeFt" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FlightPosition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlightPlan" (
    "id" SERIAL NOT NULL,
    "flightID" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "latitude" INTEGER NOT NULL,
    "longitude" INTEGER NOT NULL,

    CONSTRAINT "FlightPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlightAlert" (
    "id" TEXT NOT NULL,
    "flightID" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "channel" "AlertChannel"[],
    "receiptID" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FlightAlert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlightPromptness" (
    "id" TEXT NOT NULL,
    "airlineIata" TEXT NOT NULL,
    "flightNumber" TEXT NOT NULL,
    "originIata" TEXT NOT NULL,
    "destinationIata" TEXT NOT NULL,
    "vendor" "FlightVendor" NOT NULL,
    "rating" INTEGER NOT NULL,
    "onTimePercent" INTEGER NOT NULL,
    "averageDelayTimeMs" INTEGER NOT NULL,
    "daysObserved" INTEGER NOT NULL,
    "flightsObservered" INTEGER NOT NULL,
    "onTimeCount" INTEGER NOT NULL,
    "lateCount" INTEGER NOT NULL,
    "veryLateCount" INTEGER NOT NULL,
    "excessiveCount" INTEGER NOT NULL,
    "cancelledCount" INTEGER NOT NULL,
    "divertedCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FlightPromptness_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserFlight" (
    "id" TEXT NOT NULL,
    "userID" TEXT NOT NULL,
    "flightID" TEXT NOT NULL,
    "shouldAlert" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserFlight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduledJob" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lockDuration" INTEGER NOT NULL,
    "cronTime" TEXT NOT NULL,
    "lastFailedReason" TEXT,
    "lastFailedAt" TIMESTAMP(3),
    "lastSucceedAt" TIMESTAMP(3),
    "unlockAt" TIMESTAMP(3),
    "nextRunAt" TIMESTAMP(3),
    "lastRunAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScheduledJob_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Airline_iata_key" ON "Airline"("iata");

-- CreateIndex
CREATE UNIQUE INDEX "Airport_iata_key" ON "Airport"("iata");

-- CreateIndex
CREATE UNIQUE INDEX "City_code_key" ON "City"("code");

-- CreateIndex
CREATE INDEX "Country_name_idx" ON "Country"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Country_isoCode_key" ON "Country"("isoCode");

-- CreateIndex
CREATE INDEX "Flight_originIata_idx" ON "Flight"("originIata");

-- CreateIndex
CREATE INDEX "Flight_destinationIata_idx" ON "Flight"("destinationIata");

-- CreateIndex
CREATE UNIQUE INDEX "Flight_airlineIata_flightNumber_originIata_destinationIata__key" ON "Flight"("airlineIata", "flightNumber", "originIata", "destinationIata", "originDepartureDate");

-- CreateIndex
CREATE UNIQUE INDEX "FlightVendorConnection_flightID_vendor_key" ON "FlightVendorConnection"("flightID", "vendor");

-- CreateIndex
CREATE INDEX "Aircraft_icao_idx" ON "Aircraft"("icao");

-- CreateIndex
CREATE INDEX "Aircraft_iata_idx" ON "Aircraft"("iata");

-- CreateIndex
CREATE INDEX "Aircraft_airlineIata_idx" ON "Aircraft"("airlineIata");

-- CreateIndex
CREATE UNIQUE INDEX "Aircraft_tailNumber_key" ON "Aircraft"("tailNumber");

-- CreateIndex
CREATE UNIQUE INDEX "AircraftPosition_aircraftID_key" ON "AircraftPosition"("aircraftID");

-- CreateIndex
CREATE INDEX "FlightEvent_flightTimelineID_idx" ON "FlightEvent"("flightTimelineID");

-- CreateIndex
CREATE UNIQUE INDEX "FlightEvent_flightID_flightTimelineID_index_key" ON "FlightEvent"("flightID", "flightTimelineID", "index");

-- CreateIndex
CREATE UNIQUE INDEX "FlightTimeline_flightID_index_key" ON "FlightTimeline"("flightID", "index");

-- CreateIndex
CREATE INDEX "FlightPosition_flightID_idx" ON "FlightPosition"("flightID");

-- CreateIndex
CREATE INDEX "FlightPlan_flightID_idx" ON "FlightPlan"("flightID");

-- CreateIndex
CREATE INDEX "FlightAlert_flightID_idx" ON "FlightAlert"("flightID");

-- CreateIndex
CREATE INDEX "FlightPromptness_expiresAt_idx" ON "FlightPromptness"("expiresAt");

-- CreateIndex
CREATE INDEX "FlightPromptness_vendor_idx" ON "FlightPromptness"("vendor");

-- CreateIndex
CREATE UNIQUE INDEX "FlightPromptness_airlineIata_flightNumber_originIata_destin_key" ON "FlightPromptness"("airlineIata", "flightNumber", "originIata", "destinationIata");

-- CreateIndex
CREATE UNIQUE INDEX "UserFlight_flightID_userID_key" ON "UserFlight"("flightID", "userID");

-- CreateIndex
CREATE UNIQUE INDEX "ScheduledJob_name_key" ON "ScheduledJob"("name");

-- AddForeignKey
ALTER TABLE "Flight" ADD CONSTRAINT "Flight_originIata_fkey" FOREIGN KEY ("originIata") REFERENCES "Airport"("iata") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flight" ADD CONSTRAINT "Flight_destinationIata_fkey" FOREIGN KEY ("destinationIata") REFERENCES "Airport"("iata") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flight" ADD CONSTRAINT "Flight_airlineIata_fkey" FOREIGN KEY ("airlineIata") REFERENCES "Airline"("iata") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlightVendorConnection" ADD CONSTRAINT "FlightVendorConnection_flightID_fkey" FOREIGN KEY ("flightID") REFERENCES "Flight"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AircraftPosition" ADD CONSTRAINT "AircraftPosition_aircraftID_fkey" FOREIGN KEY ("aircraftID") REFERENCES "Aircraft"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlightPosition" ADD CONSTRAINT "FlightPosition_flightID_fkey" FOREIGN KEY ("flightID") REFERENCES "Flight"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlightPlan" ADD CONSTRAINT "FlightPlan_flightID_fkey" FOREIGN KEY ("flightID") REFERENCES "Flight"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFlight" ADD CONSTRAINT "UserFlight_flightID_fkey" FOREIGN KEY ("flightID") REFERENCES "Flight"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
