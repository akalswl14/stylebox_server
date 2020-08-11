import { objectType } from "@nexus/schema";

export const Class = objectType({
  name: "Class",
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.tags();
    t.model.category();
    t.model.createdAt();
    t.model.updatedAt();
  },
});

export const CategoryName = objectType({
  name: "CategoryName",
  definition(t) {
    t.model.id();
    t.model.classId();
    t.model.Class();
    t.model.lang();
    t.model.word();
    t.model.createdAt();
    t.model.updatedAt();
  },
});
