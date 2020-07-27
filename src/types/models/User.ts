import { objectType } from "@nexus/schema";

export const User = objectType({
  name: "User",
  definition(t) {
    t.model.id();
    t.model.wishProducts();
    t.model.wishShops();
    t.model.wishEvents();
  },
});
