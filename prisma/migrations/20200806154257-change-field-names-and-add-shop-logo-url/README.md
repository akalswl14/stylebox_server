# Migration `20200806154257-change-field-names-and-add-shop-logo-url`

This migration has been generated at 8/6/2020, 3:42:57 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Product" ALTER COLUMN "instaText" SET DATA TYPE text ,
ALTER COLUMN "instaText" DROP NOT NULL;

ALTER TABLE "public"."Shop" ADD COLUMN "logoUrl" text   ;
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200805154009-initial-migration..20200806154257-change-field-names-and-add-shop-logo-url
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
   id           Int       @id @default(autoincrement())
@@ -24,12 +24,12 @@
   wishersCnt  Int?
   shops       Shop[]
   tags        Tag[]
   description String?
-  instaText   String[]
+  instaText   String?
   createdAt   DateTime       @default(now())
   updatedAt   DateTime       @default(now()) @updatedAt
-  Post        Post[]
+  posts       Post[]
 }
 model ProductName {
   id        Int      @id @default(autoincrement())
@@ -62,8 +62,9 @@
   coordinate  String?
   address     String[]
   tags        Tag[]
   city        String?
+  logoUrl     String?
   createdAt   DateTime    @default(now())
   updatedAt   DateTime    @default(now()) @updatedAt
 }
@@ -144,9 +145,9 @@
   products   Product[]
   shops      Shop[]
   createdAt  DateTime  @default(now())
   updatedAt  DateTime  @default(now()) @updatedAt
-  Post       Post[]
+  posts      Post[]
 }
 model TagName {
   id        Int      @id @default(autoincrement())
```


