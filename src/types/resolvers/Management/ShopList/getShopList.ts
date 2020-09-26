import { booleanArg, intArg, queryField, stringArg } from "@nexus/schema";

export const getShopList = queryField("getShopList", {
  type: "ShopManagementThumbnail",
  args: {
    pageNum: intArg({ nullable: true }),
    shopId: intArg({ nullable: true }),
    shopName: stringArg({ nullable: true }),
    phoneNumber: stringArg({ nullable: true }),
    address: stringArg({ nullable: true }),
    tagName: stringArg({ nullable: true }),
    shopIdAsc: booleanArg({ nullable: true }),
    shopNameAsc: booleanArg({ nullable: true }),
  },
  nullable: true,
  list: true,
  resolve: async (_, args, ctx) => {
    try {
      const {
        pageNum = 1,
        shopId,
        shopName,
        phoneNumber,
        address,
        tagName,
        shopIdAsc,
        shopNameAsc,
      } = args;
      const loadingNum = 13;
      let skipNum = loadingNum * (pageNum - 1);
      let orderByOption,
        whereOption,
        shopResult,
        queryResult,
        No = 1,
        shops = [];

      if (typeof shopIdAsc === "boolean") {
        orderByOption = shopIdAsc ? { id: "asc" } : { id: "desc" };
      }
      if (shopId) whereOption = { id: shopId };
      if (shopName) {
        whereOption = {
          names: { some: { word: { contains: shopName } } },
        };
      }
      if (phoneNumber) {
        whereOption = { phoneNumber: { contains: phoneNumber } };
      }
      if (address) {
        whereOption = {
          branches: {
            some: { address: { contains: address }, isMain: true },
          },
        };
      }
      if (tagName) {
        whereOption = {
          tags: { some: { names: { some: { word: { contains: tagName } } } } },
        };
      }
      shopResult = await ctx.prisma.shop.findMany({
        where: whereOption,
        orderBy: orderByOption,
        skip: skipNum,
        take: loadingNum,
        select: {
          id: true,
          names: { where: { lang: "VI" }, select: { word: true } },
          phoneNumber: true,
          branches: {
            where: { isMain: true },
            select: { address: true },
          },
          monthlyRankNum: true,
          priority: true,
          tags: {
            select: {
              names: { where: { lang: "VI" }, select: { word: true } },
            },
          },
        },
      });
      if (typeof shopNameAsc === "boolean") {
        let shopIdList = [];
        for (const eachShop of shopResult) {
          shopIdList.push(eachShop.id);
        }
        shopResult = await ctx.prisma.shopName.findMany({
          where: { shopId: { in: shopIdList }, lang: "VI" },
          orderBy: shopNameAsc ? { word: "asc" } : { word: "desc" },
          select: {
            shopId: true,
            word: true,
            Shop: {
              select: {
                phoneNumber: true,
                branches: {
                  where: { isMain: true },
                  select: { address: true },
                },
                monthlyRankNum: true,
                priority: true,
                tags: {
                  select: {
                    names: { where: { lang: "VI" }, select: { word: true } },
                  },
                },
              },
            },
          },
        });
        for (const eachShop of shopResult) {
          let branchList = [],
            tagNames = [];
          if (!eachShop.Shop) continue;
          queryResult = await ctx.prisma.branch.findMany({
            where: { shopId: eachShop.shopId },
            select: { id: true },
          });
          for (const eachBranch of queryResult) {
            branchList.push(eachBranch.id);
          }
          let postNum = await ctx.prisma.post.count({
            where: { shopId: eachShop.shopId },
          });
          let productNum = await ctx.prisma.product.count({
            where: { branches: { some: { id: { in: branchList } } } },
          });
          let likeNum = await ctx.prisma.like.count({
            where: { shopId: eachShop.shopId },
          });
          let viewNum = await ctx.prisma.view.count({
            where: { shopId: eachShop.shopId },
          });
          for (const eachTag of eachShop.Shop.tags) {
            tagNames.push(eachTag.names[0].word);
            if (tagNames.length == 3) break;
          }
          shops.push({
            No,
            shopId: eachShop.shopId,
            shopName: eachShop.word,
            phoneNumber: eachShop.Shop.phoneNumber,
            address: eachShop.Shop.branches[0].address,
            tagNames,
            rankNum: eachShop.Shop.monthlyRankNum,
            weight: eachShop.Shop.priority,
            postNum,
            productNum,
            likeNum,
            viewNum,
          });
          No++;
        }
      } else {
        for (const eachShop of shopResult) {
          let branchList = [],
            tagNames = [];
          queryResult = await ctx.prisma.branch.findMany({
            where: { shopId: eachShop.id },
            select: { id: true },
          });
          for (const eachBranch of queryResult) {
            branchList.push(eachBranch.id);
          }
          let postNum = await ctx.prisma.post.count({
            where: { shopId: eachShop.id },
          });
          let productNum = await ctx.prisma.product.count({
            where: { branches: { some: { id: { in: branchList } } } },
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
            weight: eachShop.priority,
            postNum,
            productNum,
            likeNum,
            viewNum,
          });
          No++;
        }
      }
      return shops;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
