# Migration `20200811164031-add-some-fields--fix-category-to-class-and-add-category-enum`

This migration has been generated at 8/11/2020, 4:40:32 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TYPE "Category" AS ENUM ('Location', 'ProductClass', 'Style', 'Price');

CREATE TABLE "public"."User" (
"id" SERIAL,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id"))

CREATE TABLE "public"."Product" (
"id" SERIAL,
"preferrersCnt" integer   ,
"viewCnt" integer   ,
"description" text   ,
"instaText" text   ,
"price" text   ,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id"))

CREATE TABLE "public"."ProductName" (
"id" SERIAL,
"productId" integer  NOT NULL ,
"lang" text  NOT NULL ,
"word" text  NOT NULL ,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id"))

CREATE TABLE "public"."ProductImage" (
"id" SERIAL,
"productId" integer  NOT NULL ,
"url" text  NOT NULL ,
"order" integer  NOT NULL ,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id"))

CREATE TABLE "public"."Shop" (
"id" SERIAL,
"logoUrl" text   ,
"discription" text   ,
"preferrersCnt" integer   ,
"viewCnt" integer   ,
"coordinate" text   ,
"address" text []  ,
"popularity" integer   ,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id"))

CREATE TABLE "public"."ShopName" (
"id" SERIAL,
"shopId" integer  NOT NULL ,
"lang" text  NOT NULL ,
"word" text  NOT NULL ,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id"))

CREATE TABLE "public"."ShopImage" (
"id" SERIAL,
"shopId" integer  NOT NULL ,
"url" text  NOT NULL ,
"order" integer  NOT NULL ,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id"))

CREATE TABLE "public"."ShopVideo" (
"id" SERIAL,
"shopId" integer  NOT NULL ,
"url" text  NOT NULL ,
"order" integer  NOT NULL ,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id"))

CREATE TABLE "public"."Event" (
"id" SERIAL,
"discription" text  NOT NULL ,
"preferrersCnt" integer   ,
"viewCnt" integer   ,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id"))

CREATE TABLE "public"."EventImage" (
"id" SERIAL,
"eventId" integer   ,
"url" text  NOT NULL ,
"order" integer  NOT NULL ,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id"))

CREATE TABLE "public"."EventVideo" (
"id" SERIAL,
"eventId" integer   ,
"url" text  NOT NULL ,
"order" integer  NOT NULL ,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id"))

CREATE TABLE "public"."Class" (
"id" SERIAL,
"category" "Category" NOT NULL ,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id"))

CREATE TABLE "public"."CategoryName" (
"id" SERIAL,
"classId" integer  NOT NULL ,
"lang" text  NOT NULL ,
"word" text  NOT NULL ,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id"))

CREATE TABLE "public"."Tag" (
"id" SERIAL,
"classId" integer  NOT NULL ,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id"))

CREATE TABLE "public"."TagName" (
"id" SERIAL,
"tagId" integer  NOT NULL ,
"lang" text  NOT NULL ,
"word" text  NOT NULL ,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id"))

CREATE TABLE "public"."Post" (
"id" SERIAL,
"title" text   ,
"text" text   ,
"preferrersCnt" integer   ,
"viewCnt" integer   ,
"publisher" text   ,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id"))

CREATE TABLE "public"."PostImage" (
"id" SERIAL,
"postId" integer   ,
"url" text  NOT NULL ,
"order" integer  NOT NULL ,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id"))

CREATE TABLE "public"."LikeContent" (
"id" SERIAL,
"postId" integer   ,
"productId" integer   ,
"userId" integer  NOT NULL ,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id"))

CREATE TABLE "public"."LikeShop" (
"id" SERIAL,
"userId" integer  NOT NULL ,
"shopId" integer  NOT NULL ,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id"))

CREATE TABLE "public"."LikeEvent" (
"id" SERIAL,
"userId" integer  NOT NULL ,
"eventId" integer  NOT NULL ,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id"))

CREATE TABLE "public"."_ProductToShop" (
"A" integer  NOT NULL ,
"B" integer  NOT NULL )

CREATE TABLE "public"."_ProductToTag" (
"A" integer  NOT NULL ,
"B" integer  NOT NULL )

CREATE TABLE "public"."_PostToProduct" (
"A" integer  NOT NULL ,
"B" integer  NOT NULL )

CREATE TABLE "public"."_ShopToTag" (
"A" integer  NOT NULL ,
"B" integer  NOT NULL )

CREATE TABLE "public"."_PostToTag" (
"A" integer  NOT NULL ,
"B" integer  NOT NULL )

CREATE UNIQUE INDEX "_ProductToShop_AB_unique" ON "public"."_ProductToShop"("A","B")

CREATE  INDEX "_ProductToShop_B_index" ON "public"."_ProductToShop"("B")

CREATE UNIQUE INDEX "_ProductToTag_AB_unique" ON "public"."_ProductToTag"("A","B")

CREATE  INDEX "_ProductToTag_B_index" ON "public"."_ProductToTag"("B")

CREATE UNIQUE INDEX "_PostToProduct_AB_unique" ON "public"."_PostToProduct"("A","B")

CREATE  INDEX "_PostToProduct_B_index" ON "public"."_PostToProduct"("B")

CREATE UNIQUE INDEX "_ShopToTag_AB_unique" ON "public"."_ShopToTag"("A","B")

CREATE  INDEX "_ShopToTag_B_index" ON "public"."_ShopToTag"("B")

CREATE UNIQUE INDEX "_PostToTag_AB_unique" ON "public"."_PostToTag"("A","B")

CREATE  INDEX "_PostToTag_B_index" ON "public"."_PostToTag"("B")

ALTER TABLE "public"."ProductName" ADD FOREIGN KEY ("productId")REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."ProductImage" ADD FOREIGN KEY ("productId")REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."ShopName" ADD FOREIGN KEY ("shopId")REFERENCES "public"."Shop"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."ShopImage" ADD FOREIGN KEY ("shopId")REFERENCES "public"."Shop"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."ShopVideo" ADD FOREIGN KEY ("shopId")REFERENCES "public"."Shop"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."EventImage" ADD FOREIGN KEY ("eventId")REFERENCES "public"."Event"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."EventVideo" ADD FOREIGN KEY ("eventId")REFERENCES "public"."Event"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."CategoryName" ADD FOREIGN KEY ("classId")REFERENCES "public"."Class"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."Tag" ADD FOREIGN KEY ("classId")REFERENCES "public"."Class"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."TagName" ADD FOREIGN KEY ("tagId")REFERENCES "public"."Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."PostImage" ADD FOREIGN KEY ("postId")REFERENCES "public"."Post"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."LikeContent" ADD FOREIGN KEY ("postId")REFERENCES "public"."Post"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."LikeContent" ADD FOREIGN KEY ("productId")REFERENCES "public"."Product"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."LikeContent" ADD FOREIGN KEY ("userId")REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."LikeShop" ADD FOREIGN KEY ("userId")REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."LikeShop" ADD FOREIGN KEY ("shopId")REFERENCES "public"."Shop"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."LikeEvent" ADD FOREIGN KEY ("userId")REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."LikeEvent" ADD FOREIGN KEY ("eventId")REFERENCES "public"."Event"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."_ProductToShop" ADD FOREIGN KEY ("A")REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."_ProductToShop" ADD FOREIGN KEY ("B")REFERENCES "public"."Shop"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."_ProductToTag" ADD FOREIGN KEY ("A")REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."_ProductToTag" ADD FOREIGN KEY ("B")REFERENCES "public"."Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."_PostToProduct" ADD FOREIGN KEY ("A")REFERENCES "public"."Post"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."_PostToProduct" ADD FOREIGN KEY ("B")REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."_ShopToTag" ADD FOREIGN KEY ("A")REFERENCES "public"."Shop"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."_ShopToTag" ADD FOREIGN KEY ("B")REFERENCES "public"."Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."_PostToTag" ADD FOREIGN KEY ("A")REFERENCES "public"."Post"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."_PostToTag" ADD FOREIGN KEY ("B")REFERENCES "public"."Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20200811164031-add-some-fields--fix-category-to-class-and-add-category-enum
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,240 @@
+generator client {
+  provider = "prisma-client-js"
+}
+
+datasource db {
+  provider = "postgresql"
+  url = "***"
+}
+
+model User {
+  id           Int           @id @default(autoincrement())
+  wishContents LikeContent[]
+  wishShops    LikeShop[]
+  wishEvents   LikeEvent[]
+  createdAt    DateTime      @default(now())
+  updatedAt    DateTime      @default(now()) @updatedAt
+}
+
+model Product {
+  id            Int            @id @default(autoincrement())
+  name          ProductName[]
+  image         ProductImage[]
+  preferrers    LikeContent[]
+  preferrersCnt Int?
+  viewCnt       Int?
+  shops         Shop[]
+  tags          Tag[]
+  posts         Post[]
+  description   String?
+  instaText     String?
+  price         String?
+  createdAt     DateTime       @default(now())
+  updatedAt     DateTime       @default(now()) @updatedAt
+}
+
+model ProductName {
+  id        Int      @id @default(autoincrement())
+  productId Int
+  Product   Product  @relation(fields: [productId], references: [id])
+  lang      String
+  word      String
+  createdAt DateTime @default(now())
+  updatedAt DateTime @default(now()) @updatedAt
+}
+
+model ProductImage {
+  id        Int      @id @default(autoincrement())
+  productId Int
+  Product   Product  @relation(fields: [productId], references: [id])
+  url       String
+  order     Int
+  createdAt DateTime @default(now())
+  updatedAt DateTime @default(now()) @updatedAt
+}
+
+model Shop {
+  id            Int         @id @default(autoincrement())
+  name          ShopName[]
+  logoUrl       String?
+  discription   String?
+  images        ShopImage[]
+  videos        ShopVideo[]
+  products      Product[]
+  preferrers    LikeShop[]
+  preferrersCnt Int?
+  viewCnt       Int?
+  coordinate    String?
+  address       String[]
+  tags          Tag[]
+  popularity    Int?
+  createdAt     DateTime    @default(now())
+  updatedAt     DateTime    @default(now()) @updatedAt
+}
+
+model ShopName {
+  id        Int      @id @default(autoincrement())
+  shopId    Int
+  Shop      Shop     @relation(fields: [shopId], references: [id])
+  lang      String
+  word      String
+  createdAt DateTime @default(now())
+  updatedAt DateTime @default(now()) @updatedAt
+}
+
+model ShopImage {
+  id        Int      @id @default(autoincrement())
+  shopId    Int
+  Shop      Shop     @relation(fields: [shopId], references: [id])
+  url       String
+  order     Int
+  createdAt DateTime @default(now())
+  updatedAt DateTime @default(now()) @updatedAt
+}
+
+model ShopVideo {
+  id        Int      @id @default(autoincrement())
+  shopId    Int
+  Shop      Shop     @relation(fields: [shopId], references: [id])
+  url       String
+  order     Int
+  createdAt DateTime @default(now())
+  updatedAt DateTime @default(now()) @updatedAt
+}
+
+model Event {
+  id            Int          @id @default(autoincrement())
+  discription   String
+  images        EventImage[]
+  videos        EventVideo[]
+  preferrers    LikeEvent[]
+  preferrersCnt Int?
+  viewCnt       Int?
+  createdAt     DateTime     @default(now())
+  updatedAt     DateTime     @default(now()) @updatedAt
+}
+
+model EventImage {
+  id        Int      @id @default(autoincrement())
+  eventId   Int?
+  Event     Event?   @relation(fields: [eventId], references: [id])
+  url       String
+  order     Int
+  createdAt DateTime @default(now())
+  updatedAt DateTime @default(now()) @updatedAt
+}
+
+model EventVideo {
+  id        Int      @id @default(autoincrement())
+  eventId   Int?
+  Event     Event?   @relation(fields: [eventId], references: [id])
+  url       String
+  order     Int
+  createdAt DateTime @default(now())
+  updatedAt DateTime @default(now()) @updatedAt
+}
+
+enum Category {
+  Location
+  ProductClass
+  Style
+  Price
+}
+
+model Class {
+  id        Int            @id @default(autoincrement())
+  name      CategoryName[]
+  tags      Tag[]
+  category  Category
+  createdAt DateTime       @default(now())
+  updatedAt DateTime       @default(now()) @updatedAt
+}
+
+model CategoryName {
+  id        Int      @id @default(autoincrement())
+  classId   Int
+  Class     Class    @relation(fields: [classId], references: [id])
+  lang      String
+  word      String
+  createdAt DateTime @default(now())
+  updatedAt DateTime @default(now()) @updatedAt
+}
+
+model Tag {
+  id        Int       @id @default(autoincrement())
+  classId   Int
+  Class     Class     @relation(fields: [classId], references: [id])
+  name      TagName[]
+  products  Product[]
+  shops     Shop[]
+  posts     Post[]
+  createdAt DateTime  @default(now())
+  updatedAt DateTime  @default(now()) @updatedAt
+}
+
+model TagName {
+  id        Int      @id @default(autoincrement())
+  tagId     Int
+  Tag       Tag      @relation(fields: [tagId], references: [id])
+  lang      String
+  word      String
+  createdAt DateTime @default(now())
+  updatedAt DateTime @default(now()) @updatedAt
+}
+
+model Post {
+  id            Int           @id @default(autoincrement())
+  title         String?
+  text          String?
+  images        PostImage[]
+  preferrers    LikeContent[]
+  preferrersCnt Int?
+  viewCnt       Int?
+  publisher     String?
+  products      Product[]
+  tags          Tag[]
+  createdAt     DateTime      @default(now())
+  updatedAt     DateTime      @default(now()) @updatedAt
+}
+
+model PostImage {
+  id        Int      @id @default(autoincrement())
+  postId    Int?
+  Post      Post?    @relation(fields: [postId], references: [id])
+  url       String
+  order     Int
+  createdAt DateTime @default(now())
+  updatedAt DateTime @default(now()) @updatedAt
+}
+
+model LikeContent {
+  id        Int      @id @default(autoincrement())
+  postId    Int?
+  productId Int?
+  userId    Int
+  Post      Post?    @relation(fields: [postId], references: [id])
+  Product   Product? @relation(fields: [productId], references: [id])
+  User      User     @relation(fields: [userId], references: [id])
+  createdAt DateTime @default(now())
+  updatedAt DateTime @default(now()) @updatedAt
+}
+
+model LikeShop {
+  id        Int      @id @default(autoincrement())
+  userId    Int
+  shopId    Int
+  User      User     @relation(fields: [userId], references: [id])
+  Shop      Shop     @relation(fields: [shopId], references: [id])
+  createdAt DateTime @default(now())
+  updatedAt DateTime @default(now()) @updatedAt
+}
+
+model LikeEvent {
+  id        Int      @id @default(autoincrement())
+  userId    Int
+  eventId   Int
+  User      User     @relation(fields: [userId], references: [id])
+  Event     Event    @relation(fields: [eventId], references: [id])
+  createdAt DateTime @default(now())
+  updatedAt DateTime @default(now()) @updatedAt
+}
```


