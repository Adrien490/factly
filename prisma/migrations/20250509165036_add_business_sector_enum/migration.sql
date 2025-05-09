/*
  Warnings:

  - You are about to drop the column `name` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `siren` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `siret` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `vatNumber` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the `Invitation` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "EmployeeCount" AS ENUM ('ONE_TO_TWO', 'THREE_TO_TEN', 'ELEVEN_TO_FIFTY', 'MORE_THAN_FIFTY');

-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'DRAFT', 'DISCONTINUED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ProductCategoryStatus" AS ENUM ('ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "VatRate" AS ENUM ('STANDARD', 'INTERMEDIATE', 'REDUCED', 'SUPER_REDUCED', 'ZERO', 'EXEMPT');

-- CreateEnum
CREATE TYPE "BusinessSector" AS ENUM ('AGRICULTURE', 'INDUSTRY', 'CONSTRUCTION', 'TRADE', 'TRANSPORT', 'HOSPITALITY', 'INFORMATION', 'FINANCE', 'REAL_ESTATE', 'PROFESSIONAL', 'ADMINISTRATIVE', 'PUBLIC', 'EDUCATION', 'HEALTH', 'ARTS', 'OTHER');

-- DropForeignKey
ALTER TABLE "Invitation" DROP CONSTRAINT "Invitation_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Invitation" DROP CONSTRAINT "Invitation_userId_fkey";

-- DropIndex
DROP INDEX "Client_name_status_idx";

-- AlterTable
ALTER TABLE "Client" DROP COLUMN "name",
DROP COLUMN "phone",
DROP COLUMN "siren",
DROP COLUMN "siret",
DROP COLUMN "vatNumber",
ADD COLUMN     "faxNumber" TEXT,
ADD COLUMN     "mobileNumber" TEXT,
ADD COLUMN     "phoneNumber" TEXT;

-- AlterTable
ALTER TABLE "Contact" DROP COLUMN "title",
ADD COLUMN     "fax" TEXT,
ADD COLUMN     "function" TEXT,
ADD COLUMN     "mobile" TEXT,
ADD COLUMN     "website" TEXT;

-- DropTable
DROP TABLE "Invitation";

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "legalForm" "LegalForm",
    "siretNumber" TEXT,
    "sirenNumber" TEXT,
    "nafApeCode" TEXT,
    "capital" TEXT,
    "rcs" TEXT,
    "vatNumber" TEXT,
    "businessSector" "BusinessSector",
    "employeeCount" "EmployeeCount",
    "clientId" TEXT NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "ProductCategoryStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "ProductCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "ProductStatus" NOT NULL DEFAULT 'ACTIVE',
    "imageUrl" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "purchasePrice" DOUBLE PRECISION,
    "vatRate" "VatRate" NOT NULL DEFAULT 'STANDARD',
    "weight" DOUBLE PRECISION,
    "width" DOUBLE PRECISION,
    "height" DOUBLE PRECISION,
    "depth" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "organizationId" TEXT NOT NULL,
    "supplierId" TEXT,
    "categoryId" TEXT,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_clientId_key" ON "Company"("clientId");

-- CreateIndex
CREATE INDEX "ProductCategory_status_organizationId_idx" ON "ProductCategory"("status", "organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductCategory_name_organizationId_key" ON "ProductCategory"("name", "organizationId");

-- CreateIndex
CREATE INDEX "Product_name_idx" ON "Product"("name");

-- CreateIndex
CREATE INDEX "Product_status_organizationId_idx" ON "Product"("status", "organizationId");

-- CreateIndex
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");

-- CreateIndex
CREATE INDEX "Product_supplierId_idx" ON "Product"("supplierId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_reference_organizationId_key" ON "Product"("reference", "organizationId");

-- CreateIndex
CREATE INDEX "Client_status_idx" ON "Client"("status");

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductCategory" ADD CONSTRAINT "ProductCategory_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ProductCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
