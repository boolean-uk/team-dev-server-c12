/*
  Warnings:

  - You are about to drop the column `course` on the `Cohort` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Cohort` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[courseId]` on the table `Cohort` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Cohort_course_key";

-- AlterTable
ALTER TABLE "Cohort" DROP COLUMN "course",
DROP COLUMN "name",
ADD COLUMN     "cohort" TEXT,
ADD COLUMN     "courseId" INTEGER;

-- CreateTable
CREATE TABLE "Course" (
    "id" SERIAL NOT NULL,
    "course" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Module" (
    "id" SERIAL NOT NULL,
    "module" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Unit" (
    "id" SERIAL NOT NULL,
    "unit" TEXT NOT NULL,
    "moduleId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exercise" (
    "id" SERIAL NOT NULL,
    "exercise" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "githubRepo" TEXT NOT NULL,
    "unitId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "tag" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CourseToModule" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ExerciseToTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Unit_moduleId_key" ON "Unit"("moduleId");

-- CreateIndex
CREATE UNIQUE INDEX "Exercise_unitId_key" ON "Exercise"("unitId");

-- CreateIndex
CREATE UNIQUE INDEX "_CourseToModule_AB_unique" ON "_CourseToModule"("A", "B");

-- CreateIndex
CREATE INDEX "_CourseToModule_B_index" ON "_CourseToModule"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ExerciseToTag_AB_unique" ON "_ExerciseToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_ExerciseToTag_B_index" ON "_ExerciseToTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Cohort_courseId_key" ON "Cohort"("courseId");

-- AddForeignKey
ALTER TABLE "Cohort" ADD CONSTRAINT "Cohort_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Unit" ADD CONSTRAINT "Unit_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToModule" ADD CONSTRAINT "_CourseToModule_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToModule" ADD CONSTRAINT "_CourseToModule_B_fkey" FOREIGN KEY ("B") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExerciseToTag" ADD CONSTRAINT "_ExerciseToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExerciseToTag" ADD CONSTRAINT "_ExerciseToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
