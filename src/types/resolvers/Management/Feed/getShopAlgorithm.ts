import { queryField } from '@nexus/schema';

export const getShopAlgorithm = queryField('getShopAlgorithm', {
  type: 'ShopRankConst',
  nullable: true,
  resolve: async (_, __, ctx) => {
    try {
      let shopConst = await ctx.prisma.setting.findOne({
        where: { id: 1 },
        select: { shopConstA: true, shopConstB: true, shopConstC: true },
      });
      return shopConst ? shopConst : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
