import { objectType } from "@nexus/schema";

export const Post = objectType({
  name: "Post",
  definition(t) {
    t.model.id();
    t.model.text();
    t.model.title();
    t.model.publisher();
    t.model.products();
    t.model.tags();
    t.model.createdAt();
    t.model.updatedAt();
    t.model.images;
  },
});

export const PostImage = objectType({
  name: "PostImage",
  definition(t) {
    t.model.id();
    t.model.url();
    t.model.order();
    t.model.Post();
    t.model.postId();
    t.model.createdAt();
    t.model.updatedAt();
  },
});
