import { queryField, stringArg } from '@nexus/schema';

export const getStyleBubble = queryField('getStyleBubble', {
  type: 'ClassTagDetail',
  args: {
    lang: stringArg({ required: true }),
  },
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const { lang } = args;
      let rtn = [],
        order = 0,
        mainBubbleTagId,
        prismaResult,
        tagName;

      try {
        prismaResult = await ctx.prisma.setting.findOne({
          where: { id: 1 },
          select: { mainBubbleTagId: true },
        });
        mainBubbleTagId = prismaResult?.mainBubbleTagId;

        if (mainBubbleTagId) {
          for (const eachId of mainBubbleTagId) {
            prismaResult = await ctx.prisma.tag.findOne({
              where: { id: eachId },
              select: {
                tagImage: true,
                names: true,
              },
            });

            tagName = prismaResult?.names.filter((tag) => tag.lang === lang);

            if (tagName) {
              tagName = tagName[0].word;
            }

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
