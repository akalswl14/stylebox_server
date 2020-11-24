import { queryField, stringArg } from "@nexus/schema";

export const getRecommendShopTags = queryField("getRecommendShopTags", {
  type: "RecommendTagThumbnail",
  args: {
    word: stringArg({ required: true }),
    lang: stringArg({ nullable: true }),
  },
  nullable: true,
  list: true,
  resolve: async (_, args, ctx) => {
    try {
      const { word } = args;
      const lang = args.lang ?? "VI";
      const take = 3;
      let tags = [];
      let shopResult = await ctx.prisma.shop.findMany({
        select: { id: true },
      });
      let shopList = [];
      for (const eachShop of shopResult) {
        shopList.push(eachShop.id);
      }
      let queryResult = await ctx.prisma.tag.findMany({
        where: {
          names: { some: { word: { contains: word }, lang } },
          category: "ShopName",
          shops: { every: { id: { in: shopList } } },
        },
        select: {
          shops: { select: { id: true } },
          names: { where: { lang }, select: { word: true } },
          isClass: true,
        },
        take,
      });
      if (!queryResult) return null;
      for (const eachTag of queryResult) {
        tags.push({
          id:
            eachTag.shops && eachTag.shops.length > 0 && eachTag.shops[0].id
              ? eachTag.shops[0].id
              : null,
          tagName:
            eachTag.names && eachTag.names.length > 0 && eachTag.names[0].word
              ? eachTag.names[0].word
              : null,
          isClass: eachTag.isClass,
        });
      }
      return tags ? tags : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
