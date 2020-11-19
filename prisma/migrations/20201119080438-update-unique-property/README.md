# Migration `20201119080438-update-unique-property`

This migration has been generated at 11/19/2020, 5:04:38 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
DROP INDEX "public"."BranchName.word_unique"

DROP INDEX "public"."ProductName.word_unique"

DROP INDEX "public"."ShopName.word_unique"
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200926043538-fix-schmea..20201119080438-update-unique-property
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
@@ -39,9 +39,9 @@
   id        Int      @id @default(autoincrement())
   productId Int?
   Product   Product? @relation(fields: [productId], references: [id])
   lang      String
-  word      String   @unique
+  word      String
   createdAt DateTime @default(now())
   updatedAt DateTime @default(now()) @updatedAt
 }
@@ -104,9 +104,9 @@
   id        Int      @id @default(autoincrement())
   shopId    Int?
   Shop      Shop?    @relation(fields: [shopId], references: [id])
   lang      String
-  word      String   @unique
+  word      String
   createdAt DateTime @default(now())
   updatedAt DateTime @default(now()) @updatedAt
 }
@@ -164,9 +164,9 @@
   id        Int      @id @default(autoincrement())
   branchId  Int?
   Branch    Branch?  @relation(fields: [branchId], references: [id])
   lang      String
-  word      String   @unique
+  word      String
   createdAt DateTime @default(now())
   updatedAt DateTime @default(now()) @updatedAt
 }
```


