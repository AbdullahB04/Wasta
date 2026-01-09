-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'USER';

-- AlterTable
ALTER TABLE "public"."workers" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'WORKER';
