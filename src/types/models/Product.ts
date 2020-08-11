import { objectType } from "@nexus/schema";

export const Product = objectType({
  name: "Product",
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.image();
    t.model.preferrers();
    t.model.preferrersCnt();
    t.model.viewCnt();
    t.model.shops();
    t.model.tags();
    t.model.posts();
    t.model.description();
    t.model.instaText();
    t.model.price();
    t.model.createdAt();
    t.model.updatedAt();
  },
});

export const ProductName = objectType({
  name: "ProductName",
  definition(t) {
    t.model.id();
    t.model.productId();
    t.model.Product();
    t.model.lang();
    t.model.word();
    t.model.createdAt();
    t.model.updatedAt();
  },
});

export const ProductImage = objectType({
  name: "ProductImage",
  definition(t) {
    t.model.id();
    t.model.productId();
    t.model.Product();
    t.model.url();
    t.model.order();
    t.model.createdAt();
    t.model.updatedAt();
  },
});
