# Migration `20200922062434-update-search-period-on-setting`

This migration has been generated at 9/22/2020, 3:24:34 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Setting" DROP COLUMN "SearchPeriod",
ADD COLUMN "SearchPeriod" timestamp(3)   NOT NULL 
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200922061857-update-shop-external-link..20200922062434-update-search-period-on-setting
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
@@ -395,9 +395,9 @@
   adminEmail         String
   adminEmailPW       String
   mainEventBannerId  Int[]
   QuestionOption     String[]
-  SearchPeriod       Int
+  SearchPeriod       DateTime
   createdAt          DateTime @default(now())
   updatedAt          DateTime @default(now()) @updatedAt
 }
```


