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

export const VideoInputType = inputObjectType({
  name: "VideoInputType",
  definition(t) {
    t.string("url", { required: true });
    t.int("order", { required: true });
    t.boolean("isYoutube", { required: true });
  },
});

export const idDicInputType = inputObjectType({
  name: "idDicInputType",
  definition(t) {
    t.int("id", { required: true });
  },
});

export const LinkInputType = inputObjectType({
  name: "LinkInputType",
  definition(t) {
    t.string("url", { required: true });
    t.int("order", { required: true });
    t.string("linkType", { required: true });
  },
});
