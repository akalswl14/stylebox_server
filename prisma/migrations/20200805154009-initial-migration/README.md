# Migration `20200805154009-initial-migration`

This migration has been generated at 8/5/2020, 3:40:09 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "public"."User" (
"id" SERIAL,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id"))

CREATE TABLE "public"."Product" (
"id" SERIAL,
"wishersCnt" integer   ,
"description" text   ,
"instaText" text []  ,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id"))

CREATE TABLE "public"."ProductName" (
"id" SERIAL,
"lang" text  NOT NULL ,
"word" text  NOT NULL ,
"productId" integer   ,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id"))

CREATE TABLE "public"."ProductImage" (
"id" SERIAL,
"url" text  NOT NULL ,
"order" integer  NOT NULL ,
"productId" integer   ,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id"))

CREATE TABLE "public"."Shop" (
"id" SERIAL,
"discription" text   ,
"wishersCnt" integer   ,
"coordinate" text   ,
"address" text []  ,
"city" text   ,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id"))

CREATE TABLE "public"."ShopName" (
"id" SERIAL,
"lang" text  NOT NULL ,
"word" text  NOT NULL ,
"shopId" integer   ,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id"))

CREATE TABLE "public"."ShopImage" (
"id" SERIAL,
"url" text  NOT NULL ,
"order" integer  NOT NULL ,
"shopId" integer   ,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id"))

CREATE TABLE "public"."Event" (
"id" SERIAL,
"discription" text  NOT NULL ,
"wishersCnt" integer   ,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id"))

CREATE TABLE "public"."EventImage" (
"id" SERIAL,
"url" text  NOT NULL ,
"order" integer  NOT NULL ,
"eventId" integer   ,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id"))

CREATE TABLE "public"."EventVideo" (
"id" SERIAL,
"url" text  NOT NULL ,
"order" integer  NOT NULL ,
"eventId" integer   ,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id"))

CREATE TABLE "public"."Category" (
"id" SERIAL,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id"))

CREATE TABLE "public"."CategoryName" (
"id" SERIAL,
"lang" text  NOT NULL ,
"word" text  NOT NULL ,
"categoryId" integer   ,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id"))

CREATE TABLE "public"."Tag" (
"id" SERIAL,
"categoryId" integer   ,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id"))

CREATE TABLE "public"."TagName" (
"id" SERIAL,
"lang" text  NOT NULL ,
"word" text  NOT NULL ,
"tagId" integer   ,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id"))

CREATE TABLE "public"."Post" (
"id" SERIAL,
"text" text   ,
"title" text   ,
"publisher" text   ,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id"))

CREATE TABLE "public"."PostImage" (
"id" SERIAL,
"url" text  NOT NULL ,
"order" integer  NOT NULL ,
"postId" integer   ,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id"))

CREATE TABLE "public"."_ProductToUser" (
"A" integer  NOT NULL ,
"B" integer  NOT NULL )

CREATE TABLE "public"."_ShopToUser" (
"A" integer  NOT NULL ,
"B" integer  NOT NULL )

CREATE TABLE "public"."_EventToUser" (
"A" integer  NOT NULL ,
"B" integer  NOT NULL )

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

CREATE UNIQUE INDEX "_ProductToUser_AB_unique" ON "public"."_ProductToUser"("A","B")

CREATE  INDEX "_ProductToUser_B_index" ON "public"."_ProductToUser"("B")

CREATE UNIQUE INDEX "_ShopToUser_AB_unique" ON "public"."_ShopToUser"("A","B")

CREATE  INDEX "_ShopToUser_B_index" ON "public"."_ShopToUser"("B")

CREATE UNIQUE INDEX "_EventToUser_AB_unique" ON "public"."_EventToUser"("A","B")

CREATE  INDEX "_EventToUser_B_index" ON "public"."_EventToUser"("B")

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

ALTER TABLE "public"."ProductName" ADD FOREIGN KEY ("productId")REFERENCES "public"."Product"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."ProductImage" ADD FOREIGN KEY ("productId")REFERENCES "public"."Product"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."ShopName" ADD FOREIGN KEY ("shopId")REFERENCES "public"."Shop"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."ShopImage" ADD FOREIGN KEY ("shopId")REFERENCES "public"."Shop"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."EventImage" ADD FOREIGN KEY ("eventId")REFERENCES "public"."Event"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."EventVideo" ADD FOREIGN KEY ("eventId")REFERENCES "public"."Event"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."CategoryName" ADD FOREIGN KEY ("categoryId")REFERENCES "public"."Category"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."Tag" ADD FOREIGN KEY ("categoryId")REFERENCES "public"."Category"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."TagName" ADD FOREIGN KEY ("tagId")REFERENCES "public"."Tag"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."PostImage" ADD FOREIGN KEY ("postId")REFERENCES "public"."Post"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."_ProductToUser" ADD FOREIGN KEY ("A")REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."_ProductToUser" ADD FOREIGN KEY ("B")REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."_ShopToUser" ADD FOREIGN KEY ("A")REFERENCES "public"."Shop"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."_ShopToUser" ADD FOREIGN KEY ("B")REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."_EventToUser" ADD FOREIGN KEY ("A")REFERENCES "public"."Event"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."_EventToUser" ADD FOREIGN KEY ("B")REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE

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
migration ..20200805154009-initial-migration
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,181 @@
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
+  wishersCnt  Int?
+  shops       Shop[]
+  tags        Tag[]
+  description String?
+  instaText   String[]
+  createdAt   DateTime       @default(now())
+  updatedAt   DateTime       @default(now()) @updatedAt
+  Post        Post[]
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
+  wishersCnt  Int?
+  coordinate  String?
+  address     String[]
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
+  wishersCnt  Int?
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
+  Post       Post[]
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
+
+model Post {
+  id        Int         @id @default(autoincrement())
+  text      String?
+  title     String?
+  publisher String?
+  products  Product[]
+  tags      Tag[]
+  createdAt DateTime    @default(now())
+  updatedAt DateTime    @default(now()) @updatedAt
+  images    PostImage[]
+}
+
+model PostImage {
+  id        Int      @id @default(autoincrement())
+  url       String
+  order     Int
+  Post      Post?    @relation(fields: [postId], references: [id])
+  postId    Int?
+  createdAt DateTime @default(now())
+  updatedAt DateTime @default(now()) @updatedAt
+}
```


