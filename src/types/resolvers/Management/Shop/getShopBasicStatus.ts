import { intArg, queryField } from "@nexus/schema";

export const getShopBasicStatus = queryField("getShopBasicStatus", {
  type: "ShopBasicStatus",
  args: { id: intArg({ required: true }) },
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const { id } = args;
      let queryResult;
      queryResult = await ctx.prisma.shop.findOne({
        where: { id },
        select: {
          monthlyRankNum: true,
          priority: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      let postNum = await ctx.prisma.post.count({
        where: { shopId: id },
      });
      let branchList = await ctx.prisma.branch.findMany({
        where: { shopId: id },
        select: { id: true },
      });
      let productNum = await ctx.prisma.product.count({
        where: { branches: { some: { OR: branchList } } },
      });
      let likeNum = await ctx.prisma.like.count({
        where: { shopId: id },
      });
      let viewNum = await ctx.prisma.view.count({
        where: { shopId: id },
      });
      if (!queryResult) return null;
      return {
        monthlyRankNum: queryResult.monthlyRankNum,
        weight: queryResult.priority,
        postNum,
        productNum,
        likeNum,
        viewNum,
        RegistrationDate: queryResult.createdAt,
        UpdateDate: queryResult.updatedAt,
      };
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
