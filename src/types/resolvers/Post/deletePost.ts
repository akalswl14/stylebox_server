import { intArg, mutationField } from "@nexus/schema";

export const deletePost = mutationField("deletePost", {
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
        post = await ctx.prisma.post.delete({ where: { id } });
      } catch (e) {
        console.log(e);
      }
      console.log(post);
      return post ? post : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
