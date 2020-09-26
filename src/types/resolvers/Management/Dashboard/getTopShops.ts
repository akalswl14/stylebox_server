import { queryField } from "@nexus/schema";

export const getTopShops = queryField("getTopShops", {
  type: "ShopManagementThumbnail",
  nullable: true,
  list: true,
  resolve: async (_, args, ctx) => {
    try {
      let branchResult,
        shopResult,
        shopList,
        No = 1,
        rtn = [];

      shopList = await ctx.prisma.shop.findMany({
        select: {
          id: true,
        },
      });
      for (const eachShop of shopList) {
        let postNum, productNum, likeNum, viewNum, branchList;
        branchResult = await ctx.prisma.branch.findMany({
          where: { shopId: eachShop.id, isMain: true },
          select: { address: true },
        });
        branchList = await ctx.prisma.branch.findMany({
          where: { shopId: eachShop.id },
          select: { id: true },
        });
        shopResult = await ctx.prisma.shop.findOne({
          where: { id: eachShop.id },
          select: {
            names: { where: { lang: "VI" }, select: { word: true } },
            phoneNumber: true,
            tags: {
              select: {
                names: { where: { lang: "VI" }, select: { word: true } },
              },
            },
            priority: true,
            monthlyRankNum: true,
          },
        });
        postNum = await ctx.prisma.post.count({
          where: {
            shopId: eachShop.id,
          },
        });
        productNum = await ctx.prisma.product.count({
          where: {
            branches: {
              some: {
                OR: branchList,
              },
            },
          },
        });
        likeNum = await ctx.prisma.like.count({
          where: {
            shopId: eachShop.id,
          },
        });
        viewNum = await ctx.prisma.view.count({
          where: {
            shopId: eachShop.id,
          },
        });
        if (!shopResult) return null;
        let tagNames = [];
        for (const eachTag of shopResult.tags) {
          tagNames.push(eachTag.names[0].word);
          if (tagNames.length == 3) break;
        }
        rtn.push({
          No,
          shopId: eachShop.id,
          shopName: shopResult.names[0].word,
          phoneNumber: shopResult.phoneNumber[0],
          address: branchResult[0].address,
          tagNames,
          rankNum: shopResult.monthlyRankNum,
          weight: shopResult.priority,
          postNum,
          productNum,
          likeNum,
          viewNum,
        });
        No++;
      }

      return rtn;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
