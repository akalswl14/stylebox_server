import { arg, mutationField } from '@nexus/schema';

export const updateProductList = mutationField('updateProductList', {
  type: 'Boolean',
  args: {
    products: arg({ type: 'ProductListInputType', list: true, required: true }),
  },
  nullable: false,
  resolve: async (_, args, ctx) => {
    try {
      const { products = [] } = args;
      for (const product of products) {
        await ctx.prisma.product.update({
          where: { id: product.productId },
          data: { priority: product.priority },
        });
      }
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
});
