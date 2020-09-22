import { intArg, queryField, stringArg, booleanArg } from "@nexus/schema";
import { getUserId } from "../../../utils";

export const getShops = queryField("getShops", {
  type: "ShopList",
  args: {
    lang: stringArg({ nullable: true }),
    locationId: intArg({ nullable: true }),
    tagId: intArg({ nullable: true }),
    classId: intArg({ nullable: true }),
    isClass: booleanArg({ nullable: true }),
    cursorId: intArg({ nullable: true }),
  },
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const {
        lang = "VI",
        locationId,
        tagId,
        classId,
        isClass,
        cursorId,
      } = args;
      let shopResults,
        queryResult,
        loadingPostNum,
        totalShopNum = 0,
        shops = [],
        classTags = [],
        queryOption,
        countQueryOption,
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
            classTags = await ctx.prisma.tag.findMany({
              where: {
                classId,
              },
              select: {
                id: true,
              },
            });
          }
        } else if (tagId) {
          tags.push({ id: tagId });
        }
        if (locationId) {
          tags.push({ id: locationId });
        }
        queryOption = {
          orderBy: { monthlyRankScore: "desc" },
          take: loadingPostNum,
          select: {
            id: true,
            logoUrl: true,
            names: { select: { word: true }, where: { lang } },
            onDetailTagId: true,
          },
        };
        if (tags.length > 0) {
          if (classTags.length > 0) {
            queryOption.where = {
              tags: { some: { AND: tags, OR: classTags } },
            };
            countQueryOption = {
              tags: { some: { AND: tags, OR: classTags } },
            };
          } else {
            queryOption.where = { tags: { some: { AND: tags } } };
            countQueryOption = { tags: { some: { AND: tags } } };
          }
        } else {
          if (classTags.length > 0) {
            queryOption.where = { tags: { some: { OR: classTags } } };
            countQueryOption = { tags: { some: { OR: classTags } } };
          }
        }
        if (cursorId) {
          queryOption.cursor = { id: cursorId };
          queryOption.skip = 1;
        }
        shopResults = await ctx.prisma.shop.findMany(queryOption);
        for (const eachShop of shopResults) {
          let isLikeShop,
            queryResult,
            tmp = {
              shopId: eachShop.id,
              shopName: eachShop.names[0].word,
              logoUrl: eachShop.logoUrl,
              isLikeShop: false,
              tagNames: [],
            };
          queryResult = await ctx.prisma.like.count({
            where: {
              userId,
              shopId: eachShop.id,
            },
          });
          isLikeShop = queryResult > 0 ? true : false;
          tmp.isLikeShop = isLikeShop;
          let order = 0;
          for (const eachId of eachShop.onDetailTagId) {
            if (order >= 3) break;
            queryResult = await ctx.prisma.tag.findOne({
              where: { id: eachId },
              select: {
                names: { where: { lang }, select: { word: true } },
              },
            });
            if (queryResult) {
              tmp.tagNames.push(queryResult.names[0].word);
              order++;
            }
          }
          shops.push(tmp);
        }
        if (tags.length == 0 && classTags.length == 0) {
          totalShopNum = await ctx.prisma.shop.count({});
        } else {
          totalShopNum = await ctx.prisma.shop.count({
            where: countQueryOption,
          });
        }
      } catch (e) {
        console.log(e);
      }
      return {
        totalShopNum,
        shops,
      };
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
