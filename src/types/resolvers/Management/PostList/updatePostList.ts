import { arg, mutationField } from "@nexus/schema";

export const updatePostList = mutationField("updatePostList", {
  type: "Boolean",
  args: {
    posts: arg({ type: "IdPriorityInputType", list: true, required: true }),
  },
  nullable: false,
  resolve: async (_, args, ctx) => {
    try {
      const { posts = [] } = args;
      let updateQuery;

      for (const post of posts) {
        if (post) {
          updateQuery = await ctx.prisma.post.update({
            where: { id: post.id },
            data: { priority: post.priority },
          });
        }
      }

      if (!updateQuery) return false;
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
});
