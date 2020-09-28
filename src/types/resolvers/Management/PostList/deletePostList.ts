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
      let queryResult = await ctx.prisma.post.deleteMany({
        where: { id: { in: postIds } },
      });
      return queryResult ? true : false;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
});
