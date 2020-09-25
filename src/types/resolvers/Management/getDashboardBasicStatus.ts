import { queryField } from "@nexus/schema";

export const getDashboardBasicStatus = queryField("getDashboardBasicStatus", {
  type: "DashboardBasicStatus",
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      let ShopNum,
        UserNum,
        PostNum,
        EventNum,
        ProductNum,
        AvgShopLikeNum,
        AvgPostLikeNum,
        AvgEventLikeNum,
        AvgShopViewNum,
        AvgPostViewNum,
        AvgEventViewNum,
        TotalShopLikeNum,
        TotalPostLikeNum,
        TotalEventLikeNum,
        TotalShopViewNum,
        TotalPostViewNum,
        TotalEventViewNum;
      ShopNum = await ctx.prisma.shop.count();
      UserNum = await ctx.prisma.user.count();
      PostNum = await ctx.prisma.post.count();
      EventNum = await ctx.prisma.event.count();
      ProductNum = await ctx.prisma.product.count();
      TotalShopLikeNum = await ctx.prisma.like.count({
        where: {
          shopId: {
            gt: 0,
          },
        },
      });
      AvgShopLikeNum = TotalShopLikeNum / ShopNum;
      TotalPostLikeNum = await ctx.prisma.like.count({
        where: {
          postId: {
            gt: 0,
          },
        },
      });
      AvgPostLikeNum = TotalPostLikeNum / PostNum;
      TotalEventLikeNum = await ctx.prisma.like.count({
        where: {
          eventId: {
            gt: 0,
          },
        },
      });
      AvgEventLikeNum = TotalEventLikeNum / EventNum;
      TotalShopViewNum = await ctx.prisma.view.count({
        where: {
          shopId: {
            gt: 0,
          },
        },
      });
      AvgShopViewNum = TotalShopViewNum / ShopNum;
      TotalPostViewNum = await ctx.prisma.view.count({
        where: {
          postId: {
            gt: 0,
          },
        },
      });
      AvgPostViewNum = TotalPostViewNum / PostNum;
      TotalEventViewNum = await ctx.prisma.view.count({
        where: {
          eventId: {
            gt: 0,
          },
        },
      });
      AvgEventViewNum = TotalEventViewNum / EventNum;
      return {
        ShopNum,
        UserNum,
        PostNum,
        ProductNum,
        AvgShopLikeNum,
        AvgPostLikeNum,
        AvgEventLikeNum,
        AvgShopViewNum,
        AvgPostViewNum,
        AvgEventViewNum,
        TotalShopLikeNum,
        TotalPostLikeNum,
        TotalEventLikeNum,
        TotalShopViewNum,
        TotalPostViewNum,
        TotalEventViewNum,
      };
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
