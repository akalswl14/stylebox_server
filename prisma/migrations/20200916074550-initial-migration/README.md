# Migration `20200916074550-initial-migration`

This migration has been generated by aeuna at 9/16/2020, 4:45:50 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql

```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200916053956-inital-migration..20200916074550-initial-migration
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
@@ -16,26 +16,26 @@
   updatedAt       DateTime       @default(now()) @updatedAt
 }
 model Product {
-  id            Int                 @id @default(autoincrement())
-  names         ProductName[]
-  images        ProductImage[]
-  preferrers    Like[]
-  branches      Branch[]
-  tags          Tag[]
-  posts         Post[]
-  description   String?
-  instaText     String?
-  price         Int?
-  externalLinks ProductExternalLink
-  videos        ProductVideo[]
-  isOwnPost     Boolean?
-  views         View[]
-  priority      Int?
-  mainPostId    Int?
-  createdAt     DateTime            @default(now())
-  updatedAt     DateTime            @default(now()) @updatedAt
+  id           Int                 @id @default(autoincrement())
+  names        ProductName[]
+  images       ProductImage[]
+  preferrers   Like[]
+  branches     Branch[]
+  tags         Tag[]
+  posts        Post[]
+  description  String?
+  instaText    String?
+  price        Int?
+  externalLink ProductExternalLink
+  videos       ProductVideo[]
+  isOwnPost    Boolean?
+  views        View[]
+  priority     Int?
+  mainPostId   Int?
+  createdAt    DateTime            @default(now())
+  updatedAt    DateTime            @default(now()) @updatedAt
 }
 model ProductName {
   id        Int      @id @default(autoincrement())
```

