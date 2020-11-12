import { intArg, mutationField } from "@nexus/schema";

export const deletePostList = mutationField("deletePostList", {
  type: "Boolean",
  args: {
    postIds: intArg({ required: true, list: true }),
  },
  nullable: false,
  resolve: async (_, args, ctx) => {
    try {
      const { postIds = [] } = args;
      let deleteQuery;
      let PostIds = [];

      for (const id of postIds) {
        if (id) {
          PostIds.push(id);
        }
      }

      deleteQuery = await ctx.prisma.postExternalLink.deleteMany({
        where: { postId: { in: PostIds } },
      });
      deleteQuery = await ctx.prisma.postImage.deleteMany({
        where: { postId: { in: PostIds } },
      });
      deleteQuery = await ctx.prisma.postVideo.deleteMany({
        where: { postId: { in: PostIds } },
      });
      deleteQuery = await ctx.prisma.like.deleteMany({
        where: { postId: { in: PostIds } },
      });
      deleteQuery = await ctx.prisma.view.deleteMany({
        where: { postId: { in: PostIds } },
      });
      let queryResult = await ctx.prisma.post.deleteMany({
        where: { id: { in: PostIds } },
      });
      if (!deleteQuery || !queryResult) return false;
      return queryResult ? true : false;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
});
