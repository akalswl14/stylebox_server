import { intArg, queryField } from "@nexus/schema";

export const getProductSellingShopBranch = queryField(
  "getProductSellingShopBranch",
  {
    type: "ProductToShopBranchInfo",
    args: {
      shopId: intArg({ required: true }),
      productId: intArg({ required: true }),
    },
    nullable: true,
    resolve: async (_, args, ctx) => {
      try {
        const { shopId, productId } = args;
        let branches = [];
        let shopResult = await ctx.prisma.shop.findOne({
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
          let isExist = await ctx.prisma.branch.count({
            where: { id: eachBranch.id, products: { some: { id: productId } } },
          });
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
          shopId: shopResult.id,
          shopName: shopResult.names[0].word,
          shopLink: shopResult.externalLinks[0].url,
          branches,
        };
      } catch (e) {
        console.log(e);
        return null;
      }
    },
  }
);
