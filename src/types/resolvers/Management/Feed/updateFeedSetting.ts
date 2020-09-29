import { arg, intArg, mutationField } from '@nexus/schema';

export const updateFeedSetting = mutationField('updateFeedSetting', {
  type: 'Boolean',
  args: {
    TodaysStylesPeriod: arg({ type: 'DateTime', nullable: true }),
    SearchPeriod: arg({ type: 'DateTime', nullable: true }),
    BestRankNum: intArg({ nullable: true }),
    shopConstA: intArg({ nullable: true }),
    shopConstB: intArg({ nullable: true }),
    shopConstC: intArg({ nullable: true }),
    postConstA: intArg({ nullable: true }),
    postConstB: intArg({ nullable: true }),
  },
  nullable: false,
  resolve: async (_, args, ctx) => {
    try {
      const {
        TodaysStylesPeriod,
        SearchPeriod,
        BestRankNum,
        shopConstA,
        shopConstB,
        shopConstC,
        postConstA,
        postConstB,
      } = args;

      let queryResult;

      if (TodaysStylesPeriod) {
        queryResult = await ctx.prisma.setting.update({
          where: { id: 1 },
          data: { TodaysStylesPeriod },
        });
      }
      if (SearchPeriod) {
        queryResult = await ctx.prisma.setting.update({
          where: { id: 1 },
          data: { SearchPeriod },
        });
      }
      if (BestRankNum) {
        queryResult = await ctx.prisma.setting.update({
          where: { id: 1 },
          data: { bestTotalPostNum: BestRankNum },
        });
      }
      if (shopConstA) {
        queryResult = await ctx.prisma.setting.update({
          where: { id: 1 },
          data: { shopConstA },
        });
      }
      if (shopConstB) {
        queryResult = await ctx.prisma.setting.update({
          where: { id: 1 },
          data: { shopConstB },
        });
      }
      if (shopConstC) {
        queryResult = await ctx.prisma.setting.update({
          where: { id: 1 },
          data: { shopConstC },
        });
      }
      if (postConstA) {
        queryResult = await ctx.prisma.setting.update({
          where: { id: 1 },
          data: { bestConstA: postConstA },
        });
      }
      if (postConstB) {
        queryResult = await ctx.prisma.setting.update({
          where: { id: 1 },
          data: { bestConstB: postConstB },
        });
      }
      return queryResult ? true : false;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
});
