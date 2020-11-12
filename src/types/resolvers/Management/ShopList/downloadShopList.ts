import { queryField } from "@nexus/schema";

export const downloadShopList = queryField("downloadShopList", {
  type: "ShopManagementShops",
  nullable: true,
  list: true,
  resolve: async (_, args, ctx) => {
    try {
      let shops = [],
        No = 1;
      let shopResult = await ctx.prisma.shop.findMany({
        select: {
          id: true,
          names: { where: { lang: "VI" }, select: { word: true } },
          phoneNumber: true,
          branches: { where: { isMain: true }, select: { address: true } },
          tags: {
            select: {
              names: { where: { lang: "VI" }, select: { word: true } },
            },
          },
          monthlyRankNum: true,
          priority: true,
        },
      });
      for (const eachShop of shopResult) {
        let tagNames = [];
        let postNum = await ctx.prisma.post.count({
          where: { shopId: eachShop.id },
        });
        let productNum = await ctx.prisma.product.count({
          where: { branches: { some: { shopId: eachShop.id } } },
        });
        let likeNum = await ctx.prisma.like.count({
          where: { shopId: eachShop.id },
        });
        let viewNum = await ctx.prisma.view.count({
          where: { shopId: eachShop.id },
        });
        for (const eachTag of eachShop.tags) {
          tagNames.push(eachTag.names[0].word);
          if (tagNames.length == 3) break;
        }
        shops.push({
          No,
          shopId: eachShop.id,
          shopName: eachShop.names[0].word,
          phoneNumber: eachShop.phoneNumber,
          address: eachShop.branches[0].address,
          tagNames,
          rankNum: eachShop.monthlyRankNum,
          weight: eachShop.priority ? eachShop.priority : 0,
          postNum,
          productNum,
          likeNum,
          viewNum,
        });
        No++;
      }
      return shops;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
