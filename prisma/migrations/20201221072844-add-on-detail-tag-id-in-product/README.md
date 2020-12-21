# Migration `20201221072844-add-on-detail-tag-id-in-product`

This migration has been generated at 12/21/2020, 4:28:44 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Product" ADD COLUMN "onDetailTagId" integer []  
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20201122132600-initial-migration..20201221072844-add-on-detail-tag-id-in-product
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
@@ -16,24 +16,25 @@
   updatedAt       DateTime       @default(now()) @updatedAt
 }
 model Product {
-  id           Int                 @id @default(autoincrement())
-  names        ProductName[]
-  images       ProductImage[]
-  preferrers   Like[]
-  branches     Branch[]
-  tags         Tag[]
-  posts        Post[]
-  description  String?
-  instaText    String?
-  price        Int?
-  externalLink ProductExternalLink
-  videos       ProductVideo[]
-  views        View[]
-  priority     Int?
-  createdAt    DateTime            @default(now())
-  updatedAt    DateTime            @default(now()) @updatedAt
+  id            Int                 @id @default(autoincrement())
+  names         ProductName[]
+  images        ProductImage[]
+  preferrers    Like[]
+  branches      Branch[]
+  tags          Tag[]
+  posts         Post[]
+  description   String?
+  instaText     String?
+  price         Int?
+  externalLink  ProductExternalLink
+  videos        ProductVideo[]
+  views         View[]
+  priority      Int?
+  onDetailTagId Int[]
+  createdAt     DateTime            @default(now())
+  updatedAt     DateTime            @default(now()) @updatedAt
 }
 model ProductName {
   id        Int      @id @default(autoincrement())
```


