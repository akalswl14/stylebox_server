# Migration `20200730173231-test1`

This migration has been generated at 7/30/2020, 5:32:31 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
PRAGMA foreign_keys=OFF;

ALTER TABLE "Product" ADD COLUMN "test" TEXT ;

PRAGMA foreign_key_check;

PRAGMA foreign_keys=ON;
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200730173154-initial-migration..20200730173231-test1
--- datamodel.dml
+++ datamodel.dml
@@ -3,9 +3,9 @@
 }
 datasource db {
   provider = "sqlite"
-  url = "***"
+  url = "***"
 }
 model User {
   id           Int       @id @default(autoincrement())
@@ -25,8 +25,9 @@
   shopId      Int?
   tags        Tag[]
   description String?
   instaText   String?
+  test        String?
   createdAt   DateTime       @default(now())
   updatedAt   DateTime       @default(now()) @updatedAt
 }
```


