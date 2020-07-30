# Migration `20200730173303-test2`

This migration has been generated at 7/30/2020, 5:33:03 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
PRAGMA foreign_keys=OFF;

CREATE TABLE "new_Product" (
"id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
"shopId" INTEGER ,
"description" TEXT ,
"instaText" TEXT ,
"createdAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
"test2" TEXT ,
FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE SET NULL ON UPDATE CASCADE
)

INSERT INTO "new_Product" ("id", "shopId", "description", "instaText", "createdAt", "updatedAt") SELECT "id", "shopId", "description", "instaText", "createdAt", "updatedAt" FROM "Product"

PRAGMA foreign_keys=off;
DROP TABLE "Product";;
PRAGMA foreign_keys=on

ALTER TABLE "new_Product" RENAME TO "Product";

PRAGMA foreign_key_check;

PRAGMA foreign_keys=ON;
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200730173231-test1..20200730173303-test2
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
@@ -25,11 +25,11 @@
   shopId      Int?
   tags        Tag[]
   description String?
   instaText   String?
-  test        String?
   createdAt   DateTime       @default(now())
   updatedAt   DateTime       @default(now()) @updatedAt
+  test2       String?
 }
 model ProductName {
   id        Int      @id @default(autoincrement())
```


