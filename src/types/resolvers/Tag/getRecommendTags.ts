import { queryField, stringArg } from "@nexus/schema";
import { vietnamese } from "vietnamese-js";

export const getRecommendTags = queryField("getRecommendTags", {
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
      const take = 20;
      let tags = [];
      const convertWord = vietnamese(word).toLowerCase();
      let queryResult = await ctx.prisma.tag.findMany({
        where: {
          names: {
            some: {
              searchWord: { startsWith: convertWord },
              lang,
            },
          },
          category: { in: ["Style", "ProductClass", "Feature", "Location"] },
        },
        select: {
          id: true,
          names: { where: { lang }, select: { word: true } },
          isClass: true,
          category: true,
          classId: true,
        },
        take,
      });
      if (!queryResult) return null;
      for (const eachTag of queryResult) {
        tags.push({
          id: eachTag.id,
          tagName:
            eachTag.names && eachTag.names.length > 0 && eachTag.names[0].word
              ? eachTag.names[0].word
              : null,
          isClass: eachTag.isClass,
          category: eachTag.category,
          classId: eachTag.classId,
        });
      }
      return tags ? tags : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
