import { objectType } from "@nexus/schema";

export const SearchTagLog = objectType({
  name: "SearchTagLog",
  definition(t) {
    t.model.id();
    t.model.tagId();
    t.model.userId();
    t.model.Tag();
    t.model.User();
    t.model.createdAt();
  },
});
