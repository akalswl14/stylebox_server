import { intArg, queryField } from "@nexus/schema";

export const getAllPost = queryField("getAllPost", {
  type: "Post",
  args: {
    id: intArg({ nullable: true }),
  },
  nullable: true,
  list: true,
  resolve: async (_, args, ctx) => {
    try {
      const { id } = args;
      let posts;
      try {
        if (id) {
          posts = await ctx.prisma.post.findMany({
            orderBy: { createdAt: "desc" },
            take: 4,
            cursor: { id },
            skip: 1,
          });
        } else {
          posts = await ctx.prisma.post.findMany({
            orderBy: { createdAt: "desc" },
            take: 4,
          });
        }
        return posts;
      } catch (e) {
        console.log(e);
      }
      if (posts) {
        return posts;
      } else {
        return null;
      }
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
