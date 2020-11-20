# Migration `20201119080527-add-cafe24-to-link-type`

This migration has been generated at 11/19/2020, 5:05:27 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TYPE "LinkType" ADD VALUE 'Cafe24'

DROP INDEX "public"."BranchName.word_unique"

DROP INDEX "public"."ProductName.word_unique"

DROP INDEX "public"."ShopName.word_unique"
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20201119080438-update-unique-property..20201119080527-add-cafe24-to-link-type
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
@@ -239,8 +239,9 @@
   Sendo
   LAZADA
   Tiki
   OnlineShop
+  Cafe24
 }
 model Class {
   id        Int         @id @default(autoincrement())
```


