import { queryField } from '@nexus/schema';

export const getTodaysStylesPeriod = queryField('getTodaysStylesPeriod', {
  type: 'MainFeedInfo',
  nullable: true,
  resolve: async (_, __, ctx) => {
    try {
      let postNum = 0;
      let TodaysStylesPeriod = await ctx.prisma.setting.findOne({
        where: { id: 1 },
        select: { TodaysStylesPeriod: true },
      });

      if (!TodaysStylesPeriod) return null;

      postNum = await ctx.prisma.post.count({
        where: { createdAt: { gte: TodaysStylesPeriod.TodaysStylesPeriod } },
      });

      let rtn = {
        period: TodaysStylesPeriod.TodaysStylesPeriod,
        postNum,
      };

      return rtn ? rtn : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
