/*
  Warnings:

  - You are about to drop the column `hasPdp` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `pdpIdentification` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `pdpName` on the `Organization` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "hasPdp",
DROP COLUMN "pdpIdentification",
DROP COLUMN "pdpName";
