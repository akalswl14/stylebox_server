import { queryField, stringArg, intArg } from '@nexus/schema';
import { getUserId } from '../../../utils';

export const getLikeShops = queryField('getLikeShos', {
  type: 'ShopList',
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
        styleTagName,
        locationTagName,
        TagResult,
        shops = [],
        settingQueryResult,
        loadingPostNum;

      const userId = Number(getUserId(ctx));

      if (!lang) lang = 'ENG';

      settingQueryResult = await ctx.prisma.setting.findOne({
        where: { id: 1 },
        select: { loadingPostNum: true },
      });

      loadingPostNum = settingQueryResult
        ? settingQueryResult.loadingPostNum
        : 20;

      if (!cursorId) {
        QueryResult = await ctx.prisma.shop.findMany({
          take: loadingPostNum,
          where: { preferrers: { some: { userId } } },
          select: {
            id: true,
            logoUrl: true,
            names: { where: { lang }, select: { word: true } },
            onShopListTagId: true,
            tags: {
              select: { names: { where: { lang }, select: { word: true } } },
            },
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
            onShopListTagId: true,
            tags: {
              select: { names: { where: { lang }, select: { word: true } } },
            },
          },
        });
      }

      if (!QueryResult) return null;

      totalShopNum = await ctx.prisma.shop.count({
        where: { preferrers: { some: { userId } } },
      });

      if (!totalShopNum) totalShopNum = 0;

      for (const eachLike of QueryResult) {
        for (const eachTag of eachLike.onShopListTagId) {
          TagResult = await ctx.prisma.tag.findOne({
            where: { id: eachTag },
            select: {
              names: { where: { lang }, select: { word: true } },
              Class: { select: { category: true } },
            },
          });

          if (!TagResult) return null;

          locationTagName =
            TagResult?.Class.category === 'Location'
              ? TagResult.names[0].word
              : null;

          styleTagName =
            TagResult?.Class.category === 'Style'
              ? TagResult.names[0].word
              : null;

          shops.push({
            shopId: eachLike.id,
            ShopName: eachLike.names[0].word,
            logoUrl: eachLike.logoUrl,
            styleTagName,
            locationTagName,
          });
        }
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
