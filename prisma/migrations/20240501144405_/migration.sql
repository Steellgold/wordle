/*
  Warnings:

  - Added the required column `categoryId` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "categoryId" TEXT NOT NULL,
ADD COLUMN     "isMarketplaceCategory" BOOLEAN NOT NULL DEFAULT false;
