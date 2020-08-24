import { intArg, queryField, arg } from "@nexus/schema";

export const getAllPostbyTag = queryField("getAllPostbyTag", {
  type: "Post",
  args: {
    tags: arg({ type: "idDicInputType", list: true, required: true }),
    id: intArg({ nullable: true }),
  },
  nullable: true,
  list: true,
  description: "id argument is for cursor.",
  resolve: async (_, args, ctx) => {
    try {
      const skip = 1,
        take = 4;
      const { tags, id } = args;
      let posts;
      if (id) {
        posts = await ctx.prisma.post.findMany({
          where: { tags: { some: { OR: tags } } },
          orderBy: { createdAt: "desc" },
          take: take,
          cursor: { id },
          skip: skip,
        });
      } else {
        posts = await ctx.prisma.post.findMany({
          where: { tags: { some: { OR: tags } } },
          orderBy: { createdAt: "desc" },
          take: take,
        });
      }
      return posts;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
