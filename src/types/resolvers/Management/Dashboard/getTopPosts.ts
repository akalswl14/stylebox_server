import { intArg, queryField } from "@nexus/schema";

export const getTopPosts = queryField("getTopPosts", {
  type: "PostManagementThumbnail",
  args: { periodFilter: intArg({ nullable: true }) },
  nullable: true,
  list: true,
  resolve: async (_, args, ctx) => {
    try {
      const { periodFilter = 1 } = args;
      let postResult,
        postList,
        No = 1,
        rtn = [];

      postList = await ctx.prisma.post.findMany({
        select: {
          id: true,
        },
      });
      for (const eachPost of postList) {
        let mainProductName,
          subProductNum,
          rankNum,
          likeNum,
          viewNum,
          productResult;

        postResult = await ctx.prisma.post.findOne({
          where: { id: eachPost.id },
          select: {
            mainProductId: true,
            mainProductPrice: true,
            shopId: true,
            priority: true,
            tags: {
              select: {
                names: { where: { lang: "VI" }, select: { word: true } },
              },
            },
            products: true,
            weeklyRankNum: true,
            monthlyRankNum: true,
            lifeTimeRankNum: true,
          },
        });

        likeNum = await ctx.prisma.like.count({
          where: {
            postId: eachPost.id,
          },
        });
        viewNum = await ctx.prisma.view.count({
          where: {
            postId: eachPost.id,
          },
        });
        if (!postResult) return null;
        productResult = await ctx.prisma.product.findOne({
          where: { id: postResult.mainProductId },
          select: { names: { where: { lang: "VI" }, select: { word: true } } },
        });
        if (!productResult) return null;
        mainProductName = productResult.names[0].word;
        subProductNum = postResult.products.length - 1;
        let tagNames = [];
        for (const eachTag of postResult.tags) {
          tagNames.push(eachTag.names[0].word);
          if (tagNames.length == 5) break;
        }
        rankNum =
          periodFilter == 1
            ? postResult.weeklyRankNum
            : periodFilter == 2
            ? postResult.monthlyRankNum
            : postResult.lifeTimeRankNum;
        rtn.push({
          No,
          postId: eachPost.id,
          mainProductName,
          price: postResult.mainProductPrice,
          shopId: postResult.shopId,
          priority: postResult.priority,
          tagNames,
          subProductNum,
          rankNum: rankNum ? rankNum : 0,
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
