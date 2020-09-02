# Migration `20200902135648-add-question-option-to-setting`

This migration has been generated at 9/2/2020, 1:56:48 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Setting" ADD COLUMN "QuestionOption" text []  ;
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200902115435-add-event-contents-image..20200902135648-add-question-option-to-setting
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
@@ -368,8 +368,9 @@
   shopConstE         Float
   adminEmail         String
   popularTagId       Int[]
   mainEventBannerId  Int[]
+  QuestionOption     String[]
   createdAt          DateTime @default(now())
   updatedAt          DateTime @default(now()) @updatedAt
 }
```


