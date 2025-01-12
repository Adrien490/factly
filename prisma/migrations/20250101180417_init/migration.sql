/*
  Warnings:

  - You are about to drop the column `address` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `siret` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `zipCode` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `eInvoicingFormat` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `eReportingNeeded` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `flowType` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `pdpStatus` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `pdpTransmissionId` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `transmittedAt` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `siret` on the `Supplier` table. All the data in the column will be lost.
  - You are about to drop the column `isPdp` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `pdpImmatriculation` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `siret` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `vatNumber` on the `User` table. All the data in the column will be lost.
  - Added the required column `organizationId` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `Supplier` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "InvoiceType" AS ENUM ('STANDARD', 'CREDIT_NOTE', 'DEBIT_NOTE');

-- CreateEnum
CREATE TYPE "TransmissionStatus" AS ENUM ('TO_SEND', 'SENT', 'ACKNOWLEDGED', 'REJECTED');

-- CreateEnum
CREATE TYPE "TransactionCategory" AS ENUM ('B2B_FR', 'B2C', 'EXPORT', 'INTRACOM', 'OTHER');

-- CreateEnum
CREATE TYPE "OperationType" AS ENUM ('GOODS', 'SERVICES', 'MIXED');

-- CreateEnum
CREATE TYPE "ClientType" AS ENUM ('INDIVIDUAL', 'COMPANY');

-- CreateEnum
CREATE TYPE "OrganizationRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER');

-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('PENDING', 'ACTIVE', 'REVOKED');

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_userId_fkey";

-- AlterTable
ALTER TABLE "Account" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "organizationId" TEXT NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Client" DROP COLUMN "address",
DROP COLUMN "city",
DROP COLUMN "country",
DROP COLUMN "notes",
DROP COLUMN "siret",
DROP COLUMN "zipCode",
ADD COLUMN     "billingAddress" TEXT,
ADD COLUMN     "billingCity" TEXT,
ADD COLUMN     "billingCountry" TEXT,
ADD COLUMN     "billingZipCode" TEXT,
ADD COLUMN     "clientType" "ClientType" NOT NULL DEFAULT 'COMPANY',
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "deliveryAddress" TEXT,
ADD COLUMN     "deliveryCity" TEXT,
ADD COLUMN     "deliveryCountry" TEXT,
ADD COLUMN     "deliveryZipCode" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "organizationId" TEXT NOT NULL,
ADD COLUMN     "siren" TEXT,
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "eInvoicingFormat",
DROP COLUMN "eReportingNeeded",
DROP COLUMN "flowType",
DROP COLUMN "pdpStatus",
DROP COLUMN "pdpTransmissionId",
DROP COLUMN "transmittedAt",
ADD COLUMN     "currency" TEXT,
ADD COLUMN     "invoiceType" "InvoiceType" NOT NULL DEFAULT 'STANDARD',
ADD COLUMN     "isTaxOnDebits" BOOLEAN,
ADD COLUMN     "operationType" "OperationType" NOT NULL DEFAULT 'GOODS',
ADD COLUMN     "organizationId" TEXT NOT NULL,
ADD COLUMN     "paymentDate" TIMESTAMP(3),
ADD COLUMN     "paymentMethod" TEXT,
ADD COLUMN     "pdpLastStatusMessage" TEXT,
ADD COLUMN     "pdpReference" TEXT,
ADD COLUMN     "pdpTransmissionDate" TIMESTAMP(3),
ADD COLUMN     "shippingAddress" TEXT,
ADD COLUMN     "shippingCity" TEXT,
ADD COLUMN     "shippingCountry" TEXT,
ADD COLUMN     "shippingZipCode" TEXT,
ADD COLUMN     "transactionCategory" "TransactionCategory" NOT NULL DEFAULT 'B2B_FR',
ADD COLUMN     "transmissionStatus" "TransmissionStatus" NOT NULL DEFAULT 'TO_SEND',
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "InvoiceItem" ADD COLUMN     "taxAmount" DOUBLE PRECISION,
ADD COLUMN     "taxRate" DOUBLE PRECISION,
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "InvoicePDF" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "organizationId" TEXT NOT NULL,
ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Supplier" DROP COLUMN "siret",
ADD COLUMN     "organizationId" TEXT NOT NULL,
ADD COLUMN     "siren" TEXT,
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isPdp",
DROP COLUMN "pdpImmatriculation",
DROP COLUMN "siret",
DROP COLUMN "vatNumber",
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- DropEnum
DROP TYPE "EInvoicingFormat";

-- DropEnum
DROP TYPE "FlowType";

-- DropEnum
DROP TYPE "InvitationStatus";

-- DropEnum
DROP TYPE "PdpStatus";

-- DropEnum
DROP TYPE "Plan";

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "siren" TEXT,
    "siret" TEXT,
    "vatNumber" TEXT,
    "vatOptionDebits" BOOLEAN DEFAULT false,
    "legalForm" TEXT,
    "rcsNumber" TEXT,
    "capital" DOUBLE PRECISION,
    "address" TEXT,
    "city" TEXT,
    "zipCode" TEXT,
    "country" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationMembership" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "role" "OrganizationRole" NOT NULL DEFAULT 'MEMBER',
    "status" "MembershipStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrganizationMembership_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationMembership_userId_organizationId_key" ON "OrganizationMembership"("userId", "organizationId");

-- AddForeignKey
ALTER TABLE "OrganizationMembership" ADD CONSTRAINT "OrganizationMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationMembership" ADD CONSTRAINT "OrganizationMembership_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Supplier" ADD CONSTRAINT "Supplier_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
