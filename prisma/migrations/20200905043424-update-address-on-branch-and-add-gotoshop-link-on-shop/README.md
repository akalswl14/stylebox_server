# Migration `20200905043424-update-address-on-branch-and-add-gotoshop-link-on-shop`

This migration has been generated at 9/5/2020, 1:34:24 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Branch" ALTER COLUMN "address" SET DATA TYPE text ,
ALTER COLUMN "address" SET NOT NULL

ALTER TABLE "public"."Shop" ADD COLUMN "gotoshopLink" text   NOT NULL 
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200904173152-add-is-class-to-tag..20200905043424-update-address-on-branch-and-add-gotoshop-link-on-shop
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
@@ -96,8 +96,9 @@
   monthlyRankScore Float?
   priority         Float?
   onShopListTagId  Int[]
   onDetailTagId    Int[]
+  gotoshopLink     String
   createdAt        DateTime           @default(now())
   updatedAt        DateTime           @default(now()) @updatedAt
 }
@@ -150,9 +151,9 @@
   names        BranchName[]
   logoUrl      String?
   phoneNumbers String[]
   products     Product[]
-  address      String[]
+  address      String
   googleMapId  Int?
   tags         Tag[]
   createdAt    DateTime     @default(now())
   updatedAt    DateTime     @default(now()) @updatedAt
```


