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
    t.field("postImages", { type: "PostImage", nullable: true, list: true });
    t.string("locationTag", { list: true, nullable: true });
    t.string("shopName", { nullable: true });
    t.string("mainProductName", { nullable: true });
    t.int("price", { nullable: true });
    t.boolean("likeStatus", { nullable: true });
  },
});

export const PostList = objectType({
  name: "PostList",
  definition(t) {
    t.field("posts", { type: "PostThumbnail", list: true });
    t.int("postNum");
  },
});

export const idValueObject = objectType({
  name: "idValueObject",
  definition(t) {
    t.int("id");
    t.string("value");
    t.int("order");
  },
});

export const ProductInPost = objectType({
  name: "ProductInPost",
  definition(t) {
    t.int("id");
    t.string("name");
    t.string("price");
    t.boolean("isOwnlPost");
  },
});

export const PostDetail = objectType({
  name: "PostDetail",
  definition(t) {
    t.int("id");
    t.field("postImages", { type: "PostImage", nullable: true, list: true });
    t.field("postVideos", { type: "PostVideo", nullable: true, list: true });
    t.boolean("likeStatus", { nullable: true });
    t.int("likeNum", { nullable: true });
    t.string("postDate", { nullable: true });
    t.field("shop", { type: "idValueObject", nullable: true, list: true });
    t.field("mainProduct", { type: "ProductInPost", nullable: true });
    t.field("styleTag", { type: "idValueObject", nullable: true, list: true });
    t.string("locationTag", { list: true, nullable: true });
    t.field("mainProductLinks", {
      type: "ProductExternalLink",
      nullable: true,
      list: true,
    });
    t.string("mainProductDescription", { nullable: true, list: true });
    t.field("products", { type: "ProductInPost", nullable: true, list: true });
  },
});
