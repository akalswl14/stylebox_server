# Migration `20200905043805-update-schema`

This migration has been generated at 9/5/2020, 1:38:05 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Shop" ALTER COLUMN "gotoshopLink" DROP NOT NULL
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200905043424-update-address-on-branch-and-add-gotoshop-link-on-shop..20200905043805-update-schema
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
@@ -96,9 +96,9 @@
   monthlyRankScore Float?
   priority         Float?
   onShopListTagId  Int[]
   onDetailTagId    Int[]
-  gotoshopLink     String
+  gotoshopLink     String?
   createdAt        DateTime           @default(now())
   updatedAt        DateTime           @default(now()) @updatedAt
 }
```


