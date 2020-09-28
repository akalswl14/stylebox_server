import { intArg, queryField } from "@nexus/schema";

export const getProductTagInfo = queryField("getProductTagInfo", {
  type: "TagManagementThumbnail",
  args: { id: intArg({ required: true }) },
  nullable: true,
  list: true,
  resolve: async (_, args, ctx) => {
    try {
      const { id } = args;
      let queryResult,
        tagResult,
        classResult,
        tagIdList,
        tags = [];
      queryResult = await ctx.prisma.product.findOne({
        where: { id },
        select: {
          tags: {
            select: {
              id: true,
              classId: true,
              category: true,
              names: { where: { lang: "VI" }, select: { word: true } },
            },
          },
        },
      });
      if (!queryResult) return null;
      tagIdList = queryResult.tags;
      for (const eachTag of tagIdList) {
        classResult = await ctx.prisma.className.findMany({
          where: { classId: eachTag.classId, lang: "VI" },
          select: { word: true },
        });
        if (!classResult) continue;
        tags.push({
          tagId: eachTag.id,
          tagName: eachTag.names[0].word,
          classId: eachTag.classId,
          className: classResult[0].word,
          category: eachTag.category,
        });
      }
      return tags;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
