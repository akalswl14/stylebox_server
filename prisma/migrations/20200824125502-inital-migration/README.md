# Migration `20200824125502-inital-migration`

This migration has been generated at 8/24/2020, 12:55:02 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "public"."User" (
"id" SERIAL,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id"))

CREATE TABLE "public"."Product" (
"id" SERIAL,
"description" text   ,
"instaText" text   ,
"price" integer   ,
"isOwnPost" boolean   ,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id"))

CREATE TABLE "public"."ProductName" (
"id" SERIAL,
"productId" integer   ,
"lang" text  NOT NULL ,
"word" text  NOT NULL ,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id"))

CREATE TABLE "public"."ProductImage" (
"id" SERIAL,
"productId" integer   ,
"url" text  NOT NULL ,
"order" integer  NOT NULL ,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id"))

CREATE TABLE "public"."ProductVideo" (
"id" SERIAL,
"productId" integer   ,
"url" text  NOT NULL ,
"order" integer  NOT NULL ,
"isYoutube" boolean  NOT NULL ,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id"))

CREATE TABLE "public"."ProductExternalLink" (
"id" SERIAL,
"url" text  NOT NULL ,
"order" integer  NOT NULL ,
"linkType" text  NOT NULL ,
"productId" integer   ,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id"))

CREATE TABLE "public"."Shop" (
"id" SERIAL,
"logoUrl" text   ,
"description" text   ,
"phoneNumber" text []  ,
"weeklyRankScore" Decimal(65,30)   ,
"monthlyRankScore" Decimal(65,30)   ,
"lifeTimeRankScore" Decimal(65,30)   ,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id"))

CREATE TABLE "public"."ShopName" (
"id" SERIAL,
"shopId" integer   ,
"lang" text  NOT NULL ,
"word" text  NOT NULL ,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id"))

CREATE TABLE "public"."ShopImage" (
"id" SERIAL,
"shopId" integer   ,
"url" text  NOT NULL ,
"order" integer  NOT NULL ,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id"))

CREATE TABLE "public"."ShopVideo" (
"id" SERIAL,
"shopId" integer   ,
"url" text  NOT NULL ,
"order" integer  NOT NULL ,
"isYoutube" boolean  NOT NULL ,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id"))

CREATE TABLE "public"."ShopExternalLink" (
"id" SERIAL,
"url" text  NOT NULL ,
"order" integer  NOT NULL ,
"linkType" text  NOT NULL ,
"shopId" integer   ,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id"))

CREATE TABLE "public"."Branch" (
"id" SERIAL,
"shopId" integer   ,
"logoUrl" text   ,
"phoneNumbers" text []  ,
"address" text []  ,
"googleMapId" integer   ,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id"))

CREATE TABLE "public"."BranchName" (
"id" SERIAL,
"branchId" integer   ,
"lang" text  NOT NULL ,
"word" text  NOT NULL ,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id"))

CREATE TABLE "public"."Event" (
"id" SERIAL,
"viewCnt" integer   ,
"url" text   ,
"dueDate" timestamp(3)  NOT NULL ,
"bannerImage" text  NOT NULL ,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id"))

CREATE TABLE "public"."EventImage" (
"id" SERIAL,
"eventId" integer   ,
"url" text  NOT NULL ,
"order" integer  NOT NULL ,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id"))

CREATE TABLE "public"."EventVideo" (
"id" SERIAL,
"eventId" integer   ,
"url" text  NOT NULL ,
"order" integer  NOT NULL ,
"isYoutube" boolean  NOT NULL ,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id"))

CREATE TABLE "public"."Class" (
"id" SERIAL,
"category" "Category" NOT NULL ,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id"))

CREATE TABLE "public"."ClassName" (
"id" SERIAL,
"classId" integer   ,
"lang" text  NOT NULL ,
"word" text  NOT NULL ,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id"))

CREATE TABLE "public"."Tag" (
"id" SERIAL,
"classId" integer  NOT NULL ,
"category" "Category"  ,
"orderInPopular" integer   ,
"orderInRecommend" integer   ,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id"))

CREATE TABLE "public"."TagName" (
"id" SERIAL,
"tagId" integer   ,
"lang" text  NOT NULL ,
"word" text  NOT NULL ,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id"))

CREATE TABLE "public"."Post" (
"id" SERIAL,
"shopId" integer   ,
"title" text   ,
"text" text   ,
"weeklyRankScore" Decimal(65,30)   ,
"lifeTimeRankScore" Decimal(65,30)   ,
"monthlyRankScore" Decimal(65,30)   ,
"publisher" text   ,
"mainProductId" integer   ,
"mainProductPrice" integer   ,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id"))

CREATE TABLE "public"."PostImage" (
"id" SERIAL,
"postId" integer   ,
"url" text  NOT NULL ,
"order" integer  NOT NULL ,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id"))

CREATE TABLE "public"."PostVideo" (
"id" SERIAL,
"postId" integer   ,
"url" text  NOT NULL ,
"order" integer  NOT NULL ,
"isYoutube" boolean  NOT NULL ,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id"))

CREATE TABLE "public"."View" (
"id" SERIAL,
"userId" integer   ,
"shopId" integer   ,
"postId" integer   ,
"eventId" integer   ,
"productId" integer   ,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id"))

CREATE TABLE "public"."Like" (
"id" SERIAL,
"postId" integer   ,
"productId" integer   ,
"userId" integer   ,
"eventId" integer   ,
"shopId" integer   ,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id"))

CREATE TABLE "public"."_BranchToProduct" (
"A" integer  NOT NULL ,
"B" integer  NOT NULL )

CREATE TABLE "public"."_ProductToTag" (
"A" integer  NOT NULL ,
"B" integer  NOT NULL )

CREATE TABLE "public"."_PostToProduct" (
"A" integer  NOT NULL ,
"B" integer  NOT NULL )

CREATE TABLE "public"."_ShopToTag" (
"A" integer  NOT NULL ,
"B" integer  NOT NULL )

CREATE TABLE "public"."_BranchToTag" (
"A" integer  NOT NULL ,
"B" integer  NOT NULL )

CREATE TABLE "public"."_EventToTag" (
"A" integer  NOT NULL ,
"B" integer  NOT NULL )

CREATE TABLE "public"."_PostToTag" (
"A" integer  NOT NULL ,
"B" integer  NOT NULL )

CREATE UNIQUE INDEX "_BranchToProduct_AB_unique" ON "public"."_BranchToProduct"("A","B")

CREATE  INDEX "_BranchToProduct_B_index" ON "public"."_BranchToProduct"("B")

CREATE UNIQUE INDEX "_ProductToTag_AB_unique" ON "public"."_ProductToTag"("A","B")

CREATE  INDEX "_ProductToTag_B_index" ON "public"."_ProductToTag"("B")

CREATE UNIQUE INDEX "_PostToProduct_AB_unique" ON "public"."_PostToProduct"("A","B")

CREATE  INDEX "_PostToProduct_B_index" ON "public"."_PostToProduct"("B")

CREATE UNIQUE INDEX "_ShopToTag_AB_unique" ON "public"."_ShopToTag"("A","B")

CREATE  INDEX "_ShopToTag_B_index" ON "public"."_ShopToTag"("B")

CREATE UNIQUE INDEX "_BranchToTag_AB_unique" ON "public"."_BranchToTag"("A","B")

CREATE  INDEX "_BranchToTag_B_index" ON "public"."_BranchToTag"("B")

CREATE UNIQUE INDEX "_EventToTag_AB_unique" ON "public"."_EventToTag"("A","B")

CREATE  INDEX "_EventToTag_B_index" ON "public"."_EventToTag"("B")

CREATE UNIQUE INDEX "_PostToTag_AB_unique" ON "public"."_PostToTag"("A","B")

CREATE  INDEX "_PostToTag_B_index" ON "public"."_PostToTag"("B")

ALTER TABLE "public"."ProductName" ADD FOREIGN KEY ("productId")REFERENCES "public"."Product"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."ProductImage" ADD FOREIGN KEY ("productId")REFERENCES "public"."Product"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."ProductVideo" ADD FOREIGN KEY ("productId")REFERENCES "public"."Product"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."ProductExternalLink" ADD FOREIGN KEY ("productId")REFERENCES "public"."Product"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."ShopName" ADD FOREIGN KEY ("shopId")REFERENCES "public"."Shop"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."ShopImage" ADD FOREIGN KEY ("shopId")REFERENCES "public"."Shop"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."ShopVideo" ADD FOREIGN KEY ("shopId")REFERENCES "public"."Shop"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."ShopExternalLink" ADD FOREIGN KEY ("shopId")REFERENCES "public"."Shop"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."Branch" ADD FOREIGN KEY ("shopId")REFERENCES "public"."Shop"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."BranchName" ADD FOREIGN KEY ("branchId")REFERENCES "public"."Branch"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."EventImage" ADD FOREIGN KEY ("eventId")REFERENCES "public"."Event"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."EventVideo" ADD FOREIGN KEY ("eventId")REFERENCES "public"."Event"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."ClassName" ADD FOREIGN KEY ("classId")REFERENCES "public"."Class"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."Tag" ADD FOREIGN KEY ("classId")REFERENCES "public"."Class"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."TagName" ADD FOREIGN KEY ("tagId")REFERENCES "public"."Tag"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."Post" ADD FOREIGN KEY ("shopId")REFERENCES "public"."Shop"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."PostImage" ADD FOREIGN KEY ("postId")REFERENCES "public"."Post"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."PostVideo" ADD FOREIGN KEY ("postId")REFERENCES "public"."Post"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."View" ADD FOREIGN KEY ("userId")REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."View" ADD FOREIGN KEY ("shopId")REFERENCES "public"."Shop"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."View" ADD FOREIGN KEY ("postId")REFERENCES "public"."Post"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."View" ADD FOREIGN KEY ("eventId")REFERENCES "public"."Event"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."View" ADD FOREIGN KEY ("productId")REFERENCES "public"."Product"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."Like" ADD FOREIGN KEY ("postId")REFERENCES "public"."Post"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."Like" ADD FOREIGN KEY ("productId")REFERENCES "public"."Product"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."Like" ADD FOREIGN KEY ("userId")REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."Like" ADD FOREIGN KEY ("eventId")REFERENCES "public"."Event"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."Like" ADD FOREIGN KEY ("shopId")REFERENCES "public"."Shop"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."_BranchToProduct" ADD FOREIGN KEY ("A")REFERENCES "public"."Branch"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."_BranchToProduct" ADD FOREIGN KEY ("B")REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."_ProductToTag" ADD FOREIGN KEY ("A")REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."_ProductToTag" ADD FOREIGN KEY ("B")REFERENCES "public"."Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."_PostToProduct" ADD FOREIGN KEY ("A")REFERENCES "public"."Post"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."_PostToProduct" ADD FOREIGN KEY ("B")REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."_ShopToTag" ADD FOREIGN KEY ("A")REFERENCES "public"."Shop"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."_ShopToTag" ADD FOREIGN KEY ("B")REFERENCES "public"."Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."_BranchToTag" ADD FOREIGN KEY ("A")REFERENCES "public"."Branch"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."_BranchToTag" ADD FOREIGN KEY ("B")REFERENCES "public"."Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."_EventToTag" ADD FOREIGN KEY ("A")REFERENCES "public"."Event"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."_EventToTag" ADD FOREIGN KEY ("B")REFERENCES "public"."Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."_PostToTag" ADD FOREIGN KEY ("A")REFERENCES "public"."Post"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."_PostToTag" ADD FOREIGN KEY ("B")REFERENCES "public"."Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20200824125502-inital-migration
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,330 @@
+generator client {
+  provider = "prisma-client-js"
+}
+
+datasource db {
+  provider = "postgresql"
+  url = "***"
+}
+
+model User {
+  id        Int      @id @default(autoincrement())
+  views     View[]
+  likes     Like[]
+  createdAt DateTime @default(now())
+  updatedAt DateTime @default(now()) @updatedAt
+}
+
+model Product {
+  id            Int                   @id @default(autoincrement())
+  names         ProductName[]
+  images        ProductImage[]
+  preferrers    Like[]
+  branches      Branch[]
+  tags          Tag[]
+  posts         Post[]
+  description   String?
+  instaText     String?
+  price         Int?
+  externalLinks ProductExternalLink[]
+  videos        ProductVideo[]
+  isOwnPost     Boolean?
+  views         View[]
+  createdAt     DateTime              @default(now())
+  updatedAt     DateTime              @default(now()) @updatedAt
+}
+
+model ProductName {
+  id        Int      @id @default(autoincrement())
+  productId Int?
+  Product   Product? @relation(fields: [productId], references: [id])
+  lang      String
+  word      String
+  createdAt DateTime @default(now())
+  updatedAt DateTime @default(now()) @updatedAt
+}
+
+model ProductImage {
+  id        Int      @id @default(autoincrement())
+  productId Int?
+  Product   Product? @relation(fields: [productId], references: [id])
+  url       String
+  order     Int
+  createdAt DateTime @default(now())
+  updatedAt DateTime @default(now()) @updatedAt
+}
+
+model ProductVideo {
+  id        Int      @id @default(autoincrement())
+  productId Int?
+  Product   Product? @relation(fields: [productId], references: [id])
+  url       String
+  order     Int
+  isYoutube Boolean
+  createdAt DateTime @default(now())
+  updatedAt DateTime @default(now()) @updatedAt
+}
+
+model ProductExternalLink {
+  id        Int      @id @default(autoincrement())
+  url       String
+  order     Int
+  linkType  String
+  productId Int?
+  Product   Product? @relation(fields: [productId], references: [id])
+  createdAt DateTime @default(now())
+  updatedAt DateTime @default(now()) @updatedAt
+}
+
+model Shop {
+  id                Int                @id @default(autoincrement())
+  names             ShopName[]
+  branches          Branch[]
+  externalLinks     ShopExternalLink[]
+  logoUrl           String?
+  description       String?
+  images            ShopImage[]
+  videos            ShopVideo[]
+  phoneNumber       String[]
+  preferrers        Like[]
+  tags              Tag[]
+  posts             Post[]
+  views             View[]
+  weeklyRankScore   Float?
+  monthlyRankScore  Float?
+  lifeTimeRankScore Float?
+  createdAt         DateTime           @default(now())
+  updatedAt         DateTime           @default(now()) @updatedAt
+}
+
+model ShopName {
+  id        Int      @id @default(autoincrement())
+  shopId    Int?
+  Shop      Shop?    @relation(fields: [shopId], references: [id])
+  lang      String
+  word      String
+  createdAt DateTime @default(now())
+  updatedAt DateTime @default(now()) @updatedAt
+}
+
+model ShopImage {
+  id        Int      @id @default(autoincrement())
+  shopId    Int?
+  Shop      Shop?    @relation(fields: [shopId], references: [id])
+  url       String
+  order     Int
+  createdAt DateTime @default(now())
+  updatedAt DateTime @default(now()) @updatedAt
+}
+
+model ShopVideo {
+  id        Int      @id @default(autoincrement())
+  shopId    Int?
+  Shop      Shop?    @relation(fields: [shopId], references: [id])
+  url       String
+  order     Int
+  isYoutube Boolean
+  createdAt DateTime @default(now())
+  updatedAt DateTime @default(now()) @updatedAt
+}
+
+model ShopExternalLink {
+  id        Int      @id @default(autoincrement())
+  url       String
+  order     Int
+  linkType  String
+  shopId    Int?
+  Shop      Shop?    @relation(fields: [shopId], references: [id])
+  createdAt DateTime @default(now())
+  updatedAt DateTime @default(now()) @updatedAt
+}
+
+model Branch {
+  id           Int          @id @default(autoincrement())
+  shopId       Int?
+  Shop         Shop?        @relation(fields: [shopId], references: [id])
+  names        BranchName[]
+  logoUrl      String?
+  phoneNumbers String[]
+  products     Product[]
+  address      String[]
+  googleMapId  Int?
+  tags         Tag[]
+  createdAt    DateTime     @default(now())
+  updatedAt    DateTime     @default(now()) @updatedAt
+}
+
+model BranchName {
+  id        Int      @id @default(autoincrement())
+  branchId  Int?
+  Branch    Branch?  @relation(fields: [branchId], references: [id])
+  lang      String
+  word      String
+  createdAt DateTime @default(now())
+  updatedAt DateTime @default(now()) @updatedAt
+}
+
+model Event {
+  id          Int          @id @default(autoincrement())
+  images      EventImage[]
+  videos      EventVideo[]
+  preferrers  Like[]
+  viewCnt     Int?
+  url         String?
+  dueDate     DateTime
+  bannerImage String
+  tags        Tag[]
+  views       View[]
+  createdAt   DateTime     @default(now())
+  updatedAt   DateTime     @default(now()) @updatedAt
+}
+
+model EventImage {
+  id        Int      @id @default(autoincrement())
+  eventId   Int?
+  Event     Event?   @relation(fields: [eventId], references: [id])
+  url       String
+  order     Int
+  createdAt DateTime @default(now())
+  updatedAt DateTime @default(now()) @updatedAt
+}
+
+model EventVideo {
+  id        Int      @id @default(autoincrement())
+  eventId   Int?
+  Event     Event?   @relation(fields: [eventId], references: [id])
+  url       String
+  order     Int
+  isYoutube Boolean
+  createdAt DateTime @default(now())
+  updatedAt DateTime @default(now()) @updatedAt
+}
+
+enum Category {
+  Location
+  ProductClass
+  Style
+  Price
+  Feature
+  ShopName
+}
+
+model Class {
+  id        Int         @id @default(autoincrement())
+  names     ClassName[]
+  tags      Tag[]
+  category  Category
+  createdAt DateTime    @default(now())
+  updatedAt DateTime    @default(now()) @updatedAt
+}
+
+model ClassName {
+  id        Int      @id @default(autoincrement())
+  classId   Int?
+  Class     Class?   @relation(fields: [classId], references: [id])
+  lang      String
+  word      String
+  createdAt DateTime @default(now())
+  updatedAt DateTime @default(now()) @updatedAt
+}
+
+model Tag {
+  id               Int       @id @default(autoincrement())
+  classId          Int
+  Class            Class     @relation(fields: [classId], references: [id])
+  names            TagName[]
+  shops            Shop[]
+  branches         Branch[]
+  posts            Post[]
+  products         Product[]
+  events           Event[]
+  category         Category?
+  orderInPopular   Int?
+  orderInRecommend Int?
+  createdAt        DateTime  @default(now())
+  updatedAt        DateTime  @default(now()) @updatedAt
+}
+
+model TagName {
+  id        Int      @id @default(autoincrement())
+  tagId     Int?
+  Tag       Tag?     @relation(fields: [tagId], references: [id])
+  lang      String
+  word      String
+  createdAt DateTime @default(now())
+  updatedAt DateTime @default(now()) @updatedAt
+}
+
+model Post {
+  id                Int         @id @default(autoincrement())
+  shopId            Int?
+  Shop              Shop?       @relation(fields: [shopId], references: [id])
+  title             String?
+  text              String?
+  images            PostImage[]
+  preferrers        Like[]
+  weeklyRankScore   Float?
+  lifeTimeRankScore Float?
+  monthlyRankScore  Float?
+  publisher         String?
+  products          Product[]
+  tags              Tag[]
+  videos            PostVideo[]
+  mainProductId     Int?
+  mainProductPrice  Int?
+  views             View[]
+  createdAt         DateTime    @default(now())
+  updatedAt         DateTime    @default(now()) @updatedAt
+}
+
+model PostImage {
+  id        Int      @id @default(autoincrement())
+  postId    Int?
+  Post      Post?    @relation(fields: [postId], references: [id])
+  url       String
+  order     Int
+  createdAt DateTime @default(now())
+  updatedAt DateTime @default(now()) @updatedAt
+}
+
+model PostVideo {
+  id        Int      @id @default(autoincrement())
+  postId    Int?
+  Post      Post?    @relation(fields: [postId], references: [id])
+  url       String
+  order     Int
+  isYoutube Boolean
+  createdAt DateTime @default(now())
+  updatedAt DateTime @default(now()) @updatedAt
+}
+
+model View {
+  id        Int      @id @default(autoincrement())
+  userId    Int?
+  shopId    Int?
+  postId    Int?
+  eventId   Int?
+  productId Int?
+  User      User?    @relation(fields: [userId], references: [id])
+  Shop      Shop?    @relation(fields: [shopId], references: [id])
+  Post      Post?    @relation(fields: [postId], references: [id])
+  Event     Event?   @relation(fields: [eventId], references: [id])
+  Product   Product? @relation(fields: [productId], references: [id])
+  createdAt DateTime @default(now())
+}
+
+model Like {
+  id        Int      @id @default(autoincrement())
+  postId    Int?
+  productId Int?
+  userId    Int?
+  eventId   Int?
+  shopId    Int?
+  Post      Post?    @relation(fields: [postId], references: [id])
+  Product   Product? @relation(fields: [productId], references: [id])
+  User      User?    @relation(fields: [userId], references: [id])
+  Event     Event?   @relation(fields: [eventId], references: [id])
+  Shop      Shop?    @relation(fields: [shopId], references: [id])
+  createdAt DateTime @default(now())
+  updatedAt DateTime @default(now()) @updatedAt
+}
```


