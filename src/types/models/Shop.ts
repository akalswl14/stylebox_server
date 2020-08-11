import { objectType } from "@nexus/schema";

export const Shop = objectType({
  name: "Shop",
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.logoUrl();
    t.model.discription();
    t.model.images();
    t.model.videos();
    t.model.phoneNumber();
    t.model.products();
    t.model.preferrers();
    t.model.preferrersCnt();
    t.model.viewCnt();
    t.model.coordinate();
    t.model.address();
    t.model.tags();
    t.model.popularity();
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
    t.model.createdAt();
    t.model.updatedAt();
  },
});
