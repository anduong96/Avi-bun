-- CreateEnum
CREATE TYPE "MeasurementType" AS ENUM ('AMERICAN', 'METRIC', 'IMPERIAL');

-- CreateTable
CREATE TABLE "UserPreference" (
    "id" TEXT NOT NULL,
    "userID" TEXT NOT NULL,
    "measurement" "MeasurementType" NOT NULL DEFAULT 'AMERICAN',

    CONSTRAINT "UserPreference_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserPreference" ADD CONSTRAINT "UserPreference_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
