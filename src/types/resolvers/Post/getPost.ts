import { intArg, queryField } from "@nexus/schema";

export const getPost = queryField("getPost", {
  type: "Post",
  args: {
    id: intArg({ required: true }),
  },
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const { id } = args;
      let post;
      try {
        if (id) {
          post = await ctx.prisma.post.findOne({
            where: { id },
          });
        }
      } catch (e) {
        console.log(e);
      }
      return post ? post : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
