import { mutationField, arg, intArg } from "@nexus/schema";

export const createTag = mutationField("createTag", {
  type: "Tag",
  args: {
    name: arg({ type: "NameInputType", list: true, required: true }),
    categoryId: intArg({ nullable: true }),
  },
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const { name, categoryId } = args;
      let tag;
      if (categoryId) {
        tag = await ctx.prisma.tag.create({
          data: { Category: { connect: { id: categoryId } } },
        });
      } else {
        tag = await ctx.prisma.tag.create({
          data: {},
        });
      }
      if (tag) {
        const tagId = tag.id;
        name.forEach(async (eachName) => {
          await ctx.prisma.tagName.create({
            data: {
              lang: eachName.lang,
              word: eachName.word,
              Tag: { connect: { id: tagId } },
            },
          });
        });
        tag = ctx.prisma.tag.findOne({ where: { id: tag.id } });
      }
      return tag;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
