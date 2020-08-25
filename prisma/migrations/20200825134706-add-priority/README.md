# Migration `20200825134706-add-priority`

This migration has been generated at 8/25/2020, 1:47:06 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Post" ADD COLUMN "priority" Decimal(65,30)   ;

ALTER TABLE "public"."Product" ADD COLUMN "priority" Decimal(65,30)   ;

ALTER TABLE "public"."Shop" ADD COLUMN "priority" Decimal(65,30)   ;
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200824132116-fix-event..20200825134706-add-priority
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
   id        Int      @id @default(autoincrement())
@@ -29,8 +29,9 @@
   externalLinks ProductExternalLink[]
   videos        ProductVideo[]
   isOwnPost     Boolean?
   views         View[]
+  priority      Float?
   createdAt     DateTime              @default(now())
   updatedAt     DateTime              @default(now()) @updatedAt
 }
@@ -92,8 +93,9 @@
   views             View[]
   weeklyRankScore   Float?
   monthlyRankScore  Float?
   lifeTimeRankScore Float?
+  priority          Float?
   createdAt         DateTime           @default(now())
   updatedAt         DateTime           @default(now()) @updatedAt
 }
@@ -271,8 +273,9 @@
   videos            PostVideo[]
   mainProductId     Int?
   mainProductPrice  Int?
   views             View[]
+  priority          Float?
   createdAt         DateTime    @default(now())
   updatedAt         DateTime    @default(now()) @updatedAt
 }
```


