import { queryField, stringArg } from "@nexus/schema";

export const getRecommendShopTags = queryField("getRecommendShopTags", {
  type: "TagThumbnail",
  args: {
    word: stringArg({ required: true }),
    lang: stringArg({ nullable: true }),
  },
  nullable: true,
  list: true,
  resolve: async (_, args, ctx) => {
    try {
      const { word, lang = "ENG" } = args;
      const take = 3;
      let tags = [];
      let queryResult = await ctx.prisma.tag.findMany({
        where: {
          names: { some: { word: { contains: word }, lang } },
          category: "ShopName",
        },
        select: {
          shops: { select: { id: true } },
          names: { where: { lang }, select: { word: true } },
          isClass: true,
        },
        take,
      });
      console.log(queryResult);
      if (!queryResult) return null;
      for (const eachTag of queryResult) {
        tags.push({
          id: eachTag.shops[0].id,
          tagName: eachTag.names[0].word,
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
