import { queryField, stringArg, intArg } from "@nexus/schema";
import { getUserId } from "../../../utils";

export const getPostsbyShop = queryField("getPostsbyShop", {
  type: "PostList",
  args: {
    lang: stringArg({ nullable: true }),
    shopId: intArg({ required: true }),
    filter: intArg({ nullable: true }),
    cursorId: intArg({ nullable: true }),
  },
  nullable: true,
  description:
    "About filter, 1 means Recent, 2 means Price Low and 3 means Price High",
  resolve: async (_, args, ctx) => {
    try {
      const { lang = "ENG", shopId, filter = 1, cursorId } = args;
      let queryResult,
        orderQuery,
        queryArg,
        loadingPostNum,
        totalPostNum,
        posts = [];
      const userId = Number(getUserId(ctx));
      queryResult = await ctx.prisma.setting.findOne({
        where: { id: 1 },
        select: { loadingPostNum: true },
      });
      loadingPostNum = queryResult ? queryResult.loadingPostNum : 20;
      if (filter == 1) {
        orderQuery = [{ createdAt: "desc" }];
      } else {
        orderQuery =
          filter == 2
            ? [{ isOnline: "asc" }, { mainProductPrice: "asc" }]
            : [{ isOnline: "desc" }, { mainProductPrice: "desc" }];
      }
      queryArg = {
        where: { shopId },
        select: {
          id: true,
          images: { select: { url: true } },
          mainProductId: true,
          mainProductPrice: true,
        },
        orderBy: orderQuery,
        take: loadingPostNum,
      };
      if (cursorId) {
        queryArg.cursor = { id: cursorId };
        queryArg.skip = 1;
      }
      queryResult = await ctx.prisma.post.findMany(queryArg);
      for (const eachPost of queryResult) {
        if (!eachPost.mainProductId) {
          return null;
        }
        let mainProduct = await ctx.prisma.product.findOne({
          where: { id: eachPost.mainProductId },
          select: { names: { where: { lang }, select: { word: true } } },
        });
        let shopResult = await ctx.prisma.shop.findOne({
          where: { id: shopId },
          select: { names: { where: { lang }, select: { word: true } } },
        });
        let likeResult = await ctx.prisma.like.count({
          where: { postId: eachPost.id, userId },
        });
        if (mainProduct && shopResult) {
          let tmp = {
            postId: eachPost.id,
            productName: mainProduct.names[0].word,
            shopName: shopResult.names[0].word,
            postImage: eachPost.images[0].url,
            price: eachPost.mainProductPrice,
            isLikePost: likeResult > 0 ? true : false,
          };
          posts.push(tmp);
        }
      }
      totalPostNum = await ctx.prisma.post.count({ where: { shopId } });
      let rtn = {
        totalPostNum,
        posts,
      };
      return rtn;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
