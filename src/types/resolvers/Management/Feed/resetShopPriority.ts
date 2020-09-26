import { mutationField } from '@nexus/schema';

export const resetShopPriority = mutationField('resetShopPriority', {
  type: 'Boolean',
  nullable: true,
  resolve: async (_, __, ctx) => {
    try {
      let queryResult = await ctx.prisma.shop.updateMany({
        data: { priority: 1 },
      });
      return queryResult ? true : false;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
});
