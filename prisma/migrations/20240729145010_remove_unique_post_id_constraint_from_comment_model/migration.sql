-- DropIndex
DROP INDEX "Comment_postId_key";

-- AlterTable
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_pkey" PRIMARY KEY ("id");
