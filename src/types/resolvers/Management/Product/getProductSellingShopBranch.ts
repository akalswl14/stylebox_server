import { intArg, queryField } from "@nexus/schema";

export const getProductSellingShopBranch = queryField(
  "getProductSellingShopBranch",
  {
    type: "ProductToShopBranchInfo",
    args: {
      shopId: intArg({ nullable: true }),
      productId: intArg({ nullable: true }),
    },
    nullable: true,
    resolve: async (_, args, ctx) => {
      try {
        const { shopId, productId } = args;
        let branches = [];
        if (shopId === 0 || (!shopId && !productId)) {
          return {
            id: 0,
            shopName: "",
            shopLink: "",
            branches: [],
          };
        }
        let shopResult;
        if (!shopId && productId) {
          let branchResult = await ctx.prisma.branch.findMany({
            where: { products: { some: { id: productId } } },
            select: { shopId: true },
          });
          if (branchResult.length === 0) return null;
          let shopId = branchResult[0].shopId;
          if (!shopId) return null;
          shopResult = await ctx.prisma.shop.findOne({
            where: { id: shopId },
            select: {
              id: true,
              names: { where: { lang: "VI" }, select: { word: true } },
              externalLinks: {
                where: { onBottom: false },
                select: { url: true },
                orderBy: { order: "asc" },
              },
              branches: {
                select: {
                  id: true,
                },
              },
            },
          });
        }
        if (shopId) {
          shopResult = await ctx.prisma.shop.findOne({
            where: { id: shopId },
            select: {
              id: true,
              names: { where: { lang: "VI" }, select: { word: true } },
              externalLinks: {
                where: { onBottom: false },
                select: { url: true },
                orderBy: { order: "asc" },
              },
              branches: {
                select: {
                  id: true,
                },
              },
            },
          });
        }
        if (!shopResult) return null;
        for (const eachBranch of shopResult.branches) {
          let branchResult = await ctx.prisma.branch.findOne({
            where: { id: eachBranch.id },
            select: {
              names: { where: { lang: "VI" }, select: { word: true } },
              phoneNumbers: true,
              address: true,
            },
          });
          let isExist;
          if (productId) {
            isExist = await ctx.prisma.branch.count({
              where: {
                id: eachBranch.id,
                products: { some: { id: productId } },
              },
            });
          } else {
            isExist = 0;
          }
          if (!branchResult) continue;
          branches.push({
            id: eachBranch.id,
            branchName: branchResult.names[0].word,
            phoneNumber: branchResult.phoneNumbers[0],
            address: branchResult.address,
            isSelected: isExist > 0 ? true : false,
          });
        }
        return {
          id: shopResult.id,
          shopName: shopResult.names[0].word,
          shopLink: shopResult.externalLinks[0]
            ? shopResult.externalLinks[0].url
            : null,
          branches,
        };
      } catch (e) {
        console.log(e);
        return null;
      }
    },
  }
);
