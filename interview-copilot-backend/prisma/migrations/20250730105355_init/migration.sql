-- CreateTable
CREATE TABLE "public"."Chat" (
    "id" SERIAL NOT NULL,
    "userMessage" TEXT NOT NULL,
    "aiMessage" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'unknown',
    "userId" TEXT NOT NULL DEFAULT 'demo-user',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);
