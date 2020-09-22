# Migration `20200922061857-update-shop-external-link`

This migration has been generated at 9/22/2020, 3:18:57 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."ShopExternalLink" DROP COLUMN "isOnDetail",
DROP COLUMN "isOnGoToShop"
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200922061124-udpate-schema..20200922061857-update-shop-external-link
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
@@ -131,19 +131,17 @@
   updatedAt DateTime @default(now()) @updatedAt
 }
 model ShopExternalLink {
-  id           Int      @id @default(autoincrement())
-  url          String
-  linkType     LinkType
-  shopId       Int?
-  Shop         Shop?    @relation(fields: [shopId], references: [id])
-  order        Int
-  onBottom     Boolean
-  isOnDetail   Boolean
-  isOnGoToShop Boolean
-  createdAt    DateTime @default(now())
-  updatedAt    DateTime @default(now()) @updatedAt
+  id        Int      @id @default(autoincrement())
+  url       String
+  linkType  LinkType
+  shopId    Int?
+  Shop      Shop?    @relation(fields: [shopId], references: [id])
+  order     Int
+  onBottom  Boolean
+  createdAt DateTime @default(now())
+  updatedAt DateTime @default(now()) @updatedAt
 }
 model Branch {
   id           Int          @id @default(autoincrement())
```


