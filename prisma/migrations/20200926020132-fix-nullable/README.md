# Migration `20200926020132-fix-nullable`

This migration has been generated at 9/26/2020, 11:01:32 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Event" ALTER COLUMN "address" DROP NOT NULL
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200923071843-add-is-main-on-branch..20200926020132-fix-nullable
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
@@ -181,9 +181,9 @@
   tags           Tag[]
   views          View[]
   isOnList       Boolean
   title          String
-  address        String
+  address        String?
   onDetailTagId  Int[]
   contentsImages EventContentsImage[]
   startDate      DateTime
   createdAt      DateTime             @default(now())
```


