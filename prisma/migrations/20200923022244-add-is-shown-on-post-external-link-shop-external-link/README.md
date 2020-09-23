# Migration `20200923022244-add-is-shown-on-post-external-link-shop-external-link`

This migration has been generated at 9/23/2020, 11:22:44 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."PostExternalLink" ADD COLUMN "isShown" boolean   NOT NULL 
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200922062434-update-search-period-on-setting..20200923022244-add-is-shown-on-post-external-link-shop-external-link
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
@@ -322,8 +322,9 @@
   order     Int
   linkType  LinkType
   Post      Post?    @relation(fields: [postId], references: [id])
   postId    Int?
+  isShown   Boolean
   createdAt DateTime @default(now())
   updatedAt DateTime @default(now()) @updatedAt
 }
```


