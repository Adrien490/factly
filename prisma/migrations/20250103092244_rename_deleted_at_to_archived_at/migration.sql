/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Client` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Client" DROP COLUMN IF EXISTS "isActive";
ALTER TABLE "Client" DROP COLUMN IF EXISTS "deletedAt";
ALTER TABLE "Client" ADD COLUMN "archivedAt" TIMESTAMP;
