import { objectType } from "@nexus/schema";

export const Post = objectType({
  name: "Post",
  definition(t) {
    t.model.id();
    t.model.title();
    t.model.text();
    t.model.images();
    t.model.preferrers();
    t.model.preferrersCnt();
    t.model.viewCnt();
    t.model.publisher();
    t.model.products();
    t.model.tags();
    t.model.createdAt();
    t.model.updatedAt();
  },
});

export const PostImage = objectType({
  name: "PostImage",
  definition(t) {
    t.model.id();
    t.model.postId();
    t.model.Post();
    t.model.url();
    t.model.order();
    t.model.createdAt();
    t.model.updatedAt();
  },
});
