import { intArg, mutationField } from '@nexus/schema';

export const deleteProductList = mutationField('deleteProductList', {
  type: 'Boolean',
  args: {
    productIds: intArg({ required: true, list: true }),
  },
  nullable: false,
  resolve: async (_, args, ctx) => {
    try {
      const { productIds = [] } = args;
      let queryResult = await ctx.prisma.product.deleteMany({
        where: { id: { in: productIds } },
      });
      return queryResult ? true : false;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
});
