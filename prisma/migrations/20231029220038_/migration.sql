-- AlterTable
ALTER TABLE "Airline" ALTER COLUMN "logoFullImageURL" DROP NOT NULL,
ALTER COLUMN "logoFullImageType" DROP NOT NULL,
ALTER COLUMN "logoCompactImageURL" DROP NOT NULL,
ALTER COLUMN "logoCompactImageType" DROP NOT NULL;
