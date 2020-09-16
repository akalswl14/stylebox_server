# Migration `20200916053736-initial-migration`

This migration has been generated by aeuna at 9/16/2020, 2:37:36 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Post" ALTER COLUMN "externalLinkClickNum" SET NOT NULL

ALTER TABLE "public"."Shop" ALTER COLUMN "externalLinkClickNum" SET NOT NULL
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200916053018-initial-migration..20200916053736-initial-migration
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
@@ -97,9 +97,9 @@
   priority             Int?
   onShopListTagId      Int[]
   onDetailTagId        Int[]
   gotoshopLink         String?
-  externalLinkClickNum Int?
+  externalLinkClickNum Int
   createdAt            DateTime           @default(now())
   updatedAt            DateTime           @default(now()) @updatedAt
 }
@@ -296,9 +296,9 @@
   views                View[]
   priority             Int?
   onDetailTagId        Int[]
   isOnline             Boolean
-  externalLinkClickNum Int?
+  externalLinkClickNum Int
   postExternalLinks    PostExternalLink[]
   createdAt            DateTime           @default(now())
   updatedAt            DateTime           @default(now()) @updatedAt
 }
```

