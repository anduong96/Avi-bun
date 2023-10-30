-- CreateTable
CREATE TABLE "AirportCondition" (
    "id" TEXT NOT NULL,
    "airportIata" TEXT NOT NULL,
    "departureDelayPercent" INTEGER NOT NULL,
    "departureCanceledPercent" INTEGER NOT NULL,
    "departureAverageDelayMs" INTEGER NOT NULL,
    "arrivalDelayPercent" INTEGER NOT NULL,
    "arrivalCanceledPercent" INTEGER NOT NULL,
    "arrivalAverageDelayMs" INTEGER NOT NULL,

    CONSTRAINT "AirportCondition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AirportWeather" (
    "id" TEXT NOT NULL,
    "airportIata" TEXT NOT NULL,
    "tempuratureC" INTEGER NOT NULL,

    CONSTRAINT "AirportWeather_pkey" PRIMARY KEY ("id")
);
