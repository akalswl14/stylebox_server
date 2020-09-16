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
        shops = [],
        settingQueryResult,
        loadingPostNum,
        tagResult,
        QueryOption,
        styleTag = [];

      const userId = Number(getUserId(ctx));

      if (!lang) lang = 'ENG';

      QueryOption = {
        take: loadingPostNum,
        where: { preferrers: { some: { userId } } },
        select: {
          id: true,
          logoUrl: true,
          names: { where: { lang }, select: { word: true } },
          onShopListTagId: true,
        },
      };

      settingQueryResult = await ctx.prisma.setting.findOne({
        where: { id: 1 },
        select: { loadingPostNum: true },
      });

      loadingPostNum = settingQueryResult
        ? settingQueryResult.loadingPostNum
        : 20;

      if (!cursorId) {
        QueryResult = await ctx.prisma.shop.findMany(QueryOption);
      } else {
        QueryOption.skip = 1;
        QueryOption.cursor = { id: cursorId };
        QueryResult = await ctx.prisma.shop.findMany(QueryOption);
      }

      if (!QueryResult) return null;

      totalShopNum = await ctx.prisma.shop.count({
        where: { preferrers: { some: { userId } } },
      });

      if (!totalShopNum) totalShopNum = 0;

      for (const eachLike of QueryResult) {
        for (const eachTagId of eachLike.onShopListTagId) {
          tagResult = await ctx.prisma.tag.findOne({
            where: {
              id: eachTagId,
            },
            select: {
              names: { where: { lang }, select: { word: true } },
            },
          });

          styleTag.push(tagResult?.names[0].word);
        }

        shops.push({
          shopId: eachLike.id,
          shopName: eachLike.names[0].word,
          logoUrl: eachLike.logoUrl,
          styleTagName: styleTag,
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
