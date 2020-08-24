import { objectType } from "@nexus/schema";

export const User = objectType({
  name: "User",
  definition(t) {
    t.model.id();
    t.model.views();
    t.model.likes();
    t.model.createdAt();
    t.model.updatedAt();
  },
});
