/*
  Warnings:

  - A unique constraint covering the columns `[course]` on the table `Cohort` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Cohort_course_key" ON "Cohort"("course");
