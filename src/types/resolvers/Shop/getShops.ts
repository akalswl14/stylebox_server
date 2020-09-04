import { intArg, queryField, stringArg, booleanArg } from "@nexus/schema";
import { getUserId } from "../../../utils";

export const getShops = queryField("getShops", {
  type: "ShopList",
  args: {
    lang: stringArg({ nullable: true }),
    locationId: intArg({ nullable: true }),
    tagId: intArg({ nullable: true }),
    classId: intArg({ nullable: true }),
    isClass: booleanArg({ required: true }),
    cursorId: intArg({ nullable: true }),
  },
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const {
        lang = "ENG",
        locationId,
        tagId,
        classId,
        isClass,
        cursorId,
      } = args;
      let shopResults,
        queryResult,
        loadingPostNum,
        shops = [],
        tags = [];
      try {
        const userId = Number(getUserId(ctx));
        queryResult = await ctx.prisma.setting.findOne({
          where: {
            id: 1,
          },
          select: { loadingPostNum: true },
        });
        loadingPostNum = queryResult?.loadingPostNum
          ? queryResult?.loadingPostNum
          : 4;
        if (isClass) {
          if (classId) {
            tags = await ctx.prisma.tag.findMany({
              where: {
                classId,
              },
              select: {
                id: true,
              },
            });
            await ctx.prisma.shop.findMany({
              where: {
                OR: tags,
              },
            });
          }
        } else if (tagId) {
          tags.push({ id: tagId });
        }
        if (locationId) {
          tags.push({ id: locationId });
        }
        if (cursorId) {
          shopResults = await ctx.prisma.shop.findMany({
            orderBy: { monthlyRankScore: "desc" },
            take: loadingPostNum,
            cursor: { id: cursorId },
            skip: 1,
            select: {
              id: true,
              logoUrl: true,
              names: { select: { word: true }, where: { lang } },
              onShopListTagId: true,
            },
          });
        } else {
          shopResults = await ctx.prisma.shop.findMany({
            orderBy: { monthlyRankScore: "desc" },
            take: loadingPostNum,
            skip: 1,
            select: {
              id: true,
              logoUrl: true,
              names: { select: { word: true }, where: { lang } },
              onShopListTagId: true,
            },
          });
        }
        for (const eachShop of shopResults) {
          let isLikeShop,
            queryResult,
            tmp = {
              shopId: eachShop.id,
              shopName: eachShop.names[0].word,
              logoUrl: eachShop.logoUrl,
              isLikeShop: false,
              locationTagName: null,
              styleTagName: null,
            };
          queryResult = await ctx.prisma.like.count({
            where: {
              userId,
              shopId: eachShop.id,
            },
          });
          isLikeShop = queryResult > 0 ? true : false;
          tmp.isLikeShop = isLikeShop;
          for (const eachId of eachShop.onShopListTagId) {
            queryResult = await ctx.prisma.tag.findOne({
              where: { id: eachId },
              select: {
                category: true,
                names: { where: { lang }, select: { word: true } },
              },
            });
            if (queryResult?.category == "Location") {
              tmp.locationTagName = queryResult.names[0].word;
            } else if (queryResult?.category == "Style") {
              tmp.styleTagName = queryResult.names[0].word;
            }
          }
          shops.push(tmp);
        }
      } catch (e) {
        console.log(e);
      }
      return {
        totalShopNum: shops.length,
        shops,
      };
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
