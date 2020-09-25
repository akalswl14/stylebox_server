import { arg, intArg, queryField } from '@nexus/schema';

export const updateFeedSetting = queryField('updateFeedSetting', {
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
  nullable: true,
  resolve: async (_, args, ctx) => {
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

    await ctx.prisma.setting.update(QueryOption);

    try {
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
});
