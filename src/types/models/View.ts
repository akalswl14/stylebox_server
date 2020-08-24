import { objectType } from "@nexus/schema";

export const View = objectType({
  name: "View",
  definition(t) {
    t.model.id();
    t.model.userId();
    t.model.shopId();
    t.model.postId();
    t.model.eventId();
    t.model.productId();
    t.model.User();
    t.model.Shop();
    t.model.Post();
    t.model.Event();
    t.model.Product();
    t.model.createdAt();
  },
});
