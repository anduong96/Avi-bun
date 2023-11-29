-- CreateTable
CREATE TABLE "UserWaitList" (
    "id" TEXT NOT NULL,
    "userID" TEXT NOT NULL,
    "feature" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserWaitList_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserWaitList_userID_feature_key" ON "UserWaitList"("userID", "feature");

-- AddForeignKey
ALTER TABLE "UserWaitList" ADD CONSTRAINT "UserWaitList_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
