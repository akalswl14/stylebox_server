# Migration `20200902164219-add-search-option-to-setting`

This migration has been generated at 9/2/2020, 4:42:19 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Setting" ADD COLUMN "SearchCategoryOption" text  NOT NULL ,
ADD COLUMN "SearchLocationOption" text  NOT NULL ,
ADD COLUMN "SearchStyleOption" text  NOT NULL ,
ADD COLUMN "SearchPriceOption" text  NOT NULL ,
ADD COLUMN "SearchFeatureOption" text  NOT NULL ;
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200902153459-add-is-online-to-post..20200902164219-add-search-option-to-setting
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
@@ -352,29 +352,34 @@
   updatedAt DateTime @default(now()) @updatedAt
 }
 model Setting {
-  id                 Int      @id @default(autoincrement())
-  mainBubbleTagId    Int[]
-  bestBubbleTagId    Int[]
-  shopBubbleTagId    Int[]
-  loadingPostNum     Int
-  TodaysStylesPeriod Int
-  bestTotalPostNum   Int
-  bestConstA         Float
-  bestConstB         Float
-  shopConstA         Float
-  shopConstB         Float
-  shopConstC         Float
-  shopConstD         Float
-  shopConstE         Float
-  adminEmail         String
-  popularTagId       Int[]
-  mainEventBannerId  Int[]
-  QuestionOption     String[]
-  SearchPeriod       Int
-  createdAt          DateTime @default(now())
-  updatedAt          DateTime @default(now()) @updatedAt
+  id                   Int      @id @default(autoincrement())
+  mainBubbleTagId      Int[]
+  bestBubbleTagId      Int[]
+  shopBubbleTagId      Int[]
+  loadingPostNum       Int
+  TodaysStylesPeriod   Int
+  bestTotalPostNum     Int
+  bestConstA           Float
+  bestConstB           Float
+  shopConstA           Float
+  shopConstB           Float
+  shopConstC           Float
+  shopConstD           Float
+  shopConstE           Float
+  adminEmail           String
+  popularTagId         Int[]
+  mainEventBannerId    Int[]
+  QuestionOption       String[]
+  SearchPeriod         Int
+  SearchCategoryOption String
+  SearchLocationOption String
+  SearchStyleOption    String
+  SearchPriceOption    String
+  SearchFeatureOption  String
+  createdAt            DateTime @default(now())
+  updatedAt            DateTime @default(now()) @updatedAt
 }
 model SearchTagLog {
   id        Int      @id @default(autoincrement())
```


