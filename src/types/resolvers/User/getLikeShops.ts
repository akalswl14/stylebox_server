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
        shops = [],
        settingQueryResult,
        loadingPostNum,
        tagResult,
        QueryOption,
        styleAndLocationTag = [];

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
          tags: {
            select: { names: { where: { lang }, select: { word: true } } },
          },
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
          tagResult = await ctx.prisma.tag.findMany({
            where: {
              id: eachTagId,
              OR: [{ category: 'Location' }, { category: 'Style' }],
            },
            select: {
              names: { where: { lang }, select: { word: true } },
              category: true,
            },
          });

          styleAndLocationTag.push(tagResult[0]);
        }

        styleTagName =
          styleAndLocationTag[0].category === 'Style'
            ? styleAndLocationTag[0].names[0].word
            : styleAndLocationTag[1].names[0].word;

        locationTagName =
          styleAndLocationTag[0].category === 'Location'
            ? styleAndLocationTag[0].names[0].word
            : styleAndLocationTag[1].names[0].word;

        shops.push({
          shopId: eachLike.id,
          shopName: eachLike.names[0].word,
          logoUrl: eachLike.logoUrl,
          styleTagName,
          locationTagName,
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
