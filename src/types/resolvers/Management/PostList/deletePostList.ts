import { intArg, mutationField } from '@nexus/schema';

export const deletePostList = mutationField('deletePostList', {
  type: 'Boolean',
  args: {
    postIds: intArg({ required: true, list: true }),
  },
  nullable: false,
  resolve: async (_, args, ctx) => {
    try {
      const { postIds = [] } = args;
      let deleteQuery;

      deleteQuery = await ctx.prisma.postExternalLink.deleteMany({
        where: { postId: { in: postIds } },
      });
      deleteQuery = await ctx.prisma.postImage.deleteMany({
        where: { postId: { in: postIds } },
      });
      deleteQuery = await ctx.prisma.postVideo.deleteMany({
        where: { postId: { in: postIds } },
      });
      deleteQuery = await ctx.prisma.like.deleteMany({
        where: { postId: { in: postIds } },
      });
      deleteQuery = await ctx.prisma.view.deleteMany({
        where: { postId: { in: postIds } },
      });
      let queryResult = await ctx.prisma.post.deleteMany({
        where: { id: { in: postIds } },
      });
      if (!deleteQuery || !queryResult) return false;
      return queryResult ? true : false;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
});
