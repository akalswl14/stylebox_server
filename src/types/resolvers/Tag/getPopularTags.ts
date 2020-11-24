import { queryField, stringArg } from "@nexus/schema";

export const getPopularTags = queryField("getPopularTags", {
  type: "ClassTagDetail",
  args: {
    lang: stringArg({ nullable: true }),
  },
  nullable: true,
  list: true,
  resolve: async (_, args, ctx) => {
    try {
      const lang = args.lang ?? "VI";
      let tagResult,
        tags = [];
      tagResult = await ctx.prisma.tag.findMany({
        where: { isRecommendation: { gt: 0 } },
        select: {
          id: true,
          names: { where: { lang }, select: { word: true } },
          isRecommendation: true,
        },
        orderBy: { isRecommendation: "asc" },
      });
      for (const eachTag of tagResult) {
        tags.push({
          id: eachTag.id,
          tagName:
            eachTag.names && eachTag.names.length > 0 && eachTag.names[0].word
              ? eachTag.names[0].word
              : null,
          order: eachTag.isRecommendation,
        });
      }
      return tags ? tags : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
