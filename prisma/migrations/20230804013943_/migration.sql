/*
  Warnings:

  - A unique constraint covering the columns `[userEmail,lessonId]` on the table `LessonProgress` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "LessonProgress_lessonId_userEmail_key";

-- CreateIndex
CREATE UNIQUE INDEX "LessonProgress_userEmail_lessonId_key" ON "LessonProgress"("userEmail", "lessonId");
