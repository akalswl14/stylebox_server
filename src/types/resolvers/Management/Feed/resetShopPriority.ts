import { queryField } from '@nexus/schema';

export const resetShopPriority = queryField('resetShopPriority', {
  type: 'Boolean',
  nullable: true,
  resolve: async (_, __, ctx) => {
    try {
      await ctx.prisma.shop.updateMany({
        data: { priority: 1 },
      });
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
});
