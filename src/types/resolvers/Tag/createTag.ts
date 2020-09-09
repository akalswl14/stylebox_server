import {
  mutationField,
  arg,
  intArg,
  stringArg,
  booleanArg,
} from "@nexus/schema";

export const createTag = mutationField("createTag", {
  type: "Tag",
  args: {
    classId: intArg({ required: true }),
    names: arg({ type: "NameInputType", list: true, required: true }),
    category: arg({ type: "Category", nullable: true }),
    tagImage: stringArg({ nullable: true }),
    isOnOption: booleanArg({ required: true }),
    isClass: booleanArg({ required: true }),
  },
  nullable: true,
  description: "name argument is for TagName.",
  resolve: async (_, args, ctx) => {
    try {
      const { names, classId, category, tagImage, isOnOption, isClass } = args;
      let tag;
      tag = await ctx.prisma.tag.create({
        data: {
          Class: { connect: { id: classId } },
          names: { create: names },
          category,
          tagImage,
          isOnOption,
          isClass,
        },
      });
      return tag;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
