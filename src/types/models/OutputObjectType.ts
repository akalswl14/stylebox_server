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
    t.int("price", { nullable: true });
    t.boolean("isLikePost");
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
    t.field("productExternalLink", {
      type: "ExternalLink",
      list: true,
    });
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
    t.field("postExternalLinks", {
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
    t.string("tagNames", { nullable: true, list: true });
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
    t.field("Category", { type: "Category", nullable: true });
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
    t.string("description", { nullable: true });
    t.field("tags", { type: "ClassTagDetail", list: true });
    t.field("TopExternalLinks", { type: "ExternalLink", list: true });
    t.field("BottomExternalLinks", { type: "ExternalLink", list: true });
    t.field("shopImages", { type: "contentsThumbnail", list: true });
    t.field("shopVideos", { type: "contentsThumbnail", list: true });
    t.field("Branches", { type: "branchThumbnail", list: true });
  },
});

export const ExternalLink = objectType({
  name: "ExternalLink",
  definition(t) {
    t.int("id");
    t.int("order");
    t.string("url");
    t.field("linkType", { type: "LinkType" });
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
    t.int("googleMapUrl", { nullable: true });
  },
});

export const TagThumbnail = objectType({
  name: "TagThumbnail",
  definition(t) {
    t.int("id");
    t.string("tagName");
    t.int("order");
    t.boolean("isClass", { nullable: true });
  },
});

export const searchResultList = objectType({
  name: "searchResultList",
  definition(t) {
    t.field("lastPostDate", { type: "DateTime", nullable: true });
    t.int("totalPostNum");
    t.field("tags", { type: "TagIdThumbnail", list: true });
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
    t.field("detailTags", { type: "TagThumbnail", list: true });
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
    t.string("title", { nullable: true });
  },
});

export const EventThumbnail = objectType({
  name: "EventThumbnail",
  definition(t) {
    t.int("eventId");
    t.string("bannerImage");
    t.boolean("isLikeEvent");
    t.int("Dday");
  },
});

export const EventList = objectType({
  name: "EventList",
  definition(t) {
    t.int("totalEventNum");
    t.field("events", { type: "EventThumbnail", list: true });
  },
});

export const TagIdThumbnail = objectType({
  name: "TagIdThumbnail",
  definition(t) {
    t.int("tagId");
    t.int("classId", { nullable: true });
    t.string("category");
    t.boolean("isClass");
  },
});

export const ShopAndBranch = objectType({
  name: "ShopAndBranch",
  definition(t) {
    t.field("shop", { type: "Shop" });
    t.field("branch", { type: "Branch", list: true });
  },
});

export const DashboardBasicStatus = objectType({
  name: "DashboardBasicStatus",
  definition(t) {
    t.int("ShopNum");
    t.int("UserNum");
    t.int("PostNum");
    t.int("ProductNum");
    t.int("AvgShopLikeNum");
    t.int("AvgPostLikeNum");
    t.int("AvgEventLikeNum");
    t.int("AvgShopViewNum");
    t.int("AvgPostViewNum");
    t.int("AvgEventViewNum");
    t.int("TotalShopLikeNum");
    t.int("TotalPostLikeNum");
    t.int("TotalEventLikeNum");
    t.int("TotalShopViewNum");
    t.int("TotalPostViewNum");
    t.int("TotalEventViewNum");
  },
});

export const ShopManagementThumbnail = objectType({
  name: "ShopManagementThumbnail",
  definition(t) {
    t.int("No", { nullable: true });
    t.int("shopId");
    t.string("shopName");
    t.string("phoneNumber");
    t.string("address");
    t.string("tagNames", { list: true });
    t.int("rankNum");
    t.int("weight");
    t.int("postNum");
    t.int("productNum");
    t.int("likeNum");
    t.int("viewNum");
  },
});

export const PostManagementThumbnail = objectType({
  name: "PostManagementThumbnail",
  definition(t) {
    t.int("No", { nullable: true });
    t.int("postId");
    t.string("mainProductName");
    t.int("price");
    t.int("shopId");
    t.int("priority");
    t.string("tagNames", { list: true });
    t.int("subProductNum");
    t.int("rankNum");
    t.int("likeNum");
    t.int("viewNum");
  },
});

export const TagManagementThumbnail = objectType({
  name: "TagManagementThumbnail",
  definition(t) {
    t.int("tagId");
    t.string("tagName", { nullable: true });
    t.int("classId", { nullable: true });
    t.string("className", { nullable: true });
    t.field("category", { type: "Category", nullable: true });
    t.int("order", { nullable: true });
  },
});

export const idNameThumbnail = objectType({
  name: "idNameThumbnail",
  definition(t) {
    t.int("id");
    t.string("name");
  },
});

export const eventSearchResult = objectType({
  name: "eventSearchResult",
  definition(t) {
    t.int("id");
    t.string("bannerImage");
    t.string("title");
  },
});
