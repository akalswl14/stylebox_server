import { objectType } from "@nexus/schema";

export const LikeContent = objectType({
  name: "LikeContent",
  definition(t) {
    t.model.id();
    t.model.postId();
    t.model.productId();
    t.model.userId();
    t.model.Post();
    t.model.Product();
    t.model.User();
    t.model.createdAt();
    t.model.updatedAt();
  },
});

export const LikeShop = objectType({
  name: "LikeShop",
  definition(t) {
    t.model.id();
    t.model.userId();
    t.model.shopId();
    t.model.User();
    t.model.Shop();
    t.model.createdAt();
    t.model.updatedAt();
  },
});

export const LikeEvent = objectType({
  name: "LikeEvent",
  definition(t) {
    t.model.id();
    t.model.userId();
    t.model.eventId();
    t.model.User();
    t.model.Event();
    t.model.createdAt();
    t.model.updatedAt();
  },
});
