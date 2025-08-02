-- AlterTable
ALTER TABLE "public"."ChatMessage" ADD COLUMN     "aiMessage" TEXT,
ADD COLUMN     "type" TEXT,
ADD COLUMN     "userMessage" TEXT,
ALTER COLUMN "content" DROP NOT NULL;
