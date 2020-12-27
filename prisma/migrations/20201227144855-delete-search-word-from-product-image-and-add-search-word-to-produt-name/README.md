# Migration `20201227144855-delete-search-word-from-product-image-and-add-search-word-to-produt-name`

This migration has been generated at 12/27/2020, 11:48:55 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."ProductImage" DROP COLUMN "searchWord"

ALTER TABLE "public"."ProductName" ADD COLUMN "searchWord" text   NOT NULL DEFAULT E''
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20201223080526-add-search-word-and-search-title..20201227144855-delete-search-word-from-product-image-and-add-search-word-to-produt-name
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
@@ -36,28 +36,28 @@
   updatedAt     DateTime            @default(now()) @updatedAt
 }
 model ProductName {
-  id        Int      @id @default(autoincrement())
-  productId Int?
-  Product   Product? @relation(fields: [productId], references: [id])
-  lang      String
-  word      String
-  createdAt DateTime @default(now())
-  updatedAt DateTime @default(now()) @updatedAt
-}
-
-model ProductImage {
   id         Int      @id @default(autoincrement())
   productId  Int?
   Product    Product? @relation(fields: [productId], references: [id])
-  url        String
-  order      Int
+  lang       String
+  word       String
   searchWord String   @default("")
   createdAt  DateTime @default(now())
   updatedAt  DateTime @default(now()) @updatedAt
 }
+model ProductImage {
+  id        Int      @id @default(autoincrement())
+  productId Int?
+  Product   Product? @relation(fields: [productId], references: [id])
+  url       String
+  order     Int
+  createdAt DateTime @default(now())
+  updatedAt DateTime @default(now()) @updatedAt
+}
+
 model ProductVideo {
   id        Int      @id @default(autoincrement())
   productId Int?
   Product   Product? @relation(fields: [productId], references: [id])
```


