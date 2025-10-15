/*
  Warnings:

  - You are about to drop the column `name` on the `TeamMember` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `TeamMember` table without a default value. This is not possible if the table is not empty.
  - Added the required column `furigana` to the `TeamMember` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `TeamMember` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nickname` to the `TeamMember` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TeamMember" DROP COLUMN "name",
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "furigana" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "nickname" TEXT NOT NULL;
