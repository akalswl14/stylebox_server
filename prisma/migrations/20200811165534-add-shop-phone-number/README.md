# Migration `20200811165534-add-shop-phone-number`

This migration has been generated at 8/11/2020, 4:55:34 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Shop" ADD COLUMN "phoneNumber" text []  ;
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200811164031-add-some-fields--fix-category-to-class-and-add-category-enum..20200811165534-add-shop-phone-number
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
   id           Int           @id @default(autoincrement())
@@ -59,8 +59,9 @@
   logoUrl       String?
   discription   String?
   images        ShopImage[]
   videos        ShopVideo[]
+  phoneNumber   String[]
   products      Product[]
   preferrers    LikeShop[]
   preferrersCnt Int?
   viewCnt       Int?
```


