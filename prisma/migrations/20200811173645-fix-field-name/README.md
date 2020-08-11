# Migration `20200811173645-fix-field-name`

This migration has been generated at 8/11/2020, 5:36:45 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql

```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200811165534-add-shop-phone-number..20200811173645-fix-field-name
--- datamodel.dml
+++ datamodel.dml
@@ -3,16 +3,16 @@
 }
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url = "***"
 }
 model User {
   id           Int           @id @default(autoincrement())
-  wishContents LikeContent[]
-  wishShops    LikeShop[]
-  wishEvents   LikeEvent[]
+  likeContents LikeContent[]
+  likeShops    LikeShop[]
+  likeEvents   LikeEvent[]
   createdAt    DateTime      @default(now())
   updatedAt    DateTime      @default(now()) @updatedAt
 }
```


