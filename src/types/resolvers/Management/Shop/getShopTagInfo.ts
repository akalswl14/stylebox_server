import { intArg, queryField } from "@nexus/schema";

export const getShopTagInfo = queryField("getShopTagInfo", {
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
        tags = [],
        order = 0;
      queryResult = await ctx.prisma.shop.findOne({
        where: { id },
        select: {
          onDetailTagId: true,
        },
      });
      if (!queryResult) return null;
      tagIdList = queryResult.onDetailTagId;
      for (const eachTagId of tagIdList) {
        tagResult = await ctx.prisma.tag.findOne({
          where: { id: eachTagId },
          select: {
            category: true,
            classId: true,
            names: { where: { lang: "VI" }, select: { word: true } },
          },
        });
        if (!tagResult) continue;
        classResult = await ctx.prisma.className.findMany({
          where: { classId: tagResult.classId, lang: "VI" },
          select: { word: true },
        });
        if (!classResult) continue;
        tags.push({
          tagId: eachTagId,
          tagName: tagResult.names[0].word,
          classId: tagResult.classId,
          className: classResult[0].word,
          category: tagResult.category,
          order,
        });
        order++;
      }
      return tags;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
