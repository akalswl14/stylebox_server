# Migration `20200730173154-initial-migration`

This migration has been generated at 7/30/2020, 5:31:54 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
PRAGMA foreign_keys=OFF;

CREATE TABLE "User" (
"id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
"createdAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP)

CREATE TABLE "Product" (
"id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
"shopId" INTEGER ,
"description" TEXT ,
"instaText" TEXT ,
"createdAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE SET NULL ON UPDATE CASCADE
)

CREATE TABLE "ProductName" (
"id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
"lang" TEXT NOT NULL,
"word" TEXT NOT NULL,
"productId" INTEGER ,
"createdAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE
)

CREATE TABLE "ProductImage" (
"id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
"url" TEXT NOT NULL,
"order" INTEGER NOT NULL,
"productId" INTEGER ,
"createdAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE
)

CREATE TABLE "Shop" (
"id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
"discription" TEXT ,
"coordinate" TEXT ,
"address" TEXT ,
"city" TEXT ,
"createdAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP)

CREATE TABLE "ShopName" (
"id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
"lang" TEXT NOT NULL,
"word" TEXT NOT NULL,
"shopId" INTEGER ,
"createdAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE SET NULL ON UPDATE CASCADE
)

CREATE TABLE "ShopImage" (
"id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
"url" TEXT NOT NULL,
"order" INTEGER NOT NULL,
"shopId" INTEGER ,
"createdAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE SET NULL ON UPDATE CASCADE
)

CREATE TABLE "Event" (
"id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
"discription" TEXT NOT NULL,
"createdAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP)

CREATE TABLE "EventImage" (
"id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
"url" TEXT NOT NULL,
"order" INTEGER NOT NULL,
"eventId" INTEGER ,
"createdAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE
)

CREATE TABLE "EventVideo" (
"id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
"url" TEXT NOT NULL,
"order" INTEGER NOT NULL,
"eventId" INTEGER ,
"createdAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE
)

CREATE TABLE "Category" (
"id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
"createdAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP)

CREATE TABLE "CategoryName" (
"id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
"lang" TEXT NOT NULL,
"word" TEXT NOT NULL,
"categoryId" INTEGER ,
"createdAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE
)

CREATE TABLE "Tag" (
"id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
"categoryId" INTEGER ,
"createdAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE
)

CREATE TABLE "TagName" (
"id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
"lang" TEXT NOT NULL,
"word" TEXT NOT NULL,
"tagId" INTEGER ,
"createdAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE SET NULL ON UPDATE CASCADE
)

CREATE TABLE "_ProductToUser" (
"A" INTEGER NOT NULL,
"B" INTEGER NOT NULL,
FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE,

FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
)

CREATE TABLE "_ShopToUser" (
"A" INTEGER NOT NULL,
"B" INTEGER NOT NULL,
FOREIGN KEY ("A") REFERENCES "Shop"("id") ON DELETE CASCADE ON UPDATE CASCADE,

FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
)

CREATE TABLE "_EventToUser" (
"A" INTEGER NOT NULL,
"B" INTEGER NOT NULL,
FOREIGN KEY ("A") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE,

FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
)

CREATE TABLE "_ProductToTag" (
"A" INTEGER NOT NULL,
"B" INTEGER NOT NULL,
FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE,

FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE
)

CREATE TABLE "_ShopToTag" (
"A" INTEGER NOT NULL,
"B" INTEGER NOT NULL,
FOREIGN KEY ("A") REFERENCES "Shop"("id") ON DELETE CASCADE ON UPDATE CASCADE,

FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE
)

CREATE UNIQUE INDEX "_ProductToUser_AB_unique" ON "_ProductToUser"("A","B")

CREATE  INDEX "_ProductToUser_B_index" ON "_ProductToUser"("B")

CREATE UNIQUE INDEX "_ShopToUser_AB_unique" ON "_ShopToUser"("A","B")

CREATE  INDEX "_ShopToUser_B_index" ON "_ShopToUser"("B")

CREATE UNIQUE INDEX "_EventToUser_AB_unique" ON "_EventToUser"("A","B")

CREATE  INDEX "_EventToUser_B_index" ON "_EventToUser"("B")

CREATE UNIQUE INDEX "_ProductToTag_AB_unique" ON "_ProductToTag"("A","B")

CREATE  INDEX "_ProductToTag_B_index" ON "_ProductToTag"("B")

CREATE UNIQUE INDEX "_ShopToTag_AB_unique" ON "_ShopToTag"("A","B")

CREATE  INDEX "_ShopToTag_B_index" ON "_ShopToTag"("B")

PRAGMA foreign_key_check;

PRAGMA foreign_keys=ON;
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20200730173154-initial-migration
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,155 @@
+generator client {
+  provider = "prisma-client-js"
+}
+
+datasource db {
+  provider = "sqlite"
+  url = "***"
+}
+
+model User {
+  id           Int       @id @default(autoincrement())
+  wishProducts Product[]
+  wishShops    Shop[]
+  wishEvents   Event[]
+  createdAt    DateTime  @default(now())
+  updatedAt    DateTime  @default(now()) @updatedAt
+}
+
+model Product {
+  id          Int            @id @default(autoincrement())
+  name        ProductName[]
+  image       ProductImage[]
+  wishers     User[]
+  Shop        Shop?          @relation(fields: [shopId], references: [id])
+  shopId      Int?
+  tags        Tag[]
+  description String?
+  instaText   String?
+  createdAt   DateTime       @default(now())
+  updatedAt   DateTime       @default(now()) @updatedAt
+}
+
+model ProductName {
+  id        Int      @id @default(autoincrement())
+  lang      String
+  word      String
+  Product   Product? @relation(fields: [productId], references: [id])
+  productId Int?
+  createdAt DateTime @default(now())
+  updatedAt DateTime @default(now()) @updatedAt
+}
+
+model ProductImage {
+  id        Int      @id @default(autoincrement())
+  url       String
+  order     Int
+  Product   Product? @relation(fields: [productId], references: [id])
+  productId Int?
+  createdAt DateTime @default(now())
+  updatedAt DateTime @default(now()) @updatedAt
+}
+
+model Shop {
+  id          Int         @id @default(autoincrement())
+  name        ShopName[]
+  discription String?
+  images      ShopImage[]
+  products    Product[]
+  wishers     User[]
+  coordinate  String?
+  address     String?
+  tags        Tag[]
+  city        String?
+  createdAt   DateTime    @default(now())
+  updatedAt   DateTime    @default(now()) @updatedAt
+}
+
+model ShopName {
+  id        Int      @id @default(autoincrement())
+  lang      String
+  word      String
+  Shop      Shop?    @relation(fields: [shopId], references: [id])
+  shopId    Int?
+  createdAt DateTime @default(now())
+  updatedAt DateTime @default(now()) @updatedAt
+}
+
+model ShopImage {
+  id        Int      @id @default(autoincrement())
+  url       String
+  order     Int
+  Shop      Shop?    @relation(fields: [shopId], references: [id])
+  shopId    Int?
+  createdAt DateTime @default(now())
+  updatedAt DateTime @default(now()) @updatedAt
+}
+
+model Event {
+  id          Int          @id @default(autoincrement())
+  discription String
+  images      EventImage[]
+  videos      EventVideo[]
+  wishers     User[]
+  createdAt   DateTime     @default(now())
+  updatedAt   DateTime     @default(now()) @updatedAt
+}
+
+model EventImage {
+  id        Int      @id @default(autoincrement())
+  url       String
+  order     Int
+  Event     Event?   @relation(fields: [eventId], references: [id])
+  eventId   Int?
+  createdAt DateTime @default(now())
+  updatedAt DateTime @default(now()) @updatedAt
+}
+
+model EventVideo {
+  id        Int      @id @default(autoincrement())
+  url       String
+  order     Int
+  Event     Event?   @relation(fields: [eventId], references: [id])
+  eventId   Int?
+  createdAt DateTime @default(now())
+  updatedAt DateTime @default(now()) @updatedAt
+}
+
+model Category {
+  id        Int            @id @default(autoincrement())
+  name      CategoryName[]
+  tags      Tag[]
+  createdAt DateTime       @default(now())
+  updatedAt DateTime       @default(now()) @updatedAt
+}
+
+model CategoryName {
+  id         Int       @id @default(autoincrement())
+  lang       String
+  word       String
+  Category   Category? @relation(fields: [categoryId], references: [id])
+  categoryId Int?
+  createdAt  DateTime  @default(now())
+  updatedAt  DateTime  @default(now()) @updatedAt
+}
+
+model Tag {
+  id         Int       @id @default(autoincrement())
+  name       TagName[]
+  Category   Category? @relation(fields: [categoryId], references: [id])
+  categoryId Int?
+  products   Product[]
+  shops      Shop[]
+  createdAt  DateTime  @default(now())
+  updatedAt  DateTime  @default(now()) @updatedAt
+}
+
+model TagName {
+  id        Int      @id @default(autoincrement())
+  lang      String
+  word      String
+  Tag       Tag?     @relation(fields: [tagId], references: [id])
+  tagId     Int?
+  createdAt DateTime @default(now())
+  updatedAt DateTime @default(now()) @updatedAt
+}
```


