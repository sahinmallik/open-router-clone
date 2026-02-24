/*
  Warnings:

  - Added the required column `creditUsed` to the `ApiKey` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ApiKey" ADD COLUMN     "creditUsed" INTEGER NOT NULL,
ADD COLUMN     "lastUsed" TIMESTAMP(3);
