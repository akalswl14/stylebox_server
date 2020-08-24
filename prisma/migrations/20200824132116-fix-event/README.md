# Migration `20200824132116-fix-event`

This migration has been generated at 8/24/2020, 1:21:16 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Event" DROP COLUMN "viewCnt";
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200824125502-inital-migration..20200824132116-fix-event
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
   id        Int      @id @default(autoincrement())
@@ -168,9 +168,8 @@
   id          Int          @id @default(autoincrement())
   images      EventImage[]
   videos      EventVideo[]
   preferrers  Like[]
-  viewCnt     Int?
   url         String?
   dueDate     DateTime
   bannerImage String
   tags        Tag[]
```


