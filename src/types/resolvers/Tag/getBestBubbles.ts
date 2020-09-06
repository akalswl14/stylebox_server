import { queryField, stringArg } from '@nexus/schema';

export const getBestBubbles = queryField('getBestBubbles', {
  type: 'ClassTagDetail',
  args: {
    lang: stringArg({ nullable: true }),
  },
  nullable: true,
  list: true,
  resolve: async (_, args, ctx) => {
    try {
      let { lang } = args;
      let tags = [],
        settingQueryResult,
        bestBubbleTagId,
        tagQueryResult,
        order = 0;

      if (!lang) lang = 'ENG';

      settingQueryResult = await ctx.prisma.setting.findOne({
        where: { id: 1 },
        select: { bestBubbleTagId: true },
      });

      bestBubbleTagId = settingQueryResult
        ? settingQueryResult.bestBubbleTagId
        : null;

      if (bestBubbleTagId) {
        for (const eachId of bestBubbleTagId) {
          tagQueryResult = await ctx.prisma.tag.findOne({
            where: { id: eachId },
            select: {
              id: true,
              tagImage: true,
              classId: true,
              names: { where: { lang }, select: { word: true } },
            },
          });

          if (!tagQueryResult) return null;

          tags.push({
            id: tagQueryResult.id,
            tagName: tagQueryResult.names[0].word,
            order,
            tagImage: tagQueryResult.tagImage,
            classId: tagQueryResult.classId,
          });

          order++;
        }
      }
      return tags ? tags : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
