/*
  Warnings:

  - You are about to drop the column `archivedAt` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `billingAddress` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `billingCity` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `billingCountry` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `billingZipCode` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `deliveryAddress` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `deliveryCity` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `deliveryCountry` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `deliveryZipCode` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Invoice` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InvoiceItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InvoicePDF` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Supplier` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "AddressType" AS ENUM ('BILLING', 'DELIVERY');

-- CreateEnum
CREATE TYPE "ClientStatus" AS ENUM ('LEAD', 'PROSPECT', 'ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "LegalForm" AS ENUM ('AUTO_ENTREPRENEUR', 'EI', 'EIRL', 'EURL', 'SARL', 'SAS', 'SASU', 'SA', 'SCI', 'SCM', 'SNC', 'ASSOCIATION', 'AUTRE');

-- CreateEnum
CREATE TYPE "Civility" AS ENUM ('M', 'Mme', 'Mlle');

-- CreateEnum
CREATE TYPE "Country" AS ENUM ('FR', 'BE', 'DE', 'ES', 'IT');

-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_userId_fkey";

-- DropForeignKey
ALTER TABLE "Client" DROP CONSTRAINT "Client_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Client" DROP CONSTRAINT "Client_userId_fkey";

-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_clientId_fkey";

-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_userId_fkey";

-- DropForeignKey
ALTER TABLE "InvoiceItem" DROP CONSTRAINT "InvoiceItem_invoiceId_fkey";

-- DropForeignKey
ALTER TABLE "InvoiceItem" DROP CONSTRAINT "InvoiceItem_productId_fkey";

-- DropForeignKey
ALTER TABLE "InvoicePDF" DROP CONSTRAINT "InvoicePDF_invoiceId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_supplierId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_userId_fkey";

-- DropForeignKey
ALTER TABLE "Supplier" DROP CONSTRAINT "Supplier_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Supplier" DROP CONSTRAINT "Supplier_userId_fkey";

-- DropIndex
DROP INDEX "Client_email_idx";

-- DropIndex
DROP INDEX "Client_reference_idx";

-- DropIndex
DROP INDEX "Client_userId_idx";

-- AlterTable
ALTER TABLE "Client" DROP COLUMN "archivedAt",
DROP COLUMN "billingAddress",
DROP COLUMN "billingCity",
DROP COLUMN "billingCountry",
DROP COLUMN "billingZipCode",
DROP COLUMN "deliveryAddress",
DROP COLUMN "deliveryCity",
DROP COLUMN "deliveryCountry",
DROP COLUMN "deliveryZipCode",
ADD COLUMN     "civility" "Civility",
ADD COLUMN     "legalForm" "LegalForm",
ADD COLUMN     "siret" TEXT,
ADD COLUMN     "status" "ClientStatus" NOT NULL DEFAULT 'LEAD',
ADD COLUMN     "website" TEXT,
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "hasPdp" BOOLEAN DEFAULT false,
ADD COLUMN     "pdpIdentification" TEXT,
ADD COLUMN     "pdpName" TEXT;

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "Invoice";

-- DropTable
DROP TABLE "InvoiceItem";

-- DropTable
DROP TABLE "InvoicePDF";

-- DropTable
DROP TABLE "Product";

-- DropTable
DROP TABLE "Supplier";

-- DropEnum
DROP TYPE "InvoiceStatus";

-- DropEnum
DROP TYPE "InvoiceType";

-- DropEnum
DROP TYPE "OperationType";

-- DropEnum
DROP TYPE "TransactionCategory";

-- DropEnum
DROP TYPE "TransmissionStatus";

-- CreateTable
CREATE TABLE "ClientAddress" (
    "id" TEXT NOT NULL,
    "addressType" "AddressType" NOT NULL,
    "line1" TEXT NOT NULL,
    "line2" TEXT,
    "zipCode" TEXT,
    "city" TEXT,
    "country" "Country",
    "isDefault" BOOLEAN DEFAULT false,
    "clientId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClientAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientContact" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "isDefault" BOOLEAN DEFAULT false,
    "title" TEXT,
    "clientId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClientContact_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClientAddress_clientId_addressType_isDefault_key" ON "ClientAddress"("clientId", "addressType", "isDefault");

-- CreateIndex
CREATE INDEX "ClientContact_clientId_idx" ON "ClientContact"("clientId");

-- CreateIndex
CREATE INDEX "Client_status_idx" ON "Client"("status");

-- CreateIndex
CREATE INDEX "Client_siren_idx" ON "Client"("siren");

-- CreateIndex
CREATE INDEX "Client_siret_idx" ON "Client"("siret");

-- CreateIndex
CREATE INDEX "OrganizationMembership_status_idx" ON "OrganizationMembership"("status");

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientAddress" ADD CONSTRAINT "ClientAddress_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientContact" ADD CONSTRAINT "ClientContact_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
