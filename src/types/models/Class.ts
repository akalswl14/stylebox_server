import { objectType } from "@nexus/schema";

export const Class = objectType({
  name: "Class",
  definition(t) {
    t.model.id();
    t.model.names();
    t.model.tags();
    t.model.category();
    t.model.createdAt();
    t.model.updatedAt();
  },
});

export const ClassName = objectType({
  name: "ClassName",
  definition(t) {
    t.model.id();
    t.model.classId();
    t.model.Class();
    t.model.lang();
    t.model.word();
    t.model.searchWord();
    t.model.createdAt();
    t.model.updatedAt();
  },
});
