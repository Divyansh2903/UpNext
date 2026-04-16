-- CreateEnum
CREATE TYPE "SongPlatform" AS ENUM ('youtube', 'spotify');

-- AlterTable
ALTER TABLE "songs" ADD COLUMN     "platform" "SongPlatform" NOT NULL DEFAULT 'youtube';
