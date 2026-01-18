/*
  Warnings:

  - You are about to drop the column `description` on the `services` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[firebaseUid]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[firebaseUid]` on the table `workers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `firebaseUid` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firebaseUid` to the `workers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `workers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `position` to the `workers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "services" DROP COLUMN "description";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "firebaseUid" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "workers" ADD COLUMN     "firebaseUid" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "position" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_firebaseUid_key" ON "users"("firebaseUid");

-- CreateIndex
CREATE UNIQUE INDEX "workers_firebaseUid_key" ON "workers"("firebaseUid");
