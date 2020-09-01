# Migration `20200901173912-add-main-event-banner-id-to-setting`

This migration has been generated at 9/1/2020, 5:39:13 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Setting" ADD COLUMN "mainEventBannerId" integer []  ;
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200901164927-change-db-schema..20200901173912-add-main-event-banner-id-to-setting
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
@@ -356,8 +356,9 @@
   shopConstD         Float
   shopConstE         Float
   adminEmail         String
   popularTagId       Int[]
+  mainEventBannerId  Int[]
   createdAt          DateTime @default(now())
   updatedAt          DateTime @default(now()) @updatedAt
 }
```


