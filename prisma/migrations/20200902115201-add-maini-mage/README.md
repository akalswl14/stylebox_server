# Migration `20200902115201-add-maini-mage`

This migration has been generated at 9/2/2020, 11:52:01 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Event" ADD COLUMN "mainImage" text  NOT NULL ;
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200901173912-add-main-event-banner-id-to-setting..20200902115201-add-maini-mage
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
@@ -182,8 +182,9 @@
   views       View[]
   isOnList    Boolean
   title       String
   bannerText  String?
+  mainImage   String
   createdAt   DateTime     @default(now())
   updatedAt   DateTime     @default(now()) @updatedAt
 }
```


