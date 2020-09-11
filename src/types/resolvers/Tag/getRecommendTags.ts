import { queryField, stringArg } from "@nexus/schema";

export const getRecommendTags = queryField("getRecommendTags", {
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
          names: { some: { word: { contains: word } } },
          category: { in: ["Style", "ProductClass", "Feature", "Location"] },
        },
        select: {
          id: true,
          names: { where: { lang }, select: { word: true } },
          isClass: true,
        },
        take,
      });
      if (!queryResult) return null;
      for (const eachTag of queryResult) {
        tags.push({
          id: eachTag.id,
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
