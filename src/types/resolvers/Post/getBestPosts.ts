import { queryField, stringArg, intArg } from "@nexus/schema";
import { getUserId } from "../../../utils";

export const getBestPosts = queryField("getBestPosts", {
  type: "postNumPostList",
  args: {
    lang: stringArg({ nullable: true }),
    periodFilter: intArg({ nullable: true }),
    locationTagId: intArg({ nullable: true }),
    classId: intArg({ nullable: true }),
    cursorId: intArg({ nullable: true }),
  },
  nullable: true,
  description:
    "About filter, 1 means this week, 2 means this month and 3 means life time. Field pageNum has to start from 1.",
  resolve: async (_, args, ctx) => {
    try {
      const { periodFilter = 1, locationTagId, classId, cursorId } = args;
      let { lang } = args;
      if (!lang) lang = "VI";
      let tagResult = [],
        loadingPostNum,
        bestTotalPostNum,
        posts = [];
      let orderOption:
        | (
            | {
                weeklyRankScore: "asc" | "desc";
              }
            | {
                createdAt: "asc" | "desc";
              }
          )[]
        | (
            | {
                monthlyRankScore: "asc" | "desc";
              }
            | {
                createdAt: "asc" | "desc";
              }
          )[]
        | (
            | {
                lifeTimeRankScore: "asc" | "desc";
              }
            | {
                createdAt: "asc" | "desc";
              }
          )[] = [];
      const userId = Number(getUserId(ctx));
      if (!userId) {
        return null;
      }
      let queryResult = await ctx.prisma.setting.findOne({
        where: { id: 1 },
        select: { loadingPostNum: true, bestTotalPostNum: true },
      });
      loadingPostNum = queryResult ? queryResult.loadingPostNum : 20;
      bestTotalPostNum = queryResult ? queryResult.bestTotalPostNum : 100;
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
      let totalPostNum = await ctx.prisma.post.count({
        where: {
          AND: tagResult,
        },
      });
      let postResult = await ctx.prisma.post.findMany({
        where: {
          AND: tagResult,
        },
        select: {
          id: true,
          images: { select: { url: true }, take: 1 },
          mainProductId: true,
          mainProductPrice: true,
        },
        orderBy: orderOption,
        take: loadingPostNum,
        cursor: cursorId ? { id: cursorId } : undefined,
        skip: cursorId ? 1 : undefined,
      });
      for (const eachPost of postResult) {
        let likeResult = await ctx.prisma.like.count({
          where: { userId, postId: eachPost.id },
        });
        let isLikePost = likeResult > 0 ? true : false;
        let productNameResult = await ctx.prisma.productName.findMany({
          where: { productId: eachPost.mainProductId, lang },
          select: { word: true },
        });
        let productName = productNameResult[0].word;
        let shopResult = await ctx.prisma.shop.findMany({
          where: {
            posts: { some: { id: eachPost.id } },
          },
          select: {
            names: { where: { lang }, select: { word: true } },
          },
        });
        if (shopResult.length <= 0 || !shopResult) continue;
        if (!eachPost.mainProductPrice) continue;
        let tmp = {
          postId: eachPost.id,
          productName,
          shopName: shopResult[0].names[0].word,
          postImage: eachPost.images[0].url,
          price: eachPost.mainProductPrice,
          isLikePost,
        };
        posts.push(tmp);
      }
      return {
        postNum: totalPostNum,
        posts,
      };
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
