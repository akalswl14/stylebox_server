import { queryField } from '@nexus/schema';

export const getSearchPeriod = queryField('getSearchPeriod', {
  type: 'DateTime',
  nullable: true,
  resolve: async (_, __, ctx) => {
    try {
      let searchPeriod = await ctx.prisma.setting.findOne({
        where: { id: 1 },
        select: { SearchPeriod: true },
      });

      return searchPeriod ? searchPeriod.SearchPeriod : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
