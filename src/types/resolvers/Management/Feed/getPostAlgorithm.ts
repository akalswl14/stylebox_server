import { queryField } from '@nexus/schema';

export const getPostAlgorithm = queryField('getPostAlgorithm', {
  type: 'PostRankConst',
  nullable: true,
  resolve: async (_, __, ctx) => {
    try {
      let postConst = await ctx.prisma.setting.findOne({
        where: { id: 1 },
        select: { bestConstA: true, bestConstB: true },
      });

      return postConst ? postConst : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
