/*
  Warnings:

  - A unique constraint covering the columns `[ritualId,date]` on the table `RitualLog` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "RitualLog" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "RitualLog_ritualId_date_key" ON "RitualLog"("ritualId", "date");
