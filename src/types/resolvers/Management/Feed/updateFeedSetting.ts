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

      let QueryOption = {
        where: { id: 1 },
        data: {},
      };

      if (TodaysStylesPeriod)
        QueryOption.data.TodaysStylesPeriod = TodaysStylesPeriod;
      if (SearchPeriod) QueryOption.data.SearchPeriod = SearchPeriod;
      if (BestRankNum) QueryOption.data.bestTotalPostNum = BestRankNum;
      if (shopConstA) QueryOption.data.shopConstA = shopConstA;
      if (shopConstB) QueryOption.data.shopConstB = shopConstB;
      if (shopConstC) QueryOption.data.shopConstC = shopConstC;
      if (postConstA) QueryOption.data.bestConstA = postConstA;
      if (postConstB) QueryOption.data.bestConstB = postConstB;

      let queryResult = await ctx.prisma.setting.update(QueryOption);

      return queryResult ? true : false;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
});
