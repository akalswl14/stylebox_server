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
      let lang = "VI",
        products = [];

      let rtnProducts = await ctx.prisma.product.findMany({
        select: {
          id: true,
          price: true,
        },
      });
      for (const eachProduct of rtnProducts) {
        if (!eachProduct) continue;
        let ProductNameResult = await ctx.prisma.productName.findMany({
          where: { productId: eachProduct.id, lang },
          select: {
            word: true,
          },
        });
        let BranchResult = await ctx.prisma.branch.findMany({
          where: { products: { some: { id: eachProduct.id } } },
          select: {
            id: true,
          },
        });
        if (
          !BranchResult ||
          BranchResult.length <= 0 ||
          !ProductNameResult ||
          ProductNameResult.length <= 0
        )
          continue;
        let ShopResult = await ctx.prisma.shop.findMany({
          where: {
            branches: { some: { OR: BranchResult } },
          },
          select: {
            id: true,
            names: { where: { lang }, select: { word: true } },
          },
        });
        products.push({
          productId: eachProduct.id,
          productName: ProductNameResult[0].word,
          shopId: ShopResult[0].id,
          shopName: ShopResult[0].names[0].word,
          price: eachProduct.price,
        });
      }

      return products ?? null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
