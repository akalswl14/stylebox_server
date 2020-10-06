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
      if (ShopNum > 0) {
        TotalShopLikeNum = await ctx.prisma.like.count({
          where: {
            shopId: {
              gt: 0,
            },
          },
        });
        AvgShopLikeNum = TotalShopLikeNum / ShopNum;
        TotalShopViewNum = await ctx.prisma.view.count({
          where: {
            shopId: {
              gt: 0,
            },
          },
        });
        AvgShopViewNum = TotalShopViewNum / ShopNum;
      } else {
        TotalShopLikeNum = 0;
        AvgShopLikeNum = 0.0;
        TotalShopViewNum = 0;
        AvgShopViewNum = 0.0;
      }
      if (PostNum > 0) {
        TotalPostLikeNum = await ctx.prisma.like.count({
          where: {
            postId: {
              gt: 0,
            },
          },
        });
        AvgPostLikeNum = TotalPostLikeNum / PostNum;
        TotalPostViewNum = await ctx.prisma.view.count({
          where: {
            postId: {
              gt: 0,
            },
          },
        });
        AvgPostViewNum = TotalPostViewNum / PostNum;
      } else {
        TotalPostLikeNum = 0;
        AvgPostLikeNum = 0.0;
        TotalPostViewNum = 0;
        AvgPostViewNum = 0.0;
      }
      if (EventNum > 0) {
        TotalEventLikeNum = await ctx.prisma.like.count({
          where: {
            eventId: {
              gt: 0,
            },
          },
        });
        AvgEventLikeNum = TotalEventLikeNum / EventNum;
        TotalEventViewNum = await ctx.prisma.view.count({
          where: {
            eventId: {
              gt: 0,
            },
          },
        });
        AvgEventViewNum = TotalEventViewNum / EventNum;
      } else {
        TotalEventLikeNum = 0;
        AvgEventLikeNum = 0.0;
        TotalEventViewNum = 0;
        AvgEventViewNum = 0.0;
      }
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
