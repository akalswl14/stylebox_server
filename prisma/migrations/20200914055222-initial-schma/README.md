# Migration `20200914055222-initial-schma`

This migration has been generated at 9/14/2020, 2:52:22 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
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
"isOwnPost" boolean   ,
"priority" integer   ,
"mainPostId" integer   ,
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
"linkType" text   NOT NULL ,
"productId" integer   ,
"createdAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."Shop" (
"id" SERIAL,
"logoUrl" text   ,
"description" text   ,
"phoneNumber" text []  ,
"monthlyRankScore" Decimal(65,30)   ,
"priority" integer   ,
"onShopListTagId" integer []  ,
"onDetailTagId" integer []  ,
"gotoshopLink" text   ,
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
"order" integer   NOT NULL ,
"linkType" text   NOT NULL ,
"shopId" integer   ,
"createdAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."Branch" (
"id" SERIAL,
"shopId" integer   ,
"logoUrl" text   ,
"phoneNumbers" text []  ,
"address" text   NOT NULL ,
"googleMapId" integer   ,
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
"bannerText" text   ,
"isExpired" boolean   NOT NULL ,
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
"title" text   ,
"text" text   ,
"weeklyRankScore" Decimal(65,30)   ,
"lifeTimeRankScore" Decimal(65,30)   ,
"monthlyRankScore" Decimal(65,30)   ,
"publisher" text   ,
"mainProductId" integer   ,
"mainProductPrice" integer   ,
"priority" integer   ,
"onDetailTagId" integer []  ,
"isOnline" boolean   NOT NULL ,
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
"TodaysStylesPeriod" integer   NOT NULL ,
"bestTotalPostNum" integer   NOT NULL ,
"bestConstA" Decimal(65,30)   NOT NULL ,
"bestConstB" Decimal(65,30)   NOT NULL ,
"shopConstA" Decimal(65,30)   NOT NULL ,
"shopConstB" Decimal(65,30)   NOT NULL ,
"shopConstC" Decimal(65,30)   NOT NULL ,
"shopConstD" Decimal(65,30)   NOT NULL ,
"adminEmail" text   NOT NULL ,
"adminEmailPW" text   NOT NULL ,
"popularTagId" integer []  ,
"mainEventBannerId" integer []  ,
"QuestionOption" text []  ,
"SearchPeriod" integer   NOT NULL ,
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

CREATE TABLE "public"."_BranchToTag" (
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

CREATE UNIQUE INDEX "ProductName.word_unique" ON "public"."ProductName"("word")

CREATE UNIQUE INDEX "ShopName.word_unique" ON "public"."ShopName"("word")

CREATE UNIQUE INDEX "BranchName.word_unique" ON "public"."BranchName"("word")

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

CREATE UNIQUE INDEX "_BranchToTag_AB_unique" ON "public"."_BranchToTag"("A", "B")

CREATE INDEX "_BranchToTag_B_index" ON "public"."_BranchToTag"("B")

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

ALTER TABLE "public"."_BranchToTag" ADD FOREIGN KEY ("A")REFERENCES "public"."Branch"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."_BranchToTag" ADD FOREIGN KEY ("B")REFERENCES "public"."Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."_EventToTag" ADD FOREIGN KEY ("A")REFERENCES "public"."Event"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."_EventToTag" ADD FOREIGN KEY ("B")REFERENCES "public"."Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."_PostToTag" ADD FOREIGN KEY ("A")REFERENCES "public"."Post"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."_PostToTag" ADD FOREIGN KEY ("B")REFERENCES "public"."Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200910044109-update-word-preferrence---unique..20200914055222-initial-schma
--- datamodel.dml
+++ datamodel.dml
@@ -3,9 +3,9 @@
 }
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url = "***"
 }
 model User {
   id              Int            @id @default(autoincrement())
@@ -30,9 +30,9 @@
   externalLinks ProductExternalLink[]
   videos        ProductVideo[]
   isOwnPost     Boolean?
   views         View[]
-  priority      Float?
+  priority      Int?
   mainPostId    Int?
   createdAt     DateTime              @default(now())
   updatedAt     DateTime              @default(now()) @updatedAt
 }
@@ -93,9 +93,9 @@
   tags             Tag[]
   posts            Post[]
   views            View[]
   monthlyRankScore Float?
-  priority         Float?
+  priority         Int?
   onShopListTagId  Int[]
   onDetailTagId    Int[]
   gotoshopLink     String?
   createdAt        DateTime           @default(now())
@@ -182,8 +182,9 @@
   isOnList       Boolean
   title          String
   bannerText     String?
   contentsImages EventContentsImage[]
+  isExpired      Boolean
   createdAt      DateTime             @default(now())
   updatedAt      DateTime             @default(now()) @updatedAt
 }
@@ -257,9 +258,8 @@
   products      Product[]
   events        Event[]
   category      Category?
   tagImage      String?
-  isOnOption    Boolean
   searchTagLogs SearchTagLog[]
   isClass       Boolean
   createdAt     DateTime       @default(now())
   updatedAt     DateTime       @default(now()) @updatedAt
@@ -292,9 +292,9 @@
   videos            PostVideo[]
   mainProductId     Int?
   mainProductPrice  Int?
   views             View[]
-  priority          Float?
+  priority          Int?
   onDetailTagId     Int[]
   isOnline          Boolean
   createdAt         DateTime    @default(now())
   updatedAt         DateTime    @default(now()) @updatedAt
@@ -365,9 +365,8 @@
   shopConstA         Float
   shopConstB         Float
   shopConstC         Float
   shopConstD         Float
-  shopConstE         Float
   adminEmail         String
   adminEmailPW       String
   popularTagId       Int[]
   mainEventBannerId  Int[]
```


