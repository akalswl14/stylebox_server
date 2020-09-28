import { arg, mutationField } from '@nexus/schema';

export const updatePostList = mutationField('updatePostList', {
  type: 'Boolean',
  args: {
    posts: arg({ type: 'IdPriorityInputType', list: true, required: true }),
  },
  nullable: false,
  resolve: async (_, args, ctx) => {
    try {
      const { posts = [] } = args;
      for (const post of posts) {
        await ctx.prisma.post.update({
          where: { id: post.id },
          data: { priority: post.priority },
        });
      }
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
});
