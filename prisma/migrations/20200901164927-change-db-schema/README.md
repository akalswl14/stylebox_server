# Migration `20200901164927-change-db-schema`

This migration has been generated at 9/1/2020, 4:49:27 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "public"."Setting" (
"id" SERIAL,
"mainBubbleTagId" integer []  ,
"bestBubbleTagId" integer []  ,
"shopBubbleTagId" integer []  ,
"loadingPostNum" integer  NOT NULL ,
"TodaysStylesPeriod" integer  NOT NULL ,
"bestTotalPostNum" integer  NOT NULL ,
"bestConstA" Decimal(65,30)  NOT NULL ,
"bestConstB" Decimal(65,30)  NOT NULL ,
"shopConstA" Decimal(65,30)  NOT NULL ,
"shopConstB" Decimal(65,30)  NOT NULL ,
"shopConstC" Decimal(65,30)  NOT NULL ,
"shopConstD" Decimal(65,30)  NOT NULL ,
"shopConstE" Decimal(65,30)  NOT NULL ,
"adminEmail" text  NOT NULL ,
"popularTagId" integer []  ,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id"))

CREATE TABLE "public"."SearchTagLog" (
"id" SERIAL,
"tagId" integer   ,
"userId" integer   ,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id"))

ALTER TABLE "public"."Event" ADD COLUMN "isOnList" boolean  NOT NULL ,
ADD COLUMN "title" text  NOT NULL ,
ADD COLUMN "bannerText" text   ;

ALTER TABLE "public"."Post" ADD COLUMN "onDetailTagId" integer []  ;

ALTER TABLE "public"."Product" ADD COLUMN "mainPostId" integer   ;

ALTER TABLE "public"."Shop" ADD COLUMN "onShopListTagId" integer []  ,
ADD COLUMN "onDetailTagId" integer []  ;

ALTER TABLE "public"."Tag" DROP COLUMN "orderInPopular",
DROP COLUMN "orderInRecommend",
ADD COLUMN "tagImage" text   ,
ADD COLUMN "isOnOption" boolean  NOT NULL ;

ALTER TABLE "public"."SearchTagLog" ADD FOREIGN KEY ("tagId")REFERENCES "public"."Tag"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."SearchTagLog" ADD FOREIGN KEY ("userId")REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200825134706-add-priority..20200901164927-change-db-schema
--- datamodel.dml
+++ datamodel.dml
@@ -3,17 +3,18 @@
 }
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url = "***"
 }
 model User {
-  id        Int      @id @default(autoincrement())
-  views     View[]
-  likes     Like[]
-  createdAt DateTime @default(now())
-  updatedAt DateTime @default(now()) @updatedAt
+  id              Int            @id @default(autoincrement())
+  views           View[]
+  likes           Like[]
+  searchTagLogIds SearchTagLog[]
+  createdAt       DateTime       @default(now())
+  updatedAt       DateTime       @default(now()) @updatedAt
 }
 model Product {
   id            Int                   @id @default(autoincrement())
@@ -30,8 +31,9 @@
   videos        ProductVideo[]
   isOwnPost     Boolean?
   views         View[]
   priority      Float?
+  mainPostId    Int?
   createdAt     DateTime              @default(now())
   updatedAt     DateTime              @default(now()) @updatedAt
 }
@@ -94,8 +96,10 @@
   weeklyRankScore   Float?
   monthlyRankScore  Float?
   lifeTimeRankScore Float?
   priority          Float?
+  onShopListTagId   Int[]
+  onDetailTagId     Int[]
   createdAt         DateTime           @default(now())
   updatedAt         DateTime           @default(now()) @updatedAt
 }
@@ -175,8 +179,11 @@
   dueDate     DateTime
   bannerImage String
   tags        Tag[]
   views       View[]
+  isOnList    Boolean
+  title       String
+  bannerText  String?
   createdAt   DateTime     @default(now())
   updatedAt   DateTime     @default(now()) @updatedAt
 }
@@ -229,22 +236,23 @@
   updatedAt DateTime @default(now()) @updatedAt
 }
 model Tag {
-  id               Int       @id @default(autoincrement())
-  classId          Int
-  Class            Class     @relation(fields: [classId], references: [id])
-  names            TagName[]
-  shops            Shop[]
-  branches         Branch[]
-  posts            Post[]
-  products         Product[]
-  events           Event[]
-  category         Category?
-  orderInPopular   Int?
-  orderInRecommend Int?
-  createdAt        DateTime  @default(now())
-  updatedAt        DateTime  @default(now()) @updatedAt
+  id            Int            @id @default(autoincrement())
+  classId       Int
+  Class         Class          @relation(fields: [classId], references: [id])
+  names         TagName[]
+  shops         Shop[]
+  branches      Branch[]
+  posts         Post[]
+  products      Product[]
+  events        Event[]
+  category      Category?
+  tagImage      String?
+  isOnOption    Boolean
+  searchTagLogs SearchTagLog[]
+  createdAt     DateTime       @default(now())
+  updatedAt     DateTime       @default(now()) @updatedAt
 }
 model TagName {
   id        Int      @id @default(autoincrement())
@@ -274,8 +282,9 @@
   mainProductId     Int?
   mainProductPrice  Int?
   views             View[]
   priority          Float?
+  onDetailTagId     Int[]
   createdAt         DateTime    @default(now())
   updatedAt         DateTime    @default(now()) @updatedAt
 }
@@ -329,4 +338,34 @@
   Shop      Shop?    @relation(fields: [shopId], references: [id])
   createdAt DateTime @default(now())
   updatedAt DateTime @default(now()) @updatedAt
 }
+
+model Setting {
+  id                 Int      @id @default(autoincrement())
+  mainBubbleTagId    Int[]
+  bestBubbleTagId    Int[]
+  shopBubbleTagId    Int[]
+  loadingPostNum     Int
+  TodaysStylesPeriod Int
+  bestTotalPostNum   Int
+  bestConstA         Float
+  bestConstB         Float
+  shopConstA         Float
+  shopConstB         Float
+  shopConstC         Float
+  shopConstD         Float
+  shopConstE         Float
+  adminEmail         String
+  popularTagId       Int[]
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


