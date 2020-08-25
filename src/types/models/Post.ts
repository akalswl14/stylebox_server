import { objectType } from "@nexus/schema";

export const Post = objectType({
  name: "Post",
  definition(t) {
    t.model.id();
    t.model.shopId();
    t.model.Shop();
    t.model.title();
    t.model.text();
    t.model.images();
    t.model.preferrers();
    t.model.weeklyRankScore();
    t.model.lifeTimeRankScore();
    t.model.monthlyRankScore();
    t.model.publisher();
    t.model.products();
    t.model.tags();
    t.model.videos();
    t.model.mainProductId();
    t.model.mainProductPrice();
    t.model.views();
    t.model.priority();
    t.model.createdAt();
    t.model.updatedAt();
  },
});

export const PostImage = objectType({
  name: "PostImage",
  definition(t) {
    t.model.id();
    t.model.postId();
    t.model.Post();
    t.model.url();
    t.model.order();
    t.model.createdAt();
    t.model.updatedAt();
  },
});

export const PostVideo = objectType({
  name: "PostVideo",
  definition(t) {
    t.model.id();
    t.model.postId();
    t.model.Post();
    t.model.url();
    t.model.order();
    t.model.isYoutube();
    t.model.createdAt();
    t.model.updatedAt();
  },
});
