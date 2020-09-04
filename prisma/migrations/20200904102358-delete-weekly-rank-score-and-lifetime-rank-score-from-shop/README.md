# Migration `20200904102358-delete-weekly-rank-score-and-lifetime-rank-score-from-shop`

This migration has been generated at 9/4/2020, 10:23:58 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Shop" DROP COLUMN "weeklyRankScore",
DROP COLUMN "lifeTimeRankScore";
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200902171047-delete-search-option-from-setting..20200904102358-delete-weekly-rank-score-and-lifetime-rank-score-from-shop
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
@@ -79,29 +79,27 @@
   updatedAt DateTime @default(now()) @updatedAt
 }
 model Shop {
-  id                Int                @id @default(autoincrement())
-  names             ShopName[]
-  branches          Branch[]
-  externalLinks     ShopExternalLink[]
-  logoUrl           String?
-  description       String?
-  images            ShopImage[]
-  videos            ShopVideo[]
-  phoneNumber       String[]
-  preferrers        Like[]
-  tags              Tag[]
-  posts             Post[]
-  views             View[]
-  weeklyRankScore   Float?
-  monthlyRankScore  Float?
-  lifeTimeRankScore Float?
-  priority          Float?
-  onShopListTagId   Int[]
-  onDetailTagId     Int[]
-  createdAt         DateTime           @default(now())
-  updatedAt         DateTime           @default(now()) @updatedAt
+  id               Int                @id @default(autoincrement())
+  names            ShopName[]
+  branches         Branch[]
+  externalLinks    ShopExternalLink[]
+  logoUrl          String?
+  description      String?
+  images           ShopImage[]
+  videos           ShopVideo[]
+  phoneNumber      String[]
+  preferrers       Like[]
+  tags             Tag[]
+  posts            Post[]
+  views            View[]
+  monthlyRankScore Float?
+  priority         Float?
+  onShopListTagId  Int[]
+  onDetailTagId    Int[]
+  createdAt        DateTime           @default(now())
+  updatedAt        DateTime           @default(now()) @updatedAt
 }
 model ShopName {
   id        Int      @id @default(autoincrement())
```


