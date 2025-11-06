-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "List" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "List_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL,
    "listId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rarity" TEXT NOT NULL,
    "weight" INTEGER,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "qty" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "UserItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackType" (
    "id" TEXT NOT NULL,
    "listId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cardsPerPack" INTEGER NOT NULL DEFAULT 4,
    "pitySteps" TEXT,

    CONSTRAINT "PackType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DropTable" (
    "id" TEXT NOT NULL,
    "packTypeId" TEXT NOT NULL,
    "rarity" TEXT NOT NULL,
    "baseProb" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "DropTable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackOpen" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "packTypeId" TEXT NOT NULL,
    "openedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "result" TEXT NOT NULL,

    CONSTRAINT "PackOpen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPity" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "packTypeId" TEXT NOT NULL,
    "counter" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "UserPity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackPreview" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "packTypeId" TEXT NOT NULL,
    "cards" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PackPreview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "List_slug_key" ON "List"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "UserItem_userId_itemId_key" ON "UserItem"("userId", "itemId");

-- CreateIndex
CREATE UNIQUE INDEX "UserPity_userId_packTypeId_key" ON "UserPity"("userId", "packTypeId");

-- CreateIndex
CREATE INDEX "PackPreview_userId_packTypeId_idx" ON "PackPreview"("userId", "packTypeId");

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserItem" ADD CONSTRAINT "UserItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserItem" ADD CONSTRAINT "UserItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackType" ADD CONSTRAINT "PackType_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DropTable" ADD CONSTRAINT "DropTable_packTypeId_fkey" FOREIGN KEY ("packTypeId") REFERENCES "PackType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackOpen" ADD CONSTRAINT "PackOpen_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackOpen" ADD CONSTRAINT "PackOpen_packTypeId_fkey" FOREIGN KEY ("packTypeId") REFERENCES "PackType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPity" ADD CONSTRAINT "UserPity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPity" ADD CONSTRAINT "UserPity_packTypeId_fkey" FOREIGN KEY ("packTypeId") REFERENCES "PackType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackPreview" ADD CONSTRAINT "PackPreview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackPreview" ADD CONSTRAINT "PackPreview_packTypeId_fkey" FOREIGN KEY ("packTypeId") REFERENCES "PackType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
