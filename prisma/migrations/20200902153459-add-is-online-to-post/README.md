# Migration `20200902153459-add-is-online-to-post`

This migration has been generated at 9/2/2020, 3:34:59 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Post" ADD COLUMN "isOnline" boolean  NOT NULL ;
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200902151100-add-search-period-to-setting..20200902153459-add-is-online-to-post
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
@@ -294,8 +294,9 @@
   mainProductPrice  Int?
   views             View[]
   priority          Float?
   onDetailTagId     Int[]
+  isOnline          Boolean
   createdAt         DateTime    @default(now())
   updatedAt         DateTime    @default(now()) @updatedAt
 }
```


