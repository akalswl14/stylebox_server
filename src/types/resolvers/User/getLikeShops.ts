import { queryField, stringArg, intArg } from "@nexus/schema";
import { getUserId } from "../../../utils";
import { S3_URL } from "../AWS_IAM";

export const getLikeShops = queryField("getLikeShops", {
  type: "ShopList",
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
        totalShopNum,
        shops = [],
        settingQueryResult,
        loadingPostNum,
        tagResult,
        isLikeShop;

      const userId = Number(getUserId(ctx));

      if (!userId) return null;
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
        select: { shopId: true },
      });

      if (!likeIds) {
        return { totalShopNum: 0, shops: [] };
      }

      if (!cursorId) {
        QueryResult = await ctx.prisma.shop.findMany({
          take: loadingPostNum,
          where: { preferrers: { some: { userId } } },
          select: {
            id: true,
            logoUrl: true,
            names: { where: { lang }, select: { word: true } },
            onDetailTagId: true,
          },
        });
      } else {
        QueryResult = await ctx.prisma.shop.findMany({
          take: loadingPostNum,
          skip: 1,
          cursor: { id: cursorId },
          where: { preferrers: { some: { userId } } },
          select: {
            id: true,
            logoUrl: true,
            names: { where: { lang }, select: { word: true } },
            onDetailTagId: true,
          },
        });
      }

      if (!QueryResult) return null;

      totalShopNum = await ctx.prisma.shop.count({
        where: { preferrers: { some: { userId } } },
      });

      for (const eachLike of QueryResult) {
        let check = 0;
        let styleTag = [];
        if (!eachLike || !eachLike.onDetailTagId) continue;
        for (const eachTagId of eachLike.onDetailTagId) {
          tagResult = await ctx.prisma.tag.findOne({
            where: {
              id: eachTagId,
            },
            select: {
              names: { where: { lang }, select: { word: true } },
            },
          });
          if (
            tagResult &&
            tagResult.names &&
            tagResult.names.length > 0 &&
            tagResult.names[0].word
          ) {
            if (check < 3) {
              styleTag.push(tagResult.names[0].word);
            }
            check++;
          }
        }

        isLikeShop =
          (await ctx.prisma.like.count({
            where: { userId, shopId: eachLike.id },
          })) > 0
            ? true
            : false;

        shops.push({
          shopId: eachLike.id,
          shopName:
            eachLike.names &&
            eachLike.names.length > 0 &&
            eachLike.names[0].word
              ? eachLike.names[0].word
              : null,
          logoUrl: eachLike.logoUrl ? S3_URL + eachLike.logoUrl : null,
          tagNames: styleTag,
          isLikeShop,
        });
      }
      let rtn = {
        totalShopNum,
        shops,
      };

      return rtn ? rtn : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
