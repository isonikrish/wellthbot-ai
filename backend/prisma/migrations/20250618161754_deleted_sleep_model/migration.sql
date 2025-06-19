/*
  Warnings:

  - You are about to drop the `SleepLog` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SleepLog" DROP CONSTRAINT "SleepLog_userId_fkey";

-- DropTable
DROP TABLE "SleepLog";
