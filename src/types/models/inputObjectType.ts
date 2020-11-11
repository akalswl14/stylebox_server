import { inputObjectType } from "@nexus/schema";

export const branchInputType = inputObjectType({
  name: "branchInputType",
  definition(t) {
    t.string("branchName", { required: true });
    t.string("branchPhoneNumber", { required: true });
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
    t.boolean("isShown", { nullable: true });
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

export const IdOrderInputType = inputObjectType({
  name: "IdOrderInputType",
  definition(t) {
    t.int("id");
    t.int("order");
  },
});

export const PopularTagInputType = inputObjectType({
  name: "PopularTagInputType",
  definition(t) {
    t.int("order", { required: true });
    t.int("tagId", { required: true });
  },
});

export const QuestionInputType = inputObjectType({
  name: "QuestionInputType",
  definition(t) {
    t.int("order");
    t.string("questionType");
  },
});

export const IdValueInputType = inputObjectType({
  name: "IdValueInputType",
  definition(t) {
    t.int("id");
    t.int("value");
  },
});

export const EventListInputType = inputObjectType({
  name: "EventListInputType",
  definition(t) {
    t.int("eventId", { required: true });
    t.field("eventStart", { type: "DateTime", nullable: true });
    t.field("eventEnd", { type: "DateTime", nullable: true });
    t.boolean("isOnList", { nullable: true });
  },
});

export const IdPriorityInputType = inputObjectType({
  name: "IdPriorityInputType",
  definition(t) {
    t.int("id", { required: true });
    t.int("priority", { required: true });
  },
});

export const branchUpdateInputType = inputObjectType({
  name: "branchUpdateInputType",
  definition(t) {
    t.int("id", { nullable: true });
    t.string("branchName", { nullable: true });
    t.string("branchPhoneNumber", { nullable: true });
    t.string("branchAddress", { nullable: true });
    t.string("branchGoogleMapUrl", { nullable: true });
  },
});

export const ProductListInputType = inputObjectType({
  name: "ProductListInputType",
  definition(t) {
    t.int("id", { required: true });
    t.int("price", { required: true });
  },
});
