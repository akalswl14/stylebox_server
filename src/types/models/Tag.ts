import { objectType } from "@nexus/schema";

export const Tag = objectType({
  name: "Tag",
  definition(t) {
    t.model.id();
    t.model.classId();
    t.model.Class();
    t.model.name();
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
    t.model.tagId();
    t.model.Tag();
    t.model.lang();
    t.model.word();
    t.model.createdAt();
    t.model.updatedAt();
  },
});
