import { objectType } from "@nexus/schema";

export const Tag = objectType({
  name: "Tag",
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.Category();
    t.model.categoryId();
    t.model.products();
    t.model.shops();
    t.model.posts();
    t.model.createdAt();
    t.model.updatedAt();
  },
});

export const TagName = objectType({
  name: "TagName",
  definition(t) {
    t.model.id();
    t.model.lang();
    t.model.word();
    t.model.Tag();
    t.model.tagId();
    t.model.createdAt();
    t.model.updatedAt();
  },
});
