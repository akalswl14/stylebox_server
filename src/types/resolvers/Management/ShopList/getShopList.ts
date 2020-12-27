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
    weightAsc: booleanArg({ nullable: true }),
    rankAsc: booleanArg({ nullable: true }),
  },
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const {
        shopId,
        shopName,
        phoneNumber,
        address,
        tagName,
        shopIdAsc,
        shopNameAsc,
        weightAsc,
        rankAsc,
      } = args;
      let { pageNum } = args;
      if (!pageNum) pageNum = 1;
      const loadingNum = 13;
      let skipNum = loadingNum * (pageNum - 1);
      let orderByOption:
          | [
              {
                monthlyRankScore: "asc" | "desc";
              },
              { monthlyRankNum: "asc" | "desc" }
            ]
          | [
              {
                priority: "asc" | "desc";
              },
              { id: "asc" }
            ]
          | {
              id: "asc" | "desc";
            }
          | undefined,
        whereOption,
        shopResult,
        queryResult,
        No = 1,
        totalShopNum = 0,
        shops = [];

      if (typeof shopIdAsc === "boolean") {
        orderByOption = shopIdAsc ? { id: "asc" } : { id: "desc" };
      }
      if (typeof weightAsc === "boolean") {
        orderByOption = weightAsc
          ? [{ priority: "asc" }, { id: "asc" }]
          : [{ priority: "desc" }, { id: "asc" }];
      }
      if (typeof rankAsc === "boolean") {
        orderByOption = rankAsc
          ? [{ monthlyRankScore: "desc" }, { monthlyRankNum: "asc" }]
          : [{ monthlyRankScore: "asc" }, { monthlyRankNum: "desc" }];
      }
      if (shopId) whereOption = { id: shopId };
      if (shopName) {
        whereOption = {
          names: {
            some: {
              searchWord: { contains: shopName.toLowerCase() },
            },
          },
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
          tags: {
            some: {
              names: {
                some: { searchWord: { contains: tagName.toLowerCase() } },
              },
            },
          },
        };
      }
      shopResult = await ctx.prisma.shop.findMany({
        where: whereOption,
        orderBy: orderByOption,
        skip: skipNum,
        take: loadingNum,
        select: {
          id: true,
          phoneNumber: true,
          monthlyRankNum: true,
          priority: true,
        },
      });
      totalShopNum = await ctx.prisma.shop.count({
        where: whereOption,
      });
      if (typeof shopNameAsc === "boolean") {
        let shopIdList = [];
        for (const eachShop of shopResult) {
          if (!eachShop) continue;
          shopIdList.push(eachShop.id);
        }
        shopResult = await ctx.prisma.shopName.findMany({
          where: { shopId: { in: shopIdList }, lang: "VI" },
          orderBy: shopNameAsc ? { word: "asc" } : { word: "desc" },
          select: {
            shopId: true,
            word: true,
          },
        });
        for (const eachShop of shopResult) {
          let branchList = [],
            tagNames = [];
          if (!eachShop.shopId) continue;
          queryResult = await ctx.prisma.branch.findMany({
            where: { shopId: eachShop.shopId },
            select: { id: true },
          });
          if (queryResult) {
            for (const eachBranch of queryResult) {
              branchList.push(eachBranch.id);
            }
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
          let tagResult = await ctx.prisma.tag.findMany({
            where: { shops: { some: { id: eachShop.shopId } } },
            select: {
              names: { where: { lang: "VI" }, select: { word: true } },
            },
          });
          let mainBranchResult = await ctx.prisma.branch.findMany({
            where: { shopId: eachShop.shopId, isMain: true },
            select: { address: true },
          });
          let shopDetail = await ctx.prisma.shop.findOne({
            where: { id: eachShop.shopId },
            select: {
              phoneNumber: true,
              monthlyRankNum: true,
              priority: true,
            },
          });
          if (!(tagResult && mainBranchResult && shopDetail)) continue;
          if (tagResult) {
            for (const eachTag of tagResult) {
              tagNames.push(eachTag.names[0].word);
              if (tagNames.length == 3) break;
            }
          }
          shops.push({
            No,
            shopId: eachShop.shopId,
            shopName: eachShop.word ?? null,
            phoneNumber: shopDetail ? shopDetail.phoneNumber : null,
            address:
              mainBranchResult &&
              mainBranchResult.length > 0 &&
              mainBranchResult[0].address
                ? mainBranchResult[0].address
                : null,
            tagNames,
            rankNum:
              typeof shopDetail.monthlyRankNum === "number"
                ? shopDetail.monthlyRankNum
                : 0,
            weight:
              typeof shopDetail.priority === "number" ? shopDetail.priority : 0,
            postNum,
            productNum,
            likeNum,
            viewNum,
          });
          No++;
        }
      } else {
        for (const eachShop of shopResult) {
          if (!eachShop) continue;
          let branchList = [],
            tagNames = [];
          queryResult = await ctx.prisma.branch.findMany({
            where: { shopId: eachShop.id },
            select: { id: true },
          });
          if (queryResult) {
            for (const eachBranch of queryResult) {
              branchList.push(eachBranch.id);
            }
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
          let mainBranchResult = await ctx.prisma.branch.findMany({
            where: { isMain: true, shopId: eachShop.id },
            select: { address: true },
          });
          let shopNameResult = await ctx.prisma.shopName.findMany({
            where: { shopId: eachShop.id, lang: "VI" },
            select: { word: true },
          });
          let tagListQueryResult = await ctx.prisma.shop.findOne({
            where: { id: eachShop.id },
            select: {
              onDetailTagId: true,
            },
          });
          if (tagListQueryResult) {
            for (const eachTag of tagListQueryResult.onDetailTagId) {
              let tagResult = await ctx.prisma.tag.findOne({
                where: { id: eachTag },
                select: {
                  names: { where: { lang: "VI" }, select: { word: true } },
                },
              });
              if (tagResult && tagResult.names[0].word) {
                tagNames.push(tagResult.names[0].word);
              }
              if (tagNames.length == 3) break;
            }
          }
          shops.push({
            No,
            shopId: eachShop.id,
            shopName:
              shopNameResult &&
              shopNameResult.length > 0 &&
              shopNameResult[0].word
                ? shopNameResult[0].word
                : null,
            phoneNumber: eachShop.phoneNumber,
            address:
              mainBranchResult &&
              mainBranchResult.length > 0 &&
              mainBranchResult[0].address
                ? mainBranchResult[0].address
                : null,
            tagNames,
            rankNum:
              typeof eachShop.monthlyRankNum === "number"
                ? eachShop.monthlyRankNum
                : 0,
            weight:
              typeof eachShop.priority === "number" ? eachShop.priority : 0,
            postNum,
            productNum,
            likeNum,
            viewNum,
          });
          No++;
        }
      }
      return { totalShopNum, shops };
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
