import { queryField, stringArg } from "@nexus/schema";
import { S3_URL } from "../AWS_IAM";

export const getMainBubbles = queryField("getMainBubbles", {
  type: "ClassTagDetail",
  args: {
    lang: stringArg({ nullable: true }),
  },
  nullable: true,
  list: true,
  resolve: async (_, args, ctx) => {
    try {
      let { lang } = args;
      let rtn: any = [],
        order = 0,
        mainBubbleTagId,
        prismaResult,
        settingQueryResult;

      if (!lang) lang = "VI";

      try {
        settingQueryResult = await ctx.prisma.setting.findOne({
          where: { id: 1 },
          select: { mainBubbleTagId: true },
        });

        mainBubbleTagId = settingQueryResult
          ? settingQueryResult.mainBubbleTagId
          : null;

        if (mainBubbleTagId) {
          for (const eachId of mainBubbleTagId) {
            prismaResult = await ctx.prisma.tag.findOne({
              where: { id: eachId },
              select: {
                tagImage: true,
                names: { where: { lang }, select: { word: true } },
                classId: true,
              },
            });

            if (!prismaResult) return null;

            rtn.push({
              id: eachId,
              order,
              tagImage: prismaResult.tagImage
                ? S3_URL + prismaResult.tagImage
                : null,
              tagName:
                prismaResult.names &&
                prismaResult.names.length > 0 &&
                prismaResult.names[0].word
                  ? prismaResult.names[0].word
                  : null,
              classId: prismaResult.classId,
            });

            order++;
          }
        }
        return rtn ? rtn : null;
      } catch (e) {
        console.log(e);
      }
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
