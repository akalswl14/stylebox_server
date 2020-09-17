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
    isClass: booleanArg({ required: true }),
    isRecommendation: booleanArg({ required: true }),
  },
  nullable: true,
  description: "name argument is for TagName.",
  resolve: async (_, args, ctx) => {
    try {
      const {
        names,
        classId,
        category,
        tagImage,
        isClass,
        isRecommendation,
      } = args;
      let tag;
      tag = await ctx.prisma.tag.create({
        data: {
          Class: { connect: { id: classId } },
          names: { create: names },
          category,
          tagImage,
          isClass,
          isRecommendation,
        },
      });
      return tag;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
