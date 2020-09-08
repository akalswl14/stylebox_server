# Migration `20200908024205-add-admin-email-pw-to-setting`

This migration has been generated at 9/8/2020, 11:42:05 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Setting" ADD COLUMN "adminEmailPW" text   NOT NULL 
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200905043805-update-schema..20200908024205-add-admin-email-pw-to-setting
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
@@ -367,8 +367,9 @@
   shopConstC         Float
   shopConstD         Float
   shopConstE         Float
   adminEmail         String
+  adminEmailPW       String
   popularTagId       Int[]
   mainEventBannerId  Int[]
   QuestionOption     String[]
   SearchPeriod       Int
```


