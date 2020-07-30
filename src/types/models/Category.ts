import { objectType } from "@nexus/schema";

export const Category = objectType({
  name: "Category",
  definition(t) {
    t.model.id();
    t.model.tags();
    t.model.name();
    t.model.createdAt();
    t.model.updatedAt();
  },
});

export const CategoryName = objectType({
  name: "CategoryName",
  definition(t) {
    t.model.id();
    t.model.lang();
    t.model.word();
    t.model.Category();
    t.model.categoryId();
    t.model.createdAt();
    t.model.updatedAt();
  },
});
