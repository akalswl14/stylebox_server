# Migration `20200904173152-add-is-class-to-tag`

This migration has been generated at 9/4/2020, 5:31:52 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Tag" ADD COLUMN "isClass" boolean  NOT NULL ;
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200904102358-delete-weekly-rank-score-and-lifetime-rank-score-from-shop..20200904173152-add-is-class-to-tag
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
@@ -258,8 +258,9 @@
   category      Category?
   tagImage      String?
   isOnOption    Boolean
   searchTagLogs SearchTagLog[]
+  isClass       Boolean
   createdAt     DateTime       @default(now())
   updatedAt     DateTime       @default(now()) @updatedAt
 }
```


