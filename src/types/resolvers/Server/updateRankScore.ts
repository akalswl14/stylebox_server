import { mutationField } from "@nexus/schema";

export const updateRankScore = mutationField("updateRankScore", {
  type: "Boolean",
  nullable: false,
  resolve: async (_, args, ctx) => {
    try {
      let postResult,
        queryResult,
        PostWeekLikeNum = 0,
        PostMonthLikeNum = 0,
        PostLifeLikeNum = 0,
        PostWeekViewNum = 0,
        PostMonthViewNum = 0,
        PostLifeViewNum = 0,
        ShopMonthLikeNum = 0,
        ShopMonthViewNum = 0,
        weeklyRankScore = 0,
        monthlyRankScore = 0,
        lifeTimeRankScore = 0,
        ShopmonthlyRankScore = 0,
        ShopPostNum = 0;
      queryResult = await ctx.prisma.setting.findOne({
        where: { id: 1 },
        select: {
          bestConstA: true,
          bestConstB: true,
          shopConstA: true,
          shopConstB: true,
          shopConstC: true,
          shopConstD: true,
        },
      });
      if (!queryResult) return false;
      const bestConstA = queryResult.bestConstA;
      const bestConstB = queryResult.bestConstB;
      const shopConstA = queryResult.shopConstA;
      const shopConstB = queryResult.shopConstB;
      const shopConstC = queryResult.shopConstC;
      const shopConstD = queryResult.shopConstD;
      const today = new Date(new Date().setUTCHours(0, 0, 0, 0));
      let before7Days = new Date();
      let before1Month = new Date();
      before7Days.setUTCDate(today.getUTCDate() - 7);
      before7Days.setUTCHours(0, 0, 0, 0);
      before1Month.setUTCDate(today.getUTCDate() - 30);
      before1Month.setUTCHours(0, 0, 0, 0);
      queryResult = await ctx.prisma.shop.updateMany({
        data: { monthlyRankScore: { set: 0.0 } },
      });
      if (!queryResult) return false;
      postResult = await ctx.prisma.post.findMany({
        select: {
          id: true,
          shopId: true,
          Shop: { select: { monthlyRankScore: true } },
        },
      });
      for (const eachPost of postResult) {
        PostWeekLikeNum = await ctx.prisma.like.count({
          where: { postId: eachPost.id, createdAt: { gte: before7Days } },
        });
        PostMonthLikeNum = await ctx.prisma.like.count({
          where: { postId: eachPost.id, createdAt: { gte: before1Month } },
        });
        PostLifeLikeNum = await ctx.prisma.like.count({
          where: { postId: eachPost.id },
        });
        PostWeekViewNum = await ctx.prisma.view.count({
          where: { postId: eachPost.id, createdAt: { gte: before7Days } },
        });
        PostMonthViewNum = await ctx.prisma.view.count({
          where: { postId: eachPost.id, createdAt: { gte: before1Month } },
        });
        PostLifeViewNum = await ctx.prisma.view.count({
          where: { postId: eachPost.id },
        });
        weeklyRankScore =
          bestConstA * PostWeekLikeNum + bestConstB * PostWeekViewNum;
        monthlyRankScore =
          bestConstA * PostMonthLikeNum + bestConstB * PostMonthViewNum;
        lifeTimeRankScore =
          bestConstA * PostLifeLikeNum + bestConstB * PostLifeViewNum;
        queryResult = await ctx.prisma.post.update({
          where: {
            id: eachPost.id,
          },
          data: {
            weeklyRankScore: { set: weeklyRankScore },
            monthlyRankScore: { set: monthlyRankScore },
            lifeTimeRankScore: { set: lifeTimeRankScore },
          },
        });
        if (!queryResult) return false;
        if (eachPost.shopId) {
          ShopMonthLikeNum = await ctx.prisma.like.count({
            where: {
              shopId: eachPost.shopId,
              createdAt: { gte: before1Month },
            },
          });
          ShopMonthViewNum = await ctx.prisma.view.count({
            where: {
              shopId: eachPost.shopId,
              createdAt: { gte: before1Month },
            },
          });
          ShopPostNum = await ctx.prisma.post.count({
            where: {
              shopId: eachPost.shopId,
              createdAt: { gte: before1Month },
            },
          });
          ShopmonthlyRankScore =
            (shopConstA * ShopMonthViewNum +
              shopConstB +
              ShopMonthLikeNum +
              shopConstC * monthlyRankScore) /
              ShopPostNum +
            shopConstD;
          if (eachPost.Shop && eachPost.Shop.monthlyRankScore) {
            ShopmonthlyRankScore += eachPost.Shop.monthlyRankScore;
          }
          queryResult = await ctx.prisma.shop.update({
            where: { id: eachPost.shopId },
            data: { monthlyRankScore: { set: ShopmonthlyRankScore } },
          });
          if (!queryResult) return false;
        }
      }
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
});
