# Migration `20200926043538-fix-schmea`

This migration has been generated at 9/26/2020, 1:35:38 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Event" DROP COLUMN "address"

ALTER TABLE "public"."Shop" ALTER COLUMN "phoneNumber" SET DATA TYPE text ,
ALTER COLUMN "phoneNumber" SET NOT NULL
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200926020132-fix-nullable..20200926043538-fix-schmea
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
@@ -85,9 +85,9 @@
   logoUrl              String?
   description          String?
   images               ShopImage[]
   videos               ShopVideo[]
-  phoneNumber          String[]
+  phoneNumber          String
   preferrers           Like[]
   tags                 Tag[]
   posts                Post[]
   views                View[]
@@ -181,9 +181,8 @@
   tags           Tag[]
   views          View[]
   isOnList       Boolean
   title          String
-  address        String?
   onDetailTagId  Int[]
   contentsImages EventContentsImage[]
   startDate      DateTime
   createdAt      DateTime             @default(now())
```


