import { objectType } from "@nexus/schema";

export const Product = objectType({
  name: "Product",
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.image();
    t.model.wishers();
    t.model.wishersCnt();
    t.model.Shop();
    t.model.shopId();
    t.model.tags();
    t.model.createdAt();
    t.model.updatedAt();
    t.model.description();
    t.model.instaText();
  },
});

export const ProductName = objectType({
  name: "ProductName",
  definition(t) {
    t.model.id();
    t.model.lang();
    t.model.word();
    t.model.Product();
    t.model.productId();
    t.model.createdAt();
    t.model.updatedAt();
  },
});

export const ProductImage = objectType({
  name: "ProductImage",
  definition(t) {
    t.model.id();
    t.model.url();
    t.model.order();
    t.model.Product();
    t.model.productId();
    t.model.createdAt();
    t.model.updatedAt();
  },
});
