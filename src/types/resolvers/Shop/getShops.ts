import { intArg, queryField, stringArg, booleanArg } from "@nexus/schema";
import { getUserId } from "../../../utils";
import { S3_URL } from "../AWS_IAM";

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
      const { locationId, tagId, classId, isClass, cursorId } = args;
      const lang = args.lang ?? "VI";
      const shops = [];
      const userId = Number(getUserId(ctx));
      if (!userId) return null;
      let classTags: any[], inputTags: any;
      let whereOption;
      let totalShopNum: number;

      if (tagId && isClass) {
        // none
        whereOption = undefined;
      } else if (locationId) {
        let tags;
        if (locationId === 35) {
          let othersTagInfo = await ctx.prisma.tag.findMany({
            where: { classId: 15 },
            select: { id: true },
          });
          tags = { some: { OR: othersTagInfo } };
        } else {
          tags = { some: { id: locationId } };
        }
        if (tagId) {
          // location & tag
          whereOption = {
            AND: [
              {
                tags,
              },
              { tags: { some: { id: tagId } } },
            ],
          };
        } else if (isClass && classId) {
          // location & class
          classTags = await ctx.prisma.tag.findMany({
            where: { classId },
            select: { id: true },
          });
          inputTags = classTags.map((tag: any) => ({ tags: { some: tag } }));
          whereOption = {
            tags,
            OR: inputTags,
          };
        } else {
          // only location
          whereOption = { tags };
        }
      } else {
        if (tagId) {
          // only tag
          whereOption = { tags: { some: { id: tagId } } };
        } else if (isClass && classId) {
          //only class
          classTags = await ctx.prisma.tag.findMany({
            where: { classId },
            select: { id: true },
          });
          inputTags = classTags.map((tag: any) => ({ tags: { some: tag } }));
          whereOption = {
            OR: inputTags,
          };
        } else {
          //none
          whereOption = undefined;
        }
      }
      if (!whereOption) {
        totalShopNum = await ctx.prisma.shop.count({});
      } else {
        totalShopNum = await ctx.prisma.shop.count({
          where: whereOption,
        });
      }

      const queryResult = await ctx.prisma.setting.findOne({
        where: {
          id: 1,
        },
        select: { loadingPostNum: true },
      });
      const loadingPostNum = queryResult?.loadingPostNum
        ? queryResult?.loadingPostNum
        : 4;
      const shopResults = await ctx.prisma.shop.findMany({
        orderBy: [{ monthlyRankScore: "desc" }, { id: "asc" }],
        select: {
          id: true,
          logoUrl: true,
          names: {
            select: { word: true },
            where: { lang },
          },
          onDetailTagId: true,
        },
        cursor: typeof cursorId === "number" ? { id: cursorId } : undefined,
        skip: typeof cursorId === "number" ? 1 : undefined,
        where: whereOption,
        take: loadingPostNum,
      });
      for (const eachShop of shopResults) {
        let isLikeShop,
          queryResult,
          tmp: {
            shopId: number;
            shopName: string;
            logoUrl: string | null;
            isLikeShop: boolean;
            tagNames: string[];
          } = {
            shopId: eachShop.id,
            shopName: eachShop.names[0].word,
            logoUrl: eachShop.logoUrl ? S3_URL + eachShop.logoUrl : null,
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
          if (!queryResult) continue;
          if (queryResult) {
            tmp.tagNames.push(queryResult.names[0].word);
            order++;
          }
        }
        shops.push(tmp);
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
