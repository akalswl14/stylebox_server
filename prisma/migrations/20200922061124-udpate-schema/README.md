# Migration `20200922061124-udpate-schema`

This migration has been generated at 9/22/2020, 3:11:24 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Shop" DROP COLUMN "onShopListTagId"
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200922025036-initial-migration..20200922061124-udpate-schema
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
@@ -93,9 +93,8 @@
   views                View[]
   monthlyRankScore     Float?
   monthlyRankNum       Int
   priority             Int?
-  onShopListTagId      Int[]
   onDetailTagId        Int[]
   externalLinkClickNum Int
   createdAt            DateTime           @default(now())
   updatedAt            DateTime           @default(now()) @updatedAt
```


