# Migration `20200923071843-add-is-main-on-branch`

This migration has been generated at 9/23/2020, 4:18:43 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Branch" ADD COLUMN "isMain" boolean   NOT NULL 

ALTER TABLE "public"."ShopExternalLink" ADD COLUMN "isShown" boolean   NOT NULL 
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200923022244-add-is-shown-on-post-external-link-shop-external-link..20200923071843-add-is-main-on-branch
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
@@ -138,8 +138,9 @@
   shopId    Int?
   Shop      Shop?    @relation(fields: [shopId], references: [id])
   order     Int
   onBottom  Boolean
+  isShown   Boolean
   createdAt DateTime @default(now())
   updatedAt DateTime @default(now()) @updatedAt
 }
@@ -153,8 +154,9 @@
   address      String
   googleMapUrl String?
   longitude    Float?
   latitude     Float?
+  isMain       Boolean
   createdAt    DateTime     @default(now())
   updatedAt    DateTime     @default(now()) @updatedAt
 }
```


