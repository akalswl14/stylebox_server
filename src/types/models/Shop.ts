import { objectType } from "@nexus/schema";

export const Shop = objectType({
  name: "Shop",
  definition(t) {
    t.model.id();
    t.model.names();
    t.model.branches();
    t.model.externalLinks();
    t.model.logoUrl();
    t.model.description();
    t.model.images();
    t.model.videos();
    t.model.phoneNumber();
    t.model.preferrers();
    t.model.tags();
    t.model.posts();
    t.model.views();
    t.model.monthlyRankScore();
    t.model.priority();
    t.model.onDetailTagId();
    t.model.externalLinkClickNum();
    t.model.monthlyRankNum();
    t.model.createdAt();
    t.model.updatedAt();
  },
});

export const ShopName = objectType({
  name: "ShopName",
  definition(t) {
    t.model.id();
    t.model.shopId();
    t.model.Shop();
    t.model.lang();
    t.model.word();
    t.model.createdAt();
    t.model.updatedAt();
  },
});

export const ShopImage = objectType({
  name: "ShopImage",
  definition(t) {
    t.model.id();
    t.model.shopId();
    t.model.Shop();
    t.model.url();
    t.model.order();
    t.model.createdAt();
    t.model.updatedAt();
  },
});

export const ShopVideo = objectType({
  name: "ShopVideo",
  definition(t) {
    t.model.id();
    t.model.shopId();
    t.model.Shop();
    t.model.url();
    t.model.order();
    t.model.isYoutube();
    t.model.createdAt();
    t.model.updatedAt();
  },
});

export const ShopExternalLink = objectType({
  name: "ShopExternalLink",
  definition(t) {
    t.model.id();
    t.model.url();
    t.model.linkType();
    t.model.shopId();
    t.model.Shop();
    t.model.order();
    t.model.onBottom();
    t.model.isShown();
    t.model.createdAt();
    t.model.updatedAt();
  },
});
