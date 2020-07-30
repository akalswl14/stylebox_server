# Migration `20200730173341-back`

This migration has been generated at 7/30/2020, 5:33:41 PM.
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
migration 20200730173303-test2..20200730173341-back
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
@@ -27,9 +27,8 @@
   description String?
   instaText   String?
   createdAt   DateTime       @default(now())
   updatedAt   DateTime       @default(now()) @updatedAt
-  test2       String?
 }
 model ProductName {
   id        Int      @id @default(autoincrement())
```


