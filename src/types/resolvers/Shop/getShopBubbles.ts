import { queryField, stringArg, booleanArg } from "@nexus/schema";

export const getShopBubbles = queryField("getShopBubbles", {
  type: "ClassTagDetail",
  args: {
    lang: stringArg({ nullable: true }),
  },
  nullable: true,
  list: true,
  resolve: async (_, args, ctx) => {
    try {
      const { lang = "ENG" } = args;
      let queryResult,
        tagIdList = [],
        order = 0,
        rtn = [];
      try {
        queryResult = await ctx.prisma.setting.findOne({
          where: {
            id: 1,
          },
          select: { shopBubbleTagId: true },
        });
        if (queryResult) {
          for (const eachTagId of queryResult.shopBubbleTagId) {
            tagIdList.push({ id: eachTagId, order });
            order++;
          }
        }
        for (const eachTagId of tagIdList) {
          queryResult = await ctx.prisma.tag.findOne({
            where: { id: eachTagId.id },
            select: {
              names: { where: { lang }, select: { word: true } },
              tagImage: true,
              classId: true,
              isClass: true,
            },
          });
          let tmp = {
            id: eachTagId.id,
            tagName: queryResult?.names[0].word,
            tagImage: queryResult?.tagImage,
            order: eachTagId.order,
            isClass: queryResult?.isClass,
          };
          rtn.push(tmp);
        }
      } catch (e) {
        console.log(e);
      }
      return rtn;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
