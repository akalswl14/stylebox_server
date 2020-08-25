import { mutationField, arg, intArg } from "@nexus/schema";

export const createTag = mutationField("createTag", {
  type: "Tag",
  args: {
    classId: intArg({ required: true }),
    names: arg({ type: "NameInputType", list: true, required: true }),
    category: arg({ type: "Category", nullable: true }),
    orderInPopular: intArg({ required: false }),
    orderInRecommend: intArg({ required: false }),
  },
  nullable: true,
  description: "name argument is for TagName.",
  resolve: async (_, args, ctx) => {
    try {
      const {
        names,
        classId,
        category,
        orderInPopular = 0,
        orderInRecommend = 0,
      } = args;
      let tag;
      tag = await ctx.prisma.tag.create({
        data: {
          Class: { connect: { id: classId } },
          names: { create: names },
          category,
          orderInPopular,
          orderInRecommend,
        },
      });
      return tag;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
