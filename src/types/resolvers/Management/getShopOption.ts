import { queryField, stringArg } from "@nexus/schema";

export const getShopOption = queryField("getShopOption", {
  type: "ShopOption",
  args: { shopName: stringArg({ required: true }) },
  nullable: true,
  list: true,
  resolve: async (_, args, ctx) => {
    try {
      const { shopName } = args;
      let queryResult,
        shops = [];
      queryResult = await ctx.prisma.shopName.findMany({
        where: { word: { contains: shopName } },
        select: {
          shopId: true,
          word: true,
          Shop: {
            select: {
              externalLinks: {
                where: { onBottom: false },
                select: { url: true },
              },
            },
          },
        },
      });
      if (!queryResult) return null;
      for (const eachShopName of queryResult) {
        if (!eachShopName.shopId) continue;
        let shopNameResult = await ctx.prisma.shopExternalLink.findMany({
          where: { shopId: eachShopName.shopId, onBottom: false },
          select: { url: true },
          orderBy: { order: "asc" },
        });
        let shopLink = null;
        shops.push({
          id: eachShopName.shopId,
          shopName: eachShopName.word,
          shopLink:
            shopNameResult.length > 0 && shopNameResult[0].url
              ? shopNameResult[0].url
              : null,
        });
      }
      return shops;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
