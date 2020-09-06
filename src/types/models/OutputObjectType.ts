import { objectType } from "@nexus/schema";

export const AuthPayload = objectType({
  name: "AuthPayload",
  definition(t) {
    t.string("token", { nullable: true });
    t.field("user", { type: "User", nullable: true });
  },
});

export const PostThumbnail = objectType({
  name: "PostThumbnail",
  definition(t) {
    t.int("postId");
    t.string("productName");
    t.string("shopName");
    t.string("postImage", { nullable: true });
    t.int("price");
    t.boolean("isLikePost");
    t.string("locationTagName", { nullable: true });
  },
});

export const PostList = objectType({
  name: "PostList",
  definition(t) {
    t.int("totalPostNum");
    t.field("posts", { type: "PostThumbnail", list: true });
  },
});

export const ProductThumbnail = objectType({
  name: "ProductThumbnail",
  definition(t) {
    t.int("productId");
    t.string("productName");
    t.string("price");
    t.int("mainPostId", { nullable: true });
  },
});

export const PostDetail = objectType({
  name: "PostDetail",
  definition(t) {
    t.int("postId");
    t.boolean("isLikePost");
    t.field("PostDate", { type: "DateTime", nullable: true });
    t.int("price");
    t.int("shopId");
    t.string("shopName");
    t.string("shopLogoUrl", { nullable: true });
    t.string("description", { nullable: true });
    t.string("YoutubeVideoUrl", { nullable: true });
    t.int("mainProductId");
    t.string("mainProductName");
    t.field("mainProductExternalLinks", {
      type: "ExternalLink",
      list: true,
    });
    t.field("postImages", { type: "contentsThumbnail", list: true });
    t.field("tags", { type: "ClassTagDetail", list: true });
    t.field("products", { type: "ProductThumbnail", list: true });
  },
});

export const ShopThumbnail = objectType({
  name: "ShopThumbnail",
  definition(t) {
    t.int("shopId");
    t.string("shopName");
    t.string("logoUrl", { nullable: true });
    t.boolean("isLikeShop");
    t.string("styleTagName", { nullable: true });
    t.string("locationTagName", { nullable: true });
  },
});

export const ShopList = objectType({
  name: "ShopList",
  definition(t) {
    t.int("totalShopNum");
    t.field("shops", { type: "ShopThumbnail", nullable: false, list: true });
  },
});

export const ClassTagDetail = objectType({
  name: "ClassTagDetail",
  definition(t) {
    t.int("id");
    t.string("tagName");
    t.int("order");
    t.string("tagImage", { nullable: true });
    t.int("classId", { nullable: true });
    t.boolean("isClass", { nullable: true });
    t.boolean("Category", { nullable: true });
  },
});

export const ShopDetail = objectType({
  name: "ShopDetail",
  definition(t) {
    t.int("shopId");
    t.string("logoUrl", { nullable: true });
    t.string("shopName");
    t.boolean("isLikeShop");
    t.field("lastUpdateDate", { type: "DateTime", nullable: true });
    t.string("addressUrl", { nullable: true });
    t.string("description", { nullable: true });
    t.field("tags", { type: "ClassTagDetail", list: true });
    t.field("ExternalLinks", { type: "ExternalLink", list: true });
    t.field("shopImages", { type: "contentsThumbnail", list: true });
    t.field("shopVideos", { type: "contentsThumbnail", list: true });
    t.field("Branches", { type: "branchThumbnail", list: true });
  },
});

export const ExternalLink = objectType({
  name: "ExternalLink",
  definition(t) {
    t.int("id");
    t.string("url");
    t.string("linkType");
  },
});

export const contentsThumbnail = objectType({
  name: "contentsThumbnail",
  definition(t) {
    t.int("id");
    t.string("url");
    t.int("order");
  },
});

export const branchThumbnail = objectType({
  name: "branchThumbnail",
  definition(t) {
    t.string("address");
    t.int("googleMapId", { nullable: true });
  },
});

export const TagThumbnail = objectType({
  name: "TagThumbnail",
  definition(t) {
    t.int("id");
    t.string("tagName");
    t.boolean("isClass", { nullable: true });
  },
});

export const searchResultList = objectType({
  name: "searchResultList",
  definition(t) {
    t.field("lastPostDate", { type: "DateTime" });
    t.int("totalPostNum");
    t.field("tags", { type: "ClassTagDetail", list: true });
    t.field("posts", { type: "PostThumbnail", list: true });
  },
});

export const levelCategoryOption = objectType({
  name: "levelCategoryOption",
  definition(t) {
    t.int("classId");
    t.string("className");
    t.field("subTags", { type: "TagThumbnail", list: true });
  },
});

export const EventDetail = objectType({
  name: "EventDetail",
  definition(t) {
    t.string("eventTitle");
    t.string("url", { nullable: true });
    t.field("dueDate", { type: "DateTime" });
    t.field("eventImages", { type: "contentsThumbnail", list: true });
    t.field("eventVideos", { type: "contentsThumbnail", list: true });
    t.field("eventContentsImages", { type: "contentsThumbnail", list: true });
    t.field("locationTags", { type: "TagThumbnail", list: true });
  },
});

export const priorityPostList = objectType({
  name: "priorityPostList",
  definition(t) {
    t.int("lastPostPriority");
    t.field("posts", { type: "PostThumbnail", list: true });
  },
});

export const EventBanner = objectType({
  name: "EventBanner",
  definition(t) {
    t.int("eventId");
    t.string("bannerImage");
    t.int("order");
  },
});

export const EventThumbnail = objectType({
  name: "EventThumbnail",
  definition(t) {
    t.int("eventId");
    t.string("bannerImage");
    t.boolean("isLikeEvent");
    t.int("Dday");
    t.string("bannerText", { nullable: true });
  },
});

export const EventList = objectType({
  name: "EventList",
  definition(t) {
    t.int("totalEventNum");
    t.field("events", { type: "EventThumbnail", list: true });
  },
});
