/*
  Warnings:

  - Made the column `creditUsed` on table `ApiKey` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lastUsed` on table `ApiKey` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ApiKey" ALTER COLUMN "creditUsed" SET NOT NULL,
ALTER COLUMN "creditUsed" SET DEFAULT 0,
ALTER COLUMN "lastUsed" SET NOT NULL,
ALTER COLUMN "lastUsed" SET DEFAULT CURRENT_TIMESTAMP;
