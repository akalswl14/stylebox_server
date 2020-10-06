import { queryField } from '@nexus/schema';

export const getBestFeedNum = queryField('getBestFeedNum', {
  type: 'Int',
  nullable: true,
  resolve: async (_, __, ctx) => {
    try {
      let bestFeedNum = await ctx.prisma.setting.findOne({
        where: { id: 1 },
        select: { bestTotalPostNum: true },
      });

      return bestFeedNum ? bestFeedNum.bestTotalPostNum : 14;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
