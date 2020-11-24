import { queryField, stringArg, booleanArg } from "@nexus/schema";
import { S3_URL } from "../AWS_IAM";

export const getShopBubbles = queryField("getShopBubbles", {
  type: "ClassTagDetail",
  args: {
    lang: stringArg({ nullable: true }),
  },
  nullable: true,
  list: true,
  resolve: async (_, args, ctx) => {
    try {
      const lang = args.lang ?? "VI";
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
          if (!eachTagId || !eachTagId.id) continue;
          queryResult = await ctx.prisma.tag.findOne({
            where: { id: eachTagId.id },
            select: {
              names: { where: { lang }, select: { word: true } },
              tagImage: true,
              classId: true,
              isClass: true,
              category: true,
            },
          });
          if (!queryResult) continue;
          let tmp = {
            id: eachTagId.id,
            tagName:
              queryResult.names &&
              queryResult.names.length > 0 &&
              queryResult.names[0].word
                ? queryResult.names[0].word
                : null,
            tagImage: queryResult.tagImage
              ? S3_URL + queryResult.tagImage
              : null,
            order: eachTagId.order,
            isClass: queryResult.isClass,
            classId: queryResult.classId,
            category: queryResult.category,
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
