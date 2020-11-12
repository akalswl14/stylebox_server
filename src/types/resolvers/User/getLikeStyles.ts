import { queryField, stringArg, intArg } from "@nexus/schema";
import { getUserId } from "../../../utils";

export const getLikeStyles = queryField("getLikeStyles", {
  type: "PostList",
  args: {
    lang: stringArg({ nullable: true }),
    cursorId: intArg({ nullable: true }),
  },
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const { cursorId } = args;
      let { lang } = args;
      let QueryResult,
        totalPostNum,
        mainProduct,
        posts = [],
        settingQueryResult,
        loadingPostNum,
        postIds = [];

      const userId = Number(getUserId(ctx));

      if (!lang) lang = "VI";

      settingQueryResult = await ctx.prisma.setting.findOne({
        where: { id: 1 },
        select: { loadingPostNum: true },
      });

      loadingPostNum = settingQueryResult
        ? settingQueryResult.loadingPostNum
        : 20;

      let likeIds = await ctx.prisma.like.findMany({
        where: { userId },
        select: { postId: true },
      });

      for (const like of likeIds) {
        if (like.postId) {
          postIds.push({ id: like.postId });
        }
      }

      if (!postIds) return { totalPostNum: 0, posts: [] };

      if (!cursorId) {
        QueryResult = await ctx.prisma.post.findMany({
          where: { OR: postIds },
          take: loadingPostNum,
          select: {
            id: true,
            images: { select: { url: true } },
            mainProductId: true,
            mainProductPrice: true,
            Shop: {
              select: { names: { where: { lang }, select: { word: true } } },
            },
          },
        });
      } else {
        QueryResult = await ctx.prisma.post.findMany({
          where: { OR: postIds },
          take: loadingPostNum,
          skip: 1,
          cursor: { id: cursorId },
          select: {
            id: true,
            images: { select: { url: true } },
            mainProductId: true,
            mainProductPrice: true,
            Shop: {
              select: { names: { where: { lang }, select: { word: true } } },
            },
          },
        });
      }

      if (!QueryResult) return null;

      totalPostNum = await ctx.prisma.post.count({
        where: { preferrers: { some: { userId } } },
      });

      for (const eachPost of QueryResult) {
        if (eachPost.mainProductId) {
          mainProduct = await ctx.prisma.product.findOne({
            where: { id: eachPost.mainProductId },
            select: {
              names: { where: { lang }, select: { word: true } },
            },
          });

          if (!mainProduct) return null;

          posts.push({
            postId: eachPost.id,
            productName: mainProduct.names[0].word,
            shopName: eachPost.Shop?.names[0].word,
            postImage: eachPost.images[0].url,
            price: eachPost.mainProductPrice,
          });
        } else {
          return null;
        }
      }

      let rtn = {
        totalPostNum,
        posts,
      };

      return rtn ? rtn : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
