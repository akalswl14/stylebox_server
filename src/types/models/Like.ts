import { objectType } from "@nexus/schema";

export const Like = objectType({
  name: "Like",
  definition(t) {
    t.model.id();
    t.model.postId();
    t.model.productId();
    t.model.userId();
    t.model.eventId();
    t.model.shopId();
    t.model.Post();
    t.model.Product();
    t.model.User();
    t.model.Event();
    t.model.Shop();
    t.model.createdAt();
    t.model.updatedAt();
  },
});
