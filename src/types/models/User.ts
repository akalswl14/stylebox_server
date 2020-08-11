import { objectType } from "@nexus/schema";

export const User = objectType({
  name: "User",
  definition(t) {
    t.model.id();
    t.model.likeContents();
    t.model.likeShops();
    t.model.likeEvents;
    t.model.createdAt();
    t.model.updatedAt();
  },
});
