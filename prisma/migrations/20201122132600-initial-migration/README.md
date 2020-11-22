# Migration `20201122132600-initial-migration`

This migration has been generated at 11/22/2020, 10:26:00 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TYPE "public"."Category" AS ENUM ('Location', 'ProductClass', 'Style', 'Price', 'Feature', 'ShopName')

CREATE TYPE "public"."LinkType" AS ENUM ('Instagram', 'Facebook', 'FacebookMessanger', 'Youtube', 'TikTok', 'Shopee', 'Sendo', 'LAZADA', 'Tiki', 'OnlineShop', 'Cafe24')

CREATE TABLE "public"."User" (
"id" SERIAL,
"createdAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."Product" (
"id" SERIAL,
"description" text   ,
"instaText" text   ,
"price" integer   ,
"priority" integer   ,
"createdAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."ProductName" (
"id" SERIAL,
"productId" integer   ,
"lang" text   NOT NULL ,
"word" text   NOT NULL ,
"createdAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."ProductImage" (
"id" SERIAL,
"productId" integer   ,
"url" text   NOT NULL ,
"order" integer   NOT NULL ,
"createdAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."ProductVideo" (
"id" SERIAL,
"productId" integer   ,
"url" text   NOT NULL ,
"order" integer   NOT NULL ,
"isYoutube" boolean   NOT NULL ,
"createdAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."ProductExternalLink" (
"id" SERIAL,
"url" text   NOT NULL ,
"order" integer   NOT NULL ,
"linkType" "LinkType"  NOT NULL ,
"productId" integer   ,
"createdAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."Shop" (
"id" SERIAL,
"logoUrl" text   ,
"description" text   ,
"phoneNumber" text   NOT NULL ,
"monthlyRankScore" Decimal(65,30)   ,
"monthlyRankNum" integer   NOT NULL ,
"priority" integer   ,
"onDetailTagId" integer []  ,
"externalLinkClickNum" integer   NOT NULL ,
"createdAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."ShopName" (
"id" SERIAL,
"shopId" integer   ,
"lang" text   NOT NULL ,
"word" text   NOT NULL ,
"createdAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."ShopImage" (
"id" SERIAL,
"shopId" integer   ,
"url" text   NOT NULL ,
"order" integer   NOT NULL ,
"createdAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."ShopVideo" (
"id" SERIAL,
"shopId" integer   ,
"url" text   NOT NULL ,
"order" integer   NOT NULL ,
"isYoutube" boolean   NOT NULL ,
"createdAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."ShopExternalLink" (
"id" SERIAL,
"url" text   NOT NULL ,
"linkType" "LinkType"  NOT NULL ,
"shopId" integer   ,
"order" integer   NOT NULL ,
"onBottom" boolean   NOT NULL ,
"isShown" boolean   NOT NULL ,
"createdAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."Branch" (
"id" SERIAL,
"shopId" integer   ,
"phoneNumbers" text []  ,
"address" text   NOT NULL ,
"googleMapUrl" text   ,
"longitude" Decimal(65,30)   ,
"latitude" Decimal(65,30)   ,
"isMain" boolean   NOT NULL ,
"createdAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."BranchName" (
"id" SERIAL,
"branchId" integer   ,
"lang" text   NOT NULL ,
"word" text   NOT NULL ,
"createdAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."Event" (
"id" SERIAL,
"url" text   ,
"dueDate" timestamp(3)   NOT NULL ,
"bannerImage" text   NOT NULL ,
"isOnList" boolean   NOT NULL ,
"title" text   NOT NULL ,
"onDetailTagId" integer []  ,
"startDate" timestamp(3)   NOT NULL ,
"createdAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."EventImage" (
"id" SERIAL,
"eventId" integer   ,
"url" text   NOT NULL ,
"order" integer   NOT NULL ,
"createdAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."EventVideo" (
"id" SERIAL,
"eventId" integer   ,
"url" text   NOT NULL ,
"order" integer   NOT NULL ,
"isYoutube" boolean   NOT NULL ,
"createdAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."EventContentsImage" (
"id" SERIAL,
"eventId" integer   ,
"url" text   NOT NULL ,
"order" integer   NOT NULL ,
"createdAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."Class" (
"id" SERIAL,
"category" "Category"  NOT NULL ,
"createdAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."ClassName" (
"id" SERIAL,
"classId" integer   ,
"lang" text   NOT NULL ,
"word" text   NOT NULL ,
"createdAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."Tag" (
"id" SERIAL,
"classId" integer   NOT NULL ,
"category" "Category"  ,
"tagImage" text   ,
"isClass" boolean   NOT NULL ,
"isRecommendation" integer   NOT NULL ,
"createdAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."TagName" (
"id" SERIAL,
"tagId" integer   ,
"lang" text   NOT NULL ,
"word" text   NOT NULL ,
"createdAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."Post" (
"id" SERIAL,
"shopId" integer   ,
"text" text   ,
"weeklyRankScore" Decimal(65,30)   ,
"lifeTimeRankScore" Decimal(65,30)   ,
"monthlyRankScore" Decimal(65,30)   ,
"weeklyRankNum" integer   ,
"monthlyRankNum" integer   ,
"lifeTimeRankNum" integer   ,
"mainProductId" integer   ,
"mainProductPrice" integer   ,
"priority" integer   ,
"onDetailTagId" integer []  ,
"isOnline" boolean   NOT NULL ,
"externalLinkClickNum" integer   NOT NULL ,
"createdAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."PostExternalLink" (
"id" SERIAL,
"url" text   NOT NULL ,
"order" integer   NOT NULL ,
"linkType" "LinkType"  NOT NULL ,
"postId" integer   ,
"isShown" boolean   NOT NULL ,
"createdAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."PostImage" (
"id" SERIAL,
"postId" integer   ,
"url" text   NOT NULL ,
"order" integer   NOT NULL ,
"createdAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."PostVideo" (
"id" SERIAL,
"postId" integer   ,
"url" text   NOT NULL ,
"order" integer   NOT NULL ,
"isYoutube" boolean   NOT NULL ,
"createdAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."View" (
"id" SERIAL,
"userId" integer   ,
"shopId" integer   ,
"postId" integer   ,
"eventId" integer   ,
"productId" integer   ,
"createdAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."Like" (
"id" SERIAL,
"postId" integer   ,
"productId" integer   ,
"userId" integer   ,
"eventId" integer   ,
"shopId" integer   ,
"createdAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."Setting" (
"id" SERIAL,
"mainBubbleTagId" integer []  ,
"bestBubbleTagId" integer []  ,
"shopBubbleTagId" integer []  ,
"loadingPostNum" integer   NOT NULL ,
"TodaysStylesPeriod" timestamp(3)   NOT NULL ,
"bestTotalPostNum" integer   NOT NULL ,
"bestConstA" Decimal(65,30)   NOT NULL ,
"bestConstB" Decimal(65,30)   NOT NULL ,
"shopConstA" Decimal(65,30)   NOT NULL ,
"shopConstB" Decimal(65,30)   NOT NULL ,
"shopConstC" Decimal(65,30)   NOT NULL ,
"adminEmail" text   NOT NULL ,
"adminEmailPW" text   NOT NULL ,
"mainEventBannerId" integer []  ,
"QuestionOption" text []  ,
"SearchPeriod" timestamp(3)   NOT NULL ,
"createdAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."SearchTagLog" (
"id" SERIAL,
"tagId" integer   ,
"userId" integer   ,
"createdAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."_BranchToProduct" (
"A" integer   NOT NULL ,
"B" integer   NOT NULL 
)

CREATE TABLE "public"."_ProductToTag" (
"A" integer   NOT NULL ,
"B" integer   NOT NULL 
)

CREATE TABLE "public"."_PostToProduct" (
"A" integer   NOT NULL ,
"B" integer   NOT NULL 
)

CREATE TABLE "public"."_ShopToTag" (
"A" integer   NOT NULL ,
"B" integer   NOT NULL 
)

CREATE TABLE "public"."_EventToTag" (
"A" integer   NOT NULL ,
"B" integer   NOT NULL 
)

CREATE TABLE "public"."_PostToTag" (
"A" integer   NOT NULL ,
"B" integer   NOT NULL 
)

CREATE UNIQUE INDEX "ProductExternalLink_productId_unique" ON "public"."ProductExternalLink"("productId")

CREATE UNIQUE INDEX "ShopName.word_unique" ON "public"."ShopName"("word")

CREATE UNIQUE INDEX "ClassName.word_unique" ON "public"."ClassName"("word")

CREATE UNIQUE INDEX "TagName.word_unique" ON "public"."TagName"("word")

CREATE UNIQUE INDEX "_BranchToProduct_AB_unique" ON "public"."_BranchToProduct"("A", "B")

CREATE INDEX "_BranchToProduct_B_index" ON "public"."_BranchToProduct"("B")

CREATE UNIQUE INDEX "_ProductToTag_AB_unique" ON "public"."_ProductToTag"("A", "B")

CREATE INDEX "_ProductToTag_B_index" ON "public"."_ProductToTag"("B")

CREATE UNIQUE INDEX "_PostToProduct_AB_unique" ON "public"."_PostToProduct"("A", "B")

CREATE INDEX "_PostToProduct_B_index" ON "public"."_PostToProduct"("B")

CREATE UNIQUE INDEX "_ShopToTag_AB_unique" ON "public"."_ShopToTag"("A", "B")

CREATE INDEX "_ShopToTag_B_index" ON "public"."_ShopToTag"("B")

CREATE UNIQUE INDEX "_EventToTag_AB_unique" ON "public"."_EventToTag"("A", "B")

CREATE INDEX "_EventToTag_B_index" ON "public"."_EventToTag"("B")

CREATE UNIQUE INDEX "_PostToTag_AB_unique" ON "public"."_PostToTag"("A", "B")

CREATE INDEX "_PostToTag_B_index" ON "public"."_PostToTag"("B")

ALTER TABLE "public"."ProductName" ADD FOREIGN KEY ("productId")REFERENCES "public"."Product"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."ProductImage" ADD FOREIGN KEY ("productId")REFERENCES "public"."Product"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."ProductVideo" ADD FOREIGN KEY ("productId")REFERENCES "public"."Product"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."ProductExternalLink" ADD FOREIGN KEY ("productId")REFERENCES "public"."Product"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."ShopName" ADD FOREIGN KEY ("shopId")REFERENCES "public"."Shop"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."ShopImage" ADD FOREIGN KEY ("shopId")REFERENCES "public"."Shop"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."ShopVideo" ADD FOREIGN KEY ("shopId")REFERENCES "public"."Shop"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."ShopExternalLink" ADD FOREIGN KEY ("shopId")REFERENCES "public"."Shop"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."Branch" ADD FOREIGN KEY ("shopId")REFERENCES "public"."Shop"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."BranchName" ADD FOREIGN KEY ("branchId")REFERENCES "public"."Branch"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."EventImage" ADD FOREIGN KEY ("eventId")REFERENCES "public"."Event"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."EventVideo" ADD FOREIGN KEY ("eventId")REFERENCES "public"."Event"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."EventContentsImage" ADD FOREIGN KEY ("eventId")REFERENCES "public"."Event"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."ClassName" ADD FOREIGN KEY ("classId")REFERENCES "public"."Class"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."Tag" ADD FOREIGN KEY ("classId")REFERENCES "public"."Class"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."TagName" ADD FOREIGN KEY ("tagId")REFERENCES "public"."Tag"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."Post" ADD FOREIGN KEY ("shopId")REFERENCES "public"."Shop"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."PostExternalLink" ADD FOREIGN KEY ("postId")REFERENCES "public"."Post"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."PostImage" ADD FOREIGN KEY ("postId")REFERENCES "public"."Post"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."PostVideo" ADD FOREIGN KEY ("postId")REFERENCES "public"."Post"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."View" ADD FOREIGN KEY ("userId")REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."View" ADD FOREIGN KEY ("shopId")REFERENCES "public"."Shop"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."View" ADD FOREIGN KEY ("postId")REFERENCES "public"."Post"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."View" ADD FOREIGN KEY ("eventId")REFERENCES "public"."Event"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."View" ADD FOREIGN KEY ("productId")REFERENCES "public"."Product"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."Like" ADD FOREIGN KEY ("postId")REFERENCES "public"."Post"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."Like" ADD FOREIGN KEY ("productId")REFERENCES "public"."Product"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."Like" ADD FOREIGN KEY ("userId")REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."Like" ADD FOREIGN KEY ("eventId")REFERENCES "public"."Event"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."Like" ADD FOREIGN KEY ("shopId")REFERENCES "public"."Shop"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."SearchTagLog" ADD FOREIGN KEY ("tagId")REFERENCES "public"."Tag"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."SearchTagLog" ADD FOREIGN KEY ("userId")REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."_BranchToProduct" ADD FOREIGN KEY ("A")REFERENCES "public"."Branch"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."_BranchToProduct" ADD FOREIGN KEY ("B")REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."_ProductToTag" ADD FOREIGN KEY ("A")REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."_ProductToTag" ADD FOREIGN KEY ("B")REFERENCES "public"."Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."_PostToProduct" ADD FOREIGN KEY ("A")REFERENCES "public"."Post"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."_PostToProduct" ADD FOREIGN KEY ("B")REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."_ShopToTag" ADD FOREIGN KEY ("A")REFERENCES "public"."Shop"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."_ShopToTag" ADD FOREIGN KEY ("B")REFERENCES "public"."Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."_EventToTag" ADD FOREIGN KEY ("A")REFERENCES "public"."Event"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."_EventToTag" ADD FOREIGN KEY ("B")REFERENCES "public"."Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."_PostToTag" ADD FOREIGN KEY ("A")REFERENCES "public"."Post"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."_PostToTag" ADD FOREIGN KEY ("B")REFERENCES "public"."Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20201122132600-initial-migration
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,414 @@
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
+  id              Int            @id @default(autoincrement())
+  views           View[]
+  likes           Like[]
+  searchTagLogIds SearchTagLog[]
+  createdAt       DateTime       @default(now())
+  updatedAt       DateTime       @default(now()) @updatedAt
+}
+
+model Product {
+  id           Int                 @id @default(autoincrement())
+  names        ProductName[]
+  images       ProductImage[]
+  preferrers   Like[]
+  branches     Branch[]
+  tags         Tag[]
+  posts        Post[]
+  description  String?
+  instaText    String?
+  price        Int?
+  externalLink ProductExternalLink
+  videos       ProductVideo[]
+  views        View[]
+  priority     Int?
+  createdAt    DateTime            @default(now())
+  updatedAt    DateTime            @default(now()) @updatedAt
+}
+
+model ProductName {
+  id        Int      @id @default(autoincrement())
+  productId Int?
+  Product   Product? @relation(fields: [productId], references: [id])
+  lang      String
+  word      String
+  createdAt DateTime @default(now())
+  updatedAt DateTime @default(now()) @updatedAt
+}
+
+model ProductImage {
+  id        Int      @id @default(autoincrement())
+  productId Int?
+  Product   Product? @relation(fields: [productId], references: [id])
+  url       String
+  order     Int
+  createdAt DateTime @default(now())
+  updatedAt DateTime @default(now()) @updatedAt
+}
+
+model ProductVideo {
+  id        Int      @id @default(autoincrement())
+  productId Int?
+  Product   Product? @relation(fields: [productId], references: [id])
+  url       String
+  order     Int
+  isYoutube Boolean
+  createdAt DateTime @default(now())
+  updatedAt DateTime @default(now()) @updatedAt
+}
+
+model ProductExternalLink {
+  id        Int      @id @default(autoincrement())
+  url       String
+  order     Int
+  linkType  LinkType
+  productId Int?
+  Product   Product? @relation(fields: [productId], references: [id])
+  createdAt DateTime @default(now())
+  updatedAt DateTime @default(now()) @updatedAt
+}
+
+model Shop {
+  id                   Int                @id @default(autoincrement())
+  names                ShopName[]
+  branches             Branch[]
+  externalLinks        ShopExternalLink[]
+  logoUrl              String?
+  description          String?
+  images               ShopImage[]
+  videos               ShopVideo[]
+  phoneNumber          String
+  preferrers           Like[]
+  tags                 Tag[]
+  posts                Post[]
+  views                View[]
+  monthlyRankScore     Float?
+  monthlyRankNum       Int
+  priority             Int?
+  onDetailTagId        Int[]
+  externalLinkClickNum Int
+  createdAt            DateTime           @default(now())
+  updatedAt            DateTime           @default(now()) @updatedAt
+}
+
+model ShopName {
+  id        Int      @id @default(autoincrement())
+  shopId    Int?
+  Shop      Shop?    @relation(fields: [shopId], references: [id])
+  lang      String
+  word      String   @unique
+  createdAt DateTime @default(now())
+  updatedAt DateTime @default(now()) @updatedAt
+}
+
+model ShopImage {
+  id        Int      @id @default(autoincrement())
+  shopId    Int?
+  Shop      Shop?    @relation(fields: [shopId], references: [id])
+  url       String
+  order     Int
+  createdAt DateTime @default(now())
+  updatedAt DateTime @default(now()) @updatedAt
+}
+
+model ShopVideo {
+  id        Int      @id @default(autoincrement())
+  shopId    Int?
+  Shop      Shop?    @relation(fields: [shopId], references: [id])
+  url       String
+  order     Int
+  isYoutube Boolean
+  createdAt DateTime @default(now())
+  updatedAt DateTime @default(now()) @updatedAt
+}
+
+model ShopExternalLink {
+  id        Int      @id @default(autoincrement())
+  url       String
+  linkType  LinkType
+  shopId    Int?
+  Shop      Shop?    @relation(fields: [shopId], references: [id])
+  order     Int
+  onBottom  Boolean
+  isShown   Boolean
+  createdAt DateTime @default(now())
+  updatedAt DateTime @default(now()) @updatedAt
+}
+
+model Branch {
+  id           Int          @id @default(autoincrement())
+  shopId       Int?
+  Shop         Shop?        @relation(fields: [shopId], references: [id])
+  names        BranchName[]
+  phoneNumbers String[]
+  products     Product[]
+  address      String
+  googleMapUrl String?
+  longitude    Float?
+  latitude     Float?
+  isMain       Boolean
+  createdAt    DateTime     @default(now())
+  updatedAt    DateTime     @default(now()) @updatedAt
+}
+
+model BranchName {
+  id        Int      @id @default(autoincrement())
+  branchId  Int?
+  Branch    Branch?  @relation(fields: [branchId], references: [id])
+  lang      String
+  word      String
+  createdAt DateTime @default(now())
+  updatedAt DateTime @default(now()) @updatedAt
+}
+
+model Event {
+  id             Int                  @id @default(autoincrement())
+  images         EventImage[]
+  videos         EventVideo[]
+  preferrers     Like[]
+  url            String?
+  dueDate        DateTime
+  bannerImage    String
+  tags           Tag[]
+  views          View[]
+  isOnList       Boolean
+  title          String
+  onDetailTagId  Int[]
+  contentsImages EventContentsImage[]
+  startDate      DateTime
+  createdAt      DateTime             @default(now())
+  updatedAt      DateTime             @default(now()) @updatedAt
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
+  isYoutube Boolean
+  createdAt DateTime @default(now())
+  updatedAt DateTime @default(now()) @updatedAt
+}
+
+model EventContentsImage {
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
+  Feature
+  ShopName
+}
+
+enum LinkType {
+  Instagram
+  Facebook
+  FacebookMessanger
+  Youtube
+  TikTok
+  Shopee
+  Sendo
+  LAZADA
+  Tiki
+  OnlineShop
+  Cafe24
+}
+
+model Class {
+  id        Int         @id @default(autoincrement())
+  names     ClassName[]
+  tags      Tag[]
+  category  Category
+  createdAt DateTime    @default(now())
+  updatedAt DateTime    @default(now()) @updatedAt
+}
+
+model ClassName {
+  id        Int      @id @default(autoincrement())
+  classId   Int?
+  Class     Class?   @relation(fields: [classId], references: [id])
+  lang      String
+  word      String   @unique
+  createdAt DateTime @default(now())
+  updatedAt DateTime @default(now()) @updatedAt
+}
+
+model Tag {
+  id               Int            @id @default(autoincrement())
+  classId          Int
+  Class            Class          @relation(fields: [classId], references: [id])
+  names            TagName[]
+  shops            Shop[]
+  posts            Post[]
+  products         Product[]
+  events           Event[]
+  category         Category?
+  tagImage         String?
+  searchTagLogs    SearchTagLog[]
+  isClass          Boolean
+  isRecommendation Int
+  createdAt        DateTime       @default(now())
+  updatedAt        DateTime       @default(now()) @updatedAt
+}
+
+model TagName {
+  id        Int      @id @default(autoincrement())
+  tagId     Int?
+  Tag       Tag?     @relation(fields: [tagId], references: [id])
+  lang      String
+  word      String   @unique
+  createdAt DateTime @default(now())
+  updatedAt DateTime @default(now()) @updatedAt
+}
+
+model Post {
+  id                   Int                @id @default(autoincrement())
+  shopId               Int?
+  Shop                 Shop?              @relation(fields: [shopId], references: [id])
+  text                 String?
+  images               PostImage[]
+  preferrers           Like[]
+  weeklyRankScore      Float?
+  lifeTimeRankScore    Float?
+  monthlyRankScore     Float?
+  weeklyRankNum        Int?
+  monthlyRankNum       Int?
+  lifeTimeRankNum      Int?
+  products             Product[]
+  tags                 Tag[]
+  videos               PostVideo[]
+  mainProductId        Int?
+  mainProductPrice     Int?
+  views                View[]
+  priority             Int?
+  onDetailTagId        Int[]
+  isOnline             Boolean
+  externalLinkClickNum Int
+  postExternalLinks    PostExternalLink[]
+  createdAt            DateTime           @default(now())
+  updatedAt            DateTime           @default(now()) @updatedAt
+}
+
+model PostExternalLink {
+  id        Int      @id @default(autoincrement())
+  url       String
+  order     Int
+  linkType  LinkType
+  Post      Post?    @relation(fields: [postId], references: [id])
+  postId    Int?
+  isShown   Boolean
+  createdAt DateTime @default(now())
+  updatedAt DateTime @default(now()) @updatedAt
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
+model PostVideo {
+  id        Int      @id @default(autoincrement())
+  postId    Int?
+  Post      Post?    @relation(fields: [postId], references: [id])
+  url       String
+  order     Int
+  isYoutube Boolean
+  createdAt DateTime @default(now())
+  updatedAt DateTime @default(now()) @updatedAt
+}
+
+model View {
+  id        Int      @id @default(autoincrement())
+  userId    Int?
+  shopId    Int?
+  postId    Int?
+  eventId   Int?
+  productId Int?
+  User      User?    @relation(fields: [userId], references: [id])
+  Shop      Shop?    @relation(fields: [shopId], references: [id])
+  Post      Post?    @relation(fields: [postId], references: [id])
+  Event     Event?   @relation(fields: [eventId], references: [id])
+  Product   Product? @relation(fields: [productId], references: [id])
+  createdAt DateTime @default(now())
+}
+
+model Like {
+  id        Int      @id @default(autoincrement())
+  postId    Int?
+  productId Int?
+  userId    Int?
+  eventId   Int?
+  shopId    Int?
+  Post      Post?    @relation(fields: [postId], references: [id])
+  Product   Product? @relation(fields: [productId], references: [id])
+  User      User?    @relation(fields: [userId], references: [id])
+  Event     Event?   @relation(fields: [eventId], references: [id])
+  Shop      Shop?    @relation(fields: [shopId], references: [id])
+  createdAt DateTime @default(now())
+  updatedAt DateTime @default(now()) @updatedAt
+}
+
+model Setting {
+  id                 Int      @id @default(autoincrement())
+  mainBubbleTagId    Int[]
+  bestBubbleTagId    Int[]
+  shopBubbleTagId    Int[]
+  loadingPostNum     Int
+  TodaysStylesPeriod DateTime
+  bestTotalPostNum   Int
+  bestConstA         Float
+  bestConstB         Float
+  shopConstA         Float
+  shopConstB         Float
+  shopConstC         Float
+  adminEmail         String
+  adminEmailPW       String
+  mainEventBannerId  Int[]
+  QuestionOption     String[]
+  SearchPeriod       DateTime
+  createdAt          DateTime @default(now())
+  updatedAt          DateTime @default(now()) @updatedAt
+}
+
+model SearchTagLog {
+  id        Int      @id @default(autoincrement())
+  tagId     Int?
+  userId    Int?
+  Tag       Tag?     @relation(fields: [tagId], references: [id])
+  User      User?    @relation(fields: [userId], references: [id])
+  createdAt DateTime @default(now())
+}
```


