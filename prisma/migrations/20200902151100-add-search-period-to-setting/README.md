# Migration `20200902151100-add-search-period-to-setting`

This migration has been generated at 9/2/2020, 3:11:00 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Setting" ADD COLUMN "SearchPeriod" integer  NOT NULL ;
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200902135648-add-question-option-to-setting..20200902151100-add-search-period-to-setting
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
@@ -369,8 +369,9 @@
   adminEmail         String
   popularTagId       Int[]
   mainEventBannerId  Int[]
   QuestionOption     String[]
+  SearchPeriod       Int
   createdAt          DateTime @default(now())
   updatedAt          DateTime @default(now()) @updatedAt
 }
```


