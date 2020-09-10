# Migration `20200910044109-update-word-preferrence---unique`

This migration has been generated at 9/10/2020, 1:41:09 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE UNIQUE INDEX "BranchName.word_unique" ON "public"."BranchName"("word")

CREATE UNIQUE INDEX "ClassName.word_unique" ON "public"."ClassName"("word")

CREATE UNIQUE INDEX "ProductName.word_unique" ON "public"."ProductName"("word")

CREATE UNIQUE INDEX "ShopName.word_unique" ON "public"."ShopName"("word")

CREATE UNIQUE INDEX "TagName.word_unique" ON "public"."TagName"("word")
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200908024205-add-admin-email-pw-to-setting..20200910044109-update-word-preferrence---unique
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
@@ -41,9 +41,9 @@
   id        Int      @id @default(autoincrement())
   productId Int?
   Product   Product? @relation(fields: [productId], references: [id])
   lang      String
-  word      String
+  word      String   @unique
   createdAt DateTime @default(now())
   updatedAt DateTime @default(now()) @updatedAt
 }
@@ -106,9 +106,9 @@
   id        Int      @id @default(autoincrement())
   shopId    Int?
   Shop      Shop?    @relation(fields: [shopId], references: [id])
   lang      String
-  word      String
+  word      String   @unique
   createdAt DateTime @default(now())
   updatedAt DateTime @default(now()) @updatedAt
 }
@@ -163,9 +163,9 @@
   id        Int      @id @default(autoincrement())
   branchId  Int?
   Branch    Branch?  @relation(fields: [branchId], references: [id])
   lang      String
-  word      String
+  word      String   @unique
   createdAt DateTime @default(now())
   updatedAt DateTime @default(now()) @updatedAt
 }
@@ -240,9 +240,9 @@
   id        Int      @id @default(autoincrement())
   classId   Int?
   Class     Class?   @relation(fields: [classId], references: [id])
   lang      String
-  word      String
+  word      String   @unique
   createdAt DateTime @default(now())
   updatedAt DateTime @default(now()) @updatedAt
 }
@@ -269,9 +269,9 @@
   id        Int      @id @default(autoincrement())
   tagId     Int?
   Tag       Tag?     @relation(fields: [tagId], references: [id])
   lang      String
-  word      String
+  word      String   @unique
   createdAt DateTime @default(now())
   updatedAt DateTime @default(now()) @updatedAt
 }
```


