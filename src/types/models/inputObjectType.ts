import { inputObjectType } from "@nexus/schema";

export const branchInputType = inputObjectType({
  name: "branchInputType",
  definition(t) {
    t.field("branchNames", { type: NameInputType, list: true, required: true });
    t.string("branchPhoneNumbers", { required: true, list: true });
    t.string("branchAddress", { required: true });
    t.string("branchGoogleMapUrl", { required: true });
  },
});

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
    t.field("linkType", { type: "LinkType", required: true });
  },
});

export const ShopLinkInputType = inputObjectType({
  name: "ShopLinkInputType",
  definition(t) {
    t.string("url", { required: true });
    t.field("linkType", { type: "LinkType", required: true });
    t.boolean("isOnBottom", { required: true });
    t.int("order", { required: true });
  },
});

export const TagClassIdInputType = inputObjectType({
  name: "TagClassIdInputType",
  definition(t) {
    t.int("tagId");
    t.int("classId", { nullable: true });
    t.boolean("isClass");
  },
});

export const TagOrderInputType = inputObjectType({
  name: "TagOrderInputType",
  definition(t) {
    t.int("tagId");
    t.int("order");
  },
});
