import { inputObjectType } from "@nexus/schema";

export const NameInputType = inputObjectType({
  name: "NameInputType",
  definition(t) {
    t.string("word", { required: true });
    t.string("lang", { required: true });
  },
});

export const ImageInputType = inputObjectType({
  name: "ImageInputType",
  definition(t) {
    t.string("url", { required: true });
    t.int("order", { required: true });
  },
});
