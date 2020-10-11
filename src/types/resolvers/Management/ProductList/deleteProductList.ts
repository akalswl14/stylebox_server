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
      let deleteQuery;

      deleteQuery = await ctx.prisma.productImage.deleteMany({
        where: { productId: { in: productIds } },
      });
      deleteQuery = await ctx.prisma.productName.deleteMany({
        where: { productId: { in: productIds } },
      });
      deleteQuery = await ctx.prisma.productVideo.deleteMany({
        where: { productId: { in: productIds } },
      });
      deleteQuery = await ctx.prisma.like.deleteMany({
        where: { productId: { in: productIds } },
      });
      deleteQuery = await ctx.prisma.view.deleteMany({
        where: { productId: { in: productIds } },
      });
      let productLinkIds = await ctx.prisma.productExternalLink.findMany({
        where: { productId: { in: productIds } },
        select: { id: true },
      });
      let queryResult = await ctx.prisma.product.deleteMany({
        where: { id: { in: productIds } },
      });
      deleteQuery = await ctx.prisma.productExternalLink.deleteMany({
        where: { OR: productLinkIds },
      });

      if (!deleteQuery || !queryResult) return false;

      return queryResult ? true : false;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
});
