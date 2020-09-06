import { queryField, stringArg } from '@nexus/schema';

export const getMainBubbles = queryField('getMainBubbles', {
  type: 'ClassTagDetail',
  args: {
    lang: stringArg({ required: true }),
  },
  nullable: true,
  list: true,
  resolve: async (_, args, ctx) => {
    try {
      const { lang } = args;
      let rtn = [],
        order = 0,
        mainBubbleTagId,
        prismaResult,
        settingQueryResult,
        tagName;

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
              },
            });

            tagName = prismaResult ? prismaResult.names[0].word : null;

            order++;
            rtn.push({
              id: eachId,
              order,
              tagImage: prismaResult?.tagImage,
              tagName,
            });
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
