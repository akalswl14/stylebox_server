import { inputObjectType } from "@nexus/schema";

export const productNameInputType = inputObjectType({
  name: "productNameInputType",
  definition(t) {
    t.string("word", { required: true });
    t.string("lang", { required: true });
  },
});

export const productImageInputType = inputObjectType({
  name: "productImageInputType",
  definition(t) {
    t.string("url", { required: true });
    t.int("order", { required: true });
  },
});

export const shopNameInputType = inputObjectType({
  name: "shopNameInputType",
  definition(t) {
    t.string("lang", { required: true });
    t.string("word", { required: true });
  },
});

export const shopImageInputType = inputObjectType({
  name: "shopImageInputType",
  definition(t) {
    t.string("url", { required: true });
    t.int("order", { required: true });
  },
});

export const tagNameInputType = inputObjectType({
  name: "tagNameInputType",
  definition(t) {
    t.string("word", { required: true });
    t.string("lang", { required: true });
  },
});

export const eventContentsInputType = inputObjectType({
  name: "eventContentsInputType",
  definition(t) {
    t.string("url", { required: true });
    t.int("order", { required: true });
  },
});
