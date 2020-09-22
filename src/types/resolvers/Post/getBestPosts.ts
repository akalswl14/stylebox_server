import { queryField, stringArg, intArg } from "@nexus/schema";
import { getUserId } from "../../../utils";

export const getBestPosts = queryField("getBestPosts", {
  type: "PostThumbnail",
  args: {
    lang: stringArg({ nullable: true }),
    periodFilter: intArg({ nullable: true }),
    locationTagId: intArg({ nullable: true }),
    classId: intArg({ nullable: true }),
    cursorId: intArg({ nullable: true }),
    pageNum: intArg({ required: true }),
  },
  list: true,
  nullable: true,
  description:
    "About filter, 1 means this week, 2 means this month and 3 means life time. Field pageNum has to start from 1.",
  resolve: async (_, args, ctx) => {
    try {
      const {
        lang = "VI",
        periodFilter = 1,
        locationTagId,
        classId,
        cursorId,
        pageNum,
      } = args;
      let queryResult,
        postResult,
        tagResult = [],
        loadingPostNum,
        bestTotalPostNum,
        queryOption,
        orderOption,
        posts = [];
      const userId = Number(getUserId(ctx));
      queryResult = await ctx.prisma.setting.findOne({
        where: { id: 1 },
        select: { loadingPostNum: true, bestTotalPostNum: true },
      });
      loadingPostNum = queryResult ? queryResult.loadingPostNum : 20;
      bestTotalPostNum = queryResult ? queryResult.bestTotalPostNum : 100;
      if (bestTotalPostNum - pageNum * loadingPostNum == 0) {
        return [];
      } else if (bestTotalPostNum - pageNum * loadingPostNum < loadingPostNum) {
        loadingPostNum = bestTotalPostNum - pageNum * loadingPostNum;
      }
      if (classId) {
        let classTags = await ctx.prisma.tag.findMany({
          where: { classId },
          select: { id: true },
        });
        for (const eachTag of classTags) {
          tagResult.push({ tags: { some: { id: eachTag.id } } });
        }
      }
      if (locationTagId) {
        tagResult.push({ tags: { some: { id: locationTagId } } });
      }
      if (periodFilter == 1) {
        orderOption = [{ weeklyRankScore: "desc" }, { createdAt: "asc" }];
      } else if (periodFilter == 2) {
        orderOption = [{ monthlyRankScore: "desc" }, { createdAt: "asc" }];
      } else {
        orderOption = [{ lifeTimeRankScore: "desc" }, { createdAt: "asc" }];
      }
      queryOption = {
        where: {
          AND: tagResult,
        },
        select: {
          id: true,
          images: { select: { url: true }, take: 1 },
          Shop: {
            select: { names: { where: { lang }, select: { word: true } } },
          },
          mainProductId: true,
          mainProductPrice: true,
        },
        orderBy: orderOption,
        take: loadingPostNum,
      };
      if (cursorId) {
        queryOption.cursor = { id: cursorId };
        queryOption.skip = 1;
      }
      postResult = await ctx.prisma.post.findMany(queryOption);
      for (const eachPost of postResult) {
        if (eachPost.Shop) {
          queryResult = await ctx.prisma.like.count({
            where: { userId, postId: eachPost.id },
          });
          let isLikePost = queryResult > 0 ? true : false;
          queryResult = await ctx.prisma.productName.findMany({
            where: { productId: eachPost.mainProductId, lang },
            select: { word: true },
          });
          let productName = queryResult[0].word;
          let tmp = {
            postId: eachPost.id,
            productName,
            shopName: eachPost.Shop.names[0].word,
            postImage: eachPost.images[0].url,
            price: eachPost.mainProductPrice,
            isLikePost,
          };
          posts.push(tmp);
        }
      }
      return posts;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
