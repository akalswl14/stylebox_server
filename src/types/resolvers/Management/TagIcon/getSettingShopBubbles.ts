import { queryField } from "@nexus/schema";

export const getSettingShopBubbles = queryField("getSettingShopBubbles", {
  type: "TagManagementThumbnail",
  nullable: true,
  list: true,
  resolve: async (_, args, ctx) => {
    try {
      let queryResult,
        settingResult,
        bubbleIdList,
        classResult,
        order = 0,
        rtn = [];
      settingResult = await ctx.prisma.setting.findOne({
        where: { id: 1 },
        select: { shopBubbleTagId: true },
      });
      bubbleIdList = settingResult?.shopBubbleTagId;
      if (!bubbleIdList) return null;
      for (const eachTag of bubbleIdList) {
        queryResult = await ctx.prisma.tag.findOne({
          where: { id: eachTag },
          select: {
            names: { where: { lang: "VI" }, select: { word: true } },
            classId: true,
            category: true,
          },
        });
        if (!queryResult) return null;
        classResult = await ctx.prisma.className.findMany({
          where: { classId: queryResult.classId, lang: "VI" },
          select: { word: true },
        });
        if (!classResult) return null;
        rtn.push({
          tagId: eachTag,
          tagName: queryResult.names[0].word,
          classId: queryResult.classId,
          className: classResult[0].word,
          category: queryResult.category,
          order,
        });
        order++;
      }
      return rtn;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
