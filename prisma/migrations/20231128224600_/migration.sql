/*
  Warnings:

  - The values [IMPERIAL] on the enum `MeasurementType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MeasurementType_new" AS ENUM ('AMERICAN', 'METRIC');
ALTER TABLE "UserPreference" ALTER COLUMN "measurement" DROP DEFAULT;
ALTER TABLE "UserPreference" ALTER COLUMN "measurement" TYPE "MeasurementType_new" USING ("measurement"::text::"MeasurementType_new");
ALTER TYPE "MeasurementType" RENAME TO "MeasurementType_old";
ALTER TYPE "MeasurementType_new" RENAME TO "MeasurementType";
DROP TYPE "MeasurementType_old";
ALTER TABLE "UserPreference" ALTER COLUMN "measurement" SET DEFAULT 'AMERICAN';
COMMIT;
