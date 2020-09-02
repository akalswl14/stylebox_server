# Migration `20200902115435-add-event-contents-image`

This migration has been generated at 9/2/2020, 11:54:35 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "public"."EventContentsImage" (
"id" SERIAL,
"eventId" integer   ,
"url" text  NOT NULL ,
"order" integer  NOT NULL ,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id"))

ALTER TABLE "public"."EventContentsImage" ADD FOREIGN KEY ("eventId")REFERENCES "public"."Event"("id") ON DELETE SET NULL ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200902115201-add-maini-mage..20200902115435-add-event-contents-image
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
@@ -170,23 +170,23 @@
   updatedAt DateTime @default(now()) @updatedAt
 }
 model Event {
-  id          Int          @id @default(autoincrement())
-  images      EventImage[]
-  videos      EventVideo[]
-  preferrers  Like[]
-  url         String?
-  dueDate     DateTime
-  bannerImage String
-  tags        Tag[]
-  views       View[]
-  isOnList    Boolean
-  title       String
-  bannerText  String?
-  mainImage   String
-  createdAt   DateTime     @default(now())
-  updatedAt   DateTime     @default(now()) @updatedAt
+  id             Int                  @id @default(autoincrement())
+  images         EventImage[]
+  videos         EventVideo[]
+  preferrers     Like[]
+  url            String?
+  dueDate        DateTime
+  bannerImage    String
+  tags           Tag[]
+  views          View[]
+  isOnList       Boolean
+  title          String
+  bannerText     String?
+  contentsImages EventContentsImage[]
+  createdAt      DateTime             @default(now())
+  updatedAt      DateTime             @default(now()) @updatedAt
 }
 model EventImage {
   id        Int      @id @default(autoincrement())
@@ -208,8 +208,18 @@
   createdAt DateTime @default(now())
   updatedAt DateTime @default(now()) @updatedAt
 }
+model EventContentsImage {
+  id        Int      @id @default(autoincrement())
+  eventId   Int?
+  Event     Event?   @relation(fields: [eventId], references: [id])
+  url       String
+  order     Int
+  createdAt DateTime @default(now())
+  updatedAt DateTime @default(now()) @updatedAt
+}
+
 enum Category {
   Location
   ProductClass
   Style
```


