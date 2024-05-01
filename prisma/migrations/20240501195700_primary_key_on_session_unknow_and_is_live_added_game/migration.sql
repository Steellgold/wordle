-- AlterEnum
ALTER TYPE "GAME_RESULT" ADD VALUE 'UNKNOWN';

-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "isLive" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Session" ADD CONSTRAINT "Session_pkey" PRIMARY KEY ("sessionToken");
