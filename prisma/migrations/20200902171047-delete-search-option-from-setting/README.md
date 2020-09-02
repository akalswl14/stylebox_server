# Migration `20200902171047-delete-search-option-from-setting`

This migration has been generated at 9/2/2020, 5:10:47 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Setting" DROP COLUMN "SearchCategoryOption",
DROP COLUMN "SearchLocationOption",
DROP COLUMN "SearchStyleOption",
DROP COLUMN "SearchPriceOption",
DROP COLUMN "SearchFeatureOption";
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200902164219-add-search-option-to-setting..20200902171047-delete-search-option-from-setting
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
@@ -352,34 +352,29 @@
   updatedAt DateTime @default(now()) @updatedAt
 }
 model Setting {
-  id                   Int      @id @default(autoincrement())
-  mainBubbleTagId      Int[]
-  bestBubbleTagId      Int[]
-  shopBubbleTagId      Int[]
-  loadingPostNum       Int
-  TodaysStylesPeriod   Int
-  bestTotalPostNum     Int
-  bestConstA           Float
-  bestConstB           Float
-  shopConstA           Float
-  shopConstB           Float
-  shopConstC           Float
-  shopConstD           Float
-  shopConstE           Float
-  adminEmail           String
-  popularTagId         Int[]
-  mainEventBannerId    Int[]
-  QuestionOption       String[]
-  SearchPeriod         Int
-  SearchCategoryOption String
-  SearchLocationOption String
-  SearchStyleOption    String
-  SearchPriceOption    String
-  SearchFeatureOption  String
-  createdAt            DateTime @default(now())
-  updatedAt            DateTime @default(now()) @updatedAt
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
+  mainEventBannerId  Int[]
+  QuestionOption     String[]
+  SearchPeriod       Int
+  createdAt          DateTime @default(now())
+  updatedAt          DateTime @default(now()) @updatedAt
 }
 model SearchTagLog {
   id        Int      @id @default(autoincrement())
```


