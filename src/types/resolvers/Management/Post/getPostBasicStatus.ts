import { intArg, queryField } from '@nexus/schema';

export const getPostBasicStatus = queryField('getPostBasicStatus', {
  type: 'PostBasicStatus',
  args: { id: intArg({ required: true }) },
  nullable: false,
  resolve: async (_, args, ctx) => {
    try {
      const { id } = args;
      let postResult = await ctx.prisma.post.findOne({
        where: { id },
        select: {
          weeklyRankNum: true,
          monthlyRankNum: true,
          lifeTimeRankNum: true,
          priority: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      let likesNum = await ctx.prisma.like.count({
        where: { postId: id },
      });
      let viewsNum = await ctx.prisma.view.count({
        where: { postId: id },
      });

      let postBasicStatus = {
        weeklyRank: postResult?.weeklyRankNum,
        monthlyRank: postResult?.monthlyRankNum,
        totalRank: postResult?.lifeTimeRankNum,
        priority: postResult?.priority,
        likesNum,
        viewsNum,
        createdAt: postResult?.createdAt,
        updatedAt: postResult?.updatedAt,
      };

      return postBasicStatus ? postBasicStatus : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
