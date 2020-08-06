import { objectType } from "@nexus/schema";

export const Shop = objectType({
  name: "Shop",
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.discription();
    t.model.images();
    t.model.products();
    t.model.wishers();
    t.model.wishersCnt();
    t.model.coordinate();
    t.model.address();
    t.model.tags();
    t.model.logoUrl();
    t.model.city();
    t.model.createdAt();
    t.model.updatedAt();
  },
});

export const ShopImage = objectType({
  name: "ShopImage",
  definition(t) {
    t.model.id();
    t.model.url();
    t.model.order();
    t.model.Shop();
    t.model.shopId();
    t.model.createdAt();
    t.model.updatedAt();
  },
});

export const ShopName = objectType({
  name: "ShopName",
  definition(t) {
    t.model.id();
    t.model.lang();
    t.model.word();
    t.model.Shop();
    t.model.shopId();
    t.model.createdAt();
    t.model.updatedAt();
  },
});
