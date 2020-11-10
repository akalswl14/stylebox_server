import { queryField, stringArg } from "@nexus/schema";

export const getShopByProductName = queryField("getShopByProductName", {
  type: "ShopByProductName",
  args: {
    productName: stringArg({ required: true }),
  },
  list: true,
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const { productName } = args;
      let shop = [],
        lang = "VI";

      let branches = await ctx.prisma.product.findMany({
        where: { names: { some: { word: { contains: productName } } } },
        select: {
          id: true,
          price: true,
          names: { where: { lang }, select: { word: true } },
          branches: { select: { shopId: true } },
        },
      });

      if (!branches) return null;

      for (const branch of branches) {
        if (branch.branches[0].shopId) {
          let shopInfo = await ctx.prisma.shop.findOne({
            where: { id: branch.branches[0].shopId },
            select: { names: { where: { lang }, select: { word: true } } },
          });
          if (!shopInfo) return null;
          shop.push({
            productId: branch.id,
            productName: branch.names[0].word,
            shopId: branch.branches[0].shopId,
            shopName: shopInfo.names[0].word,
            price: branch.price,
          });
        }
      }

      return shop ? shop : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
