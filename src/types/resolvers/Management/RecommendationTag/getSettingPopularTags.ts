import { queryField } from '@nexus/schema';

export const getSettingPopularTags = queryField('getSettingPopularTags', {
  type: 'ClassTagDetail',
  nullable: true,
  list: true,
  resolve: async (_, __, ctx) => {
    try {
      let popularTags,
        lang,
        tags = [],
        order = 1;

      if (!lang) lang = 'VI';

      popularTags = await ctx.prisma.tag.findMany({
        where: { isRecommendation: { gte: 1 } },
        orderBy: { isRecommendation: 'asc' },
        select: {
          id: true,
          category: true,
          names: { where: { lang }, select: { word: true } },
          classId: true,
          isRecommendation: true,
          Class: {
            select: {
              names: { where: { lang }, select: { word: true } },
            },
          },
        },
      });

      for (const eachPopularTag of popularTags) {
        tags.push({
          order,
          Category: eachPopularTag.category,
          classId: eachPopularTag.classId,
          className: eachPopularTag.Class.names[0].word,
          id: eachPopularTag.id,
          tagName: eachPopularTag.names[0].word,
        });
        order++;
      }

      return tags ? tags : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
