-- CreateEnum
CREATE TYPE "DateFormatType" AS ENUM ('AMERICAN', 'WORLD');

-- AlterTable
ALTER TABLE "UserPreference" ADD COLUMN     "dateFormat" "DateFormatType" NOT NULL DEFAULT 'AMERICAN';
