import { queryField, stringArg } from '@nexus/schema';

export const getShopByProductName = queryField('getShopByProductName', {
  type: 'ShopByProductName',
  args: {
    productName: stringArg({ required: true }),
  },
  list: true,
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const { productName } = args;
      let shop = [],
        lang = 'VI';
      let branches = await ctx.prisma.branch.findMany({
        where: {
          products: {
            some: { names: { some: { word: { contains: productName } } } },
          },
        },
        select: { shopId: true, products: { select: { id: true } } },
      });

      for (const branch of branches) {
        let shopInfo = await ctx.prisma.shop.findOne({
          where: { id: branch.shopId },
          select: { names: { where: { lang }, select: { word: true } } },
        });
        if (!shopInfo) return null;
        shop.push({
          productId: branch.products[0].id,
          productName,
          shopId: branch.shopId,
          shopName: shopInfo.names[0].word,
        });
      }

      return shop ? shop : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
